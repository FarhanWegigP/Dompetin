"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  EyeOff,
  TrendingUp,
  Wallet,
  Calendar,
  Sparkles,
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

// Memoized Components untuk optimasi
const StatCard = memo(({ title, value, icon: Icon, color, bgColor, hideAmount }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
        <Icon className={color} size={22} />
      </div>
    </div>
    <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">
      {hideAmount ? "Rp •••••••" : value}
    </p>
  </div>
));

StatCard.displayName = 'StatCard';

const TransactionItem = memo(({ transaction, hideAmount }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200">
    <div className="flex items-center space-x-4 flex-1 min-w-0">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
          transaction.type === "income"
            ? "bg-green-50"
            : "bg-red-50"
        }`}
      >
        {transaction.type === "income" ? (
          <ArrowDownRight className="text-green-600" size={20} />
        ) : (
          <ArrowUpRight className="text-red-600" size={20} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900 truncate">{transaction.category}</p>
        <p className="text-sm text-gray-500 truncate">{transaction.date}</p>
      </div>
    </div>
    <p
      className={`text-lg font-bold ml-4 flex-shrink-0 ${
        transaction.type === "income" ? "text-green-600" : "text-red-600"
      }`}
    >
      {hideAmount ? "•••" : `${transaction.type === "income" ? "+" : "-"}${formatCurrency(transaction.amount)}`}
    </p>
  </div>
));

TransactionItem.displayName = 'TransactionItem';

const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default function DashboardPage() {
  const router = useRouter();

  const [showBalance, setShowBalance] = useState(true);
  const [saldo, setSaldo] = useState(null);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [chartType, setChartType] = useState("expense");
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(false);

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

  const INCOME_COLORS = [
    "#10b981", "#34d399", "#6ee7b7", "#a7f3d0",
    "#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd",
    "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe",
  ];

  const EXPENSE_COLORS = [
    "#ef4444", "#f87171", "#fca5a5", "#fecaca",
    "#f97316", "#fb923c", "#fdba74", "#fed7aa",
    "#84cc16", "#a3e635", "#bef264", "#d9f99d",
  ];

  const getCurrentMonthYear = () => {
    const now = new Date();
    return {
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    };
  };

  // Optimized data fetching
  useEffect(() => {
    let mounted = true;

    async function loadDashboard() {
      try {
        setLoading(true);

        const [saldoRes, statsRes, latestRes] = await Promise.all([
          fetch("/api/transaction/saldo", { credentials: "include" }),
          fetch("/api/transaction/stats", { credentials: "include" }),
          fetch("/api/transaction/latest?limit=4", { credentials: "include" }),
        ]);

        if (!mounted) return;

        const [saldoData, statsData, latestData] = await Promise.all([
          saldoRes.json(),
          statsRes.json(),
          latestRes.json(),
        ]);

        setSaldo(Number(saldoData.saldo) || 0);
        setIncome(Number(statsData.pemasukan_bulan_ini) || 0);
        setExpense(Number(statsData.pengeluaran_bulan_ini) || 0);

        const mapped = latestData.map((item) => ({
          id: item.id_transaksi,
          amount: Number(item.nominal),
          category: item.kategori?.nama_kategori || "-",
          type: item.jenis_transaksi?.id_jenis === 1 ? "income" : "expense",
          date: new Date(item.timestamp).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          }),
        }));

        setRecentTransactions(mapped);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  // Load chart data
  useEffect(() => {
    let mounted = true;

    async function loadCategorySummary(type = "expense") {
      try {
        setChartLoading(true);
        const idJenis = type === "income" ? 1 : 2;
        const { month, year } = getCurrentMonthYear();

        const res = await fetch(
          `/api/transaction/category-summary?id_jenis=${idJenis}&month=${month}&year=${year}`,
          { credentials: "include" }
        );
        
        if (!mounted) return;
        
        const data = await res.json();

        const transformed = data.map((item) => ({
          name: item.nama_kategori,
          value: Number(item.total),
        }));

        setChartData(transformed);
      } catch (err) {
        console.error("Failed load category summary:", err);
      } finally {
        if (mounted) setChartLoading(false);
      }
    }

    loadCategorySummary(chartType);

    return () => {
      mounted = false;
    };
  }, [chartType]);

  // Load flow data
  useEffect(() => {
    let mounted = true;

    async function loadFlowData() {
      try {
        setFlowLoading(true);
        const res = await fetch(
          `/api/transaction/flow?start=${flowStartDate}&end=${flowEndDate}`,
          { credentials: "include" }
        );
        
        if (!mounted) return;
        
        const data = await res.json();

        const transformed = data.data.map((item) => ({
          date: new Date(item.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          }),
          saldo: item.saldo,
        }));

        setFlowData(transformed);
      } catch (err) {
        console.error("Failed to load flow data:", err);
      } finally {
        if (mounted) setFlowLoading(false);
      }
    }

    loadFlowData();

    return () => {
      mounted = false;
    };
  }, [flowStartDate, flowEndDate]);

  // Memoized tooltip
  const CustomPieTooltip = useMemo(() => {
    return ({ active, payload }) => {
      if (!active || !payload || !payload.length) return null;

      const item = payload[0];
      const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
      const percent = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;

      return (
        <div className="bg-white px-4 py-3 border border-gray-200 shadow-lg rounded-xl">
          <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
          <div className="text-gray-700 font-medium text-sm mt-1">
            {formatCurrency(item.value)}
          </div>
          <div className="text-gray-500 text-xs mt-0.5">{percent}% dari total</div>
        </div>
      );
    };
  }, [chartData]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6 space-y-6">


      {/* Balance Card */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Wallet size={24} />
              </div>
              <div>
                <p className="text-green-100 text-sm">Total Saldo</p>
                <p className="text-xs text-green-200">Update real-time</p>
              </div>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-3 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
            >
              {showBalance ? <Eye size={22} /> : <EyeOff size={22} />}
            </button>
          </div>
          <div className="text-4xl font-bold mb-2">
            {showBalance ? formatCurrency(saldo) : "Rp ••••••••"}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <StatCard
          title="Pemasukan Bulan Ini"
          value={formatCurrency(income)}
          icon={ArrowDownRight}
          color="text-green-600"
          bgColor="bg-green-50"
          hideAmount={!showBalance}
        />
        <StatCard
          title="Pengeluaran Bulan Ini"
          value={formatCurrency(expense)}
          icon={ArrowUpRight}
          color="text-red-600"
          bgColor="bg-red-50"
          hideAmount={!showBalance}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Kategori Transaksi</h3>
            <div className="inline-flex rounded-full bg-gray-100 p-1">
              <button
                onClick={() => setChartType("income")}
                className={`px-4 py-2 text-xs rounded-full font-medium transition-all ${
                  chartType === "income"
                    ? "bg-white shadow-sm text-green-600"
                    : "text-gray-500"
                }`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setChartType("expense")}
                className={`px-4 py-2 text-xs rounded-full font-medium transition-all ${
                  chartType === "expense"
                    ? "bg-white shadow-sm text-red-600"
                    : "text-gray-500"
                }`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          <div className="h-72">
            {chartLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <TrendingUp size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-400">Belum ada data bulan ini</p>
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
                    paddingAngle={3}
                    dataKey="value"
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
                  <Tooltip content={CustomPieTooltip} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: "11px", paddingTop: 16 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Transaksi Terbaru</h3>
            <button
              onClick={() => router.push("/transaction")}
              className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
            >
              Lihat Semua
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div className="p-3">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Wallet size={48} className="mx-auto mb-3 opacity-50" />
                <p>Belum ada transaksi</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentTransactions.map((t) => (
                  <TransactionItem key={t.id} transaction={t} hideAmount={!showBalance} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Flow Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900">Flow Keuangan</h3>
          <div className="flex items-center gap-3">
            <Calendar size={18} className="text-gray-400" />
            <input
              type="date"
              value={flowStartDate}
              onChange={(e) => setFlowStartDate(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="text-gray-400">—</span>
            <input
              type="date"
              value={flowEndDate}
              onChange={(e) => setFlowEndDate(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="h-72">
          {flowLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
            </div>
          ) : flowData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <TrendingUp size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-400">Tidak ada data</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={flowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={11}
                  tickLine={false}
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
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Perbandingan Bulan Ini</h3>
        <p className="text-sm text-gray-500 mb-6">Pemasukan vs Pengeluaran</p>

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
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal vertical={false} />
              <XAxis
                type="number"
                stroke="#9ca3af"
                fontSize={11}
                tickLine={false}
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
                width={100}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value)]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}