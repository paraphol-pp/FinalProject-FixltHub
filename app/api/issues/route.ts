// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: Request) {
//   const url = new URL(req.url);
//   const reporter = url.searchParams.get("reporter");
//   const exclude = url.searchParams.get("exclude");

//   const where: any = {};
//   if (reporter) {
//     if (exclude) {
//       where.reporter = { not: reporter };
//     } else {
//       where.reporter = reporter;
//     }
//   }

//   const issues = await prisma.issue.findMany({
//     where: where,
//     orderBy: { id: "desc" },
//   });
//   return NextResponse.json(issues);
// }

// export async function POST(req: Request) {
//   const body = await req.json();

//   const now = new Date();
//   const formattedDate = now.toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });

//   const issue = await prisma.issue.create({
//     data: {
//       title: body.title,
//       location: body.location,
//       description: body.description,
//       category: body.category,
//       status: "Pending",
//       reporter: body.reporter ?? "Citizen X",
//       date: formattedDate,
//       imageUrl: body.imageUrl || "/assets/issues/issue-1.avif",
//     },
//   });

//   return NextResponse.json(issue, { status: 201 });
// }


import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongoose";
import { Issue } from "@/models/Issue";

export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const created = await Issue.create({
      title: body.title,
      location: body.location,
      description: body.description,
      category: body.category,
      status: "Pending",
      reporter: body.reporter ?? "Citizen X",
      date: formattedDate,
      imageUrl: body.imageUrl || "/assets/issues/issue-1.avif",
    });

    const obj = created.toObject();
    return NextResponse.json(
      { ...obj, id: String(obj._id) },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[api/issues][POST] ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create issue" },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    await connectMongo();

    const url = new URL(req.url);
    const reporter = url.searchParams.get("reporter");
    const exclude = url.searchParams.get("exclude");

    const filter: any = {};
    if (reporter) filter.reporter = exclude ? { $ne: reporter } : reporter;

    const issues = await Issue.find(filter).sort({ createdAt: -1 }).lean();

    // normalize ให้ frontend ใช้ issue.id ได้เหมือนเดิม
    const normalized = issues.map((it: any) => ({ ...it, id: String(it._id) }));

    return NextResponse.json(normalized);
  } catch (err: any) {
    console.error("[api/issues][GET] ERROR:", err);
    return NextResponse.json(
      { error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

