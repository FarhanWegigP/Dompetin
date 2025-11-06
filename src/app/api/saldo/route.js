import { NextResponse } from "next/server";
import { prisma } from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ambil saldo terbaru berdasarkan timestamp
    const latestSaldo = await prisma.saldo.findFirst({
      where: { id_user: user.id_user },
      orderBy: { timestamp_catatan: "desc" },
      select: { saldo_hasil: true }
    });

    return NextResponse.json({
      saldo: latestSaldo?.saldo_hasil ?? 0
    });

  } catch (err) {
    console.error("GET /api/saldo error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
