import { verifyAuth, json } from "@/src/lib/auth";

export async function GET(req) {
  const payload = verifyAuth(req);
  if (!payload) return json({ error: "Unauthorized" }, 401);
  return json({ user: payload });
}
