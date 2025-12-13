"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Wallet, FileText, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Transaction", href: "/transaction", icon: Wallet },
    { name: "Loan & Debt", href: "/loandebt", icon: FileText },
    { name: "Bill Vault", href: "/billvault", icon: FileText },
  ];

  return (
    <aside className="w-60 bg-[#0D1B2A] text-white fixed h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Dompet.in
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                active
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { LayoutDashboard, Wallet, FileText, LogOut } from "lucide-react";

// export default function Sidebar() {
//   const pathname = usePathname();

//   const menu = [
//     { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//     { name: "Transaction", href: "/transaction", icon: Wallet },
//     { name: "Loan & Debt", href: "/loandebt", icon: FileText },
//     { name: "Bill Vault", href: "/billvault", icon: FileText },
//   ];

//   return (
//     <aside className="w-60 bg-white border-r border-gray-200 text-gray-900 fixed h-screen flex flex-col shadow-sm">
//       <div className="p-6 text-2xl font-bold border-b border-gray-200 text-green-600">
//         Dompet.in
//       </div>

//       <nav className="flex-1 p-4 space-y-2">
//         {menu.map((item) => {
//           const Icon = item.icon;
//           const active = pathname.startsWith(item.href);

//           return (
//             <Link
//               key={item.name}
//               href={item.href}
//               className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
//                 active
//                   ? "bg-green-600 text-white"
//                   : "text-gray-700 hover:bg-gray-100"
//               }`}
//             >
//               <Icon size={18} />
//               <span>{item.name}</span>
//             </Link>
//           );
//         })}
//       </nav>
//     </aside>
//   );
// }