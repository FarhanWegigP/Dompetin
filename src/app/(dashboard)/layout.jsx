import Header from "@/src/app/components/ui/Header";
import Sidebar from "@/src/app/components/ui/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 flex">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-60">
        <Header />

        <main className="pt-[83px]">
          {children}
        </main>
      </div>
    </div>
  );
}
