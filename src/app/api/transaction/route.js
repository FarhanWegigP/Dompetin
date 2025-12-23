// src/app/api/transaction/route.js
import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

// =======================
// POST → Tambah Transaksi
// =======================
export async function POST(request) {
  try {
    const body = await request.json();
    const { nominal, deskripsi, id_jenis, id_kategori, tanggal } = body;

    // Validasi
    if (
      typeof nominal !== "number" ||
      typeof id_jenis !== "number" ||
      typeof id_kategori !== "number"
    ) {
      return NextResponse.json(
        { error: "Payload tidak valid", body },
        { status: 400 }
      );
    }

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Format tanggal dengan zona waktu WIB (UTC+7)
    const finalDate = tanggal
      ? new Date(`${tanggal}T00:00:00+07:00`)
      : new Date(Date.now() + 7 * 60 * 60 * 1000);

    // Insert transaksi
    const transaksi = await prisma.transaksi.create({
      data: {
        id_user: user.id_user,
        detail_transaksi: deskripsi ?? "",
        id_jenis,
        id_kategori,
        nominal,
        timestamp: finalDate,
      },
    });

    // Ambil saldo terbaru dari view setelah insert
    const saldoView = await prisma.$queryRaw`
      SELECT saldo_berjalan
      FROM view_transaksi_lengkap
      WHERE id_transaksi = ${transaksi.id_transaksi}
      LIMIT 1
    `;

    const saldo_baru =
      saldoView.length > 0 ? Number(saldoView[0].saldo_berjalan) : 0;

    return NextResponse.json({
      success: true,
      transaksi,
      saldo_baru,
    });
  } catch (err) {
    console.error("=== POST TRANSACTION ERROR ===");
    console.error(err);
    console.error("MESSAGE:", err.message);

    return NextResponse.json(
      {
        error: "Failed adding transaction",
        message: err.message,
      },
      { status: 500 }
    );
  }
}

// =======================
// GET → List Transaksi dengan Pagination
// =======================
export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "15", 10);

    const skip = (page - 1) * pageSize;

    // Total count
    const total = await prisma.transaksi.count({
      where: { id_user: user.id_user },
    });

    // Data transaksi
    const transaksi = await prisma.transaksi.findMany({
      where: { id_user: user.id_user },
      orderBy: { timestamp: "desc" },
      skip,
      take: pageSize,
      include: {
        kategori: true,
        jenis_transaksi: true,
      },
    });

    return NextResponse.json({
      data: transaksi,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error("GET /transaction error:", err);
    return NextResponse.json(
      { error: "Failed fetching transactions" },
      { status: 500 }
    );
  }
}