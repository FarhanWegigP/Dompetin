// src/app/api/transaction/flow/route.js
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
        const startDate = searchParams.get("start");
        const endDate = searchParams.get("end");

        // Default: 30 hari terakhir
        const now = new Date();
        const defaultStart = new Date(now);
        defaultStart.setDate(defaultStart.getDate() - 30);

        const start = startDate ? new Date(startDate) : defaultStart;
        const end = endDate ? new Date(endDate) : now;

        // Set end date to end of day
        end.setHours(23, 59, 59, 999);

        // Get saldo awal sebelum periode
        const saldoAwalResult = await prisma.$queryRaw`
      SELECT COALESCE(
        (SELECT saldo_berjalan 
         FROM view_transaksi_lengkap 
         WHERE id_user = ${user.id_user} 
           AND timestamp < ${start}
         ORDER BY timestamp DESC, id_transaksi DESC 
         LIMIT 1),
        0
      ) as saldo_awal
    `;

        let saldoBerjalan = Number(saldoAwalResult[0]?.saldo_awal || 0);

        // Ambil transaksi dalam periode
        const transaksi = await prisma.transaksi.findMany({
            where: {
                id_user: user.id_user,
                timestamp: {
                    gte: start,
                    lte: end,
                },
            },
            orderBy: [
                { timestamp: "asc" },
                { id_transaksi: "asc" },
            ],
            select: {
                id_transaksi: true,
                nominal: true,
                timestamp: true,
                id_jenis: true,
            },
        });

        // Build flow data dengan running balance
        const flowData = [];

        // Titik awal
        flowData.push({
            date: start.toISOString().split('T')[0],
            saldo: saldoBerjalan,
            label: "Saldo Awal",
        });

        for (const t of transaksi) {
            const amount = Number(t.nominal);
            if (t.id_jenis === 1) {
                // Pemasukan
                saldoBerjalan += amount;
            } else {
                // Pengeluaran
                saldoBerjalan -= amount;
            }

            flowData.push({
                date: t.timestamp.toISOString().split('T')[0],
                saldo: saldoBerjalan,
                type: t.id_jenis === 1 ? "income" : "expense",
                amount: amount,
            });
        }

        // Group by date untuk menghindari terlalu banyak titik
        const groupedByDate = {};
        for (const item of flowData) {
            groupedByDate[item.date] = item;
        }

        const result = Object.values(groupedByDate).sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );

        return NextResponse.json({
            start: start.toISOString(),
            end: end.toISOString(),
            data: result,
        });
    } catch (err) {
        console.error("GET /transaction/flow error:", err);
        return NextResponse.json(
            { error: "Failed fetching flow data" },
            { status: 500 }
        );
    }
}
