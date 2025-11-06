// ✅ ROOT LAYOUT — JANGAN ADA HEADER/SIDEBAR DI SINI
import "./globals.css";

export const metadata = {
  title: "Dompet.in",
  description: "Aplikasi manajemen keuangan pribadi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
