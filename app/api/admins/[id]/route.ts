// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// type ParamsPromise = Promise<{ id: string }>;

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: ParamsPromise }
// ) {
//   try {
//     const { id } = await params;
//     const body = await req.json();
//     const { name, email, role, password, currentPassword } = body;

//     // Fetch current user to verify password
//     const user = await prisma.user.findUnique({
//       where: { id: Number(id) },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     if (currentPassword && user.password !== currentPassword) {
//       return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
//     } else if (!currentPassword && (password || name || email)) {
//        return NextResponse.json({ error: "Current password is required" }, { status: 400 });
//     }

//     const updateData: any = {};
//     if (name) updateData.name = name;
//     if (email) updateData.email = email;
//     if (role) updateData.role = role;
//     if (password) updateData.password = password;

//     const updated = await prisma.user.update({
//       where: { id: Number(id) },
//       data: updateData,
//     });

//     return NextResponse.json(updated);
//   } catch (error) {
//     return NextResponse.json({ error: "Update failed" }, { status: 500 });
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: ParamsPromise }
// ) {
//   try {
//     const { id } = await params;
//     await prisma.user.delete({
//       where: { id: Number(id) },
//     });
//     return NextResponse.json({ message: "Deleted" });
//   } catch (error) {
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongo } from "@/lib/mongoose";
import { User } from "@/models/User";

type ParamsPromise = Promise<{ id: string }>;

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

function toSafeUser(u: any) {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role ?? "user",
  };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    await connectMongo();

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const { name, email, role, password, currentPassword } = body;

    // Fetch current user to verify password
    const user = await User.findById(id).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // logic เดิม: ถ้ามี currentPassword ต้องตรง
    if (currentPassword && user.password !== currentPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    } else if (!currentPassword && (password || name || email)) {
      return NextResponse.json(
        { error: "Current password is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (password !== undefined) updateData.password = password;

    const updated = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).lean();

    if (!updated) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(toSafeUser(updated));
  } catch (error) {
    console.error("[api/admin/[id]][PUT] error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    await connectMongo();

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const deleted = await User.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("[api/admin/[id]][DELETE] error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

