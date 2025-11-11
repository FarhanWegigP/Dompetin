"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Impor ikon-ikon yang kita butuhkan
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  PieChart,
  Gift,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Fungsi untuk validasi input (biar nggak kosong)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password tidak boleh kosong";
    }
    return newErrors;
  };

  // Fungsi untuk update state pas ngetik
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Fungsi pas tombol "Masuk" diklik
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // --- LOGIN BOHONGAN (MOCK) ---
    // (Ini menggantikan fetch ke backend yang error)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pura-pura loading

      // Cek email & password bohongan
      if (formData.email === "fai@mail.com" && formData.password === "123456") {
        setSuccessMessage("Login berhasil! Mengalihkan ke Dashboard...");
        setIsLoading(false);
        setTimeout(() => {
          // Kita pakai router.push() biar beneran pindah halaman
          router.push("/dashboard"); 
        }, 1000);
      } else {
        setApiError("Email atau password salah.");
        setIsLoading(false);
      }
      
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Terjadi kesalahan. Coba lagi nanti.");
      setIsLoading(false);
    }
    // --- BATAS LOGIN BOHONGAN ---
  };

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Kiri: Branding (Sesuai Vercel) */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-green-600 to-green-700 flex-col justify-between p-12">
        <div>
          <div className="text-4xl font-bold text-white mb-2">Dompet.in</div>
          <p className="text-green-100">Mengelola keuangan jadi lebih mudah</p>
        </div>

        {/* 3 Fitur Utama */}
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Aman & Terpercaya</h3>
              <p className="text-green-100 text-sm">Pilihan cerdas untuk keuangan teratur.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <PieChart className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Analisis Lengkap</h3>
              <p className="text-green-100 text-sm">Pantau pengeluaran dengan detail</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Gift className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Gratis Selamanya</h3>
              <p className="text-green-100 text-sm">Semua fitur dasar tanpa biaya</p>
            </div>
          </div>
        </div>

        {/* Footer Panel Kiri */}
        <div>
          <p className="text-sm text-green-100">Dipercaya oleh 10.000+ pengguna</p>
          <div className="flex items-center space-x-1 text-yellow-400 mt-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 7.02l6.572-.955L10 0l2.939 6.065 6.572.955-4.756 4.625L15.878 18.09z"/></svg>
            ))}
            <span className="text-white ml-1">4.8/5</span>
          </div>
        </div>
      </div>

      {/* Kanan: Form Login */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-sm">

          {/* Alert Sukses dan Error */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-800 text-sm">{apiError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="nama@email.com"
                />
              </div>
              {errors.email && (
                <div className="mt-2 flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {/* Link "Lupa Password?" SUDAH DIHAPUS */}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <div className="mt-2 flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-green-600"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Ingat saya
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Memproses...</span>
                </>
              ) : (
                "Masuk"
              )}
            </button>
            
            {/* Tombol "Masuk dengan Google" dan pemisah "atau" SUDAH DIHAPUS */}
            
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-semibold text-green-600 hover:text-green-700"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}