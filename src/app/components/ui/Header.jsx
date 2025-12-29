"use client";

import { LogOut, User, Menu } from "lucide-react";
import { useEffect, useState } from "react";

export default function Header() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include", // ⬅️ WAJIB
        });

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const name = user?.nickname || "User";
  const email = user?.email || "user@example.com";

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex justify-between items-center z-40 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            document.getElementById("mobile-sidebar")?.classList.toggle("translate-x-0");
            document.getElementById("mobile-sidebar")?.classList.toggle("-translate-x-full");
          }}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={24} />
        </button>

        <div>
          <p className="text-xs sm:text-sm text-gray-500">Welcome back,</p>
          <h1 className="text-base sm:text-xl font-semibold text-gray-900">
            {loading ? "Loading..." : name}
          </h1>
        </div>
      </div>

      {/* Right */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 rounded-xl"
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <User size={18} className="text-green-600" />
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {name}
          </span>
        </button>

        {showUserMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowUserMenu(false)}
            />

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border py-2 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-medium truncate">{email}</p>
              </div>

              <button
                onClick={() => {
                  document.cookie = "auth_token=; path=/; max-age=0";
                  window.location.href = "/login";
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>Keluar</span>
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
