import { useState } from "react";
import {
  LayoutDashboard,
  House,
  CalendarDays,
  Wallet,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";

export default function LandlordSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  // ============================================================
  // MENU
  // ============================================================

  const menuItems = [
    {
      name: "ផ្ទាំងគ្រប់គ្រង",
      english: "Dashboard",
      path: "/landlord",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "បន្ទប់របស់ខ្ញុំ",
      english: "My Rooms",
      path: "/landlord/rooms",
      icon: House,
    },
    {
      name: "ការកក់",
      english: "Bookings",
      path: "/landlord/bookings",
      icon: CalendarDays,
    },
    {
      name: "ចំណូល",
      english: "Earnings",
      path: "/landlord/earnings",
      icon: Wallet,
    },
    {
      name: "ប្រវត្តិរូប",
      english: "Profile",
      path: "/landlord/profile",
      icon: User,
    },
  ];

  // ============================================================
  // CLOSE SIDEBAR
  // ============================================================

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    closeSidebar();

    navigate("/auth/login");
  };

  return (
    <>
      {/* ======================================================
          MOBILE MENU BUTTON
      ======================================================= */}

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-700 shadow-md transition hover:bg-gray-50 lg:hidden"
        aria-label="Open landlord menu"
      >
        <Menu size={22} />
      </button>

      {/* ======================================================
          MOBILE OVERLAY
      ======================================================= */}

      {isOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          aria-label="Close landlord sidebar"
        />
      )}

      {/* ======================================================
          SIDEBAR
      ======================================================= */}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* ====================================================
            HEADER / LOGO
        ===================================================== */}

        <div className="flex h-18 shrink-0 items-center justify-between border-b border-gray-100 px-5">
          <Link
            to="/landlord"
            onClick={closeSidebar}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <House size={21} strokeWidth={2.2} />
            </div>

            <div className="leading-tight">
              <h1 className="text-lg font-bold tracking-tight text-gray-900">
                Room<span className="text-blue-600">Khmer</span>
              </h1>

              <p className="text-[10px] text-gray-400">Landlord Portal</p>
            </div>
          </Link>

          {/* Mobile close */}

          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-hidden px-3 py-5">
          {/* Main menu title */}

          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-xl px-3 py-2.5 transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon size={19} strokeWidth={2} />

                        <div className="leading-tight">
                          <p className="text-sm font-medium">{item.name}</p>

                          <p
                            className={`mt-0.5 text-[10px] ${
                              isActive ? "text-blue-100" : "text-gray-400"
                            }`}
                          >
                            {item.english}
                          </p>
                        </div>
                      </div>

                      {isActive && <ChevronRight size={15} />}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ====================================================
            BOTTOM
            Always stays at bottom.
        ===================================================== */}

        <div className="shrink-0 border-t border-gray-100 p-3">
          {/* Settings */}

          <NavLink
            to="/landlord/settings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <Settings size={19} />

            <div className="leading-tight">
              <p className="text-sm font-medium">Settings</p>

              <p className="text-[10px] text-gray-400">Account Settings</p>
            </div>
          </NavLink>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={19} />

            <div className="text-left leading-tight">
              <p className="text-sm font-medium">ចាកចេញ</p>

              <p className="text-[10px] text-red-300">Logout</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
