// src/app/api/loandebt/summary/route.js
import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

// =======================
// GET → Summary Total Utang & Piutang
// =======================
export async function GET() {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Aggregate total utang
    const utangAgg = await prisma.utang_piutang.aggregate({
      where: {
        id_user: user.id_user,
        tipe: "utang",
      },
      _sum: {
        jumlah: true,
      },
    });

    // Aggregate total piutang
    const piutangAgg = await prisma.utang_piutang.aggregate({
      where: {
        id_user: user.id_user,
        tipe: "piutang",
      },
      _sum: {
        jumlah: true,
      },
    });

    const totalUtang = Number(utangAgg._sum.jumlah ?? 0);
    const totalPiutang = Number(piutangAgg._sum.jumlah ?? 0);

    return NextResponse.json({
      totalUtang,
      totalPiutang,
      netPosition: totalPiutang - totalUtang, // positif = lebih banyak piutang
    });
  } catch (err) {
    console.error("GET /loandebt/summary error:", err);
    return NextResponse.json(
      { error: "Failed fetching summary" },
      { status: 500 }
    );
  }
}