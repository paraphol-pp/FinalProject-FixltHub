// app/api/issues/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// helper type สำหรับ params ที่เป็น Promise
type ParamsPromise = Promise<{ id: string }>;

// GET /api/issues/:id
export async function GET(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  const { id } = await params; // ✅ ต้อง await ก่อน
  const issue = await prisma.issue.findUnique({
    where: { id: Number(id) },
  });

  if (!issue) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(issue);
}

// PUT /api/issues/:id → อัปเดต status
export async function PUT(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    const { id } = await params; // ✅ await
    const { status } = await req.json();

    const updated = await prisma.issue.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/issues/[id] error", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/issues/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    const { id } = await params; // ✅ await

    await prisma.issue.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE /api/issues/[id] error", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
