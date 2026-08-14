import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/pages/components/admin/AdminSidebar";
import AdminNavbar from "../components/pages/components/admin/AdminNavbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="lg:pl-64">
        <AdminNavbar />
        <main className="min-h-screen p-4 pt-24 sm:p-6 sm:pt-24 lg:p-8 lg:pt-28">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
