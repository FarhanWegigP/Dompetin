"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, FileText, Camera, X } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transaction", href: "/transaction", icon: Wallet },
    { name: "Loan & Debt", href: "/loandebt", icon: FileText },
    { name: "Bill Vault", href: "/billvault", icon: Camera },
  ];

  const closeMobileSidebar = () => {
    document.getElementById('mobile-sidebar')?.classList.add('-translate-x-full');
    document.getElementById('mobile-sidebar')?.classList.remove('translate-x-0');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-gray-100 fixed h-screen flex-col shadow-sm z-50">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Wallet className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dompet.in</h1>
              <p className="text-xs text-gray-500">Finance Manager</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? "bg-green-600 text-white shadow-lg shadow-green-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-900 mb-1">
              💡 Pro Tip
            </p>
            <p className="text-xs text-green-700">
              Scan nota otomatis dengan fitur Bill Vault!
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        id="mobile-sidebar"
        className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 transform -translate-x-full transition-transform duration-300 ease-in-out z-50 shadow-xl"
      >
        {/* Logo + Close Button */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
              <Wallet className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Dompet.in</h1>
              <p className="text-xs text-gray-500">Finance Manager</p>
            </div>
          </div>
          <button
            onClick={closeMobileSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? "bg-green-600 text-white shadow-lg shadow-green-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-green-900 mb-1">
              💡 Pro Tip
            </p>
            <p className="text-xs text-green-700">
              Scan nota otomatis dengan fitur Bill Vault!
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      <div
        id="mobile-sidebar-backdrop"
        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none transition-opacity duration-300 z-40"
        onClick={closeMobileSidebar}
      />
    </>
  );
}