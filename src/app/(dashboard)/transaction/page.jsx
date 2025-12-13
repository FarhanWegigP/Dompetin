"use client";

import { useState, useEffect } from "react";
import { Plus, Eye, EyeOff, ChevronDown, ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

export default function TransactionPage() {
  const [nominal, setNominal] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionNote, setTransactionNote] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);
  const [hideAmounts, setHideAmounts] = useState(false);
  const [activeTab, setActiveTab] = useState("pemasukan");

  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [showAll, setShowAll] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 15;


  const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // helper: hari ini dalam format YYYY-MM-DD
  const todayStr = () => new Date().toISOString().split("T")[0];

  // =========================
  // LOAD SALDO
  // =========================
  useEffect(() => {
    async function loadSaldo() {
      try {
        const res = await fetch("/api/transaction/saldo", { credentials: "include" });
        const data = await res.json();
        setBalance(Number(data.saldo) || 0);
      } catch (err) {
        console.error("Failed to fetch saldo:", err);
      }
    }
    loadSaldo();
  }, []);

  // =========================
  // LOAD STATS BULAN INI
  // =========================
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/transaction/stats", { credentials: "include" });
        const data = await res.json();

        setIncome(Number(data.pemasukan_bulan_ini) || 0);
        setExpense(Number(data.pengeluaran_bulan_ini) || 0);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    }
    loadStats();
  }, []);

  // =========================
  // LOAD TRANSAKSI TERBARU
  // =========================
  useEffect(() => {
    async function loadLatest() {
      try {
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
      } catch (err) {
        console.error("Failed to fetch latest:", err);
      }
    }
    loadLatest();
  }, []);

  // =========================
  // KATEGORI
  // =========================
  const categories = {
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
  };

  const kategoriMapping = {
    // Pengeluaran
    "Belanja Harian": 2,
    "Hiburan": 6,
    "Transportasi": 3,
    "Kesehatan": 5,
    "Kosmetik & Perawatan Diri": 4,
    "Liburan": 15,
    "Makanan & Minuman": 1,
    "Pajak & Administrasi": 17,
    "Pakaian & Aksesori": 7,
    "Pendidikan": 10,
    "Peralatan Rumah Tangga": 12,
    "Perawatan Kendaraan": 13,
    "Pulsa & Paket Data": 16,
    "Sewa / Kontrakan": 9,
    "Tagihan (Listrik, Air, Internet)": 8,
    "Hewan Peliharaan": 19,
    "Hobi": 14,
    "Keuangan (utang, bunga, biaya bank)": 18,
    "Lain-lain": 33,

    // Pemasukan
    "Gaji": 20,
    "Bonus": 21,
    "Bunga Tabungan": 27,
    "Cashback": 30,
    "Dividen": 28,
    "Hadiah & Donasi": 11,
    "Hadiah / Reward": 29,
    "Hasil Investasi": 25,
    "Komisi / Fee": 24,
    "Penghasilan Freelance": 31,
    "Penjualan Barang / Jasa": 26,
    "Tunjangan": 22,
    "Uang Kaget / Tak Terduga": 32,
    "Uang Saku": 23,
  };
  async function loadAllTransactions(pg = 1) {
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
  }
  

  // =========================
  // SUBMIT TRANSAKSI (HYBRID DATE)
  // =========================
  async function handleSubmit() {
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
  
    // FIX TANGGAL — Format aman agar backend bisa baca
    const formattedDate = transactionDate
      ? (() => {
          const [year, month, day] = transactionDate.split("-");
          return `${year}-${month}-${day}`;
        })()
      : null;
  
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
          tanggal: formattedDate, // <— sudah aman
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        console.error(data);
        alert("Gagal menambah transaksi");
        return;
      }
  
      alert("Transaksi berhasil disimpan!");
  
      setNominal("");
      setSelectedCategory("");
      setTransactionNote("");
      setTransactionDate("");
  
      setIsModalOpen(false);
    } catch (err) {
      console.error("Submit error:", err);
    }
  }
  

  // =========================
  // UI
  // =========================

  return (
    <div className="p-4 bg-white-50 min-h-screen pb-24">
      {/* SALDO ANDA */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wallet size={24} />
            <span className="text-sm font-medium">Saldo anda</span>
          </div>
          <button
            onClick={() => setHideAmounts(!hideAmounts)}
            className="p-2 hover:bg-green-600 rounded-lg transition"
          >
            {hideAmounts ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="text-3xl font-bold">
          {hideAmounts ? "Rp. ••••••••" : formatCurrency(balance)}
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* PEMASUKAN */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="text-green-600" size={18} />
            </div>
            <span className="text-gray-600 font-medium text-sm">Pemasukan</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {hideAmounts ? "***" : formatCurrency(income)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
        </div>

        {/* PENGELUARAN */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="text-red-600" size={18} />
            </div>
            <span className="text-gray-600 font-medium text-sm">Pengeluaran</span>
          </div>
          <div className="text-xl font-bold text-gray-900">
            {hideAmounts ? "***" : formatCurrency(expense)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
        </div>
      </div>

      {/* TRANSAKSI TERAKHIR */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Transaksi Terakhir</h3>
          <button className="text-sm text-blue-600 hover:underline font-medium flex items-center">
            Tampilkan Semua
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">NOMINAL</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">KATEGORI</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CATATAN</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">TANGGAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {hideAmounts ? "***" : formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{t.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{t.note}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD BUTTON */}
      <button
        onClick={() => {
          setTransactionDate(todayStr()); // default hari ini setiap buka modal
          setIsModalOpen(true);
        }}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gray-700 hover:bg-gray-800 text-white rounded-2xl shadow-2xl flex items-center justify-center transition transform hover:scale-105 z-40"
      >
        <Plus size={32} />
      </button>

      {/* MODAL TAMBAH TRANSAKSI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Tambah Transaksi</h3>
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setActiveTab("pemasukan")}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    activeTab === "pemasukan"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Pemasukan
                </button>
                <button
                  onClick={() => setActiveTab("pengeluaran")}
                  className={`px-6 py-2 rounded-full font-medium transition ${
                    activeTab === "pengeluaran"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  Pengeluaran
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Nominal</label>
                <input
                  type="number"
                  value={nominal}
                  onChange={(e) => setNominal(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Kategori</label>
                <select
                  className="w-full border rounded-xl p-3"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Catatan</label>
                <textarea
                  value={transactionNote}
                  onChange={(e) => setTransactionNote(e.target.value)}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 resize-none"
                  placeholder="Tambahkan catatan (opsional)"
                ></textarea>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsOCRModalOpen(true)}
                  className="flex items-center text-gray-700 hover:underline text-sm font-medium"
                >
                  📷 Scan OCR
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OCR MODAL */}
      {isOCRModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h4 className="text-lg font-bold mb-4 text-gray-800">Scan OCR</h4>
            <input type="file" accept="image/*" className="mb-4 text-sm w-full" />
            <p className="text-sm text-gray-600 mb-4">
              Unggah foto struk untuk mengambil data transaksi.
            </p>

            <div className="bg-gray-100 text-gray-700 text-sm p-4 rounded-lg mb-4 min-h-24">
              Hasil OCR akan muncul di sini...
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOCRModalOpen(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => setIsOCRModalOpen(false)}
                className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-medium"
              >
                Gunakan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import {
//   Plus,
//   Eye,
//   EyeOff,
//   ChevronDown,
//   ArrowDownRight,
//   ArrowUpRight,
//   Wallet,
// } from "lucide-react";

// export default function TransactionPage() {
//   // INPUT STATES
//   const [nominal, setNominal] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [transactionDate, setTransactionDate] = useState("");
//   const [transactionNote, setTransactionNote] = useState("");

//   // UI STATE
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);
//   const [hideAmounts, setHideAmounts] = useState(false);
//   const [activeTab, setActiveTab] = useState("pemasukan");

//   // DATA STATE
//   const [balance, setBalance] = useState(0);
//   const [income, setIncome] = useState(0);
//   const [expense, setExpense] = useState(0);
//   const [transactions, setTransactions] = useState([]);

//   const [showAll, setShowAll] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const PAGE_SIZE = 15;

//   const todayStr = () => {
//     const now = new Date();
//     const year = now.getFullYear();
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     const day = String(now.getDate()).padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const formatCurrency = (value) =>
//     new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(value || 0);

//   // LOAD SALDO
//   useEffect(() => {
//     async function loadSaldo() {
//       try {
//         const res = await fetch("/api/transaction/saldo", {
//           credentials: "include",
//         });
//         const data = await res.json();
//         setBalance(Number(data.saldo) || 0);
//       } catch (err) {
//         console.error("Failed to fetch saldo:", err);
//       }
//     }
//     loadSaldo();
//   }, []);

//   // LOAD STATS BULAN INI
//   useEffect(() => {
//     async function loadStats() {
//       try {
//         const res = await fetch("/api/transaction/stats", {
//           credentials: "include",
//         });
//         const data = await res.json();
//         setIncome(Number(data.pemasukan_bulan_ini) || 0);
//         setExpense(Number(data.pengeluaran_bulan_ini) || 0);
//       } catch (err) {
//         console.error("Failed to fetch stats:", err);
//       }
//     }
//     loadStats();
//   }, []);

//   // LOAD TRANSAKSI TERBARU
//   async function loadLatest() {
//     try {
//       const res = await fetch("/api/transaction/latest?limit=5", {
//         credentials: "include",
//       });
//       const data = await res.json();

//       const mapped = data.map((item) => ({
//         id: item.id_transaksi,
//         amount: Number(item.nominal),
//         category: item.kategori?.nama_kategori || "-",
//         note: item.detail_transaksi || "-",
//         type: item.jenis_transaksi?.id_jenis === 1 ? "income" : "expense",
//         date: new Date(item.timestamp).toLocaleDateString("id-ID", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }),
//       }));

//       setTransactions(mapped);
//     } catch (err) {
//       console.error("Failed to fetch latest:", err);
//     }
//   }

//   useEffect(() => {
//     loadLatest();
//   }, []);

//   // PAGINATION - LOAD FULL
//   async function loadAllTransactions(pg = 1) {
//     try {
//       const res = await fetch(
//         `/api/transaction?page=${pg}&pageSize=${PAGE_SIZE}`,
//         { credentials: "include" }
//       );
//       const json = await res.json();

//       const mapped = json.data.map((item) => ({
//         id: item.id_transaksi,
//         amount: Number(item.nominal),
//         category: item.kategori?.nama_kategori || "-",
//         note: item.detail_transaksi || "-",
//         type: item.jenis_transaksi?.id_jenis === 1 ? "income" : "expense",
//         date: new Date(item.timestamp).toLocaleDateString("id-ID", {
//           day: "2-digit",
//           month: "short",
//           year: "numeric",
//         }),
//       }));

//       setTransactions(mapped);
//       setTotalPages(json.totalPages);
//       setPage(pg);
//     } catch (err) {
//       console.error("Pagination error:", err);
//     }
//   }

//   // SUBMIT TRANSAKSI
//   async function handleSubmit() {
//     if (!nominal || !selectedCategory) {
//       alert("Isi nominal & kategori!");
//       return;
//     }

//     const kategoriID = kategoriMapping[selectedCategory];
//     if (!kategoriID) return alert("Kategori tidak ditemukan!");

//     const formattedDate = transactionDate || todayStr();
//     const id_jenis = activeTab === "pemasukan" ? 1 : 2;

//     try {
//       const res = await fetch("/api/transaction", {
//         method: "POST",
//         credentials: "include",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           nominal: Number(nominal),
//           deskripsi: transactionNote,
//           id_jenis,
//           id_kategori: kategoriID,
//           tanggal: formattedDate,
//         }),
//       });

//       const data = await res.json();
//       if (!res.ok) {
//         alert("Gagal menambah transaksi");
//         return;
//       }

//       alert("Transaksi berhasil disimpan!");

//       // Reset form
//       setNominal("");
//       setSelectedCategory("");
//       setTransactionNote("");
//       setTransactionDate("");

//       setIsModalOpen(false);

//       // Refresh list
//       showAll ? loadAllTransactions(page) : loadLatest();
//     } catch (err) {
//       console.error("Submit error:", err);
//     }
//   }

//   // KATEGORI
//   const categories = {
//     pemasukan: [
//       "Bonus",
//       "Bunga Tabungan",
//       "Cashback",
//       "Dividen",
//       "Gaji",
//       "Hadiah & Donasi",
//       "Hadiah / Reward",
//       "Hasil Investasi",
//       "Komisi / Fee",
//       "Penghasilan Freelance",
//       "Penjualan Barang / Jasa",
//       "Tunjangan",
//       "Uang Kaget / Tak Terduga",
//       "Uang Saku",
//       "Lain-lain",
//     ],
//     pengeluaran: [
//       "Belanja Harian",
//       "Hewan Peliharaan",
//       "Hiburan",
//       "Hobi",
//       "Kesehatan",
//       "Keuangan (utang, bunga, biaya bank)",
//       "Kosmetik & Perawatan Diri",
//       "Liburan",
//       "Makanan & Minuman",
//       "Pajak & Administrasi",
//       "Pakaian & Aksesori",
//       "Pendidikan",
//       "Peralatan Rumah Tangga",
//       "Perawatan Kendaraan",
//       "Pulsa & Paket Data",
//       "Sewa / Kontrakan",
//       "Tagihan (Listrik, Air, Internet)",
//       "Transportasi",
//       "Lain-lain",
//     ],
//   };

//   const kategoriMapping = {
//     "Belanja Harian": 2,
//     "Hiburan": 6,
//     "Transportasi": 3,
//     "Kesehatan": 5,
//     "Kosmetik & Perawatan Diri": 4,
//     "Liburan": 15,
//     "Makanan & Minuman": 1,
//     "Pajak & Administrasi": 17,
//     "Pakaian & Aksesori": 7,
//     "Pendidikan": 10,
//     "Peralatan Rumah Tangga": 12,
//     "Perawatan Kendaraan": 13,
//     "Pulsa & Paket Data": 16,
//     "Sewa / Kontrakan": 9,
//     "Tagihan (Listrik, Air, Internet)": 8,
//     "Hewan Peliharaan": 19,
//     "Hobi": 14,
//     "Keuangan (utang, bunga, biaya bank)": 18,
//     "Lain-lain": 33,

//     Gaji: 20,
//     Bonus: 21,
//     "Bunga Tabungan": 27,
//     Cashback: 30,
//     Dividen: 28,
//     "Hadiah & Donasi": 11,
//     "Hadiah / Reward": 29,
//     "Hasil Investasi": 25,
//     "Komisi / Fee": 24,
//     "Penghasilan Freelance": 31,
//     "Penjualan Barang / Jasa": 26,
//     Tunjangan: 22,
//     "Uang Kaget / Tak Terduga": 32,
//     "Uang Saku": 23,
//   };

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen pb-24">
//       {/* SALDO */}
//       <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg mb-6">
//         <div className="flex items-center justify-between mb-4">
//           <div className="flex items-center space-x-2">
//             <Wallet size={24} />
//             <span className="text-sm font-medium">Saldo anda</span>
//           </div>
//           <button
//             onClick={() => setHideAmounts(!hideAmounts)}
//             className="p-2 hover:bg-green-600 rounded-lg transition"
//           >
//             {hideAmounts ? <EyeOff size={20} /> : <Eye size={20} />}
//           </button>
//         </div>

//         <div className="text-3xl font-bold">
//           {hideAmounts ? "Rp. ••••••••" : formatCurrency(balance)}
//         </div>
//       </div>

//       {/* SUMMARY */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
//           <div className="flex items-center space-x-2 mb-2">
//             <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
//               <ArrowDownRight className="text-green-600" size={18} />
//             </div>
//             <span className="text-gray-600 font-medium text-sm">Pemasukan</span>
//           </div>
//           <div className="text-xl font-bold text-gray-900">
//             {hideAmounts ? "***" : formatCurrency(income)}
//           </div>
//           <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
//         </div>

//         <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
//           <div className="flex items-center space-x-2 mb-2">
//             <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
//               <ArrowUpRight className="text-red-600" size={18} />
//             </div>
//             <span className="text-gray-600 font-medium text-sm">
//               Pengeluaran
//             </span>
//           </div>
//           <div className="text-xl font-bold text-gray-900">
//             {hideAmounts ? "***" : formatCurrency(expense)}
//           </div>
//           <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200">
//         <div className="p-5 border-b border-gray-200 flex items-center justify-between">
//           <h3 className="text-lg font-bold text-gray-900">Transaksi Terakhir</h3>

//           {!showAll ? (
//             <button
//               className="text-sm text-blue-600 hover:underline font-medium flex items-center"
//               onClick={() => {
//                 setShowAll(true);
//                 loadAllTransactions(1);
//               }}
//             >
//               Tampilkan Semua <ChevronDown size={16} />
//             </button>
//           ) : (
//             <button
//               className="text-sm text-blue-600 hover:underline font-medium"
//               onClick={() => {
//                 setShowAll(false);
//                 loadLatest();
//               }}
//             >
//               Kembali ke Ringkas
//             </button>
//           )}
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   NOMINAL
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   KATEGORI
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   CATATAN
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   TANGGAL
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-200">
//               {transactions.map((t) => (
//                 <tr key={t.id} className="hover:bg-gray-50 transition">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`font-medium ${
//                         t.type === "income"
//                           ? "text-green-600"
//                           : "text-red-600"
//                       }`}
//                     >
//                       {hideAmounts ? "***" : formatCurrency(t.amount)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-gray-900">
//                     {t.category}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                     {t.note}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-gray-600">
//                     {t.date}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* PAGINATION */}
//         {showAll && (
//           <div className="flex justify-between items-center p-4">
//             <button
//               disabled={page === 1}
//               onClick={() => loadAllTransactions(page - 1)}
//               className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//             >
//               Sebelumnya
//             </button>

//             <span className="text-gray-700 text-sm">
//               Halaman {page} dari {totalPages}
//             </span>

//             <button
//               disabled={page === totalPages}
//               onClick={() => loadAllTransactions(page + 1)}
//               className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
//             >
//               Berikutnya
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ADD BUTTON */}
//       <button
//         onClick={() => {
//           setTransactionDate(todayStr());
//           setIsModalOpen(true);
//         }}
//         className="fixed bottom-8 right-8 w-16 h-16 bg-gray-700 hover:bg-gray-800 text-white rounded-2xl shadow-2xl flex items-center justify-center transition transform hover:scale-105 z-40"
//       >
//         <Plus size={32} />
//       </button>

//       {/* MODAL TAMBAH */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-6 border-b">
//               <h3 className="text-xl font-bold mb-4 text-gray-800">
//                 Tambah Transaksi
//               </h3>

//               <div className="flex justify-center space-x-2">
//                 <button
//                   onClick={() => setActiveTab("pemasukan")}
//                   className={`px-6 py-2 rounded-full font-medium transition ${
//                     activeTab === "pemasukan"
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   Pemasukan
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("pengeluaran")}
//                   className={`px-6 py-2 rounded-full font-medium transition ${
//                     activeTab === "pengeluaran"
//                       ? "bg-gray-700 text-white"
//                       : "bg-gray-200 text-gray-600"
//                   }`}
//                 >
//                   Pengeluaran
//                 </button>
//               </div>
//             </div>

//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700">
//                   Nominal
//                 </label>
//                 <input
//                   type="number"
//                   value={nominal}
//                   onChange={(e) => setNominal(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
//                   placeholder="0"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700">
//                   Kategori
//                 </label>
//                 <select
//                   className="w-full border rounded-xl p-3"
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                 >
//                   <option value="">Pilih kategori</option>
//                   {categories[activeTab].map((cat) => (
//                     <option value={cat} key={cat}>
//                       {cat}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700">
//                   Tanggal
//                 </label>
//                 <input
//                   type="date"
//                   value={transactionDate}
//                   onChange={(e) => setTransactionDate(e.target.value)}
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-2 text-gray-700">
//                   Catatan
//                 </label>
//                 <textarea
//                   value={transactionNote}
//                   onChange={(e) => setTransactionNote(e.target.value)}
//                   rows="3"
//                   className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 resize-none"
//                   placeholder="Tambahkan catatan (opsional)"
//                 ></textarea>
//               </div>
//               <div>
//               <button
//                   onClick={() => setIsOCRModalOpen(true)}
//                   className="w-full flex items-center justify-center gap-2 px-4 py-3
//                   bg-gray-100 hover:bg-gray-200 text-gray-800
//                   rounded-lg border border-gray-300 transition font-medium"
//                 >
//                 📷 <span>Scan Struk (OCR)</span>
//               </button>

//               </div>

//               <div className="flex justify-between pt-2">
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium mr-3"
//                 >
//                   Batal
//                 </button>

//                 <button
//                   onClick={handleSubmit}
//                   className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-medium"
//                 >
//                   Simpan
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* OCR MODAL */}
//       {isOCRModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//           <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl">
//             <h4 className="text-lg font-bold mb-4 text-gray-800">Scan OCR</h4>

//             <input type="file" accept="image/*" className="mb-4 text-sm w-full" />

//             <p className="text-sm text-gray-600 mb-4">
//               Unggah foto struk untuk mengambil data transaksi.
//             </p>

//             <div className="bg-gray-100 text-gray-700 text-sm p-4 rounded-lg mb-4 min-h-24">
//               Hasil OCR akan muncul di sini...
//             </div>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setIsOCRModalOpen(false)}
//                 className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
//               >
//                 Batal
//               </button>
//               <button
//                 onClick={() => setIsOCRModalOpen(false)}
//                 className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-medium"
//               >
//                 Gunakan
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
