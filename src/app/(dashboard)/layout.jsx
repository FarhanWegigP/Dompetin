import { getUserFromToken } from "@/src/app/lib/auth";
import Header from "@/src/app/components/ui/Header";
import Sidebar from "@/src/app/components/ui/Sidebar";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex">
      <Sidebar />

      {/* Main Content Area - Fixed margin and removed gap */}
      <div className="flex-1 lg:ml-60">
        <Header user={user} />

        {/* Content - Adjusted padding to remove gap */}
        <main className="pt-[83px]">
          {children}
        </main>
      </div>
    </div>
  );
}