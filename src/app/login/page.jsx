"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email tidak valid";
    }
    if (!formData.password) {
      newErrors.password = "Password tidak boleh kosong";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulasi API call
    setTimeout(() => {
      setSuccessMessage("Login berhasil! Mengalihkan...");
      setIsLoading(false);
      // Redirect ke dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }, 1500);
  };

  return (
    <main className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Kiri: Branding */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-green-600 to-green-700 flex-col justify-between p-12">
        <div>
          <div className="text-4xl font-bold text-white mb-2">Dompet.in</div>
          <p className="text-green-100">Mengelola keuangan jadi lebih mudah</p>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Aman & Terpercaya</h3>
              <p className="text-green-100 text-sm">Enkripsi data tingkat bank</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Analisis Lengkap</h3>
              <p className="text-green-100 text-sm">Pantau pengeluaran dengan detail</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Gratis Selamanya</h3>
              <p className="text-green-100 text-sm">Semua fitur dasar tanpa biaya</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-green-100 text-sm">Dipercaya oleh 10,000+ pengguna</div>
          <div className="text-yellow-300">★★★★★ 4.8/5</div>
        </div>
      </div>

      {/* Kanan: Form Login */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile Header */}
          <div className="md:hidden mb-8">
            <div className="text-3xl font-bold text-gray-900 mb-2">Dompet.in</div>
            <p className="text-gray-600">Masuk ke akun Anda</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-3">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-green-200"
                  }`}
                />
              </div>
              {errors.email && (
                <div className="mt-2 flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link href="/forgot-password" className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-green-200"
                  }`}
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

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Ingat saya
              </label>
            </div>

            {/* Submit Button */}
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
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <div className="px-3 text-sm text-gray-500">atau</div>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login */}
          <button className="w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Masuk dengan Google</span>
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-green-600 hover:text-green-700">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}