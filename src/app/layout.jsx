import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Dompet.in",
  description: "Kelola keuangan jadi lebih mudah",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
