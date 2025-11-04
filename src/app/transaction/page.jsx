"use client";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Filter,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Wallet,
  X,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TransactionPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pemasukan");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push('/');
  };
  const [formData, setFormData] = useState({
    nominal: "",
    kategori: "",
    catatan: ""
  });

  const router = useRouter();

  // Data dummy
  const userData = {
    name: "Farhan",
    balance: 1234567890.00,
  };

  const transactions = [
    { id: 1, type: "income", category: "cimol bojot", amount: 123000, date: "15 Okt 2025", note: "Jajan" },
    { id: 2, type: "expense", category: "teh tarik", amount: 456000, date: "14 Okt 2025", note: "Minuman" },
    { id: 3, type: "expense", category: "cireng ayam", amount: 789000, date: "14 Okt 2025", note: "" },
    { id: 4, type: "income", category: "sepatu adidas", amount: 12000, date: "13 Okt 2025", note: "" },
    { id: 5, type: "income", category: "alhamdulillah gajian", amount: 345000, date: "12 Okt 2025", note: "Gaji bulan ini" },
    { id: 6, type: "income", category: "budi bayar utang", amount: 100000, date: "11 Okt 2025", note: "" },
    { id: 7, type: "expense", category: "beli mobil", amount: 999000, date: "10 Okt 2025", note: "Cicilan" },
  ];

  const categories = {
    pemasukan: ["Gaji", "Bonus", "Freelance", "Investasi", "Lainnya"],
    pengeluaran: ["Makanan", "Transport", "Belanja", "Tagihan", "Hiburan", "Lainnya"]
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false, path: "/dashboard" },
    { icon: ArrowUpRight, label: "Transaction", active: true, path: "/transaction" },
    { icon: CreditCard, label: "Loan & Debt", active: false, path: "/loandebt" },
    { icon: FileText, label: "Bill Vault", active: false, path: "/billvault" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, type: activeTab });
    setShowModal(false);
    setFormData({ nominal: "", kategori: "", catatan: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-green-600">Dompet.in</h1>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X size={24} />
            </button>
          </div>

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

      {/* Overlay */}
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

          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowDownRight className="text-green-600" size={20} />
                </div>
                <span className="text-gray-600 font-medium">Pemasukan</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">Rp. 7.500.000</div>
              <p className="text-sm text-gray-500 mt-1">Bulan ini</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <ArrowUpRight className="text-red-600" size={20} />
                </div>
                <span className="text-gray-600 font-medium">Pengeluaran</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">Rp. 3.200.000</div>
              <p className="text-sm text-gray-500 mt-1">Bulan ini</p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Transaksi terakhir</h3>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Filter size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                  nominal
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                  kategori
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition">
                  catatan
                </button>
              </div>
            </div>

            {/* Transaction Items */}
            <div className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="text-lg font-medium text-gray-900 w-32">
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            transaction.type === 'income' ? 'bg-green-500' : 'bg-slate-800'
                          }`}
                          style={{ width: `${Math.min((transaction.amount / 1000000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 min-w-[200px]">
                      <span className="text-gray-700">{transaction.category}</span>
                      {transaction.type === 'income' ? (
                        <ChevronUp className="text-green-600" size={20} />
                      ) : (
                        <ChevronDown className="text-red-600" size={20} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition transform hover:scale-105 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Tabs */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <button
                  onClick={() => setActiveTab("pemasukan")}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    activeTab === "pemasukan"
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Pemasukan
                </button>
                <button
                  onClick={() => setActiveTab("pengeluaran")}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    activeTab === "pengeluaran"
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Pengeluaran
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Nominal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nominal
                </label>
                <input
                  type="number"
                  name="nominal"
                  value={formData.nominal}
                  onChange={handleChange}
                  placeholder="Tambah kategori"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-gray-100 cursor-pointer"
                    required
                  >
                    <option value="">Pilih kategori</option>
                    {categories[activeTab].map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  placeholder="Tambahkan catatan (opsional)"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ nominal: "", kategori: "", catatan: "" });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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