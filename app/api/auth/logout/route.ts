import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.json(
    { message: "Logout success" },
    { status: 200 }
  );

  // ลบ auth-token cookie
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // ตั้ง maxAge=0 เพื่อลบ cookie
    path: "/",
  });

  return response;
}
