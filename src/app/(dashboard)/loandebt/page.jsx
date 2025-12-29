"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { Eye, EyeOff, Plus, Edit, Trash2, AlertTriangle, TrendingDown, TrendingUp, Users } from "lucide-react";

// Memoized Debt Item Row
const DebtItem = memo(({ item, onEdit, onDelete, showAmount }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          item.type === "utang" ? "bg-red-50" : "bg-green-50"
        }`}>
          <Users className={item.type === "utang" ? "text-red-600" : "text-green-600"} size={18} />
        </div>
        <div>
          <div className="font-medium text-gray-900">{item.name}</div>
          <div className="text-xs text-gray-500">{item.date}</div>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`font-bold ${item.type === "utang" ? "text-red-600" : "text-green-600"}`}>
        {showAmount ? formatCurrency(item.amount) : "•••••"}
      </span>
    </td>
    <td className="px-6 py-4 text-gray-600 text-sm">
      {item.note || "-"}
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onEdit(item)}
          className="p-2 hover:bg-green-50 rounded-xl transition-colors"
        >
          <Edit size={18} className="text-green-600" />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-2 hover:bg-red-50 rounded-xl transition-colors"
        >
          <Trash2 size={18} className="text-red-600" />
        </button>
      </div>
    </td>
  </tr>
));

DebtItem.displayName = 'DebtItem';

const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

export default function LoanDebtPage() {
  const [showUtangBalance, setShowUtangBalance] = useState(true);
  const [showPiutangBalance, setShowPiutangBalance] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeType, setActiveType] = useState("utang");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [nama, setNama] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [catatan, setCatatan] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [userData, setUserData] = useState({
    totalUtang: 0,
    totalPiutang: 0,
  });
  const [utangList, setUtangList] = useState([]);
  const [piutangList, setPiutangList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/loandebt/summary", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch summary");
      const data = await res.json();
      setUserData({
        totalUtang: data.totalUtang || 0,
        totalPiutang: data.totalPiutang || 0,
      });
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  }, []);

  const fetchUtang = useCallback(async () => {
    try {
      const res = await fetch("/api/loandebt?type=utang", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch utang");
      const data = await res.json();
      setUtangList(data);
    } catch (err) {
      console.error("Failed to fetch utang:", err);
    }
  }, []);

  const fetchPiutang = useCallback(async () => {
    try {
      const res = await fetch("/api/loandebt?type=piutang", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch piutang");
      const data = await res.json();
      setPiutangList(data);
    } catch (err) {
      console.error("Failed to fetch piutang:", err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setInitialLoading(true);
      await Promise.all([fetchSummary(), fetchUtang(), fetchPiutang()]);
      if (mounted) setInitialLoading(false);
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [fetchSummary, fetchUtang, fetchPiutang]);

  const handleSubmit = useCallback(async () => {
    if (!nama || !jumlah) {
      alert("Nama dan Jumlah harus diisi!");
      return;
    }

    if (Number(jumlah) <= 0) {
      alert("Jumlah harus lebih dari 0!");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        const res = await fetch(`/api/loandebt/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            nama,
            jumlah: Number(jumlah),
            catatan
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to update");
        }

        alert("Data berhasil diupdate!");
      } else {
        const res = await fetch("/api/loandebt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            nama,
            jumlah: Number(jumlah),
            catatan,
            type: activeType,
          }),
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Failed to create");
        }

        alert("Data berhasil ditambahkan!");
      }

      await Promise.all([fetchSummary(), fetchUtang(), fetchPiutang()]);

      setShowModal(false);
      setNama("");
      setJumlah("");
      setCatatan("");
      setIsEditMode(false);
      setEditId(null);
    } catch (err) {
      console.error("Submit error:", err);
      alert(err.message || "Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  }, [nama, jumlah, catatan, isEditMode, editId, activeType, fetchSummary, fetchUtang, fetchPiutang]);

  const handleEdit = useCallback((item) => {
    setIsEditMode(true);
    setEditId(item.id);
    setNama(item.name);
    setJumlah(String(item.amount));
    setCatatan(item.note || "");
    setActiveType(item.type);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback((item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!itemToDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/loandebt/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete");
      }

      alert("Data berhasil dihapus!");

      await Promise.all([fetchSummary(), fetchUtang(), fetchPiutang()]);
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.message || "Gagal menghapus data!");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  }, [itemToDelete, fetchSummary, fetchUtang, fetchPiutang]);

  if (initialLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6 space-y-6 pb-24">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <TrendingDown size={24} />
                </div>
                <div>
                  <h3 className="text-sm text-red-100">Total Utang</h3>
                  <p className="text-xs text-red-200">Yang harus dibayar</p>
                </div>
              </div>
              <button
                onClick={() => setShowUtangBalance(!showUtangBalance)}
                className="p-3 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              >
                {showUtangBalance ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <div className="text-3xl font-bold">
              {showUtangBalance ? formatCurrency(userData.totalUtang) : "Rp ••••••••"}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-sm text-green-100">Total Piutang</h3>
                  <p className="text-xs text-green-200">Yang harus ditagih</p>
                </div>
              </div>
              <button
                onClick={() => setShowPiutangBalance(!showPiutangBalance)}
                className="p-3 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              >
                {showPiutangBalance ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <div className="text-3xl font-bold">
              {showPiutangBalance ? formatCurrency(userData.totalPiutang) : "Rp ••••••••"}
            </div>
          </div>
        </div>
      </div>

      {/* Utang List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingDown className="text-red-600" size={20} />
              Daftar Utang
            </h3>
            <p className="text-sm text-gray-500 mt-1">Catatan utang yang harus dibayar</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Utang
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Catatan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {utangList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Users size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-400">Belum ada data utang</p>
                  </td>
                </tr>
              ) : (
                utangList.map((item) => (
                  <DebtItem
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showAmount={showUtangBalance}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Piutang List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-green-600" size={20} />
              Daftar Piutang
            </h3>
            <p className="text-sm text-gray-500 mt-1">Catatan piutang yang harus ditagih</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Piutang
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Catatan
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {piutangList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Users size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-400">Belum ada data piutang</p>
                  </td>
                </tr>
              ) : (
                piutangList.map((item) => (
                  <DebtItem
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showAmount={showPiutangBalance}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => {
          setIsEditMode(false);
          setEditId(null);
          setNama("");
          setJumlah("");
          setCatatan("");
          setActiveType("utang");
          setShowModal(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Hapus Data?</h3>
              <p className="text-gray-600 mb-6">
                Yakin ingin menghapus <strong>{itemToDelete?.name}</strong>?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Menghapus..." : "Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isEditMode ? "Edit Data" : "Tambah Data"}
              </h3>
              {!isEditMode ? (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setActiveType("utang")}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                      activeType === "utang"
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Utang
                  </button>
                  <button
                    onClick={() => setActiveType("piutang")}
                    className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                      activeType === "piutang"
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Piutang
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <span
                    className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                      activeType === "utang"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {activeType === "utang" ? "Utang" : "Piutang"}
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama orang/tempat"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                <input
                  type="number"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  placeholder="Dalam rupiah"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Catatan tambahan (opsional)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setNama("");
                    setJumlah("");
                    setCatatan("");
                    setIsEditMode(false);
                    setEditId(null);
                  }}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-colors disabled:opacity-50 shadow-lg"
                >
                  {loading ? "Menyimpan..." : isEditMode ? "Update" : "Tambah"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}