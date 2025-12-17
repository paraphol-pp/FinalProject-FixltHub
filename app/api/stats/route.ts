// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const adminCount = await prisma.user.count({
//       where: {
//         role: "admin",
//       },
//     });

//     return NextResponse.json({
//       adminCount,
//       contactCount: 0,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch stats" },
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

    const adminCount = await User.countDocuments({
      role: "admin",
    });

    return NextResponse.json({
      adminCount,
      contactCount: 0, // ยัง hardcode เหมือนเดิม
    });
  } catch (error) {
    console.error("[api/stats] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
