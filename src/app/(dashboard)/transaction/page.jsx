"use client";
import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Eye, EyeOff, ArrowDownRight, ArrowUpRight, Wallet, Filter } from "lucide-react";

export default function TransactionPage() {
  const [showBalance, setShowBalance] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pemasukan");

  const [formData, setFormData] = useState({
    nominal: "",
    kategori: "",
    catatan: "",
  });

  // Dummy data
  const userBalance = 1234567890;
  const transactions = [
    { id: 1, type: "income", category: "Cimol Bojot", amount: 123000, date: "15 Okt 2025", note: "Jajan" },
    { id: 2, type: "expense", category: "Teh Tarik", amount: 456000, date: "14 Okt 2025", note: "Minuman" },
    { id: 3, type: "income", category: "Gaji Freelance", amount: 2000000, date: "14 Okt 2025", note: "" },
  ];

  const categories = {
    pemasukan: ["Gaji", "Bonus", "Freelance", "Investasi", "Lainnya"],
    pengeluaran: ["Makanan", "Transport", "Belanja", "Tagihan", "Hiburan", "Lainnya"],
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, type: activeTab });
    setShowModal(false);
    setFormData({ nominal: "", kategori: "", catatan: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
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
          {showBalance ? formatCurrency(userBalance) : "Rp. ••••••••"}
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
          {transactions.map((t) => (
            <div key={t.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center space-x-4 flex-1">
                <div className="text-lg font-medium text-gray-900 w-32">
                  {formatCurrency(t.amount)}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        t.type === "income" ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min((t.amount / 1000000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 min-w-[200px]">
                  <span className="text-gray-700">{t.category}</span>
                  {t.type === "income" ? (
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

      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition transform hover:scale-105 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-center space-x-2 mb-6">
                <button
                  onClick={() => setActiveTab("pemasukan")}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    activeTab === "pemasukan"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Pemasukan
                </button>
                <button
                  onClick={() => setActiveTab("pengeluaran")}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    activeTab === "pengeluaran"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Pengeluaran
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Nominal */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Nominal</label>
                <input
                  type="number"
                  name="nominal"
                  value={formData.nominal}
                  onChange={handleChange}
                  required
                  className="w-full mt-2 px-4 py-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                <select
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleChange}
                  className="w-full mt-2 px-4 py-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Pilih kategori</option>
                  {categories[activeTab].map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Catatan</label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleChange}
                  rows="3"
                  className="w-full mt-2 px-4 py-3 border rounded-lg bg-gray-100 resize-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tambahkan catatan (opsional)"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ nominal: "", kategori: "", catatan: "" });
                  }}
                  className="flex-1 px-6 py-3 border rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Tambah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
