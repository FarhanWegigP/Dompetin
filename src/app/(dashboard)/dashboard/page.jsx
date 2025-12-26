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
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const router = useRouter();

  const [showBalance, setShowBalance] = useState(true);
  const [saldo, setSaldo] = useState(null);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chart state
  const [chartType, setChartType] = useState("expense");
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

  // Flow chart state (line chart dengan date range)
  const [flowData, setFlowData] = useState([]);
  const [flowLoading, setFlowLoading] = useState(false);
  const [flowStartDate, setFlowStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [flowEndDate, setFlowEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Color palettes - grouped by shades
  const INCOME_COLORS = [
    "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", // Green shades
    "#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", // Blue shades
    "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", // Purple shades
    "#f59e0b", "#fbbf24", "#fcd34d", "#fde68a", // Amber shades
    "#ec4899", "#f472b6", "#f9a8d4", "#fbcfe8", // Pink shades
  ];

  const EXPENSE_COLORS = [
    "#ef4444", "#f87171", "#fca5a5", "#fecaca", // Red shades
    "#f97316", "#fb923c", "#fdba74", "#fed7aa", // Orange shades
    "#84cc16", "#a3e635", "#bef264", "#d9f99d", // Lime shades
    "#06b6d4", "#22d3ee", "#67e8f9", "#a5f3fc", // Cyan shades
    "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", // Indigo shades
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const getCurrentMonthYear = () => {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  };

  // Load category summary for chart
  async function loadCategorySummary(type = "expense") {
    try {
      setChartLoading(true);
      const idJenis = type === "income" ? 1 : 2;
      const { month, year } = getCurrentMonthYear();

      const res = await fetch(
        `/api/transaction/category-summary?id_jenis=${idJenis}&month=${month}&year=${year}`,
        { credentials: "include" }
      );
      const data = await res.json();

      const transformed = data.map((item) => ({
        name: item.nama_kategori,
        value: Number(item.total),
      }));

      setChartData(transformed);
      setChartType(type);
    } catch (err) {
      console.error("Failed load category summary:", err);
    } finally {
      setChartLoading(false);
    }
  }

  // Fetch semua data sekaligus
  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        // Parallel fetch untuk performa lebih baik
        const [saldoRes, statsRes, latestRes] = await Promise.all([
          fetch("/api/transaction/saldo", { credentials: "include" }),
          fetch("/api/transaction/stats", { credentials: "include" }),
          fetch("/api/transaction/latest?limit=4", { credentials: "include" }),
        ]);

        // Parse semua response
        const saldoData = await saldoRes.json();
        const statsData = await statsRes.json();
        const latestData = await latestRes.json();

        // Set saldo
        setSaldo(Number(saldoData.saldo) || 0);

        // Set stats
        setIncome(Number(statsData.pemasukan_bulan_ini) || 0);
        setExpense(Number(statsData.pengeluaran_bulan_ini) || 0);

        // Set recent transactions
        const mapped = latestData.map((item) => ({
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
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  // Load chart on mount
  useEffect(() => {
    loadCategorySummary("expense");
  }, []);

  // Load flow data function
  async function loadFlowData() {
    try {
      setFlowLoading(true);
      const res = await fetch(
        `/api/transaction/flow?start=${flowStartDate}&end=${flowEndDate}`,
        { credentials: "include" }
      );
      const data = await res.json();

      // Transform untuk chart
      const transformed = data.data.map((item) => ({
        date: new Date(item.date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        }),
        saldo: item.saldo,
        fullDate: item.date,
      }));

      setFlowData(transformed);
    } catch (err) {
      console.error("Failed to load flow data:", err);
    } finally {
      setFlowLoading(false);
    }
  }

  // Load flow data when date range changes
  useEffect(() => {
    loadFlowData();
  }, [flowStartDate, flowEndDate]);

  const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const item = payload[0];
    const percent = (item.percent * 100).toFixed(1);

    return (
      <div className="bg-white px-4 py-3 border border-gray-200 shadow-lg rounded-lg">
        <div className="font-semibold text-gray-900">{item.name}</div>
        <div className="text-gray-700 font-medium">
          {formatCurrency(item.value)}
        </div>
        <div className="text-gray-500 text-sm">{percent}% dari total</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

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
        {/* Pie Chart Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              Ringkasan Bulanan
            </h3>

            {/* Toggle Income/Expense */}
            <div className="inline-flex rounded-full bg-gray-100 p-1">
              <button
                onClick={() => loadCategorySummary("income")}
                className={`px-3 py-1 text-xs rounded-full font-medium transition ${chartType === "income"
                  ? "bg-white shadow text-green-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => loadCategorySummary("expense")}
                className={`px-3 py-1 text-xs rounded-full font-medium transition ${chartType === "expense"
                  ? "bg-white shadow text-red-600"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-80 flex items-center justify-center">
            {chartLoading ? (
              <div className="text-gray-400 text-sm flex items-center">
                <TrendingUp className="mr-2 opacity-50" />
                Memuat grafik...
              </div>
            ) : chartData.length === 0 ? (
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm">
                  Tidak ada data untuk bulan ini
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          chartType === "income"
                            ? INCOME_COLORS[index % INCOME_COLORS.length]
                            : EXPENSE_COLORS[index % EXPENSE_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomPieTooltip />} />

                  <Legend
                    verticalAlign="bottom"
                    layout="horizontal"
                    align="center"
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: 10,
                      fontSize: "11px",
                      maxHeight: "60px",
                      overflowY: "auto",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">
              Transaksi Terbaru
            </h3>
            <button
              className="text-sm text-green-600 hover:text-green-700 font-medium"
              onClick={() => router.push("/transaction")}
            >
              Lihat Semua →
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {recentTransactions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Belum ada transaksi
              </div>
            ) : (
              recentTransactions.map((t) => (
                <div
                  key={t.id}
                  className="p-6 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${t.type === "income"
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
                      <div className="font-medium text-gray-900">
                        {t.category}
                      </div>
                      <div className="text-sm text-gray-500">{t.date}</div>
                    </div>
                  </div>

                  <div
                    className={`text-lg font-bold ${t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(t.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* LINE CHART - Flow Keuangan Per Periode */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Flow Keuangan Anda
          </h3>

          {/* Date Range Picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-400" />
              <input
                type="date"
                value={flowStartDate}
                onChange={(e) => setFlowStartDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={flowEndDate}
              onChange={(e) => setFlowEndDate(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="h-72">
          {flowLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-400 text-sm flex items-center">
                <TrendingUp className="mr-2 opacity-50" />
                Memuat grafik...
              </div>
            </div>
          ) : flowData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <TrendingUp size={48} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm">
                  Tidak ada data untuk periode ini
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={flowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    value >= 1000000
                      ? `${(value / 1000000).toFixed(1)}jt`
                      : value >= 1000
                        ? `${(value / 1000).toFixed(0)}rb`
                        : value
                  }
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Saldo"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 6, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* BAR CHART - Pemasukan vs Pengeluaran (Horizontal Bar, Bulan Ini) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Pemasukan dan Pengeluaran Anda
        </h3>
        <p className="text-sm text-gray-500 mb-4">Bulan ini</p>

        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { name: "Pemasukan", value: income, fill: "#10b981" },
                { name: "Pengeluaran", value: expense, fill: "#ef4444" },
              ]}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={true} vertical={false} />
              <XAxis
                type="number"
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value >= 1000000
                    ? `${(value / 1000000).toFixed(1)}jt`
                    : value >= 1000
                      ? `${(value / 1000).toFixed(0)}rb`
                      : value
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value)]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}