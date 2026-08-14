import { useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const navigate = useNavigate();

  const admin = {
    name: "Admin",
    email: "admin@roomkhmer.com",
  };

  const notifications = [
    {
      id: 1,
      title: "New room awaiting approval",
      description: "Modern Private Room",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "New landlord registered",
      description: "Sokha Chan",
      time: "20 min ago",
      unread: true,
    },
    {
      id: 3,
      title: "New booking received",
      description: "Booking #BK-00125",
      time: "1 hour ago",
      unread: false,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/auth/login");
  };

  return (
    <header className="fixed right-0 top-0 z-30 h-[72px] border-b border-gray-200 bg-white/95 backdrop-blur-md lg:left-64">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="hidden w-full max-w-md md:block">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search users, rooms, bookings..."
              className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* ==================================================
            MOBILE TITLE
        ================================================== */}

        <div className="ml-12 md:hidden">
          <p className="text-sm font-bold text-gray-900">
            Room<span className="text-blue-600">Khmer</span>
          </p>

          <p className="text-[10px] text-gray-400">Admin Portal</p>
        </div>

        {/* ==================================================
            RIGHT ACTIONS
        ================================================== */}

        <div className="ml-auto flex items-center gap-2">
          {/* Mobile Search */}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-50 hover:text-blue-600 md:hidden"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationOpen(!notificationOpen);
                setProfileOpen(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-50 hover:text-blue-600"
              aria-label="Notifications"
            >
              <Bell size={19} />

              {/* Notification badge */}

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            {/* Notification dropdown */}

            {notificationOpen && (
              <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Notifications
                    </h3>

                    <p className="text-[10px] text-gray-400">
                      You have 2 unread notifications
                    </p>
                  </div>

                  <button
                    type="button"
                    className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      className="flex w-full gap-3 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <Bell size={15} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-gray-800">
                            {notification.title}
                          </p>

                          {notification.unread && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                          )}
                        </div>

                        <p className="mt-1 truncate text-[11px] text-gray-500">
                          {notification.description}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {notification.time}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100 p-2">
                  <Link
                    to="/admin/notifications"
                    onClick={() => setNotificationOpen(false)}
                    className="flex items-center justify-center rounded-lg py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}

          <div className="mx-1 hidden h-8 w-px bg-gray-200 sm:block" />

          {/* ==================================================
              ADMIN PROFILE
          ================================================== */}

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationOpen(false);
              }}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <ShieldCheck size={18} />
              </div>

              <div className="hidden text-left lg:block">
                <p className="max-w-[120px] truncate text-xs font-semibold text-gray-800">
                  {admin.name}
                </p>

                <p className="text-[10px] text-gray-400">Administrator</p>
              </div>

              <ChevronDown
                size={15}
                className={`hidden text-gray-400 transition lg:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile dropdown */}

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                {/* User info */}

                <div className="border-b border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <ShieldCheck size={21} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {admin.name}
                      </p>

                      <p className="truncate text-[11px] text-gray-400">
                        {admin.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu */}

                <div className="p-2">
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
                  >
                    <User size={17} />
                    Profile
                  </Link>

                  <Link
                    to="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
                  >
                    <Settings size={17} />
                    Settings
                  </Link>

                  <div className="my-1 border-t border-gray-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
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
