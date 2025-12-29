"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, FileText, Camera, X, Sparkles } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transaction", href: "/transaction", icon: Wallet },
    { name: "Loan & Debt", href: "/loandebt", icon: FileText },
    { name: "Bill Vault", href: "/billvault", icon: Camera },
  ];

  const closeMobileSidebar = () => {
    const sidebar = document.getElementById('mobile-sidebar');
    const backdrop = document.getElementById('mobile-sidebar-backdrop');
    
    sidebar?.classList.add('-translate-x-full');
    sidebar?.classList.remove('translate-x-0');
    backdrop?.classList.add('opacity-0', 'pointer-events-none');
    backdrop?.classList.remove('opacity-100', 'pointer-events-auto');
  };
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 bg-white/80 backdrop-blur-md border-r border-gray-100 fixed h-screen flex-col shadow-sm z-50">
        
        {/* Logo */}
        <div className="p-8 border-b border-gray-100 flex justify-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
            Dompet.in
          </h1>
        </div>
  
        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
  
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} />
                <span className="font-semibold text-sm">{item.name}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
  
      {/* Mobile Sidebar */}
      <aside
        id="mobile-sidebar"
        className="lg:hidden fixed inset-y-0 left-0 w-72 bg-white transform -translate-x-full transition-transform duration-300 ease-out z-50 shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50">
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              Dompet.in
            </h1>
            <p className="text-xs text-gray-500 font-medium">Finance Manager</p>
          </div>
  
          <button
            onClick={closeMobileSidebar}
            className="p-2 hover:bg-white/80 rounded-xl transition-all active:scale-95"
          >
            <X size={22} className="text-gray-600" />
          </button>
        </div>
  
        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
  
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileSidebar}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} />
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
  
      {/* Mobile Sidebar Backdrop */}
      <div
        id="mobile-sidebar-backdrop"
        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none transition-all duration-300 z-40"
        onClick={closeMobileSidebar}
      />
    </>
  );
}  