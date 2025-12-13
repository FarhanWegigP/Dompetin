import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getUserFromToken() {
  const cookieStore = await cookies(); // ⬅ WAJIB pakai await
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  return verifyJwt(token);
}
