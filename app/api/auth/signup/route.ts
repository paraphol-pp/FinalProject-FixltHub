// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log("[signup] incoming body:", body);

//     const name = body.name ?? body.username;
//     const email = body.email;
//     const password = body.password;

//     if (!name || !email || !password) {
//       return NextResponse.json({ error: "Missing fields" }, { status: 400 });
//     }

//     const existing = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existing) {
//       return NextResponse.json(
//         { error: "Email already exists" },
//         { status: 409 }
//       );
//     }

//     console.log("[signup] createData:", { name, email, password: "***" });

//     const roleVal = body.role ?? "user";

//     let user: any;
//     try {
//       user = await (prisma as any).user.create({
//         data: { name, email, password, role: roleVal },
//       });
//     } catch (err: any) {
//       const msg = err?.message ?? "";
//       if (msg.includes("Unknown argument `role`") || msg.includes("Unknown field `role`")) {
//         console.warn("Prisma doesn't know 'role' yet — retrying create without role");
//         user = await (prisma as any).user.create({ data: { name, email, password } });
//         user.role = roleVal;
//       } else {
//         throw err;
//       }
//     }

//     const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role ?? roleVal };

//     return NextResponse.json({ message: "Signup success", user: safeUser }, { status: 201 });
//   } catch (err: any) {
//     console.error(err);
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { User } from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    console.log("[signup] incoming body:", body);

    const name = String(body.name ?? body.username ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "").trim();
    const roleVal = body.role ?? "user";

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const created = await User.create({ name, email, password, role: roleVal });


    const obj = created.toObject();
    const safeUser = {
      id: String(obj._id),
      name: obj.name,
      email: obj.email,
      role: obj.role,
    };

    return NextResponse.json(
      { message: "Signup success", user: safeUser },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[signup] error:", err);
    return NextResponse.json(
      { error: err?.message || "Signup failed" },
      { status: 500 }
    );
  }
}
