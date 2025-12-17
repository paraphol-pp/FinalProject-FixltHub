// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   try {
//     const authToken = req.cookies.get("auth-token");

//     if (!authToken) {
//       return NextResponse.json(
//         { error: "Not authenticated" },
//         { status: 401 }
//       );
//     }

//     const user = JSON.parse(authToken.value);
//     if (!user.role) user.role = "user";

//     return NextResponse.json(
//       { user },
//       { status: 200 }
//     );
//   } catch (err: any) {
//     console.error("[auth/me] error:", err);
//     return NextResponse.json(
//       { error: "Invalid auth token" },
//       { status: 401 }
//     );
//   }
// }

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authToken = req.cookies.get("auth-token");

    // ยังไม่ login = สถานะปกติ
    if (!authToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let user: any = null;
    try {
      user = JSON.parse(authToken.value);
    } catch {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (user && !user.role) user.role = "user";

    return NextResponse.json({ user }, { status: 200 });
  } catch (err: any) {
    console.error("[auth/me] error:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
