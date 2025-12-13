// module.exports = {
//     // Pastikan path ini menunjuk ke folder API Anda. Jika folder Anda adalah 'src/app/api', ini sudah benar.
//     apiFolder: "src/app/api", 
    
//     definition: {
//       openapi: "3.0.0",
//       info: {
//         title: "API Keuangan Pribadi (Personal Finance API)",
//         version: "1.0.0",
//         description: "Dokumentasi API untuk mengelola transaksi, saldo, dan laporan.",
//       },
//       // HARUS ARRAY
//       servers: [ 
//         {
//           url: "http://localhost:3000",
//           description: "Server Pengembangan Lokal",
//         },
//       ],
      
//       components: {
//         schemas: {
//           // Skema 'Transaction'
//           Transaction: { 
//             type: "object",
//             properties: {
//               nominal: { type: "number", description: "Jumlah uang transaksi.", example: 50000 },
//               deskripsi: { type: "string", description: "Deskripsi singkat.", example: "Makan siang" },
//               id_jenis: { type: "integer", description: "Jenis transaksi (1: Pemasukan, 2: Pengeluaran).", example: 2 },
//               id_kategori: { type: "integer", description: "ID Kategori.", example: 3 },
//             },
//             required: ["nominal", "id_jenis", "id_kategori"],
//           },
//         },
//         securitySchemes: {
//           bearerAuth: {
//             type: "http",
//             scheme: "bearer",
//             bearerFormat: "JWT",
//           },
//         },
//       },
//       security: [
//         {
//           bearerAuth: [],
//         },
//       ],
//     },
//   };