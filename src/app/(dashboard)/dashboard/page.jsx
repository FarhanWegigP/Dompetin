"use client";
import { useState, useEffect } from "react";

// --- KUMPULAN IKON SVG CUSTOM ---
const Icons = {
  LayoutDashboard: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>),
  ArrowUpRight: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>),
  ArrowDownRight: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/></svg>),
  Eye: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
  EyeOff: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>),
  Wallet: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>),
  CreditCard: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>),
  FileText: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>),
  LogOut: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
  Menu: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>),
  X: () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
  AlertTriangle: () => (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
  ArrowRight: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>)
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Fungsi "bohongan" untuk ambil data
async function fetchDashboardData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        userData: {
          name: "Farhan", // Ini akan dioverride oleh layout, tapi tidak apa-apa
          balance: 1234567890.0,
        },
        topExpenses: [
          { label: "cimol bojot", amount: 123000, percentage: 30 },
          { label: "teh tarik", amount: 456000, percentage: 70 },
          { label: "cireng ayam", amount: 789000, percentage: 90 },
        ],
        overviewData: {
          income: 60,
          investment: 15,
          expense: 25,
        },
        incomeExpense: {
          incomePercentage: 75,
          expensePercentage: 40,
        },
      });
    }, 500);
  });
}

// Ini adalah Halaman Dashboard-mu
export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [chartRange, setChartRange] = useState('12M');

  // State untuk data
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({ balance: 0 });
  const [topExpenses, setTopExpenses] = useState([]);
  const [overviewData, setOverviewData] = useState(null);
  const [incomeExpense, setIncomeExpense] = useState(null);

  // Mengambil data saat halaman dibuka
  useEffect(() => {
    fetchDashboardData().then(data => {
      setUserData(data.userData);
      setTopExpenses(data.topExpenses);
      setOverviewData(data.overviewData);
      setIncomeExpense(data.incomeExpense);
      setIsLoading(false);
    });
  }, []);

  // Helper untuk Donut Chart
  const calculateDonutSegments = (data) => {
    if (!data) return [];
    const total = data.income + data.investment + data.expense;
    if (total === 0) return [];
    const circumference = 2 * Math.PI * 70;
    let offset = 0;
    const segments = [
      { color: "#22c55e", value: data.income },
      { color: "#eab308", value: data.investment },
      { color: "#1e293b", value: data.expense },
    ];
    return segments.map(segment => {
      const percentage = segment.value / total;
      const dashArray = `${percentage * circumference} ${circumference}`;
      const segmentOffset = -offset;
      offset += percentage * circumference;
      return { color: segment.color, dashArray, offset: segmentOffset };
    });
  };

  const donutSegments = calculateDonutSegments(overviewData);
  
  // Tampilan Loading
  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <p className="text-lg text-green-600 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  // Tampilan Dashboard (sesuai mockup-mu)
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* KOLOM KIRI (Saldo + Overview) */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Icons.Wallet />
                <span className="text-sm font-medium">Saldo anda</span>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 hover:bg-green-600 rounded-lg transition"
              >
                {showBalance ? <Icons.Eye /> : <Icons.EyeOff />}
              </button>
            </div>
            <div className="text-3xl font-bold">
              {showBalance ? formatCurrency(userData.balance) : "Rp. ••••••••"}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Overview</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-56 h-56">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#e5e7eb" strokeWidth="30" />
                  {donutSegments.map((segment, index) => (
                    <circle
                      key={index}
                      cx="100" cy="100" r="70"
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="30"
                      strokeDasharray={segment.dashArray}
                      strokeDashoffset={segment.offset}
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Pemasukan ({overviewData.income}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Investasi ({overviewData.investment}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-slate-800 rounded"></div>
                <span className="text-sm text-gray-600">Pengeluaran ({overviewData.expense}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (3 Kartu) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pengeluaran anda (Top 3)</h3>
            <div className="space-y-4">
              {topExpenses.slice(0, 3).map((expense, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">{expense.label}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gray-700 h-2 rounded-full"
                      style={{ width: `${expense.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Flow keuangan anda</h3>
              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setChartRange('6M')}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                    chartRange === '6M' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  6 Bulan
                </button>
                <button
                  onClick={() => setChartRange('12M')}
                  className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                    chartRange === '12M' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  12 Bulan
                </button>
              </div>
            </div>
            <div className="h-32 w-full">
              <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="flowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <line x1="0" y1="0" x2="400" y2="0" stroke="#e5e7eb" strokeWidth="1"/>
                <line x1="0" y1="33" x2="400" y2="33" stroke="#e5e7eb" strokeWidth="1"/>
                <line x1="0" y1="66" x2="400" y2="66" stroke="#e5e7eb" strokeWidth="1"/>
                <line x1="0" y1="100" x2="400" y2="100" stroke="#e5e7eb" strokeWidth="1"/>
                <path
                  d={
                    chartRange === '6M'
                      ? "M 0 60 L 80 50 L 160 70 L 240 40 L 320 50 L 400 30"
                      : "M 0 60 L 40 50 L 80 70 L 120 40 L 160 50 L 200 30 L 240 45 L 280 60 L 320 80 L 360 70 L 400 50"
                  }
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d={
                    chartRange === '6M'
                      ? "M 0 60 L 80 50 L 160 70 L 240 40 L 320 50 L 400 30 L 400 100 L 0 100 Z"
                      : "M 0 60 L 40 50 L 80 70 L 120 40 L 160 50 L 200 30 L 240 45 L 280 60 L 320 80 L 360 70 L 400 50 L 400 100 L 0 100 Z"
                  }
                  fill="url(#flowGradient)"
                />
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
              {chartRange === '6M' ? (
                <>
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>Mei</span>
                  <span>Jun</span>
                </>
              ) : (
                <>
                  <span>Jan</span>
                  <span className="opacity-0 md:opacity-100">...</span>
                  <span>Jun</span>
                  <span className="opacity-0 md:opacity-100">...</span>
                  <span>Des</span>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Pemasukan dan pengeluaran</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-700">Pemasukan</span>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                  <div 
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${incomeExpense.incomePercentage}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Pengeluaran</span>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
                  <div 
                    className="bg-gray-800 h-4 rounded-full"
                    style={{ width: `${incomeExpense.expensePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}