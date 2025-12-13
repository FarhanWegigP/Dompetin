// src/app/api/loandebt/route.js
import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

// GET: Ambil semua data utang & piutang
export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'utang' atau 'piutang'

    // id_jenis: 3 = Utang, 4 = Piutang (sesuaikan dengan data di tabel jenis_transaksi)
    const jenisMap = {
      utang: 3,
      piutang: 4,
    };

    const where = {
      id_user: user.id_user,
    };

    if (type && jenisMap[type]) {
      where.id_jenis = jenisMap[type];
    }

    const data = await prisma.transaksi.findMany({
      where,
      include: {
        kategori: true,
        jenis_transaksi: true,
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // Group by nama (kategori) untuk menghitung total, terbayar, sisa
    const grouped = {};

    data.forEach((item) => {
      const key = item.id_kategori;
      const nama = item.kategori?.nama_kategori || item.detail_transaksi || "Tanpa Nama";
      const nominal = Number(item.nominal) || 0;
      const jenis = item.id_jenis;

      if (!grouped[key]) {
        grouped[key] = {
          id: item.id_transaksi,
          name: nama,
          type: jenis === 3 ? "utang" : "piutang",
          amount: 0,
          paid: 0,
          date: new Date(item.timestamp).toLocaleDateString("id-ID"),
          note: item.detail_transaksi || "",
          transactions: [],
        };
      }

      grouped[key].transactions.push(item);
      grouped[key].amount += nominal;
    });

    const result = Object.values(grouped);

    return NextResponse.json(result);
  } catch (err) {
    console.error("GET /loandebt error:", err);
    return NextResponse.json(
      { error: "Failed fetching loan/debt data" },
      { status: 500 }
    );
  }
}

// POST: Tambah utang/piutang baru
export async function POST(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { nama, jumlah, catatan, type, tanggal } = body;

    if (!nama || !jumlah || !type) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // id_jenis: 3 = Utang, 4 = Piutang
    const id_jenis = type === "utang" ? 3 : 4;

    // Cari atau buat kategori berdasarkan nama
    let kategori = await prisma.kategori.findFirst({
      where: {
        nama_kategori: nama,
      },
    });

    if (!kategori) {
      kategori = await prisma.kategori.create({
        data: {
          nama_kategori: nama,
        },
      });

      // Link kategori dengan jenis transaksi
      await prisma.kategori_jenis_transaksi.create({
        data: {
          id_jenis,
          id_kategori: kategori.id_kategori,
        },
      });
    }

    // Buat tanggal
    let finalDate;
    if (tanggal) {
      finalDate = new Date(`${tanggal}T00:00:00+07:00`);
    } else {
      finalDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    }

    // Buat transaksi
    const transaksi = await prisma.transaksi.create({
      data: {
        id_user: user.id_user,
        detail_transaksi: catatan || nama,
        id_jenis,
        id_kategori: kategori.id_kategori,
        nominal: Number(jumlah),
        timestamp: finalDate,
        saldo_terakhir: 0, // Tidak mempengaruhi saldo
      },
    });

    return NextResponse.json({
      success: true,
      data: transaksi,
    });
  } catch (err) {
    console.error("POST /loandebt error:", err);
    return NextResponse.json(
      { error: "Failed adding loan/debt" },
      { status: 500 }
    );
  }
}