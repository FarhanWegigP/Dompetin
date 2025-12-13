"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";

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

  // Data state
  const [userData, setUserData] = useState({
    totalUtang: 0,
    totalPiutang: 0,
  });
  const [utangList, setUtangList] = useState([]);
  const [piutangList, setPiutangList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch summary (total utang & piutang)
  const fetchSummary = async () => {
    try {
      const res = await fetch("/api/loandebt/summary", {
        credentials: "include",
      });
      const data = await res.json();
      setUserData({
        totalUtang: data.totalUtang || 0,
        totalPiutang: data.totalPiutang || 0,
      });
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };

  // Fetch list utang
  const fetchUtang = async () => {
    try {
      const res = await fetch("/api/loandebt?type=utang", {
        credentials: "include",
      });
      const data = await res.json();
      setUtangList(data);
    } catch (err) {
      console.error("Failed to fetch utang:", err);
    }
  };

  // Fetch list piutang
  const fetchPiutang = async () => {
    try {
      const res = await fetch("/api/loandebt?type=piutang", {
        credentials: "include",
      });
      const data = await res.json();
      setPiutangList(data);
    } catch (err) {
      console.error("Failed to fetch piutang:", err);
    }
  };

  // Load data saat mount
  useEffect(() => {
    fetchSummary();
    fetchUtang();
    fetchPiutang();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleSubmit = async () => {
    if (!nama || !jumlah) {
      alert("Nama dan Jumlah harus diisi!");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // Update
        const res = await fetch(`/api/loandebt/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ nama, jumlah, catatan }),
        });

        if (res.ok) {
          alert("Data berhasil diupdate!");
        }
      } else {
        // Create
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

        if (res.ok) {
          alert("Data berhasil ditambahkan!");
        }
      }

      // Refresh data
      fetchSummary();
      fetchUtang();
      fetchPiutang();

      // Reset form
      setShowModal(false);
      setNama("");
      setJumlah("");
      setCatatan("");
      setIsEditMode(false);
      setEditId(null);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Terjadi kesalahan!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setEditId(item.id);
    setNama(item.name);
    setJumlah(item.amount);
    setCatatan(item.note);
    setActiveType(item.type);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/loandebt/${itemToDelete.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Data berhasil dihapus!");
        fetchSummary();
        fetchUtang();
        fetchPiutang();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Gagal menghapus data!");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-white-50 min-h-screen pb-24">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Utang</h3>
            <button 
              onClick={() => setShowUtangBalance(!showUtangBalance)}
              className="p-2 hover:bg-red-600 rounded-lg transition"
            >
              {showUtangBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <div className="text-3xl font-bold">
            {showUtangBalance ? formatCurrency(userData.totalUtang) : "Rp. â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Piutang</h3>
            <button 
              onClick={() => setShowPiutangBalance(!showPiutangBalance)}
              className="p-2 hover:bg-green-600 rounded-lg transition"
            >
              {showPiutangBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          <div className="text-3xl font-bold">
            {showPiutangBalance ? formatCurrency(userData.totalPiutang) : "Rp. â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}
          </div>
        </div>
      </div>

      {/* Daftar Utang */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-5 md:p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Daftar Utang</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  NAMA
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  TOTAL UTANG
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  CATATAN
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {utangList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Belum ada data utang
                  </td>
                </tr>
              ) : (
                utangList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-red-600">
                        {showUtangBalance ? formatCurrency(item.amount) : "***"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {item.note || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Edit size={18} className="text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daftar Piutang */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-5 md:p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Daftar Piutang</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  NAMA
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  TOTAL PIUTANG
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  CATATAN
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  AKSI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {piutangList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Belum ada data piutang
                  </td>
                </tr>
              ) : (
                piutangList.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-green-600">
                        {showPiutangBalance ? formatCurrency(item.amount) : "***"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {item.note || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <Edit size={18} className="text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
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
          setShowModal(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gray-700 hover:bg-gray-800 text-white rounded-2xl shadow-2xl flex items-center justify-center transition transform hover:scale-105 z-40"
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Hapus Data?</h3>
                <p className="text-gray-600">
                  Anda yakin ingin menghapus data <strong>{itemToDelete?.name}</strong>?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition disabled:opacity-50"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isEditMode ? "Edit Data" : "Tambah Data"}
              </h3>
              {!isEditMode && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => setActiveType("utang")}
                    className={`px-6 py-2 rounded-full font-medium transition ${
                      activeType === "utang"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    Utang
                  </button>
                  <button
                    onClick={() => setActiveType("piutang")}
                    className={`px-6 py-2 rounded-full font-medium transition ${
                      activeType === "piutang"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    Piutang
                  </button>
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
                  placeholder="Nama utang/piutang"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah</label>
                <input
                  type="number"
                  value={jumlah}
                  onChange={(e) => setJumlah(e.target.value)}
                  placeholder="Dalam rupiah"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
                <textarea
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Catatan (opsional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-medium transition disabled:opacity-50"
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