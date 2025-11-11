import { getUserFromToken } from "@/src/app/lib/auth";
import Header from "@/src/app/components/ui/Header";
import Sidebar from "@/src/app/components/ui/Sidebar";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
  // const user = getUserFromToken();

 // if (!user) redirect("/login");
const user = { name: "Farhan" };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar user={user} />
      <div className="flex-1">
        <Header user={user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
