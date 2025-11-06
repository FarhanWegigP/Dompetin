import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logout berhasil" },
    { status: 200 }
  );

  // Hapus cookie token
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    expires: new Date(0), // expired
    path: "/",
  });

  return response;
}
