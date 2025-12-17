// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// type ParamsPromise = Promise<{ id: string }>;

// export async function GET(
//   req: NextRequest,
//   { params }: { params: ParamsPromise }
// ) {
//   const { id } = await params;
//   const issue = await prisma.issue.findUnique({
//     where: { id: Number(id) },
//   });

//   if (!issue) {
//     return NextResponse.json({ message: "Not found" }, { status: 404 });
//   }

//   return NextResponse.json(issue);
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: ParamsPromise }
// ) {
//   try {
//     const { id } = await params;
//     const { status, title, description, category, location, imageUrl } = await req.json();

//     const authToken = req.cookies.get("auth-token");
//     let user: any = null;
//     if (authToken) {
//       try {
//         user = JSON.parse(authToken.value);
//       } catch (e) {
//         // ignore
//       }
//     }

//     const existing = await prisma.issue.findUnique({ where: { id: Number(id) } });
//     if (!existing) {
//       return NextResponse.json({ message: "Not found" }, { status: 404 });
//     }

//     const isOwner = user && existing.reporter === user.name;
//     const isAdmin = user && user.role === "admin";

//     if (!isOwner && !isAdmin) {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     const updated = await prisma.issue.update({
//       where: { id: Number(id) },
//       data: {
//         status,
//         title,
//         description,
//         category,
//         location,
//         imageUrl,
//       },
//     });

//     return NextResponse.json(updated);
//   } catch (error) {
//     console.error("PUT /api/issues/[id] error", error);
//     return NextResponse.json({ message: "Update failed" }, { status: 500 });
//   }
// }

// // DELETE /api/issues/:id
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: ParamsPromise }
// ) {
//   try {
//     const { id } = await params; // ✅ await

//     const authToken = req.cookies.get("auth-token");
//     let user: any = null;
//     if (authToken) {
//       try {
//         user = JSON.parse(authToken.value);
//       } catch (e) {

//       }
//     }

//     const existing = await prisma.issue.findUnique({ where: { id: Number(id) } });
//     if (!existing) {
//       return NextResponse.json({ message: "Not found" }, { status: 404 });
//     }

//     const isOwner = user && existing.reporter === user.name;
//     const isAdmin = user && user.role === "admin";

//     if (!isOwner && !isAdmin) {
//       return NextResponse.json({ message: "Forbidden" }, { status: 403 });
//     }

//     await prisma.issue.delete({ where: { id: Number(id) } });

//     return NextResponse.json({ message: "Deleted" });
//   } catch (error) {
//     console.error("DELETE /api/issues/[id] error", error);
//     return NextResponse.json({ message: "Delete failed" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { Issue } from "@/models/Issue";
import mongoose from "mongoose";

type ParamsPromise = Promise<{ id: string }>;

function normalize(issue: any) {
  if (!issue) return issue;
  return { ...issue, id: String(issue._id) };
}

function getUserFromCookie(req: NextRequest) {
  const authToken = req.cookies.get("auth-token");
  if (!authToken) return null;
  try {
    return JSON.parse(authToken.value);
  } catch {
    return null;
  }
}

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    await connectMongo();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const issue = await Issue.findById(id).lean();

    if (!issue) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(normalize(issue));
  } catch (error: any) {
    console.error("GET /api/issues/[id] error", error);
    return NextResponse.json({ message: "Fetch failed" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: ParamsPromise }
) {
  try {
    await connectMongo();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const body = await req.json();
    const { status, title, description, category, location, imageUrl } = body;

    const user = getUserFromCookie(req);

    const existing = await Issue.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const isOwner = user && existing.reporter === user.name;
    const isAdmin = user && user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // อัปเดตเฉพาะ field ที่ส่งมา (กันค่า undefined ไปทับของเดิม)
    const update: any = {};
    if (status !== undefined) update.status = status;
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (category !== undefined) update.category = category;
    if (location !== undefined) update.location = location;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;

    const updated = await Issue.findByIdAndUpdate(id, update, {
      new: true,
    }).lean();

    return NextResponse.json(normalize(updated));
  } catch (error: any) {
    console.error("PUT /api/issues/[id] error", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
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
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const user = getUserFromCookie(req);

    const existing = await Issue.findById(id).lean();
    if (!existing) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const isOwner = user && existing.reporter === user.name;
    const isAdmin = user && user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await Issue.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    console.error("DELETE /api/issues/[id] error", error);
    return NextResponse.json({ message: "Delete failed" }, { status: 500 });
  }
}
