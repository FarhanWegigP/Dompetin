"use client";
import {
  ArrowUpRight,
  Calendar,
  CreditCard,
  Download,
  Eye,
  FileText,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Trash2,
  Upload,
  X,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BillVaultPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    judul: "",
    catatan: "",
    tanggal: "",
    file: null
  });

  const userData = {
    name: "Farhan",
  };

  const bills = [
    { 
      id: 1, 
      title: "NicespiceUNS.png", 
      date: "04/10/2025", 
      amount: 123000,
      category: "Makanan",
      note: "Makan siang bareng temen",
      thumbnail: "/placeholder-bill.jpg"
    },
    { 
      id: 2, 
      title: "Belanja Supermarket", 
      date: "03/10/2025", 
      amount: 456000,
      category: "Belanja",
      note: "Belanja bulanan",
      thumbnail: "/placeholder-bill.jpg"
    },
    { 
      id: 3, 
      title: "Tagihan Listrik", 
      date: "01/10/2025", 
      amount: 350000,
      category: "Tagihan",
      note: "",
      thumbnail: "/placeholder-bill.jpg"
    },
    { 
      id: 4, 
      title: "Bensin Motor", 
      date: "02/10/2025", 
      amount: 50000,
      category: "Transport",
      note: "Isi full tank",
      thumbnail: "/placeholder-bill.jpg"
    },
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
    { icon: CreditCard, label: "Loan & Debt", active: false, path: "/loandebt" },
    { icon: FileText, label: "Bill Vault", active: true, path: "/billvault" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowModal(false);
    setFormData({ judul: "", catatan: "", tanggal: "", file: null });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push('/');
  };

  const filteredBills = bills.filter(bill => 
    bill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bill.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {/* Page Title & Search */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Arsip nota anda</h1>
              <p className="text-gray-600">Kelola dan simpan semua nota belanja Anda</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari nota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Nota</p>
                  <p className="text-3xl font-bold text-gray-900">{bills.length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-green-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Bulan Ini</p>
                  <p className="text-3xl font-bold text-gray-900">4</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-blue-600" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
                  <p className="text-2xl font-bold text-gray-900">Rp 979K</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Bills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBills.map((bill) => (
              <div 
                key={bill.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition group"
              >
                {/* Image Thumbnail */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedBill(bill)}
                        className="p-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition"
                      >
                        <Eye size={20} />
                      </button>
                      <button className="p-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition">
                        <Download size={20} />
                      </button>
                      <button className="p-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bill Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 truncate">{bill.title}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Tanggal:</span>
                      <span className="font-medium text-gray-900">{bill.date}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Kategori:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        {bill.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Nominal:</span>
                      <span className="font-bold text-green-600">{formatCurrency(bill.amount)}</span>
                    </div>
                    {bill.note && (
                      <p className="text-xs text-gray-500 mt-2 truncate">{bill.note}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredBills.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <ImageIcon size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak ada nota ditemukan</h3>
              <p className="text-gray-600 mb-6">Coba ubah kata kunci pencarian Anda</p>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition transform hover:scale-105 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Tambah Nota Baru</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Foto Nota
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    required
                  />
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                  >
                    <Upload size={40} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      {formData.file ? formData.file.name : "Klik untuk upload foto"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                  </label>
                </div>
              </div>

              {/* Judul */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Nota
                </label>
                <input
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  placeholder="Contoh: Belanja Supermarket"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  required
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                  required
                />
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (Opsional)
                </label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  placeholder="Tambahkan catatan..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ judul: "", catatan: "", tanggal: "", file: null });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedBill.title}</h2>
              <button 
                onClick={() => setSelectedBill(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image Preview */}
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon size={80} className="text-gray-400" />
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Tanggal</span>
                  <span className="font-medium text-gray-900">{selectedBill.date}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Kategori</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {selectedBill.category}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Nominal</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(selectedBill.amount)}</span>
                </div>
                {selectedBill.note && (
                  <div className="pb-4 border-b border-gray-200">
                    <span className="text-gray-600 block mb-2">Catatan</span>
                    <p className="text-gray-900">{selectedBill.note}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center space-x-2">
                  <Download size={20} />
                  <span>Download</span>
                </button>
                <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center space-x-2">
                  <Trash2 size={20} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
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