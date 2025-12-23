// src/app/api/transaction/saldo/route.js
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

    // Ambil saldo terbaru dari view_transaksi_lengkap
    // View ini menghitung running balance dari semua transaksi
    const result = await prisma.$queryRaw`
      SELECT saldo_berjalan
      FROM view_transaksi_lengkap
      WHERE id_user = ${user.id_user}
      ORDER BY timestamp DESC, id_transaksi DESC
      LIMIT 1
    `;

    const saldo = result.length > 0 ? Number(result[0].saldo_berjalan) : 0;

    return NextResponse.json({ saldo });
  } catch (err) {
    console.error("GET /transaction/saldo error:", err);
    return NextResponse.json(
      { error: "Failed to fetch saldo" },
      { status: 500 }
    );
  }
}