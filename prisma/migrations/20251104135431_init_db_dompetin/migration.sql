BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[jenis_transaksi] (
    [id_jenis] INT NOT NULL IDENTITY(1,1),
    [jenis] VARCHAR(50) NOT NULL,
    CONSTRAINT [jenis_transaksi_pkey] PRIMARY KEY CLUSTERED ([id_jenis]),
    CONSTRAINT [jenis_transaksi_jenis_key] UNIQUE NONCLUSTERED ([jenis])
);

-- CreateTable
CREATE TABLE [dbo].[kalender] (
    [tanggal] DATE NOT NULL,
    CONSTRAINT [kalender_pkey] PRIMARY KEY CLUSTERED ([tanggal])
);

-- CreateTable
CREATE TABLE [dbo].[kategori] (
    [id_kategori] INT NOT NULL IDENTITY(1,1),
    [nama_kategori] VARCHAR(100) NOT NULL,
    CONSTRAINT [kategori_pkey] PRIMARY KEY CLUSTERED ([id_kategori]),
    CONSTRAINT [kategori_nama_kategori_key] UNIQUE NONCLUSTERED ([nama_kategori])
);

-- CreateTable
CREATE TABLE [dbo].[kategori_jenis_transaksi] (
    [id_jenis] INT NOT NULL,
    [id_kategori] INT NOT NULL,
    CONSTRAINT [kategori_jenis_transaksi_pkey] PRIMARY KEY CLUSTERED ([id_jenis],[id_kategori])
);

-- CreateTable
CREATE TABLE [dbo].[nota] (
    [id_nota] INT NOT NULL IDENTITY(1,1),
    [id_transaksi] INT NOT NULL,
    [foto_nota] VARCHAR(255) NOT NULL,
    [detail_nota] NVARCHAR(1000),
    [timestamp] DATETIMEOFFSET NOT NULL CONSTRAINT [nota_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [nota_pkey] PRIMARY KEY CLUSTERED ([id_nota]),
    CONSTRAINT [nota_id_transaksi_key] UNIQUE NONCLUSTERED ([id_transaksi])
);

-- CreateTable
CREATE TABLE [dbo].[saldo] (
    [id_saldo] INT NOT NULL IDENTITY(1,1),
    [id_user] INT NOT NULL,
    [id_transaksi] INT NOT NULL,
    [saldo_hasil] DECIMAL(15,2) NOT NULL,
    [timestamp_catatan] DATETIMEOFFSET NOT NULL,
    CONSTRAINT [saldo_pkey] PRIMARY KEY CLUSTERED ([id_saldo]),
    CONSTRAINT [saldo_id_transaksi_key] UNIQUE NONCLUSTERED ([id_transaksi])
);

-- CreateTable
CREATE TABLE [dbo].[transaksi] (
    [id_transaksi] INT NOT NULL IDENTITY(1,1),
    [id_user] INT NOT NULL,
    [detail_transaksi] NVARCHAR(1000),
    [id_jenis] INT NOT NULL,
    [id_kategori] INT NOT NULL,
    [nominal] DECIMAL(15,2) NOT NULL,
    [saldo_terakhir] DECIMAL(15,2) NOT NULL,
    [timestamp] DATETIMEOFFSET NOT NULL CONSTRAINT [transaksi_timestamp_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [transaksi_pkey] PRIMARY KEY CLUSTERED ([id_transaksi])
);

-- CreateTable
CREATE TABLE [dbo].[user] (
    [id_user] INT NOT NULL IDENTITY(1,1),
    [email] VARCHAR(255) NOT NULL,
    [nickname] VARCHAR(50) NOT NULL,
    [hash_password] VARCHAR(255) NOT NULL,
    CONSTRAINT [user_pkey] PRIMARY KEY CLUSTERED ([id_user]),
    CONSTRAINT [user_email_key] UNIQUE NONCLUSTERED ([email])
);

-- AddForeignKey
ALTER TABLE [dbo].[kategori_jenis_transaksi] ADD CONSTRAINT [kategori_jenis_transaksi_id_jenis_fkey] FOREIGN KEY ([id_jenis]) REFERENCES [dbo].[jenis_transaksi]([id_jenis]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[kategori_jenis_transaksi] ADD CONSTRAINT [kategori_jenis_transaksi_id_kategori_fkey] FOREIGN KEY ([id_kategori]) REFERENCES [dbo].[kategori]([id_kategori]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[nota] ADD CONSTRAINT [nota_id_transaksi_fkey] FOREIGN KEY ([id_transaksi]) REFERENCES [dbo].[transaksi]([id_transaksi]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[saldo] ADD CONSTRAINT [saldo_id_transaksi_fkey] FOREIGN KEY ([id_transaksi]) REFERENCES [dbo].[transaksi]([id_transaksi]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[saldo] ADD CONSTRAINT [saldo_id_user_fkey] FOREIGN KEY ([id_user]) REFERENCES [dbo].[user]([id_user]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[transaksi] ADD CONSTRAINT [transaksi_id_jenis_fkey] FOREIGN KEY ([id_jenis]) REFERENCES [dbo].[jenis_transaksi]([id_jenis]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[transaksi] ADD CONSTRAINT [transaksi_id_kategori_fkey] FOREIGN KEY ([id_kategori]) REFERENCES [dbo].[kategori]([id_kategori]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[transaksi] ADD CONSTRAINT [transaksi_id_user_fkey] FOREIGN KEY ([id_user]) REFERENCES [dbo].[user]([id_user]) ON DELETE CASCADE ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
