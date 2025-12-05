import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const adminCount = await prisma.user.count({
      where: {
        role: "admin",
      },
    });

    return NextResponse.json({
      adminCount,
      contactCount: 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
