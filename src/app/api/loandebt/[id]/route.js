// src/app/api/loandebt/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

// PUT: Update data utang/piutang
export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { nama, jumlah, catatan } = body;

    // Cek ownership
    const existing = await prisma.transaksi.findFirst({
      where: {
        id_transaksi: parseInt(id),
        id_user: user.id_user,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update kategori jika nama berubah
    let id_kategori = existing.id_kategori;
    if (nama && nama !== existing.kategori?.nama_kategori) {
      let kategori = await prisma.kategori.findFirst({
        where: { nama_kategori: nama },
      });

      if (!kategori) {
        kategori = await prisma.kategori.create({
          data: { nama_kategori: nama },
        });
      }
      id_kategori = kategori.id_kategori;
    }

    // Update transaksi
    const updated = await prisma.transaksi.update({
      where: { id_transaksi: parseInt(id) },
      data: {
        detail_transaksi: catatan || nama,
        id_kategori,
        nominal: jumlah ? Number(jumlah) : existing.nominal,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("PUT /loandebt/[id] error:", err);
    return NextResponse.json(
      { error: "Failed updating loan/debt" },
      { status: 500 }
    );
  }
}

// DELETE: Hapus utang/piutang
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Cek ownership
    const existing = await prisma.transaksi.findFirst({
      where: {
        id_transaksi: parseInt(id),
        id_user: user.id_user,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Hapus transaksi (cascade akan hapus saldo juga)
    await prisma.transaksi.delete({
      where: { id_transaksi: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Loan/debt deleted",
    });
  } catch (err) {
    console.error("DELETE /loandebt/[id] error:", err);
    return NextResponse.json(
      { error: "Failed deleting loan/debt" },
      { status: 500 }
    );
  }
}