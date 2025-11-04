"use client";
import {
  AlertTriangle,
  ArrowUpRight,
  CreditCard,
  Edit,
  Eye,
  EyeOff,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Trash2,
  X
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function LoanDebtPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUtangBalance, setShowUtangBalance] = useState(true);
  const [showPiutangBalance, setShowPiutangBalance] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeType, setActiveType] = useState("utang");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push('/login');
  };
  const [formData, setFormData] = useState({
    nama: "",
    jumlah: "",
    catatan: ""
  });

  const userData = {
    name: "Farhan",
    totalUtang: 200000.00,
    totalPiutang: 100000.00,
  };

  const utangList = [
    { id: 1, name: "utang ke tio", amount: 100000, progress: 60, date: "10/11/2025" },
    { id: 2, name: "utang supermarket", amount: 50000, progress: 80, date: "15/11/2025" },
    { id: 3, name: "cicilan motor", amount: 30000, progress: 40, date: "20/11/2025" },
  ];

  const piutangList = [
    { id: 1, name: "rizky", amount: 50000, progress: 50, date: "12/11/2025" },
    { id: 2, name: "andi bayar", amount: 30000, progress: 70, date: "18/11/2025" },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: false, path: "/dashboard" },
    { icon: ArrowUpRight, label: "Transaction", active: false, path: "/transaction" },
    { icon: CreditCard, label: "Loan & Debt", active: true, path: "/loandebt" },
    { icon: FileText, label: "Bill Vault", active: false, path: "/billvault" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, type: activeType });
    setShowModal(false);
    setFormData({ nama: "", jumlah: "", catatan: "" });
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
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-green-50 text-green-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
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
          {/* Balance Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Utang Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">utang</h3>
                <button 
                  onClick={() => setShowUtangBalance(!showUtangBalance)}
                  className="p-2 hover:bg-green-600 rounded-lg transition"
                >
                  {showUtangBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              <div className="text-3xl font-bold">
                {showUtangBalance ? formatCurrency(userData.totalUtang) : "Rp. ••••••••"}
              </div>
            </div>

            {/* Piutang Card */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">piutang</h3>
                <button 
                  onClick={() => setShowPiutangBalance(!showPiutangBalance)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition"
                >
                  {showPiutangBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              <div className="text-3xl font-bold">
                {showPiutangBalance ? formatCurrency(userData.totalPiutang) : "Rp. ••••••••"}
              </div>
            </div>
          </div>

          {/* Lists */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* List Utang */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">list utang</h3>
              <div className="space-y-4">
                {utangList.map((item) => (
                  <div key={item.id} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">
                        {formatCurrency(item.amount)}
                      </span>
                      <span className="text-white text-sm">{item.name}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white text-xs opacity-80">Jatuh tempo: {item.date}</span>
                      <div className="flex space-x-2">
                        <button className="text-white hover:text-green-100 transition">
                          <Edit size={16} />
                        </button>
                        <button className="text-white hover:text-red-200 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List Piutang */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">list piutang</h3>
              <div className="space-y-4">
                {piutangList.map((item) => (
                  <div key={item.id} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium text-sm">
                        {formatCurrency(item.amount)}
                      </span>
                      <span className="text-white text-sm">{item.name}</span>
                    </div>
                    <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-white text-xs opacity-80">Jatuh tempo: {item.date}</span>
                      <div className="flex space-x-2">
                        <button className="text-white hover:text-slate-100 transition">
                          <Edit size={16} />
                        </button>
                        <button className="text-white hover:text-red-200 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setActiveType("utang")}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    activeType === "utang"
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Utang
                </button>
                <button
                  onClick={() => setActiveType("piutang")}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    activeType === "piutang"
                      ? 'bg-slate-700 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  Piutang
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Nama orang/tempat"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah
                </label>
                <input
                  type="number"
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleChange}
                  placeholder="Jumlah uang"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  placeholder="Tambahkan catatan (opsional)"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-100 resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ nama: "", jumlah: "", catatan: "" });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Batal
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