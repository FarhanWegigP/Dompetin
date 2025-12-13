// src/app/api/transaction/latest/route.js
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
    const limitParam = searchParams.get("limit");
    const limit = Number.isNaN(parseInt(limitParam))
      ? 5
      : parseInt(limitParam, 10);

    // DEBUG (sementara): pastikan id_user benar
    console.log("[/transaction/latest] user.id_user =", user.id_user);

    const transaksi = await prisma.transaksi.findMany({
      where: {
        id_user: user.id_user,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: limit,
      include: {
        kategori: true,
        jenis_transaksi: true,
      },
    });

    return NextResponse.json(transaksi);
  } catch (err) {
    console.error("GET /transaction/latest error:", err);
    return NextResponse.json(
      { error: "Failed fetching latest transactions" },
      { status: 500 }
    );
  }
}
