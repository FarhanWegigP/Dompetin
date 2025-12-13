-- CreateTable
CREATE TABLE "jenis_transaksi" (
    "id_jenis" SERIAL NOT NULL,
    "jenis" VARCHAR(50) NOT NULL,

    CONSTRAINT "jenis_transaksi_pkey" PRIMARY KEY ("id_jenis")
);

-- CreateTable
CREATE TABLE "kalender" (
    "tanggal" DATE NOT NULL,

    CONSTRAINT "kalender_pkey" PRIMARY KEY ("tanggal")
);

-- CreateTable
CREATE TABLE "kategori" (
    "id_kategori" SERIAL NOT NULL,
    "nama_kategori" VARCHAR(100) NOT NULL,

    CONSTRAINT "kategori_pkey" PRIMARY KEY ("id_kategori")
);

-- CreateTable
CREATE TABLE "kategori_jenis_transaksi" (
    "id_jenis" INTEGER NOT NULL,
    "id_kategori" INTEGER NOT NULL,

    CONSTRAINT "kategori_jenis_transaksi_pkey" PRIMARY KEY ("id_jenis","id_kategori")
);

-- CreateTable
CREATE TABLE "nota" (
    "id_nota" SERIAL NOT NULL,
    "id_transaksi" INTEGER NOT NULL,
    "foto_nota" VARCHAR(255) NOT NULL,
    "detail_nota" TEXT,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nota_pkey" PRIMARY KEY ("id_nota")
);

-- CreateTable
CREATE TABLE "saldo" (
    "id_saldo" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "id_transaksi" INTEGER NOT NULL,
    "saldo_hasil" DECIMAL(18,2),
    "timestamp_catatan" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saldo_pkey" PRIMARY KEY ("id_saldo")
);

-- CreateTable
CREATE TABLE "transaksi" (
    "id_transaksi" SERIAL NOT NULL,
    "id_user" INTEGER NOT NULL,
    "detail_transaksi" TEXT,
    "id_jenis" INTEGER NOT NULL,
    "id_kategori" INTEGER NOT NULL,
    "nominal" DECIMAL(18,2),
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "saldo_terakhir" DECIMAL(18,2) DEFAULT 0,

    CONSTRAINT "transaksi_pkey" PRIMARY KEY ("id_transaksi")
);

-- CreateTable
CREATE TABLE "user" (
    "id_user" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "hash_password" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "jenis_transaksi_jenis_key" ON "jenis_transaksi"("jenis");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_nama_kategori_key" ON "kategori"("nama_kategori");

-- CreateIndex
CREATE UNIQUE INDEX "nota_id_transaksi_key" ON "nota"("id_transaksi");

-- CreateIndex
CREATE UNIQUE INDEX "saldo_id_transaksi_key" ON "saldo"("id_transaksi");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "kategori_jenis_transaksi" ADD CONSTRAINT "kategori_jenis_transaksi_id_jenis_fkey" FOREIGN KEY ("id_jenis") REFERENCES "jenis_transaksi"("id_jenis") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kategori_jenis_transaksi" ADD CONSTRAINT "kategori_jenis_transaksi_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "kategori"("id_kategori") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nota" ADD CONSTRAINT "nota_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi"("id_transaksi") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saldo" ADD CONSTRAINT "saldo_id_transaksi_fkey" FOREIGN KEY ("id_transaksi") REFERENCES "transaksi"("id_transaksi") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saldo" ADD CONSTRAINT "saldo_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_id_jenis_fkey" FOREIGN KEY ("id_jenis") REFERENCES "jenis_transaksi"("id_jenis") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_id_kategori_fkey" FOREIGN KEY ("id_kategori") REFERENCES "kategori"("id_kategori") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaksi" ADD CONSTRAINT "transaksi_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "user"("id_user") ON DELETE CASCADE ON UPDATE CASCADE;
