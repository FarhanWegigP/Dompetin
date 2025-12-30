"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { Plus, Eye, EyeOff, ChevronDown, ChevronLeft, ChevronRight, ArrowDownRight, ArrowUpRight, Wallet, Search, X } from "lucide-react";

// Memoized Transaction Row Component
const TransactionRow = memo(({ transaction, hideAmounts }) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2 sm:gap-3">
        <div
          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
            transaction.type === "income" ? "bg-green-50" : "bg-red-50"
          }`}
        >
          {transaction.type === "income" ? (
            <ArrowDownRight className="text-green-600" size={16} />
          ) : (
            <ArrowUpRight className="text-red-600" size={16} />
          )}
        </div>
        <span
          className={`font-semibold text-sm sm:text-base ${
            transaction.type === "income" ? "text-green-600" : "text-red-600"
          }`}
        >
          {hideAmounts ? "•••••" : formatCurrency(transaction.amount)}
        </span>
      </div>
    </td>
    <td className="px-3 sm:px-6 py-4">
      <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium">
        {transaction.category}
      </span>
    </td>
    <td className="px-3 sm:px-6 py-4 text-gray-600 text-sm hidden md:table-cell">{transaction.note}</td>
    <td className="px-3 sm:px-6 py-4 text-gray-500 text-xs sm:text-sm">{transaction.date}</td>
  </tr>
));

TransactionRow.displayName = 'TransactionRow';

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);

export default function TransactionPage() {
  const [nominal, setNominal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionNote, setTransactionNote] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [activeTab, setActiveTab] = useState("pemasukan");

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10;

  const [searchQuery, setSearchQuery] = useState("");

  const todayStr = () => new Date().toISOString().split("T")[0];

  const categories = useMemo(() => ({
    pemasukan: [
      "Bonus", "Bunga Tabungan", "Cashback", "Dividen", "Gaji",
      "Hadiah & Donasi", "Hadiah / Reward", "Hasil Investasi",
      "Komisi / Fee", "Penghasilan Freelance", "Penjualan Barang / Jasa",
      "Tunjangan", "Uang Kaget / Tak Terduga", "Uang Saku", "Lain-lain"
    ],
    pengeluaran: [
      "Belanja Harian", "Hewan Peliharaan", "Hiburan", "Hobi", "Kesehatan",
      "Keuangan (utang, bunga, biaya bank)", "Kosmetik & Perawatan Diri",
      "Liburan", "Makanan & Minuman", "Pajak & Administrasi",
      "Pakaian & Aksesori", "Pendidikan", "Peralatan Rumah Tangga",
      "Perawatan Kendaraan", "Pulsa & Paket Data", "Sewa / Kontrakan",
      "Tagihan (Listrik, Air, Internet)", "Transportasi", "Lain-lain"
    ],
  }), []);

  const kategoriMapping = useMemo(() => ({
    "Belanja Harian": 2, "Hiburan": 6, "Transportasi": 3, "Kesehatan": 5,
    "Kosmetik & Perawatan Diri": 4, "Liburan": 15, "Makanan & Minuman": 1,
    "Pajak & Administrasi": 17, "Pakaian & Aksesori": 7, "Pendidikan": 10,
    "Peralatan Rumah Tangga": 12, "Perawatan Kendaraan": 13,
    "Pulsa & Paket Data": 16, "Sewa / Kontrakan": 9,
    "Tagihan (Listrik, Air, Internet)": 8, "Hewan Peliharaan": 19,
    "Hobi": 14, "Keuangan (utang, bunga, biaya bank)": 18, "Lain-lain": 33,
    "Gaji": 20, "Bonus": 21, "Bunga Tabungan": 27, "Cashback": 30,
    "Dividen": 28, "Hadiah & Donasi": 11, "Hadiah / Reward": 29,
    "Hasil Investasi": 25, "Komisi / Fee": 24, "Penghasilan Freelance": 31,
    "Penjualan Barang / Jasa": 26, "Tunjangan": 22,
    "Uang Kaget / Tak Terduga": 32, "Uang Saku": 23,
  }), []);

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    
    const query = searchQuery.toLowerCase();
    return transactions.filter(t =>
      t.category.toLowerCase().includes(query) ||
      t.note.toLowerCase().includes(query)
    );
  }, [transactions, searchQuery]);

  // Load initial data
  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        setLoading(true);

        const [saldoRes, statsRes, latestRes] = await Promise.all([
          fetch("/api/transaction/saldo", { credentials: "include" }),
          fetch("/api/transaction/stats", { credentials: "include" }),
          fetch("/api/transaction/latest?limit=5", { credentials: "include" }),
        ]);

        if (!mounted) return;

        const [saldoData, statsData, latestData] = await Promise.all([
          saldoRes.json(),
          statsRes.json(),
          latestRes.json(),
        ]);

        setBalance(Number(saldoData.saldo) || 0);
        setIncome(Number(statsData.pemasukan_bulan_ini) || 0);
        setExpense(Number(statsData.pengeluaran_bulan_ini) || 0);

        const mapped = latestData.map((item) => ({
          id: item.id_transaksi,
          amount: Number(item.nominal),
          category: item.kategori?.nama_kategori || "-",
          note: item.detail_transaksi || "-",
          type: item.jenis_transaksi?.id_jenis === 1 ? "income" : "expense",
          date: new Date(item.timestamp).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));

        setTransactions(mapped);
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  const loadAllTransactions = useCallback(async (pg = 1) => {
    try {
      const res = await fetch(`/api/transaction?page=${pg}&pageSize=${PAGE_SIZE}`, {
        credentials: "include",
      });
      const json = await res.json();

      const mapped = json.data.map((item) => ({
        id: item.id_transaksi,
        amount: Number(item.nominal),
        category: item.kategori?.nama_kategori || "-",
        note: item.detail_transaksi || "-",
        type: item.jenis_transaksi?.id_jenis === 1 ? "income" : "expense",
        date: new Date(item.timestamp).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }));

      setTransactions(mapped);
      setTotalPages(json.totalPages);
      setPage(pg);
    } catch (err) {
      console.error("Pagination error:", err);
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!nominal || !selectedCategory) {
      alert("Isi nominal & kategori!");
      return;
    }

    const kategoriID = kategoriMapping[selectedCategory];
    if (!kategoriID) {
      alert("Kategori tidak ditemukan!");
      return;
    }

    const id_jenis = activeTab === "pemasukan" ? 1 : 2;
    const formattedDate = transactionDate || null;

    try {
      const res = await fetch("/api/transaction", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nominal: Number(nominal),
          deskripsi: transactionNote,
          id_jenis,
          id_kategori: kategoriID,
          tanggal: formattedDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Gagal menambah transaksi");
        return;
      }

      alert("Transaksi berhasil disimpan!");

      // Update balance and stats
      setBalance(data.saldo_baru || balance);
      
      // Reload stats (income & expense)
      const statsRes = await fetch("/api/transaction/stats", { credentials: "include" });
      const statsData = await statsRes.json();
      setIncome(Number(statsData.pemasukan_bulan_ini) || 0);
      setExpense(Number(statsData.pengeluaran_bulan_ini) || 0);

      setNominal("");
      setSelectedCategory("");
      setTransactionNote("");
      setTransactionDate("");
      setIsModalOpen(false);

      // Reload transactions
      if (showAll) {
        loadAllTransactions(page);
      } else {
        const res = await fetch("/api/transaction/latest?limit=5", {
          credentials: "include",
        });
        const latestData = await res.json();
        const mapped = latestData.map((item) => ({
          id: item.id_transaksi,
          amount: Number(item.nominal),
          category: item.kategori?.nama_kategori || "-",
          note: item.detail_transaksi || "-",
          type: item.jenis_transaksi?.id_jenis === 1 ? "income" : "expense",
          date: new Date(item.timestamp).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        }));
        setTransactions(mapped);
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  }, [nominal, selectedCategory, transactionNote, transactionDate, activeTab, kategoriMapping, balance, showAll, page, loadAllTransactions]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Memuat transaksi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-4 sm:p-6 pb-24">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-4 sm:mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/10 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
        <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Wallet size={20} className="sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-100">Total Saldo</span>
            </div>
            <button
              onClick={() => setHideAmounts(!hideAmounts)}
              className="p-2 sm:p-3 hover:bg-white/20 rounded-lg sm:rounded-xl transition-colors backdrop-blur-sm"
            >
              {hideAmounts ? <EyeOff size={18} className="sm:w-6 sm:h-6" /> : <Eye size={18} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
          <div className="text-2xl sm:text-4xl font-bold">
            {hideAmounts ? "Rp ••••••••" : formatCurrency(balance)}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-50 rounded-lg sm:rounded-xl flex items-center justify-center">
              <ArrowDownRight className="text-green-600" size={16} />
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Pemasukan</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            {hideAmounts ? "•••" : formatCurrency(income)}
          </div>
          <p className="text-xs text-gray-400 mt-1">Bulan ini</p>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg sm:rounded-xl flex items-center justify-center">
              <ArrowUpRight className="text-red-600" size={16} />
            </div>
            <span className="text-xs sm:text-sm text-gray-500 font-medium">Pengeluaran</span>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            {hideAmounts ? "•••" : formatCurrency(expense)}
          </div>
          <p className="text-xs text-gray-400 mt-1">Bulan ini</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Riwayat Transaksi</h3>
          
          {/* Search Bar */}
          <div className="relative mb-3 sm:mb-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-9 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Toggle Button */}
          <div className="flex justify-end mt-3">
            {!showAll ? (
              <button
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                onClick={() => {
                  setShowAll(true);
                  loadAllTransactions(1);
                }}
              >
                Tampilkan Semua <ChevronDown size={16} />
              </button>
            ) : (
              <button
                className="text-sm text-green-600 hover:text-green-700 font-medium"
                onClick={async () => {
                  setShowAll(false);
                  setSearchQuery("");
                  const res = await fetch("/api/transaction/latest?limit=5", {
                    credentials: "include",
                  });
                  const data = await res.json();
                  const mapped = data.map((item) => ({
                    id: item.id_transaksi,
                    amount: Number(item.nominal),
                    category: item.kategori?.nama_kategori || "-",
                    note: item.detail_transaksi || "-",
                    type: item.jenis_transaksi?.id_jenis === 1 ? "income" : "expense",
                    date: new Date(item.timestamp).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }),
                  }));
                  setTransactions(mapped);
                }}
              >
                Tampilkan Ringkas
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nominal
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Catatan
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <Wallet size={48} className="mx-auto mb-3 text-gray-300" />
                    <p className="text-gray-400 text-sm">
                      {searchQuery ? "Tidak ada transaksi yang cocok" : "Belum ada transaksi"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <TransactionRow key={t.id} transaction={t} hideAmounts={hideAmounts} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {showAll && totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 p-4 border-t border-gray-100">
            <button
              disabled={page === 1}
              onClick={() => loadAllTransactions(page - 1)}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gray-100 rounded-xl disabled:opacity-50 hover:bg-gray-200 transition-colors font-medium text-xs sm:text-sm"
            >
              <ChevronLeft size={16} />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            <span className="text-gray-600 text-xs sm:text-sm font-medium">
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => loadAllTransactions(page + 1)}
              className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-gray-100 rounded-xl disabled:opacity-50 hover:bg-gray-200 transition-colors font-medium text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => {
          setTransactionDate(todayStr());
          setIsModalOpen(true);
        }}
        className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-green-600 hover:bg-green-700 text-white rounded-xl sm:rounded-2xl shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 z-30"
      >
        <Plus size={28} className="sm:w-8 sm:h-8" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">Tambah Transaksi</h3>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setActiveTab("pemasukan")}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all text-sm sm:text-base ${
                    activeTab === "pemasukan"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pemasukan
                </button>
                <button
                  onClick={() => setActiveTab("pengeluaran")}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all text-sm sm:text-base ${
                    activeTab === "pengeluaran"
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Pengeluaran
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Nominal</label>
                <input
                  type="number"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Kategori</label>
                <select
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Pilih kategori</option>
                  {categories[activeTab].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Tanggal</label>
                <input
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Catatan</label>
                <textarea
                  value={transactionNote}
                  onChange={(e) => setTransactionNote(e.target.value)}
                  rows="3"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm sm:text-base"
                  placeholder="Tambahkan catatan (opsional)"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg text-sm sm:text-base"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}