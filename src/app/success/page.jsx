"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/oauth-token")
      .then(() => {
        setTimeout(() => router.push("/dashboard"), 2000);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Animation Container */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* GitHub Icon */}
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
                <svg
                  viewBox="0 0 24 24"
                  className="w-12 h-12"
                  fill="#181717"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Arrow Animation */}
            <div className="flex gap-1 animate-pulse">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-[ping_1s_ease-in-out_infinite]"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-[ping_1s_ease-in-out_0.2s_infinite]"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-[ping_1s_ease-in-out_0.4s_infinite]"></div>
            </div>

            {/* Wallet Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl animate-bounce">
              <Wallet className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Autentikasi Berhasil! 🎉
            </h2>
            <p className="text-green-200">
              Menghubungkan akun GitHub Anda ke Dompetin...
            </p>

            {/* Loading Spinner */}
            <div className="flex justify-center pt-4">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
            </div>

            <p className="text-sm text-green-100 pt-2">
              Mohon tunggu sebentar
            </p>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>
    </div>
  );
}