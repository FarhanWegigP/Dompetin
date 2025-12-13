// import { NextResponse } from "next/server";
// import prisma from "@/src/app/lib/prisma";
// import { getUserFromToken } from "@/src/app/lib/auth";

// // ------------------------------
// // POST : CREATE TRANSACTION
// // ------------------------------
// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { nominal, deskripsi, id_jenis, id_kategori, tanggal } = body;

//     if (!nominal || !id_jenis || !id_kategori) {
//       return NextResponse.json(
//         { error: "Data tidak lengkap" },
//         { status: 400 }
//       );
//     }

//     const user = await getUserFromToken();
//     if (!user) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // Ambil saldo terakhir dari tabel saldo
//     const lastSaldo = await prisma.saldo.findFirst({
//       where: { id_user: user.id_user },
//       orderBy: { timestamp_catatan: "desc" },
//     });

//     const prevSaldo = lastSaldo ? Number(lastSaldo.saldo_hasil) : 0;

//     // Hitung saldo baru
//     const newSaldo =
//       id_jenis === 1
//         ? prevSaldo + nominal // pemasukan
//         : prevSaldo - nominal; // pengeluaran

//     // HYBRID DATE:
//     // kalau user kirim tanggal (YYYY-MM-DD) -> pakai itu
//     // kalau tidak, fallback ke tanggal hari ini
//     const finalDate = tanggal ? new Date(tanggal) : new Date();

//     // 1. Insert transaksi
//     const transaksi = await prisma.transaksi.create({
//       data: {
//         id_user: user.id_user,
//         detail_transaksi: deskripsi ?? "",
//         id_jenis,
//         id_kategori,
//         nominal,
//         saldo_terakhir: newSaldo,
//         timestamp: finalDate, // pake tanggal hybrid
//       },
//     });

//     // 2. Insert saldo baru
//     await prisma.saldo.create({
//       data: {
//         id_user: user.id_user,
//         id_transaksi: transaksi.id_transaksi,
//         saldo_hasil: newSaldo,
//         timestamp_catatan: new Date(), // catatan saldo tetap waktu dibuat
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       transaksi,
//       saldo_baru: newSaldo,
//     });
//   } catch (err) {
//     console.error("POST transaksi error:", err);
//     return NextResponse.json(
//       { error: "Failed adding transaction" },
//       { status: 500 }
//     );
//   }
// }

// // ------------------------------
// // GET : LIST TRANSACTION
// // ------------------------------
// export async function GET() {
//   try {
//     const user = await getUserFromToken();

//     if (!user) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const transaksi = await prisma.transaksi.findMany({
//       where: { id_user: user.id_user },
//       orderBy: { timestamp: "desc" },
//       include: {
//         kategori: true,
//         jenis_transaksi: true,
//       },
//     });

//     return NextResponse.json(transaksi);
//   } catch (err) {
//     console.error("GET transaksi error:", err);
//     return NextResponse.json(
//       { error: "Failed fetching transaction" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

//  POST → Tambah Transaksi 
export async function POST(request) {
  try {
    const body = await request.json();
    const { nominal, deskripsi, id_jenis, id_kategori, tanggal } = body;

    if (!nominal || !id_jenis || !id_kategori) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lastSaldo = await prisma.saldo.findFirst({
      where: { id_user: user.id_user },
      orderBy: { timestamp_catatan: "desc" },
    });

    const prevSaldo = lastSaldo ? Number(lastSaldo.saldo_hasil) : 0;

    const newSaldo =
      id_jenis === 1
        ? prevSaldo + Number(nominal)
        : prevSaldo - Number(nominal);

    // FIX TANGGAL → PAKSA WIB (UTC+7)
    let finalDate;
    if (tanggal) {
      // Format: "2025-12-04" → "2025-12-04T00:00:00+07:00"
      finalDate = new Date(`${tanggal}T00:00:00+07:00`);
    } else {
      // Hari ini, tapi dipaksa WIB
      finalDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    }

    const transaksi = await prisma.transaksi.create({
      data: {
        id_user: user.id_user,
        detail_transaksi: deskripsi ?? "",
        id_jenis,
        id_kategori,
        nominal,
        saldo_terakhir: newSaldo,
        timestamp: finalDate,
      },
    });

    await prisma.saldo.create({
      data: {
        id_user: user.id_user,
        id_transaksi: transaksi.id_transaksi,
        saldo_hasil: newSaldo,
        timestamp_catatan: new Date(new Date().getTime() + 7 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      transaksi,
      saldo_baru: newSaldo,
    });
  } catch (err) {
    console.error("POST transaksi error:", err);
    return NextResponse.json(
      { error: "Failed adding transaction" },
      { status: 500 }
    );
  }
}



//  GET → Semua Transaksi User
export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "15");

    const skip = (page - 1) * pageSize;

    const transaksi = await prisma.transaksi.findMany({
      where: { id_user: user.id_user },
      orderBy: { timestamp: "desc" },
      include: { kategori: true, jenis_transaksi: true },
      skip,
      take: pageSize,
    });

    const total = await prisma.transaksi.count({
      where: { id_user: user.id_user },
    });

    return NextResponse.json({
      data: transaksi,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error("GET transaksi error:", err);
    return NextResponse.json({ error: "Failed fetching" }, { status: 500 });
  }
}

