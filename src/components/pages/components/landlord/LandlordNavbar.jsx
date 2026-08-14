import { useState } from "react";
import {
  Bell,
  ChevronDown,
  ExternalLink,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function LandlordNavbar() {
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  const landlord = {
    name: "Leang Piseth",
    email: "leangpiseth@gmail.com",
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setProfileOpen(false);

    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-30 h-18 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =================================================
            LEFT SIDE
        ================================================== */}

        <div className="pl-12 lg:pl-0">
          <h1 className="text-lg font-bold text-gray-900">
            ផ្ទាំងគ្រប់គ្រងម្ចាស់ផ្ទះ
          </h1>

          <p className="hidden text-xs text-gray-400 sm:block">
            Manage your rooms and rental activities
          </p>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex items-center gap-2">
          {/* =================================================
              NOTIFICATION
          ================================================== */}

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-50 hover:text-blue-600"
            aria-label="Notifications"
          >
            <Bell size={20} />

            {/* Notification badge */}

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Divider */}

          <div className="mx-2 hidden h-7 w-px bg-gray-200 sm:block" />

          {/* =================================================
              PROFILE DROPDOWN
          ================================================== */}

          <div className="relative">
            {/* Profile Button */}

            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-50 sm:gap-3"
              aria-expanded={profileOpen}
            >
              {/* Avatar */}

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={18} />
              </div>

              {/* User Information */}

              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-gray-800">
                  {landlord.name}
                </p>

                <p className="text-[10px] text-gray-400">Landlord</p>
              </div>

              {/* Arrow */}

              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* =================================================
                DROPDOWN
            ================================================== */}

            {profileOpen && (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                {/* User Header */}

                <div className="border-b border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <User size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {landlord.name}
                      </p>

                      <p className="truncate text-xs text-gray-400">
                        {landlord.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu */}

                <div className="p-2">
                  {/* Profile */}

                  <Link
                    to="/landlord/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    <User size={18} />

                    <div>
                      <p className="font-medium">ប្រវត្តិរូប</p>

                      <p className="text-[10px] text-gray-400">My Profile</p>
                    </div>
                  </Link>

                  {/* Settings */}

                  <Link
                    to="/landlord/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <Settings size={18} />

                    <div>
                      <p className="font-medium">ការកំណត់</p>

                      <p className="text-[10px] text-gray-400">Settings</p>
                    </div>
                  </Link>

                  {/* View Website */}

                  <Link
                    to="/"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                  >
                    <ExternalLink size={18} />

                    <div>
                      <p className="font-medium">មើលគេហទំព័រ</p>

                      <p className="text-[10px] text-gray-400">View Website</p>
                    </div>
                  </Link>
                </div>

                {/* Logout */}

                <div className="border-t border-gray-100 p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut size={18} />

                    <div className="text-left">
                      <p className="font-medium">ចាកចេញ</p>

                      <p className="text-[10px] text-red-300">Logout</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
