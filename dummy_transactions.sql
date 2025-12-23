-- Dummy Transactions for User ID 1 (s@si.com)
-- Run this in Supabase SQL Editor or pgAdmin

-- Insert Dummy Transactions (Mix of Income and Expenses)
INSERT INTO transaksi (id_user, detail_transaksi, id_jenis, id_kategori, nominal, timestamp) VALUES
-- Pemasukan (id_jenis = 1)
(1, 'Gaji Bulanan Desember', 1, 1, 8000000, '2025-12-01 08:00:00+07'),
(1, 'Freelance Project Web Development', 1, 1, 3500000, '2025-12-05 14:30:00+07'),
(1, 'Bonus Akhir Tahun', 1, 1, 2000000, '2025-12-15 10:00:00+07'),
(1, 'Jual Barang Bekas', 1, 2, 500000, '2025-12-10 16:20:00+07'),

-- Pengeluaran (id_jenis = 2) - Makanan
(1, 'Belanja Groceries Indomaret', 2, 3, 250000, '2025-12-02 18:00:00+07'),
(1, 'Makan Siang Restoran', 2, 3, 85000, '2025-12-03 12:30:00+07'),
(1, 'Beli Kopi Starbucks', 2, 3, 55000, '2025-12-04 09:00:00+07'),
(1, 'Dinner Keluarga', 2, 3, 320000, '2025-12-06 19:00:00+07'),
(1, 'Snack dan Minuman', 2, 3, 45000, '2025-12-07 15:00:00+07'),

-- Pengeluaran - Transportasi
(1, 'Isi Bensin Pertamax', 2, 4, 150000, '2025-12-02 07:00:00+07'),
(1, 'Grab ke Kantor', 2, 4, 35000, '2025-12-03 08:00:00+07'),
(1, 'Service Motor', 2, 4, 250000, '2025-12-08 10:00:00+07'),
(1, 'Parkir Mall', 2, 4, 15000, '2025-12-09 14:00:00+07'),

-- Pengeluaran - Hiburan
(1, 'Nonton Film Bioskop XXI', 2, 5, 85000, '2025-12-09 19:00:00+07'),
(1, 'Subscription Netflix', 2, 5, 186000, '2025-12-11 00:00:00+07'),
(1, 'Beli Game Steam', 2, 5, 250000, '2025-12-12 21:00:00+07'),

-- Pengeluaran - Kesehatan
(1, 'Beli Obat di Apotek', 2, 6, 125000, '2025-12-05 16:00:00+07'),
(1, 'Cek Kesehatan Umum', 2, 6, 450000, '2025-12-13 09:00:00+07'),

-- Pengeluaran - Pendidikan
(1, 'Bayar Kursus Online Udemy', 2, 7, 350000, '2025-12-14 10:00:00+07'),
(1, 'Beli Buku Pemrograman', 2, 7, 185000, '2025-12-16 14:00:00+07'),

-- Pengeluaran - Tagihan
(1, 'Bayar Listrik PLN', 2, 8, 275000, '2025-12-01 00:00:00+07'),
(1, 'Bayar Internet Indihome', 2, 8, 400000, '2025-12-01 00:00:00+07'),
(1, 'Bayar Air PDAM', 2, 8, 85000, '2025-12-01 00:00:00+07'),

-- Pengeluaran - Belanja
(1, 'Beli Baju di Uniqlo', 2, 9, 450000, '2025-12-17 15:00:00+07'),
(1, 'Skincare Routine', 2, 9, 320000, '2025-12-18 11:00:00+07'),
(1, 'Aksesoris Gadget', 2, 9, 175000, '2025-12-19 13:00:00+07'),

-- Pengeluaran - Lain-lain  
(1, 'Donasi Sosial', 2, 10, 100000, '2025-12-20 08:00:00+07'),
(1, 'Kado Ulang Tahun Teman', 2, 10, 250000, '2025-12-21 16:00:00+07'),
(1, 'Maintenance Rumah', 2, 10, 550000, '2025-12-22 10:00:00+07');

-- Summary:
-- Total Pemasukan: Rp 14,000,000
-- Total Pengeluaran: Rp 5,430,000  
-- Saldo: Rp 8,570,000
