
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type ParamsPromise = Promise<{ id: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  const { id } = await params;
  const issue = await prisma.issue.findUnique({
    where: { id: Number(id) },
  });

  if (!issue) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return NextResponse.json(issue);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    const { id } = await params;
    const { status, title, description, category, location, imageUrl } = await req.json();

    const authToken = req.cookies.get("auth-token");
    let user: any = null;
    if (authToken) {
      try {
        user = JSON.parse(authToken.value);
      } catch (e) {
        // ignore
      }
    }

    const existing = await prisma.issue.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const isOwner = user && existing.reporter === user.name;
    const isAdmin = user && user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.issue.update({
      where: { id: Number(id) },
      data: {
        status,
        title,
        description,
        category,
        location,
        imageUrl,
      },
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

    const authToken = req.cookies.get("auth-token");
    let user: any = null;
    if (authToken) {
      try {
        user = JSON.parse(authToken.value);
      } catch (e) {

      }
    }

    const existing = await prisma.issue.findUnique({ where: { id: Number(id) } });
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const isOwner = user && existing.reporter === user.name;
    const isAdmin = user && user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.issue.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.error("DELETE /api/issues/[id] error", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
