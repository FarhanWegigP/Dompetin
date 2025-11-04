"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Eye, 
  EyeOff,
  TrendingUp,
  Wallet,
  CreditCard,
  FileText,
  LogOut,
  Menu,
  X,
  AlertTriangle
} from "lucide-react";

export default function DashboardPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // Data dummy
  const userData = {
    name: "Farhan",
    balance: 1234567890.00,
  };

  const router = useRouter();

  const topExpenses = [
    { label: "lah bajol", amount: 123000, percentage: 25 },
    { label: "lah tarik", amount: 456000, percentage: 45 },
    { label: "urang ayam", amount: 789000, percentage: 78 },
    { label: "sepatu adidas", amount: 312000, percentage: 31 },
    { label: "kobek", amount: 345000, percentage: 35 },
  ];

  const recentTransactions = [
    { id: 1, type: "income", category: "Gaji", amount: 5000000, date: "15 Okt 2025" },
    { id: 2, type: "expense", category: "Makan", amount: 150000, date: "14 Okt 2025" },
    { id: 3, type: "expense", category: "Transport", amount: 75000, date: "14 Okt 2025" },
    { id: 4, type: "income", category: "Freelance", amount: 2000000, date: "13 Okt 2025" },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true, path: "/" },
    { icon: ArrowUpRight, label: "Transaction", active: false, path: "/transaction" },
    { icon: CreditCard, label: "Loan & Debt", active: false, path: "/loandebt" },
    { icon: FileText, label: "Bill Vault", active: false, path: "/billvault" },
  ];

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">Dompet.in</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    item.active
                      ? 'bg-green-50 text-green-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={20} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600"
            >
              <Menu size={24} />
            </button>
            <div>
              <p className="text-sm text-gray-500">Welcome back,</p>
              <h2 className="text-xl font-bold text-gray-900">{userData.name}</h2>
            </div>
            <button 
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition flex items-center space-x-2"
            >
              <span>keluar</span>
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Balance Card */}
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
              {showBalance ? formatCurrency(userData.balance) : "Rp. ••••••••"}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Overview Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Overview</h3>
              <div className="flex items-center justify-center">
                {/* Donut Chart */}
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 200 200" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="30"
                    />
                    {/* Green segment (60%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="30"
                      strokeDasharray="263 440"
                      strokeLinecap="round"
                    />
                    {/* Yellow segment (15%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="30"
                      strokeDasharray="66 440"
                      strokeDashoffset="-263"
                      strokeLinecap="round"
                    />
                    {/* Dark segment (25%) */}
                    <circle
                      cx="100"
                      cy="100"
                      r="70"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="30"
                      strokeDasharray="110 440"
                      strokeDashoffset="-329"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm text-gray-600">Pemasukan (60%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span className="text-sm text-gray-600">Investasi (15%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-slate-800 rounded"></div>
                  <span className="text-sm text-gray-600">Pengeluaran (25%)</span>
                </div>
              </div>
            </div>

            {/* Flow Keuangan & Top Expenses */}
            <div className="space-y-6">
              {/* Flow Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Flow keuangan anda</h3>
                <div className="h-32">
                  <svg viewBox="0 0 400 100" className="w-full h-full">
                    <path
                      d="M 0 50 Q 50 20, 100 40 T 200 50 T 300 30 T 400 60"
                      fill="none"
                      stroke="#64748b"
                      strokeWidth="2"
                      className="opacity-50"
                    />
                  </svg>
                </div>
              </div>

              {/* Top Expenses */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Pemasukan dan pengeluaran anda</h3>
                <div className="space-y-3">
                  {topExpenses.slice(0, 2).map((expense, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{expense.label}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-green-500' : 'bg-slate-800'
                          }`}
                          style={{ width: `${expense.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Transaksi Terbaru</h3>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium" onClick={() => router.push('/transactions')}>
                Lihat Semua →
              </button>
            </div>
            <div className="divide-y divide-gray-200">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {transaction.type === 'income' 
                        ? <ArrowDownRight size={20} /> 
                        : <ArrowUpRight size={20} />
                      }
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{transaction.category}</div>
                      <div className="text-sm text-gray-500">{transaction.date}</div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6">
              {/* Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600" size={32} />
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Keluar dari Akun?</h3>
                <p className="text-gray-600">
                  Apakah Anda yakin ingin keluar dari akun Anda? Anda perlu masuk kembali untuk mengakses dashboard.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold shadow-lg hover:shadow-xl"
                >
                  Ya, Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}