// src/app/api/loandebt/[id]/route.js
import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

// =======================
// PUT → Update Utang/Piutang
// =======================
export async function PUT(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { nama, jumlah, catatan } = body;

    // Validasi
    if (!nama || !jumlah) {
      return NextResponse.json(
        { error: "Nama dan jumlah harus diisi" },
        { status: 400 }
      );
    }

    // Cek apakah data ada dan milik user
    const existing = await prisma.utang_piutang.findUnique({
      where: { id_utang_piutang: parseInt(id, 10) },
    });

    if (!existing) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    if (existing.id_user !== user.id_user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update data
    const updated = await prisma.utang_piutang.update({
      where: { id_utang_piutang: parseInt(id, 10) },
      data: {
        nama,
        jumlah: Number(jumlah),
        catatan: catatan || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id_utang_piutang,
        name: updated.nama,
        amount: Number(updated.jumlah),
        note: updated.catatan,
        type: updated.tipe,
      },
    });
  } catch (err) {
    console.error("PUT /loandebt/[id] error:", err);
    return NextResponse.json(
      { error: "Failed updating data" },
      { status: 500 }
    );
  }
}

// =======================
// DELETE → Hapus Utang/Piutang
// =======================
export async function DELETE(request, { params }) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Cek apakah data ada dan milik user
    const existing = await prisma.utang_piutang.findUnique({
      where: { id_utang_piutang: parseInt(id, 10) },
    });

    if (!existing) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    if (existing.id_user !== user.id_user) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Hapus data
    await prisma.utang_piutang.delete({
      where: { id_utang_piutang: parseInt(id, 10) },
    });

    return NextResponse.json({
      success: true,
      message: "Data berhasil dihapus",
    });
  } catch (err) {
    console.error("DELETE /loandebt/[id] error:", err);
    return NextResponse.json(
      { error: "Failed deleting data" },
      { status: 500 }
    );
  }
}