import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const response = NextResponse.json(
    { message: "Logout success" },
    { status: 200 }
  );

  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
