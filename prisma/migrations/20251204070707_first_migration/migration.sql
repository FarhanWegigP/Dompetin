-- ===============================
-- DROP TABLES (SAFE ORDER)
-- ===============================

DROP TABLE IF EXISTS kategori_jenis_transaksi CASCADE;
DROP TABLE IF EXISTS nota CASCADE;
DROP TABLE IF EXISTS transaksi CASCADE;
DROP TABLE IF EXISTS kalender CASCADE;
DROP TABLE IF EXISTS kategori CASCADE;
DROP TABLE IF EXISTS jenis_transaksi CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- ===============================
-- MASTER TABLES
-- ===============================

CREATE TABLE "user" (
  id_user SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  nickname VARCHAR(50) NOT NULL,
  hash_password VARCHAR(255) NOT NULL
);

CREATE TABLE jenis_transaksi (
  id_jenis SERIAL PRIMARY KEY,
  jenis VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE kategori (
  id_kategori SERIAL PRIMARY KEY,
  nama_kategori VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE kalender (
  tanggal DATE PRIMARY KEY
);

-- ===============================
-- TRANSAKSI CORE
-- ===============================

CREATE TABLE transaksi (
  id_transaksi SERIAL PRIMARY KEY,
  id_user INTEGER NOT NULL,
  detail_transaksi TEXT,
  id_jenis INTEGER NOT NULL,
  id_kategori INTEGER NOT NULL,
  nominal NUMERIC,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT transaksi_id_user_fkey
    FOREIGN KEY (id_user)
    REFERENCES "user"(id_user)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT transaksi_id_jenis_fkey
    FOREIGN KEY (id_jenis)
    REFERENCES jenis_transaksi(id_jenis)
    ON DELETE RESTRICT ON UPDATE CASCADE,

  CONSTRAINT transaksi_id_kategori_fkey
    FOREIGN KEY (id_kategori)
    REFERENCES kategori(id_kategori)
    ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ===============================
-- NOTA (1–1 dengan transaksi)
-- ===============================

CREATE TABLE nota (
  id_nota SERIAL PRIMARY KEY,
  id_transaksi INTEGER NOT NULL UNIQUE,
  foto_nota TEXT,
  detail_nota TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT nota_id_transaksi_fkey
    FOREIGN KEY (id_transaksi)
    REFERENCES transaksi(id_transaksi)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- PIVOT TABLE (MANY TO MANY)
-- ===============================

CREATE TABLE kategori_jenis_transaksi (
  id_jenis INTEGER NOT NULL,
  id_kategori INTEGER NOT NULL,

  PRIMARY KEY (id_jenis, id_kategori),

  CONSTRAINT kategori_jenis_transaksi_id_jenis_fkey
    FOREIGN KEY (id_jenis)
    REFERENCES jenis_transaksi(id_jenis)
    ON DELETE CASCADE ON UPDATE CASCADE,

  CONSTRAINT kategori_jenis_transaksi_id_kategori_fkey
    FOREIGN KEY (id_kategori)
    REFERENCES kategori(id_kategori)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE utang_piutang (
    id_utang_piutang SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL,
    nama VARCHAR(255) NOT NULL,
    jumlah DECIMAL(15,2) NOT NULL,
    catatan TEXT,
    tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('utang', 'piutang')),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT utang_piutang_id_user_fkey
      FOREIGN KEY (id_user)
      REFERENCES "user"(id_user)
      ON DELETE CASCADE
);

CREATE INDEX idx_utang_piutang_user_tipe
ON utang_piutang (id_user, tipe);
