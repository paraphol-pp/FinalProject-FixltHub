import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[signup] incoming body:", body);

    // Accept either `username` from client (legacy) or map to `name`
    const name = body.name ?? body.username;
    const email = body.email;
    const password = body.password;

    // ตรวจ field
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // เช็ค email ซ้ำ
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // ✨ แบบ plaintext (ไม่ hash) — เก็บรหัสผ่านตามที่กรอกเข้ามา
    console.log("[signup] createData:", { name, email, password: "***" });

    // สร้างผู้ใช้ และตั้ง role เป็น 'user' โดยค่าเริ่มต้น
    const roleVal = body.role ?? "user";

    // พยายามสร้างพร้อม role ก่อน — ถ้าฐานข้อมูลยังไม่มีคอลัมน์ `role`
    // (Prisma client / DB ยังไม่อัพเดต) ให้ลองสร้างอีกครั้งโดยไม่ใส่ role
    let user: any;
    try {
      user = await (prisma as any).user.create({
        data: { name, email, password, role: roleVal },
      });
    } catch (err: any) {
      const msg = err?.message ?? "";
      // ถ้า error มาจาก Prisma ว่าไม่มี argument `role`, ให้ retry โดยไม่ใส่ role
      if (msg.includes("Unknown argument `role`") || msg.includes("Unknown field `role`")) {
        console.warn("Prisma doesn't know 'role' yet — retrying create without role");
        user = await (prisma as any).user.create({ data: { name, email, password } });
        // เติม role ใน object ผลลัพธ์เพื่อให้โค้ดที่เหลือใช้งานได้
        user.role = roleVal;
      } else {
        throw err;
      }
    }

    // ซ่อนรหัสผ่านในการตอบกลับ
    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role ?? roleVal };

    return NextResponse.json({ message: "Signup success", user: safeUser }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
