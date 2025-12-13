import { NextResponse } from "next/server";
import { getUserFromToken } from "@/src/app/lib/auth";
import prisma from "@/src/app/lib/prisma";

export async function GET() {
  const user = await getUserFromToken();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const result = await prisma.user.findUnique({
    where: { id_user: user.id_user },
    select: { id_user: true, email: true, nickname: true }
  });

  return NextResponse.json(result);
}
