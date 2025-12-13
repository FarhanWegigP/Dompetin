import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ambil saldo terbaru
    const lastSaldo = await prisma.saldo.findFirst({
      where: { id_user: user.id_user },
      orderBy: { timestamp_catatan: "desc" },
    });

    const saldo = lastSaldo ? Number(lastSaldo.saldo_hasil) : 0;

    return NextResponse.json({ saldo });
  } catch (err) {
    console.error("GET /transaction/saldo error:", err);
    return NextResponse.json(
      { error: "Failed to fetch saldo" },
      { status: 500 }
    );
  }
}
