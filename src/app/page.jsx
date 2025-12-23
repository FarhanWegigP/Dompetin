"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Wallet,
  PieChart,
  CreditCard,
  Camera,     // Icon Tambahan
  Receipt,    // Icon Tambahan
  Users       // Icon Tambahan
} from "lucide-react";

// --- Animasi Wrapper (FadeIn) ---
const useOnScreen = (ref) => {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return isIntersecting;
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isVisible = useOnScreen(ref);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        } ${className}`}
    >
      {children}
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-green-100 selection:text-green-800">

      {/* Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight text-green-700 flex items-center gap-2">
            <Wallet className="w-8 h-8 text-green-600" />
            Dompet.in
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            {['Fitur', 'Keunggulan'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-green-600 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="px-5 py-2.5 text-gray-600 font-medium hover:text-green-700 transition-colors"
            >
              Masuk
            </button>
            <button
              onClick={() => router.push('/register')}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 hover:shadow-lg hover:shadow-green-200 transition-all transform hover:-translate-y-0.5"
            >
              Daftar Sekarang
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium mb-6">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Aplikasi Keuangan Orang Cerdas
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.15] mb-6">
              Kelola Keuangan, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                Wujudkan Impian.
              </span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-lg leading-relaxed">
              Catat pemasukan, catat hutang, dan pantau tabungan Anda dalam satu aplikasi yang aman, mudah, dan gratis selamanya.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                Mulai Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-gray-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" />
                ))}
              </div>
              <p>Dipercaya oleh anak Sains Data</p>
            </div>
          </FadeIn>

          {/* Hero Image / Visual */}
          <FadeIn delay={200} className="relative hidden lg:block">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>

            <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 max-w-md ml-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="text-sm text-gray-400 font-medium">Total Saldo</div>
                  <div className="text-3xl font-bold text-gray-900">Rp 12.500.000</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 group hover:bg-green-50 transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Zap className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Gaji Bulanan</div>
                      <div className="text-xs text-gray-400">Pemasukan</div>
                    </div>
                  </div>
                  <div className="font-bold text-green-600">+ Rp 15.000.000</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 group hover:bg-red-50 transition-colors cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <CreditCard className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Belanja Bulanan</div>
                      <div className="text-xs text-gray-400">Pengeluaran</div>
                    </div>
                  </div>
                  <div className="font-bold text-red-500">- Rp 2.500.000</div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-50 flex items-center gap-3 animate-bounce">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Target Tercapai</div>
                  <div className="font-bold text-gray-900">Hemat 25%</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fitur Lengkap untuk Anda</h2>
            <p className="text-gray-500">Kami menyediakan semua alat yang Anda butuhkan untuk mencapai kebebasan finansial.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <PieChart className="w-6 h-6 text-green-600" />,
                title: 'Analisis Visual',
                desc: 'Grafik intuitif untuk memahami pola pengeluaran Anda dalam sekejap.'
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-green-600" />,
                title: 'Hutang Piutang Friendly',
                desc: 'Membantu pencatatan dan pengelolaan hutang dan piutang dengan mudah.'
              },
              {
                icon: <Zap className="w-6 h-6 text-green-600" />,
                title: 'Scan Nota Otomatis',
                desc: 'Tidak perlu lagi manual, cukup scan nota dan biarkan aplikasi yang mengurusnya.'
              },
            ].map((feature, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-green-100/50 hover:border-green-100 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section (Updated to Scan & Debt Visual) */}
      <section id="keunggulan" className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Visual Ilustrasi Scan & Hutang */}
          <FadeIn>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-400 rounded-3xl transform rotate-3 opacity-20"></div>

              <div className="relative bg-white border border-gray-100 p-6 rounded-3xl shadow-xl overflow-hidden">
                {/* Mockup Scan Nota */}
                <div className="mb-6 relative group cursor-pointer">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-30 transition duration-500 blur"></div>
                  <div className="relative flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Scan Struk Belanja</div>
                      <div className="text-xs text-green-600 flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        AI Processing...
                      </div>
                    </div>
                    <div className="ml-auto font-mono text-sm font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">
                      Rp 45.000
                    </div>
                  </div>
                </div>

                {/* Mockup List Hutang */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daftar Hutang</div>
                    <div className="text-xs text-green-600 font-medium">Total: Rp 170.000</div>
                  </div>

                  {[
                    { name: 'Budi Santoso', amount: 'Rp 50.000', label: 'Dipinjam', color: 'text-orange-500', bg: 'bg-orange-50' },
                    { name: 'Sari Roti', amount: 'Rp 120.000', label: 'Lunas', color: 'text-green-600', bg: 'bg-green-50' }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:shadow-md transition-shadow bg-white">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center text-xs font-bold ${item.color}`}>
                          {item.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className={`text-[10px] ${item.color} font-medium`}>{item.label}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${item.color}`}>{item.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Malas Mencatat? <br />
              <span className="text-green-600">Cukup Scan Nota Saja.</span>
            </h2>
            <p className="text-gray-500 mb-8 text-lg">
              Input pengeluaran manual itu kuno. Foto struk belanjaan Anda, biar AI kami yang mencatat detailnya secara otomatis. Plus, jangan sampai lupa menagih hutang teman!
            </p>

            <ul className="space-y-4">
              {[
                { text: 'Scan struk fisik dengan kamera HP', icon: Camera },
                { text: 'Deteksi item & harga otomatis (OCR)', icon: Receipt },
                { text: 'Catat hutang teman & set pengingat', icon: Users },
                { text: 'Rekap data hutang piutang rapi', icon: CheckCircle2 }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600 border border-green-100">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="text-gray-700 font-medium">{item.text}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Mengatur Keuangan Anda?</h2>
            <p className="text-green-100 mb-10 max-w-2xl mx-auto text-lg">
              Bergabunglah dengan orang-orang cerdas lainnya yang telah mengambil kendali penuh atas finansial mereka.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-4 bg-white text-green-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Buat Akun Gratis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Minimalis */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-lg font-bold text-green-700">
            <Wallet className="w-6 h-6" />
            Dompet.in
          </div>
          <p className="text-sm text-gray-400">
            © 2025 Dompet.in. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}