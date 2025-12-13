import { NextResponse } from "next/server";
import prisma from "@/src/app/lib/prisma";
import { getUserFromToken } from "@/src/app/lib/auth";

export async function GET(request) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const jenis = searchParams.get("jenis"); // "pemasukan" / "pengeluaran"

    let jenisId = null;
    if (jenis === "pemasukan") jenisId = 1;
    if (jenis === "pengeluaran") jenisId = 2;

    let kategoriList;

    if (jenisId) {
      // ambil kategori sesuai jenis
      kategoriList = await prisma.kategori.findMany({
        where: {
          kategori_jenis_transaksi: {
            some: {
              id_jenis: jenisId,
            },
          },
        },
        orderBy: { nama_kategori: "asc" },
      });
    } else {
      // fallback — semua kategori
      kategoriList = await prisma.kategori.findMany({
        orderBy: { nama_kategori: "asc" },
      });
    }

    return NextResponse.json(kategoriList);
  } catch (err) {
    console.error("GET kategori error:", err);
    return NextResponse.json(
      { error: "Failed fetching categories" },
      { status: 500 }
    );
  }
}
