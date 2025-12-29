"use client";

import { useRouter } from "next/navigation";
import { LogOut, User, Menu } from "lucide-react";
import { useState } from "react";

export default function Header({ user }) {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (_) {}

    document.cookie =
      "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";

    router.push("/login");
  };

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex justify-between items-center z-40 shadow-sm">
      {/* Left: Welcome Message */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button - Hidden on desktop */}
        <button
          onClick={() => {
            // Toggle sidebar on mobile (you'll need to implement this)
            document.getElementById('mobile-sidebar')?.classList.toggle('translate-x-0');
            document.getElementById('mobile-sidebar')?.classList.toggle('-translate-x-full');
          }}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        <div>
          <p className="text-xs sm:text-sm text-gray-500">Welcome back,</p>
          <h1 className="text-base sm:text-xl font-semibold text-gray-900">
            {user?.nickname ?? "User"}
          </h1>
        </div>
      </div>

      {/* Right: User Menu */}
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center">
            <User size={18} className="text-green-600" />
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">
            {user?.nickname ?? "User"}
          </span>
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowUserMenu(false)}
            />

            {/* Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email ?? "user@example.com"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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