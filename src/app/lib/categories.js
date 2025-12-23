// lib/categories.js
export const JENIS_TRANSAKSI = {
    PEMASUKAN: 1,
    PENGELUARAN: 2
};

export const KATEGORI_PENGELUARAN = [
    { id: 1, nama: 'Makanan & Minuman' },
    { id: 2, nama: 'Belanja Harian' },
    { id: 3, nama: 'Transportasi' },
    { id: 4, nama: 'Kosmetik & Perawatan Diri' },
    { id: 5, nama: 'Kesehatan' },
    { id: 6, nama: 'Hiburan' },
    { id: 7, nama: 'Pakaian & Aksesori' },
    { id: 8, nama: 'Tagihan (Listrik, Air, Internet)' },
    { id: 9, nama: 'Sewa / Kontrakan' },
    { id: 10, nama: 'Pendidikan' },
    { id: 11, nama: 'Hadiah & Donasi' },
    { id: 12, nama: 'Peralatan Rumah Tangga' },
    { id: 13, nama: 'Perawatan Kendaraan' },
    { id: 14, nama: 'Hobi' },
    { id: 15, nama: 'Liburan' },
    { id: 16, nama: 'Pulsa & Paket Data' },
    { id: 17, nama: 'Pajak & Administrasi' },
    { id: 18, nama: 'Keuangan (utang, bunga, biaya bank)' },
    { id: 19, nama: 'Hewan Peliharaan' }
];

export const KATEGORI_PEMASUKAN = [
    { id: 20, nama: 'Gaji' },
    { id: 21, nama: 'Bonus' },
    { id: 22, nama: 'Tunjangan' },
    { id: 23, nama: 'Uang Saku' },
    { id: 24, nama: 'Komisi / Fee' },
    { id: 25, nama: 'Hasil Investasi' },
    { id: 26, nama: 'Penjualan Barang / Jasa' },
    { id: 27, nama: 'Bunga Tabungan' },
    { id: 28, nama: 'Dividen' },
    { id: 29, nama: 'Hadiah / Reward' },
    { id: 30, nama: 'Cashback' },
    { id: 31, nama: 'Penghasilan Freelance' },
    { id: 32, nama: 'Uang Kaget / Tak Terduga' }
];

export const KATEGORI_LAINNYA = { id: 33, nama: 'Lain-lain' };

export function getKategoriesByJenis(idJenis) {
    if (idJenis === JENIS_TRANSAKSI.PEMASUKAN) {
        return [...KATEGORI_PEMASUKAN, KATEGORI_LAINNYA];
    } else if (idJenis === JENIS_TRANSAKSI.PENGELUARAN) {
        return [...KATEGORI_PENGELUARAN, KATEGORI_LAINNYA];
    }
    return [KATEGORI_LAINNYA];
}

export function suggestKategori(categorySuggestion, idJenis) {
    const categories = getKategoriesByJenis(idJenis);

    // Simple matching logic - find category by partial name match
    if (!categorySuggestion) return null;

    const normalizedSuggestion = categorySuggestion.toLowerCase().trim();

    const match = categories.find(cat =>
        cat.nama.toLowerCase().includes(normalizedSuggestion) ||
        normalizedSuggestion.includes(cat.nama.toLowerCase())
    );

    return match ? match.id : null;
}