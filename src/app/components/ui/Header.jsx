"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Header({ user }) {
  const router = useRouter();

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
    <header
      className="
        fixed top-0 left-60 right-0 
        bg-[#0D1B2A] text-white 
        px-6 py-4
        flex justify-between items-center
        border-b border-gray-700
        z-50
      "
    >
      <div>
        <p className="text-sm opacity-80">Welcome back,</p>
        <h1 className="text-xl font-semibold">{user?.nickname ?? "User"}</h1>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition"
      >
        <LogOut size={18} />
        <span>Keluar</span>
      </button>
    </header>
  );
}


// "use client";

// import { useRouter } from "next/navigation";
// import { LogOut } from "lucide-react";

// export default function Header({ user }) {
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await fetch("/api/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch (_) {}

//     document.cookie =
//       "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";

//     router.push("/login");
//   };

//   return (
//     <header
//       className="
//         fixed top-0 left-60 right-0 
//         bg-white text-gray-900
//         px-6 py-4
//         flex justify-between items-center
//         border-b border-gray-200
//         shadow-sm
//         z-50
//       "
//     >
//       <div>
//         <p className="text-sm text-gray-600">Welcome back,</p>
//         <h1 className="text-xl font-semibold text-gray-900">{user?.nickname ?? "User"}</h1>
//       </div>

//       <button
//         onClick={handleLogout}
//         className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition"
//       >
//         <LogOut size={18} />
//         <span>Keluar</span>
//       </button>
//     </header>
//   );
// }