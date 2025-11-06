"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  // ======= STATE =======
  const [showBalance, setShowBalance] = useState(true);
  const [saldo, setSaldo] = useState(null);

  // Ringkasan dummy (tetap dulu)
  const summary = {
    pemasukanBulanIni: 7500000,
    pengeluaranBulanIni: 3200000,
  };

  const recentTransactions = [
    { id: 1, type: "income", category: "Gaji", amount: 5000000, date: "15 Okt 2025" },
    { id: 2, type: "expense", category: "Makan", amount: 150000, date: "14 Okt 2025" },
    { id: 3, type: "expense", category: "Transport", amount: 75000, date: "14 Okt 2025" },
    { id: 4, type: "income", category: "Freelance", amount: 2000000, date: "13 Okt 2025" },
  ];

  // ======= FETCH SALDO (REAL) =======
  useEffect(() => {
    async function loadSaldo() {
      try {
        const res = await fetch("/api/saldo", {
          method: "GET",
          credentials: "include", // penting: bawa cookie auth_token
        });
        if (!res.ok) {
          console.error("API saldo error:", res.status);
          setSaldo(0);
          return;
        }
        const data = await res.json();
        setSaldo(Number(data.saldo) || 0);
      } catch (err) {
        console.error("Gagal fetch saldo:", err);
        setSaldo(0);
      }
    }
    loadSaldo();
  }, []);

  // ======= UTILS =======
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  // ======= RENDER =======
  return (
    <div className="p-6 space-y-6">
      {/* SALDO */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wallet size={24} />
            <span className="text-sm font-medium">Saldo anda</span>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-green-600 rounded-lg transition"
          >
            {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        <div className="text-3xl font-bold">
          {showBalance
            ? saldo !== null
              ? formatCurrency(saldo)
              : "Memuat..."
            : "Rp. ••••••••"}
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="text-green-600" size={20} />
            </div>
            <span className="text-gray-600 font-medium">Pemasukan</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.pemasukanBulanIni)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Bulan ini</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="text-red-600" size={20} />
            </div>
            <span className="text-gray-600 font-medium">Pengeluaran</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary.pengeluaranBulanIni)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Bulan ini</p>
        </div>
      </div>

      {/* RINGKASAN + RECENT */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Placeholder Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Ringkasan Bulanan</h3>
          <div className="h-40 flex items-center justify-center text-gray-500">
            <TrendingUp size={40} className="opacity-50" />
            <span className="ml-3">Grafik keuangan (placeholder)</span>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Transaksi Terbaru</h3>
            <button
              className="text-sm text-green-600 hover:text-green-700 font-medium"
              onClick={() => router.push("/transaction")}
            >
              Lihat Semua →
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownRight size={20} />
                    ) : (
                      <ArrowUpRight size={20} />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.category}
                    </div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </div>
                </div>

                <div
                  className={`text-lg font-bold ${
                    transaction.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
