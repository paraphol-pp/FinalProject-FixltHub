import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // อ่าน auth-token cookie
    const authToken = req.cookies.get("auth-token");

    if (!authToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = JSON.parse(authToken.value);
    // ensure role exists for older cookies
    if (!user.role) user.role = "user";

    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[auth/me] error:", err);
    return NextResponse.json(
      { error: "Invalid auth token" },
      { status: 401 }
    );
  }
}
