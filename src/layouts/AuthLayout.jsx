import { Link, Outlet } from "react-router-dom";
import { ArrowLeft, House } from "lucide-react";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <House size={21} strokeWidth={2.2} />
            </div>
            <div className="leading-tight">
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                Room<span className="text-blue-600">Khmer</span>
              </h1>
              <p className="text-[11px] text-gray-400">
                ស្វែងរកបន្ទប់របស់អ្នកនៅទីក្រុងភ្នំពេញ
              </p>
            </div>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
          >
            <ArrowLeft size={18} />

            <span className="hidden sm:inline">ត្រឡប់ទៅទំព័រដើម</span>

            <span className="sm:hidden">ត្រឡប់</span>
          </Link>
        </div>
      </header>

      {/* ================= CONTENT ================= */}

      <main className="min-h-[calc(100vh-72px)] px-4 py-10 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
