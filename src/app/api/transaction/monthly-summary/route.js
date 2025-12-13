// src/app/api/transaction/monthly-summary/route.js
import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);

    // ambil semua transaksi tahun itu, lalu group di JS
    const transaksi = await prisma.transaksi.findMany({
      where: {
        id_user: user.id_user,
        timestamp: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
      },
      select: {
        id_jenis: true,
        nominal: true,
        timestamp: true,
      },
    });

    const result = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      pemasukan: 0,
      pengeluaran: 0,
    }));

    for (const t of transaksi) {
      const monthIndex = t.timestamp.getMonth(); // 0-11
      const amount = Number(t.nominal);
      if (t.id_jenis === 1) {
        result[monthIndex].pemasukan += amount;
      } else if (t.id_jenis === 2) {
        result[monthIndex].pengeluaran += amount;
      }
    }

    return NextResponse.json({
      year,
      months: result,
    });
  } catch (err) {
    console.error("GET /transaction/monthly-summary error:", err);
    return NextResponse.json(
      { error: "Failed fetching monthly summary" },
      { status: 500 }
    );
  }
}
