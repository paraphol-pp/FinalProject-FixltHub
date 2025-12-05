import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ParamsPromise = Promise<{ id: string }>;

export async function PUT(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, email, role, password, currentPassword } = body;

    // Fetch current user to verify password
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentPassword && user.password !== currentPassword) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    } else if (!currentPassword && (password || name || email)) {
       return NextResponse.json({ error: "Current password is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (password) updateData.password = password;

    const updated = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    const { id } = await params;
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
