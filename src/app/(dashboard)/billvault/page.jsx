"use client";
import { useState, useEffect } from "react";
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
  Sparkles,
} from "lucide-react";
import {
  JENIS_TRANSAKSI,
  getKategoriesByJenis,
  suggestKategori
} from "@/src/app/lib/categories";

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

  // Fetch receipts on mount
  useEffect(() => {
    fetchReceipts();
  }, []);

  // Update available categories when jenis changes
  useEffect(() => {
    const categories = getKategoriesByJenis(selectedJenis);
    setAvailableKategories(categories);

    // Auto-select suggested category if OCR results available
    if (ocrResults?.category_suggestion) {
      const suggestedId = suggestKategori(ocrResults.category_suggestion, selectedJenis);
      if (suggestedId) {
        setSelectedKategori(suggestedId);
      }
    }
  }, [selectedJenis, ocrResults]);

  const fetchReceipts = async () => {
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
  };

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

  const filteredBills = bills.filter((bill) => {
    const searchLower = searchQuery.toLowerCase();
    const merchantMatch = bill.transaksi?.detail_transaksi?.toLowerCase().includes(searchLower);
    const categoryMatch = bill.transaksi?.kategori?.nama_kategori?.toLowerCase().includes(searchLower);
    return merchantMatch || categoryMatch;
  });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, file }));

    // Immediately trigger OCR
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

        // Pre-fill form with OCR data
        setFormData(prev => ({
          ...prev,
          judul: data.merchant || prev.judul,
        }));

        // Suggest category
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
        fetchReceipts(); // Refresh list
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
    <div className="p-6 space-y-6">
      {/* Page Title & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Arsip Nota Anda</h1>
          <p className="text-gray-600">Kelola dan simpan semua nota belanja Anda</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
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
              <ImageIcon className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bulan Ini</p>
              <p className="text-3xl font-bold text-gray-900">
                {bills.filter(b => {
                  const billDate = new Date(b.timestamp);
                  const now = new Date();
                  return billDate.getMonth() === now.getMonth() &&
                    billDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Transaksi</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  bills.reduce((sum, b) => sum + (parseFloat(b.transaksi?.nominal) || 0), 0)
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ImageIcon className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Bills Grid */}
      {isLoadingBills ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-gray-400" size={48} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBills.map((bill) => (
            <div
              key={bill.id_nota}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition group"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {bill.foto_nota ? (
                  <img
                    src={bill.foto_nota}
                    alt="Receipt"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedBill(bill)}
                      className="p-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Eye size={20} />
                    </button>
                    <a
                      href={bill.foto_nota}
                      download
                      className="p-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition"
                    >
                      <Download size={20} />
                    </a>
                    <button
                      onClick={() => handleDelete(bill.id_nota)}
                      className="p-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 truncate">
                  {bill.transaksi?.detail_transaksi || 'Nota'}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tanggal:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(bill.transaksi?.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Kategori:</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      {bill.transaksi?.kategori?.nama_kategori || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nominal:</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(bill.transaksi?.nominal || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoadingBills && filteredBills.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <ImageIcon size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {bills.length === 0 ? 'Belum ada nota' : 'Tidak ada nota ditemukan'}
          </h3>
          <p className="text-gray-600 mb-6">
            {bills.length === 0
              ? 'Mulai scan nota dengan klik tombol + di bawah'
              : 'Coba ubah kata kunci pencarian Anda'}
          </p>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gray-600 hover:bg-gray-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition transform hover:scale-105 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Upload Modal with OCR */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Scan Nota Baru</h2>
              <button
                onClick={handleModalClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
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
                    className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={40} className="text-gray-400 mb-2 animate-spin" />
                        <span className="text-sm text-gray-600">Memproses OCR...</span>
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

              {/* OCR Results Display */}
              {ocrResults && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="text-green-600" size={20} />
                    <h3 className="font-semibold text-green-900">Hasil Scan OCR</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Merchant:</span>
                      <span className="font-medium">{ocrResults.merchant || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-medium">{formatCurrency(ocrResults.total || 0)}</span>
                    </div>
                    {ocrResults.items && ocrResults.items.length > 0 && (
                      <div>
                        <span className="text-gray-600">Items:</span>
                        <ul className="ml-4 mt-1">
                          {ocrResults.items.slice(0, 3).map((item, idx) => (
                            <li key={idx} className="text-xs">
                              {item.name} - {formatCurrency(item.price)}
                            </li>
                          ))}
                          {ocrResults.items.length > 3 && (
                            <li className="text-xs text-gray-500">
                              +{ocrResults.items.length - 3} lainnya
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Jenis Transaksi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Transaksi
                </label>
                <select
                  value={selectedJenis}
                  onChange={(e) => setSelectedJenis(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
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

              {/* Judul Nota */}
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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tanggal: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, catatan: e.target.value }))
                  }
                  placeholder="Tambahkan catatan..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedBill.transaksi?.detail_transaksi || 'Detail Nota'}
              </h2>
              <button
                onClick={() => setSelectedBill(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Receipt Image */}
              <div className="rounded-lg overflow-hidden bg-gray-100">
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
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Tanggal</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(selectedBill.transaksi?.timestamp)}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Jenis</span>
                  <span className="font-medium text-gray-900">
                    {selectedBill.transaksi?.jenis_transaksi?.jenis || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Kategori</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {selectedBill.transaksi?.kategori?.nama_kategori || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Nominal</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(selectedBill.transaksi?.nominal || 0)}
                  </span>
                </div>
                {selectedBill.detail_nota && (
                  <div className="pb-4 border-b border-gray-200">
                    <span className="text-gray-600 block mb-2">Detail OCR</span>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                      {selectedBill.detail_nota}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <a
                  href={selectedBill.foto_nota}
                  download
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex items-center justify-center space-x-2"
                >
                  <Download size={20} />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => handleDelete(selectedBill.id_nota)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center space-x-2"
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