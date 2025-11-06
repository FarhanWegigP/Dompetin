"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Plus,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function LoanDebtPage() {
  const [showUtangBalance, setShowUtangBalance] = useState(true);
  const [showPiutangBalance, setShowPiutangBalance] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeType, setActiveType] = useState("utang");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    jumlah: "",
    catatan: "",
  });

  // Dummy Data
  const userData = {
    totalUtang: 500000,
    totalPiutang: 300000,
  };

  const utangList = [
    { id: 1, name: "Utang ke Tio", amount: 200000, progress: 60, date: "10/11/2025" },
    { id: 2, name: "Utang Miniso", amount: 150000, progress: 80, date: "15/11/2025" },
    { id: 3, name: "Cicilan Motor", amount: 150000, progress: 40, date: "20/11/2025" },
  ];

  const piutangList = [
    { id: 1, name: "Rizky", amount: 200000, progress: 50, date: "12/11/2025" },
    { id: 2, name: "Andi", amount: 100000, progress: 70, date: "18/11/2025" },
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, type: activeType });
    setShowModal(false);
    setFormData({ nama: "", jumlah: "", catatan: "" });
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    console.log("Item deleted:", itemToDelete);
    setShowDeleteModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Utang</h3>
            <button onClick={() => setShowUtangBalance(!showUtangBalance)}>
              {showUtangBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <div className="text-3xl font-bold">
            {showUtangBalance ? formatCurrency(userData.totalUtang) : "Rp. ••••••••"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Piutang</h3>
            <button onClick={() => setShowPiutangBalance(!showPiutangBalance)}>
              {showPiutangBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <div className="text-3xl font-bold">
            {showPiutangBalance ? formatCurrency(userData.totalPiutang) : "Rp. ••••••••"}
          </div>
        </div>
      </div>

      {/* Utang List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Daftar Utang</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {utangList.map((item) => (
            <div
              key={item.id}
              className="p-6 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition"
            >
              <div className="mb-4 md:mb-0">
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.date}</div>
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">{item.progress}% terbayar</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-red-600">
                  -{formatCurrency(item.amount)}
                </span>
                <Edit size={20} className="text-gray-600 cursor-pointer" />
                <Trash2
                  size={20}
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(item)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Piutang List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Daftar Piutang</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {piutangList.map((item) => (
            <div
              key={item.id}
              className="p-6 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition"
            >
              <div className="mb-4 md:mb-0">
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.date}</div>
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-slate-800 h-2 rounded-full"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">{item.progress}% diterima</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-green-600">
                  +{formatCurrency(item.amount)}
                </span>
                <Edit size={20} className="text-gray-600 cursor-pointer" />
                <Trash2
                  size={20}
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(item)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition transform hover:scale-105 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold">Hapus Data?</h3>
                <p className="text-gray-600">
                  Anda yakin ingin menghapus data <strong>{itemToDelete?.name}</strong>?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <button
                  onClick={() => setActiveType("utang")}
                  className={`px-6 py-2 rounded-full font-medium ${
                    activeType === "utang"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Utang
                </button>
                <button
                  onClick={() => setActiveType("piutang")}
                  className={`px-6 py-2 rounded-full font-medium ${
                    activeType === "piutang"
                      ? "bg-gray-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  Piutang
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nama: e.target.value }))
                  }
                  placeholder="Nama utang/piutang"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                <input
                  type="number"
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, jumlah: e.target.value }))
                  }
                  placeholder="Dalam rupiah"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, catatan: e.target.value }))
                  }
                  placeholder="Catatan (opsional)"
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100 resize-none"
                  rows="3"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ nama: "", jumlah: "", catatan: "" });
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
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
