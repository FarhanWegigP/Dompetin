"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header({ user }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login"); // redirect setelah logout
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back,</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user?.nickname || "User"}
          </h2>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
          text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 
          transition flex items-center space-x-2"
        >
          <span>keluar</span>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}
