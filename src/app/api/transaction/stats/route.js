// src/app/api/transaction/stats/route.js
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

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Saldo terakhir
    const lastSaldo = await prisma.saldo.findFirst({
      where: { id_user: user.id_user },
      orderBy: { timestamp_catatan: "desc" },
    });

    const saldo_terakhir = lastSaldo ? Number(lastSaldo.saldo_hasil) : 0;

    // Pemasukan bulan ini (id_jenis = 1)
    const pemasukanAgg = await prisma.transaksi.aggregate({
      where: {
        id_user: user.id_user,
        id_jenis: 1,
        timestamp: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      _sum: { nominal: true },
    });

    const pengeluaranAgg = await prisma.transaksi.aggregate({
      where: {
        id_user: user.id_user,
        id_jenis: 2,
        timestamp: {
          gte: startOfMonth,
          lt: startOfNextMonth,
        },
      },
      _sum: { nominal: true },
    });

    const pemasukan_bulan_ini = Number(pemasukanAgg._sum.nominal ?? 0);
    const pengeluaran_bulan_ini = Number(pengeluaranAgg._sum.nominal ?? 0);

    return NextResponse.json({
      saldo: saldo_terakhir,
      pemasukan_bulan_ini,
      pengeluaran_bulan_ini,
    });
  } catch (err) {
    console.error("GET /transaction/stats error:", err);
    return NextResponse.json(
      { error: "Failed fetching stats" },
      { status: 500 }
    );
  }
}
