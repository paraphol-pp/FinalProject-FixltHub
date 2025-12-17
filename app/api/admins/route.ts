// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const admins = await prisma.user.findMany({
//       where: { role: "admin" },
//       select: { id: true, name: true, email: true, role: true },
//     });
//     return NextResponse.json(admins);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch admins" }, { status: 500 });
//   }
// }

// export async function POST(rqe: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, password } = body;

//     if (!name || !email || !password) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
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

//     const newAdmin = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password,
//         role: "admin",
//       },
//     });

//     return NextResponse.json(newAdmin, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create admin" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectMongo();

    const admins = await User.find({ role: "admin" })
      .select("_id name email role")
      .sort({ createdAt: -1 })
      .lean();

    const normalized = admins.map((u: any) => ({
      id: String(u._id),
      name: u.name,
      email: u.email,
      role: u.role ?? "user",
    }));

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("[api/admin][GET] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const created = await User.create({
      name,
      email,
      password, // ยังเป็น plain text เหมือนระบบเดิม
      role: "admin",
    });

    const obj = created.toObject();
    const safeAdmin = {
      id: String(obj._id),
      name: obj.name,
      email: obj.email,
      role: obj.role ?? "admin",
    };

    return NextResponse.json(safeAdmin, { status: 201 });
  } catch (error) {
    console.error("[api/admin][POST] error:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
