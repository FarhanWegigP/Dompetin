"use client";
import { useState, useEffect, memo, useCallback } from "react";
import {
  Eye,
  Download,
  Trash2,
  Upload,
  ImageIcon,
  Search,
  Plus,
  X,
  Loader2,
  Camera,
  Receipt,
} from "lucide-react";
import {
  JENIS_TRANSAKSI,
  getKategoriesByJenis,
  suggestKategori
} from "@/src/app/lib/categories";

// Memoized Bill Card Component
const BillCard = memo(({ bill, onView, onDelete }) => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-green-100 transition-all duration-300 group">
    <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
      {bill.foto_nota ? (
        <img
          src={bill.foto_nota}
          alt="Receipt"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon size={48} className="text-gray-400" />
        </div>
      )}

      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex space-x-3">
          <button
            onClick={() => onView(bill)}
            className="p-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            <Eye size={20} />
          </button>
          {bill.foto_nota && (
  <a
    href={bill.foto_nota}
    download
    className="p-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
  >
    <Download size={20} />
  </a>
)}

          <button
            onClick={() => onDelete(bill.id_nota)}
            className="p-3 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-colors shadow-lg"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-gray-900 mb-3 truncate flex items-center gap-2">
        <Receipt size={16} className="text-green-600" />
        {bill.transaksi?.detail_transaksi || 'Nota'}
      </h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Tanggal:</span>
          <span className="font-medium text-gray-900">
            {formatDate(bill.transaksi?.timestamp)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Kategori:</span>
          <span className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
            {bill.transaksi?.kategori?.nama_kategori || 'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-500">Nominal:</span>
          <span className="font-bold text-green-600">
            {formatCurrency(bill.transaksi?.nominal || 0)}
          </span>
        </div>
      </div>
    </div>
  </div>
));

BillCard.displayName = 'BillCard';

const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function BillVaultPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bills, setBills] = useState([]);
  const [isLoadingBills, setIsLoadingBills] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    judul: "",
    catatan: "",
    tanggal: "",
    file: null,
  });

  const [ocrResults, setOcrResults] = useState(null);
  const [selectedJenis, setSelectedJenis] = useState(JENIS_TRANSAKSI.PENGELUARAN);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [availableKategories, setAvailableKategories] = useState([]);

  const fetchReceipts = useCallback(async () => {
    try {
      setIsLoadingBills(true);
      const response = await fetch('/api/receipt');
      if (response.ok) {
        const data = await response.json();
        setBills(data.receipts || []);
      }
    } catch (error) {
      console.error('Failed to fetch receipts:', error);
    } finally {
      setIsLoadingBills(false);
    }
  }, []);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  useEffect(() => {
    setSelectedKategori(null);
    const categories = getKategoriesByJenis(selectedJenis);
    setAvailableKategories(categories);

    if (ocrResults?.category_suggestion) {
      const suggestedId = suggestKategori(ocrResults.category_suggestion, selectedJenis);
      if (suggestedId) {
        setSelectedKategori(suggestedId);
      }
    }
  }, [selectedJenis, ocrResults]);

  const filteredBills = bills.filter((bill) => {
    const searchLower = searchQuery.toLowerCase();
  
    const merchant = bill.transaksi?.detail_transaksi || "";
    const category = bill.transaksi?.kategori?.nama_kategori || "";
  
    const merchantMatch = merchant.toLowerCase().includes(searchLower);
    const categoryMatch = category.toLowerCase().includes(searchLower);
  
    return merchantMatch || categoryMatch;
  });
  

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, file }));

    setIsProcessing(true);
    setOcrResults(null);

    const formDataOCR = new FormData();
    formDataOCR.append('file', file);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formDataOCR,
      });

      if (response.ok) {
        const data = await response.json();
        setOcrResults(data);

        setFormData(prev => ({
          ...prev,
          judul: data.merchant || prev.judul,
        }));

        const suggestedId = suggestKategori(data.category_suggestion, selectedJenis);
        if (suggestedId) {
          setSelectedKategori(suggestedId);
        }
      } else {
        alert('Gagal memproses OCR. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('OCR error:', error);
      alert('Terjadi kesalahan saat memproses gambar.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ocrResults) {
      alert("OCR belum selesai atau gagal");
      return;
    }

    if (!formData.file || !selectedKategori) {
      alert('Harap lengkapi semua field yang diperlukan');
      return;
    }

    setIsSaving(true);

    const submitFormData = new FormData();
    submitFormData.append('file', formData.file);
    submitFormData.append('merchant', ocrResults?.merchant || '');
    submitFormData.append('total', ocrResults?.total || 0);
    submitFormData.append('items', JSON.stringify(ocrResults?.items || []));
    submitFormData.append('category_suggestion', ocrResults?.category_suggestion || '');
    submitFormData.append('raw_text', ocrResults?.raw_text || '');
    submitFormData.append('judul', formData.judul);
    submitFormData.append('tanggal', formData.tanggal);
    submitFormData.append('catatan', formData.catatan);
    submitFormData.append('id_kategori', selectedKategori);
    submitFormData.append('id_jenis', selectedJenis);

    try {
      const response = await fetch('/api/receipt', {
        method: 'POST',
        body: submitFormData,
      });

      if (response.ok) {
        alert('Nota berhasil disimpan!');
        setShowModal(false);
        resetForm();
        fetchReceipts();
      } else {
        const error = await response.json();
        alert(`Gagal menyimpan nota: ${error.error}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Terjadi kesalahan saat menyimpan nota.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (idNota) => {
    if (!confirm('Yakin ingin menghapus nota ini?')) return;

    try {
      const response = await fetch(`/api/receipt?id=${idNota}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Nota berhasil dihapus');
        fetchReceipts();
        setSelectedBill(null);
      } else {
        alert('Gagal menghapus nota');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Terjadi kesalahan saat menghapus nota');
    }
  };

  const resetForm = () => {
    setFormData({ judul: "", catatan: "", tanggal: "", file: null });
    setOcrResults(null);
    setSelectedKategori(null);
    setSelectedJenis(JENIS_TRANSAKSI.PENGELUARAN);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Camera className="text-green-600" size={32} />
            Arsip Nota
          </h1>
          <p className="text-gray-500 mt-1">Simpan dan kelola nota belanja Anda</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Cari nota..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Nota</p>
              <p className="text-3xl font-bold text-gray-900">{bills.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <ImageIcon className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Bulan Ini</p>
              <p className="text-3xl font-bold text-gray-900">
                {bills.filter(b => {
                  const billDate = new Date(b.transaksi?.timestamp);
                  const now = new Date();
                  return billDate.getMonth() === now.getMonth() &&
                    billDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Receipt className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(
                  bills.reduce((sum, b) => sum + (parseFloat(b.transaksi?.nominal) || 0), 0)
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <ImageIcon className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Bills Grid */}
      {isLoadingBills ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="animate-spin text-green-600 mx-auto mb-4" size={48} />
            <p className="text-gray-500">Memuat nota...</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBills.map((bill) => (
            <BillCard
              key={bill.id_nota}
              bill={bill}
              onView={setSelectedBill}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoadingBills && filteredBills.length === 0 && (
        <div className="bg-white rounded-3xl p-16 text-center border border-gray-100">
          <ImageIcon size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {bills.length === 0 ? 'Belum ada nota' : 'Tidak ada nota ditemukan'}
          </h3>
          <p className="text-gray-500 mb-6">
            {bills.length === 0
              ? 'Mulai scan nota dengan klik tombol + di bawah'
              : 'Coba ubah kata kunci pencarian Anda'}
          </p>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Scan Nota Baru</h2>
              <button
                onClick={handleModalClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
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
                    disabled={isProcessing}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={40} className="text-green-600 mb-2 animate-spin" />
                        <span className="text-sm text-gray-600 font-medium">Memproses OCR...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={40} className="text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {formData.file ? formData.file.name : "Klik untuk upload foto"}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG up to 10MB
                        </span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Jenis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Transaksi
                </label>
                <select
                  value={selectedJenis}
                  onChange={(e) => setSelectedJenis(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value={JENIS_TRANSAKSI.PENGELUARAN}>Pengeluaran</option>
                  <option value={JENIS_TRANSAKSI.PEMASUKAN}>Pemasukan</option>
                </select>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={selectedKategori || ''}
                  onChange={(e) => setSelectedKategori(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {availableKategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nama}
                    </option>
                  ))}
                </select>
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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, judul: e.target.value }))
                  }
                  placeholder="Contoh: Belanja Supermarket"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tanggal: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, catatan: e.target.value }))
                  }
                  placeholder="Tambahkan catatan..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                  disabled={isSaving || isProcessing}
                >
                  {isSaving && <Loader2 className="animate-spin" size={20} />}
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Receipt className="text-green-600" size={24} />
                {selectedBill.transaksi?.detail_transaksi || 'Detail Nota'}
              </h2>
              <button
                onClick={() => setSelectedBill(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Receipt Image */}
              <div className="rounded-2xl overflow-hidden bg-gray-100">
                {selectedBill.foto_nota ? (
                  <img
                    src={selectedBill.foto_nota}
                    alt="Receipt"
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-video flex items-center justify-center">
                    <ImageIcon size={80} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(selectedBill.transaksi?.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-500">Jenis</span>
                  <span className="font-medium text-gray-900">
                    {selectedBill.transaksi?.jenis_transaksi?.jenis || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-500">Kategori</span>
                  <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                    {selectedBill.transaksi?.kategori?.nama_kategori || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-500">Nominal</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedBill.transaksi?.nominal || 0)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <a
                  href={selectedBill.foto_nota}
                  download
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Download size={20} />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => handleDelete(selectedBill.id_nota)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Trash2 size={20} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}