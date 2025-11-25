import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const issues = await prisma.issue.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(issues);
}

export async function POST(req: Request) {
  const body = await req.json();

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const issue = await prisma.issue.create({
    data: {
      title: body.title,
      location: body.location,
      description: body.description,
      category: body.category,
      status: "Pending",
      reporter: body.reporter ?? "Citizen X",
      date: formattedDate,
      imageUrl: body.imageUrl || "/assets/issues/issue-1.avif",
    },
  });

  return NextResponse.json(issue, { status: 201 });
}
