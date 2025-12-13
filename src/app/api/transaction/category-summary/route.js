// src/app/api/transaction/category-summary/route.js
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
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");
    const idJenisParam = searchParams.get("id_jenis");

    const where = {
      id_user: user.id_user,
    };

    if (idJenisParam) {
      where.id_jenis = parseInt(idJenisParam, 10);
    }

    // filter bulan & tahun kalau dikirim
    if (monthParam && yearParam) {
      const month = parseInt(monthParam, 10) - 1; // 0-based
      const year = parseInt(yearParam, 10);

      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);

      where.timestamp = {
        gte: start,
        lt: end,
      };
    }

    const transaksi = await prisma.transaksi.findMany({
      where,
      include: {
        kategori: true,
      },
    });

    const agg = new Map();

    for (const t of transaksi) {
      const key = t.id_kategori;
      const nama =
        t.kategori?.nama_kategori ?? "Lainnya";
      const current = agg.get(key) || {
        id_kategori: key,
        nama_kategori: nama,
        total: 0,
      };

      current.total += Number(t.nominal);
      agg.set(key, current);
    }

    const result = Array.from(agg.values());

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /transaction/category-summary error:", err);
    return NextResponse.json(
      { error: "Failed fetching category summary" },
      { status: 500 }
    );
  }
}
