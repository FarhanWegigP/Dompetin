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

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const [recentTransactions, setRecentTransactions] = useState([]);

  // ======= FETCH SALDO =======
  useEffect(() => {
    async function loadSaldo() {
      try {
        const res = await fetch("/api/transaction/saldo", {
          credentials: "include",
        });
        const data = await res.json();
        setSaldo(Number(data.saldo) || 0);
      } catch (err) {
        console.error("Failed load saldo:", err);
      }
    }
    loadSaldo();
  }, []);

  // ======= FETCH STATS (income & expense) =======
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/transaction/stats", {
          credentials: "include",
        });
        const data = await res.json();

        setIncome(Number(data.pemasukan_bulan_ini) || 0);
        setExpense(Number(data.pengeluaran_bulan_ini) || 0);
      } catch (err) {
        console.error("Failed load stats:", err);
      }
    }
    loadStats();
  }, []);

  // ======= FETCH RECENT TRANSACTIONS =======
  useEffect(() => {
    async function loadRecents() {
      try {
        const res = await fetch("/api/transaction/latest?limit=4", {
          credentials: "include",
        });
        const data = await res.json();
  
        const mapped = data.map((item) => ({
          id: item.id_transaksi,
          amount: Number(item.nominal),
          category: item.kategori?.nama_kategori || "-",
          type: item.jenis_transaksi?.id_jenis === 1 ? "income" : "expense",
          date: new Date(item.timestamp).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));
  
        setRecentTransactions(mapped);
      } catch (err) {
        console.error("Failed to fetch latest:", err);
      }
    }
  
    loadRecents();
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
            {formatCurrency(income)}
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
            {formatCurrency(expense)}
          </div>
          <p className="text-sm text-gray-500 mt-1">Bulan ini</p>
        </div>
      </div>

      {/* RINGKASAN + RECENT */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Placeholder Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Ringkasan Bulanan
          </h3>
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
  {recentTransactions.slice(0, 4).map((t) => (
    <div
      key={t.id}
      className="p-6 flex items-center justify-between hover:bg-gray-50 transition"
    >
      <div className="flex items-center space-x-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${
            t.type === "income"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {t.type === "income" ? (
            <ArrowDownRight size={20} />
          ) : (
            <ArrowUpRight size={20} />
          )}
        </div>

        <div>
          <div className="font-medium text-gray-900">{t.category}</div>
          <div className="text-sm text-gray-500">{t.date}</div>
        </div>
      </div>

      <div
        className={`text-lg font-bold ${
          t.type === "income" ? "text-green-600" : "text-red-600"
        }`}
      >
        {t.type === "income" ? "+" : "-"}
        {formatCurrency(t.amount)}
      </div>
    </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import {
//   ArrowUpRight,
//   ArrowDownRight,
//   Eye,
//   EyeOff,
//   TrendingUp,
//   Wallet,
// } from "lucide-react";

// // Recharts
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// export default function DashboardPage() {
//   const router = useRouter();

//   // ======= STATE SALDO DAN STATS =======
//   const [showBalance, setShowBalance] = useState(true);
//   const [saldo, setSaldo] = useState(null);

//   const [income, setIncome] = useState(0);
//   const [expense, setExpense] = useState(0);

//   const [recentTransactions, setRecentTransactions] = useState([]);

//   // ======= STATE CHART =======
//   const [chartType, setChartType] = useState("expense");
//   const [chartData, setChartData] = useState([]);
//   const [chartLoading, setChartLoading] = useState(false);

//   // ======= WARNA PIE CHART =======
//   const INCOME_COLORS = [
//     "#4ADE80", "#86EFAC", "#34D399", "#A7F3D0", "#FDE68A",
//     "#FCD34D", "#FDE047", "#F0F9FF", "#BAE6FD", "#7DD3FC",
//     "#C7D2FE", "#A5B4FC", "#DDD6FE", "#E9D5FF", "#FBCFE8",
//     "#F9A8D4", "#FECACA", "#FFE4E6", "#FFEDD5", "#FED7AA",
//     "#FDE68A", "#E9F8E5", "#D3F8DF", "#B7F1C8", "#9AE6B4"
//   ];
  
  
//   const EXPENSE_COLORS = [
//     "#B91C1C", "#7F1D1D", "#DC2626", "#991B1B", "#EF4444",
//     "#78350F", "#92400E", "#A16207", "#854D0E", "#D97706",
//     "#1E3A8A", "#1E40AF", "#312E81", "#4C1D95", "#5B21B6",
//     "#3F3D56", "#434343", "#4B5563", "#374151", "#1F2937",
//     "#475569", "#334155", "#3A3A3A", "#5C4033", "#6D4C41"
//   ];
  
  
//   const formatCurrency = (amount) =>
//     new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(amount || 0);

//   const getCurrentMonthYear = () => {
//     const now = new Date();
//     return {
//       month: now.getMonth() + 1,
//       year: now.getFullYear(),
//     };
//   };

//   useEffect(() => {
//     async function loadSaldo() {
//       try {
//         const res = await fetch("/api/transaction/saldo", {
//           credentials: "include",
//         });
//         const data = await res.json();
//         setSaldo(Number(data.saldo) || 0);
//       } catch (err) {
//         console.error("Failed load saldo:", err);
//       }
//     }
//     loadSaldo();
//   }, []);

//   useEffect(() => {
//     async function loadStats() {
//       try {
//         const res = await fetch("/api/transaction/stats", {
//           credentials: "include",
//         });
//         const data = await res.json();

//         setIncome(Number(data.pemasukan_bulan_ini) || 0);
//         setExpense(Number(data.pengeluaran_bulan_ini) || 0);
//       } catch (err) {
//         console.error("Failed load stats:", err);
//       }
//     }
//     loadStats();
//   }, []);

//   useEffect(() => {
//     async function loadRecents() {
//       try {
//         const res = await fetch("/api/transaction/latest?limit=5", {
//           credentials: "include",
//         });
//         const data = await res.json();

//         const mapped = data.map((item) => ({
//           id: item.id_transaksi,
//           amount: Number(item.nominal),
//           category: item.kategori?.nama_kategori || "-",
//           type: item.jenis_transaksi?.id_jenis === 1 ? "income" : "expense",
//           date: new Date(item.timestamp).toLocaleDateString("id-ID", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//           }),
//         }));

//         setRecentTransactions(mapped.slice(0, 5));
//       } catch (err) {
//         console.error("Failed load recents:", err);
//       }
//     }
//     loadRecents();
//   }, []);

//   async function loadCategorySummary(type = "expense") {
//     try {
//       setChartLoading(true);
//       const idJenis = type === "income" ? 1 : 2;
//       const { month, year } = getCurrentMonthYear();

//       const res = await fetch(
//         `/api/transaction/category-summary?id_jenis=${idJenis}&month=${month}&year=${year}`,
//         { credentials: "include" }
//       );
//       const data = await res.json();

//       const transformed = data.map((item) => ({
//         name: item.nama_kategori,
//         value: Number(item.total),
//       }));

//       setChartData(transformed);
//       setChartType(type);
//     } catch (err) {
//       console.error("Failed load category summary:", err);
//     } finally {
//       setChartLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadCategorySummary("expense");
//   }, []);

//   const CustomPieTooltip = ({ active, payload }) => {
//     if (!active || !payload || !payload.length) return null;

//     const item = payload[0];
//     const percent = (item.percent * 100).toFixed(1);

//     return (
//       <div className="bg-white px-4 py-3 border border-gray-200 shadow-lg rounded-lg text-xs">
//         <div className="font-semibold text-gray-900">{item.name}</div>
//         <div className="text-gray-700">
//           {formatCurrency(item.value)}
//         </div>
//         <div className="text-gray-500">{percent}% dari total</div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* SALDO */}
//       <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-2">
//             <Wallet size={24} />
//             <span className="text-sm font-medium">Saldo anda</span>
//           </div>
//           <button
//             onClick={() => setShowBalance(!showBalance)}
//             className="p-2 hover:bg-green-600 rounded-lg transition"
//           >
//             {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
//           </button>
//         </div>
//         <div className="text-3xl font-bold">
//           {showBalance
//             ? saldo !== null
//               ? formatCurrency(saldo)
//               : "Memuat..."
//             : "Rp. ••••••••"}
//         </div>
//       </div>

//       {/* SUMMARY */}
//       <div className="grid md:grid-cols-2 gap-4">
//         {/* Income */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center space-x-3 mb-2">
//             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
//               <ArrowDownRight className="text-green-600" size={20} />
//             </div>
//             <span className="text-gray-600 font-medium">Pemasukan</span>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">
//             {formatCurrency(income)}
//           </div>
//           <p className="text-sm text-gray-500 mt-1">Bulan ini</p>
//         </div>

//         {/* Expense */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center space-x-3 mb-2">
//             <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
//               <ArrowUpRight className="text-red-600" size={20} />
//             </div>
//             <span className="text-gray-600 font-medium">Pengeluaran</span>
//           </div>
//           <div className="text-2xl font-bold text-gray-900">
//             {formatCurrency(expense)}
//           </div>
//           <p className="text-sm text-gray-500 mt-1">Bulan ini</p>
//         </div>
//       </div>

//       {/* RINGKASAN + RECENT */}
//       <div className="grid lg:grid-cols-2 gap-6">

//         {/* === PIE CHART CARD === */}
//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-bold text-gray-900">
//               Ringkasan Bulanan
//             </h3>

//             {/* Toggle */}
//             <div className="inline-flex rounded-full bg-gray-100 p-1">
//               <button
//                 onClick={() => loadCategorySummary("income")}
//                 className={`px-3 py-1 text-xs rounded-full font-medium ${
//                   chartType === "income"
//                     ? "bg-white shadow text-green-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 Pemasukan
//               </button>
//               <button
//                 onClick={() => loadCategorySummary("expense")}
//                 className={`px-3 py-1 text-xs rounded-full font-medium ${
//                   chartType === "expense"
//                     ? "bg-white shadow text-red-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 Pengeluaran
//               </button>
//             </div>
//           </div>

//           {/* Chart */}
//           <div className="h-72 flex items-center justify-center">
//             {chartLoading ? (
//               <div className="text-gray-400 text-sm flex items-center">
//                 <TrendingUp className="mr-2 opacity-50" />
//                 Memuat grafik...
//               </div>
//             ) : chartData.length === 0 ? (
//               <div className="text-gray-400 text-sm">
//                 Tidak ada data untuk bulan ini.
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={chartData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={70}
//                     outerRadius={115}
//                     paddingAngle={3}
//                     dataKey="value"
//                     nameKey="name"
//                   >
//                     {chartData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={
//                           chartType === "income"
//                             ? INCOME_COLORS[index % INCOME_COLORS.length]
//                             : EXPENSE_COLORS[index % EXPENSE_COLORS.length]
//                         }
//                       />
//                     ))}
//                   </Pie>

//                   <Tooltip content={<CustomPieTooltip />} />

//                   <Legend
//                     verticalAlign="bottom"
//                     layout="horizontal"
//                     align="center"
//                     iconType="circle"
//                     wrapperStyle={{
//                       paddingTop: 10,
//                       fontSize: "12px",
//                     }}
//                   />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>

//         {/* === RECENT TRANSACTIONS === */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//           <div className="p-6 border-b border-gray-200 flex items-center justify-between">
//             <h3 className="text-lg font-bold text-gray-900">
//               Transaksi Terbaru
//             </h3>
//             <button
//               className="text-sm text-green-600 hover:text-green-700 font-medium"
//               onClick={() => router.push("/transaction")}
//             >
//               Lihat Semua →
//             </button>
//           </div>

//           <div className="divide-y divide-gray-200">
//             {recentTransactions.map((t) => (
//               <div
//                 key={t.id}
//                 className="p-6 flex items-center justify-between hover:bg-gray-50 transition"
//               >
//                 <div className="flex items-center space-x-4">
//                   <div
//                     className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                       t.type === "income"
//                         ? "bg-green-100 text-green-600"
//                         : "bg-red-100 text-red-600"
//                     }`}
//                   >
//                     {t.type === "income" ? (
//                       <ArrowDownRight size={20} />
//                     ) : (
//                       <ArrowUpRight size={20} />
//                     )}
//                   </div>

//                   <div>
//                     <div className="font-medium text-gray-900">
//                       {t.category}
//                     </div>
//                     <div className="text-sm text-gray-500">{t.date}</div>
//                   </div>
//                 </div>

//                 <div
//                   className={`text-lg font-bold ${
//                     t.type === "income" ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {t.type === "income" ? "+" : "-"}
//                   {formatCurrency(t.amount)}
//                 </div>
//               </div>
//             ))}
//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }
