import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[login] incoming body:", { email: body.email, password: "***" });

    const { email, password } = body;

    // ตรวจ field
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // ค้นหา user ด้วย email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // ถ้าไม่เจอ user
    if (!user) {
      console.log("[login] user not found for email:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // เปรียบเทียบ plaintext password (ไม่ใช้ bcrypt)
    if (user.password !== password) {
      console.log("[login] password mismatch for email:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log("[login] success for user:", user.id);

    // สร้าง response พร้อม HTTP-only cookie (รวม role ด้วย)
    const response = NextResponse.json(
      { message: "Login success", user: { id: user.id, name: user.name, email: user.email, role: (user as any).role } },
      { status: 200 }
    );

    // ตั้ง HTTP-only cookie (ไม่สามารถ access จาก JavaScript ได้)
    response.cookies.set("auth-token", JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: (user as any).role ?? "user",
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("[login] error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
