// src/app/api/loandebt/summary/route.js
import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Total Utang (id_jenis = 3)
    const utangAgg = await prisma.transaksi.aggregate({
      where: {
        id_user: user.id_user,
        id_jenis: 3,
      },
      _sum: { nominal: true },
    });

    // Total Piutang (id_jenis = 4)
    const piutangAgg = await prisma.transaksi.aggregate({
      where: {
        id_user: user.id_user,
        id_jenis: 4,
      },
      _sum: { nominal: true },
    });

    return NextResponse.json({
      totalUtang: Number(utangAgg._sum.nominal || 0),
      totalPiutang: Number(piutangAgg._sum.nominal || 0),
    });
  } catch (err) {
    console.error("GET /loandebt/summary error:", err);
    return NextResponse.json(
      { error: "Failed fetching summary" },
      { status: 500 }
    );
  }
}