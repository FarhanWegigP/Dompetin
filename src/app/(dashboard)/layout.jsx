import { getUserFromToken } from "@/src/app/lib/auth";
import Header from "@/src/app/components/ui/Header";
import Sidebar from "@/src/app/components/ui/Sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  // ====== PROTEKSI LOGIN ======
  const user = await getUserFromToken();

  // kalau tidak ada token atau token rusak → langsung tendang ke login
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />

      <div className="flex-1 ml-60">
        <Header user={user} />

        {/* Biar tidak ketutup header */}
        <main className="pt-28">
          {children}
        </main>
      </div>
    </div>
  );
}


// import { getUserFromToken } from "@/src/app/lib/auth";
// import Header from "@/src/app/components/ui/Header";
// import Sidebar from "@/src/app/components/ui/Sidebar";
// import { redirect } from "next/navigation";

// export default async function DashboardLayout({ children }) {
//   // ====== PROTEKSI LOGIN ======
//   const user = await getUserFromToken();

//   // kalau tidak ada token atau token rusak → langsung tendang ke login
//   if (!user) {
//     redirect("/login");
//   }

//   return (
//     <div className="min-h-screen bg-white flex">
//       <Sidebar />

//       <div className="flex-1 ml-60">
//         <Header user={user} />

//         {/* Biar tidak ketutup header */}
//         <main className="pt-28 bg-gray-50 min-h-screen">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }


