"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-bold text-green-600">Dompet.in</div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition">Fitur</a>
              <a href="#benefits" className="text-gray-700 hover:text-green-600 transition">Keunggulan</a>
              <a href="#testimonials" className="text-gray-700 hover:text-green-600 transition">Testimoni</a>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => router.push('/login')} className="px-6 py-2 text-green-600 hover:text-green-700 font-medium transition">
                Masuk
              </button>
              <button onClick={() => router.push('/register')} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl">
                Daftar Gratis
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8 bg-gradient-to-br from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                💰 Kelola Keuangan dengan Cerdas
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Atur Keuangan
                <span className="text-green-600"> Lebih Mudah</span> dan Terorganisir
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Platform manajemen keuangan pribadi yang membantu Anda mencatat, menganalisis, dan mengontrol pengeluaran dengan lebih efisien.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => router.push('/register')} className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl font-medium text-lg">
                  Mulai Sekarang →
                </button>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-green-600 hover:text-green-600 transition font-medium text-lg">
                  Lihat Demo
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Pengguna Aktif</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">4.8/5</div>
                  <div className="text-sm text-gray-600">Rating Pengguna</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Gratis</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <div className="text-sm text-gray-500">Saldo Bulan Ini</div>
                    <div className="text-2xl font-bold text-gray-900">Rp 8.500.000</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Pemasukan', amount: '+Rp 12.000.000', color: 'text-green-600', bg: 'bg-green-50' },
                      { label: 'Pengeluaran', amount: '-Rp 3.500.000', color: 'text-red-600', bg: 'bg-red-50' }
                    ].map((item, i) => (
                      <div key={i} className={`p-4 ${item.bg} rounded-lg flex justify-between items-center`}>
                        <span className="text-gray-700 font-medium">{item.label}</span>
                        <span className={`${item.color} font-bold text-lg`}>{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-green-200 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fitur Unggulan</h2>
            <p className="text-xl text-gray-600">Semua yang Anda butuhkan untuk mengelola keuangan</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📊', title: 'Analisis Mendalam', desc: 'Visualisasi pengeluaran dengan grafik dan statistik yang mudah dipahami' },
              { icon: '🔔', title: 'Notifikasi Pintar', desc: 'Pengingat otomatis untuk tagihan dan budget limit yang telah ditentukan' },
              { icon: '📱', title: 'Multi Platform', desc: 'Akses dari mana saja melalui web, mobile, atau desktop dengan data tersinkronisasi' },
              { icon: '🔒', title: 'Keamanan Terjamin', desc: 'Enkripsi data tingkat bank untuk melindungi informasi keuangan Anda' },
              { icon: '📈', title: 'Laporan Otomatis', desc: 'Generate laporan keuangan bulanan dan tahunan secara otomatis' },
              { icon: '🎯', title: 'Target Keuangan', desc: 'Tetapkan dan pantau progress target tabungan atau investasi Anda' }
            ].map((feature, i) => (
              <div key={i} className="p-8 border border-gray-200 rounded-xl hover:shadow-xl transition group hover:border-green-500">
                <div className="text-5xl mb-4 group-hover:scale-110 transition">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900">Kenapa Memilih Dompet.in?</h2>
              <div className="space-y-4">
                {[
                  'Interface yang intuitif dan mudah digunakan',
                  'Kategori pengeluaran yang dapat dikustomisasi',
                  'Sinkronisasi real-time di semua perangkat',
                  'Export data ke Excel dan PDF',
                  'Dukungan customer service 24/7'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="text-gray-700 text-lg">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Mulai Gratis Hari Ini</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Basic Plan</span>
                    <span className="font-bold text-green-600">GRATIS</span>
                  </div>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Unlimited transaksi</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Semua fitur dasar</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="text-green-600">✓</span>
                      <span>Cloud backup</span>
                    </li>
                  </ul>
                </div>
                <button onClick={() => router.push('/register')} className="w-full px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg font-medium text-lg">
                  Daftar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Apa Kata Mereka?</h2>
            <p className="text-xl text-gray-600">Ribuan pengguna telah merasakan manfaatnya</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Tio', role: 'Mahasiswa', text: 'Sangat membantu saya mengontrol pengeluaran bulanan. UI-nya juga simpel dan mudah dipahami!' },
              { name: 'Sasi', role: 'Mahasiswa', text: 'Fitur analisisnya detail banget. Sekarang saya bisa track cash flow bisnis dengan lebih baik.' },
              { name: 'Pio', role: 'Mahasiswa', text: 'Gratis tapi fiturnya lengkap! Perfect untuk mahasiswa yang mau belajar manage keuangan.' },
              { name: 'Fairuz', role: 'Mahasiswa', text: 'Sangat membantu saya mengontrol pengeluaran bulanan. UI-nya juga simpel dan mudah dipahami!' },
              { name: 'Jalu', role: 'Mahasiswa', text: 'Fitur analisisnya detail banget. Sekarang saya bisa track cash flow bisnis dengan lebih baik.' },
              { name: 'Regina', role: 'Mahasiswa', text: 'Gratis tapi fiturnya lengkap! Perfect untuk mahasiswa yang mau belajar manage keuangan.' }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 bg-gray-50 rounded-xl">
                <div className="text-yellow-400 text-2xl mb-4">★★★★★</div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Siap Mengatur Keuangan Lebih Baik?</h2>
          <p className="text-xl text-green-100 mb-8">Bergabunglah dengan ribuan pengguna yang telah merasakan manfaatnya</p>
          <button onClick={() => router.push('/register')} className="px-10 py-4 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition shadow-xl font-bold text-lg">
            Mulai Gratis Sekarang →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">Dompet.in</div>
              <p className="text-gray-400">Platform manajemen keuangan pribadi terpercaya</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Produk</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Fitur</a></li>
                <li><a href="#" className="hover:text-white transition">Harga</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Perusahaan</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-white transition">Karir</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Dukungan</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition">Bantuan</a></li>
                <li><a href="#" className="hover:text-white transition">Kontak</a></li>
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 Dompet.in. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}