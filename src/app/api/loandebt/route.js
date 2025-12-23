// src/app/api/loandebt/route.js
import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

// =======================
// GET → List Utang/Piutang
// =======================
export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "utang" atau "piutang"

    if (!type || (type !== "utang" && type !== "piutang")) {
      return NextResponse.json(
        { error: "Type harus 'utang' atau 'piutang'" },
        { status: 400 }
      );
    }

    const data = await prisma.utang_piutang.findMany({
      where: {
        id_user: user.id_user,
        tipe: type,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // Format response
    const formatted = data.map((item) => ({
      id: item.id_utang_piutang,
      name: item.nama,
      amount: Number(item.jumlah),
      note: item.catatan,
      type: item.tipe,
      date: new Date(item.timestamp).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      timestamp: item.timestamp,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /loandebt error:", err);
    return NextResponse.json(
      { error: "Failed fetching data" },
      { status: 500 }
    );
  }
}

// =======================
// POST → Tambah Utang/Piutang
// =======================
export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nama, jumlah, catatan, type } = body;

    // Validasi
    if (!nama || !jumlah || !type) {
      return NextResponse.json(
        { error: "Nama, jumlah, dan type harus diisi" },
        { status: 400 }
      );
    }

    if (type !== "utang" && type !== "piutang") {
      return NextResponse.json(
        { error: "Type harus 'utang' atau 'piutang'" },
        { status: 400 }
      );
    }

    if (typeof jumlah !== "number" || jumlah <= 0) {
      return NextResponse.json(
        { error: "Jumlah harus berupa angka positif" },
        { status: 400 }
      );
    }

    // Insert data
    const newData = await prisma.utang_piutang.create({
      data: {
        id_user: user.id_user,
        nama,
        jumlah,
        catatan: catatan || null,
        tipe: type,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newData.id_utang_piutang,
        name: newData.nama,
        amount: Number(newData.jumlah),
        note: newData.catatan,
        type: newData.tipe,
      },
    });
  } catch (err) {
    console.error("POST /loandebt error:", err);
    return NextResponse.json(
      { error: "Failed creating data" },
      { status: 500 }
    );
  }
}