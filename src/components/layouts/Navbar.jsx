import { useState } from "react";
import {
  Menu,
  X,
  Search,
  Heart,
  User,
  MapPin,
  House,
  ChevronDown,
  CalendarDays,
  LogOut,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();
  const { currentUser, profile, logout } = useAuth();

  const isLoggedIn = Boolean(currentUser);

  const user = {
    name: profile?.name || currentUser?.displayName || "Guest",
    email: currentUser?.email || "",
  };

  // ==========================================
  // NAVIGATION LINKS
  // ==========================================

  const navLinks = [
    {
      name: "ទំព័រដើម",
      english: "Home",
      path: "/",
    },
    {
      name: "ស្វែងរកបន្ទប់",
      english: "Find Rooms",
      path: "/rooms",
    },
    {
      name: "តំបន់",
      english: "Locations",
      path: "/locations",
    },
    {
      name: "អំពីយើង",
      english: "About",
      path: "/about",
    },
  ];

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMenu = () => {
    setIsOpen(false);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    setIsProfileOpen(false);
    setIsOpen(false);

    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }

    navigate("/auth/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      {/* =====================================================
          MAIN HEADER
      ====================================================== */}

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            LOGO
        ====================================================== */}

        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          {/* Logo Icon */}

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <House size={21} strokeWidth={2.2} />
          </div>

          {/* Logo Text */}

          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              Room<span className="text-blue-600">Khmer</span>
            </h1>

            <p className="hidden text-[11px] text-gray-400 sm:block">
              Find your room in Phnom Penh
            </p>
          </div>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `relative rounded-lg px-4 py-2.5 transition ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center leading-tight">
                  {/* Khmer */}

                  <span className="font-medium">{link.name}</span>

                  {/* English */}

                  <span
                    className={`text-[10px] ${
                      isActive ? "text-blue-400" : "text-gray-400"
                    }`}
                  >
                    {link.english}
                  </span>

                  {/* Active underline */}

                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-blue-600" />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* =====================================================
            DESKTOP ACTIONS
        ====================================================== */}

        <div className="hidden items-center gap-1 lg:flex">
          {/* =================================================
              LOCATION
          ================================================== */}

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            <MapPin size={17} className="text-blue-600" />

            <span>ភ្នំពេញ</span>
          </button>

          {/* =================================================
              SEARCH
          ================================================== */}

          <Link
            to="/rooms"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="Search rooms"
          >
            <Search size={19} />
          </Link>

          {/* =================================================
              FAVORITES
          ================================================== */}

          <Link
            to="/favorites"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Favorites"
          >
            <Heart size={19} />
          </Link>

          {/* Divider */}

          <div className="mx-2 h-7 w-px bg-gray-200" />

          {/* =================================================
              AUTHENTICATED USER
          ================================================== */}

          {isLoggedIn ? (
            <div className="relative">
              {/* Profile Button */}

              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-gray-50"
              >
                {/* Avatar */}

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User size={18} />
                </div>

                {/* Name */}

                <div className="hidden xl:block text-left">
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>

                  <p className="text-[10px] text-gray-400">My Account</p>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================== */}

              {isProfileOpen && (
                <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                  {/* User Info */}

                  <div className="border-b border-gray-100 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <User size={21} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Links */}

                  <div className="p-2">
                    {/* Profile */}

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <User size={18} />

                      <div>
                        <p className="font-medium">គណនីរបស់ខ្ញុំ</p>

                        <p className="text-[11px] text-gray-400">My Profile</p>
                      </div>
                    </Link>

                    {/* Bookings */}

                    <Link
                      to="/bookings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <CalendarDays size={18} />

                      <div>
                        <p className="font-medium">ការកក់របស់ខ្ញុំ</p>

                        <p className="text-[11px] text-gray-400">My Bookings</p>
                      </div>
                    </Link>

                    {/* Favorites */}

                    <Link
                      to="/favorites"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Heart size={18} />

                      <div>
                        <p className="font-medium">បន្ទប់ដែលចូលចិត្ត</p>

                        <p className="text-[11px] text-gray-400">Favorites</p>
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

                        <p className="text-[11px] text-gray-400">Logout</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =================================================
               GUEST USER
            ================================================== */

            <>
              {/* Login */}

              <Link
                to="/auth/login"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <User size={17} />

                <span>ចូលគណនី</span>
              </Link>

              {/* Register */}

              <Link
                to="/auth/register"
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                ចុះឈ្មោះ
              </Link>
            </>
          )}
        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ====================================================== */}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {isOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {/* =================================================
                MOBILE USER
            ================================================== */}

            {isLoggedIn && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-blue-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User size={22} />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>

                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            {/* =================================================
                MOBILE SEARCH
            ================================================== */}

            <Link
              to="/rooms"
              onClick={closeMenu}
              className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500"
            >
              <Search size={18} />

              <span>ស្វែងរកបន្ទប់...</span>
            </Link>

            {/* =================================================
                MOBILE NAVIGATION
            ================================================== */}

            <nav className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  <span className="font-medium">{link.name}</span>

                  <span className="text-xs text-gray-400">{link.english}</span>
                </NavLink>
              ))}

              {/* =================================================
                  FAVORITES
              ================================================== */}

              <NavLink
                to="/favorites"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 ${
                    isActive
                      ? "bg-red-50 text-red-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <Heart size={18} />

                <div>
                  <span className="block font-medium">បន្ទប់ដែលចូលចិត្ត</span>

                  <span className="text-xs text-gray-400">Favorites</span>
                </div>
              </NavLink>

              {/* =================================================
                  PROFILE
              ================================================== */}

              {isLoggedIn && (
                <>
                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <User size={18} />

                    <div>
                      <span className="block font-medium">គណនីរបស់ខ្ញុំ</span>

                      <span className="text-xs text-gray-400">My Profile</span>
                    </div>
                  </NavLink>

                  {/* Bookings */}

                  <NavLink
                    to="/bookings"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                  >
                    <CalendarDays size={18} />

                    <div>
                      <span className="block font-medium">ការកក់របស់ខ្ញុំ</span>

                      <span className="text-xs text-gray-400">My Bookings</span>
                    </div>
                  </NavLink>
                </>
              )}
            </nav>

            {/* =================================================
                AUTHENTICATION
            ================================================== */}

            <div className="mt-4 border-t border-gray-100 pt-4">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-medium text-red-500 transition hover:bg-red-100"
                >
                  <LogOut size={17} />
                  ចាកចេញ
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {/* Login */}

                  <Link
                    to="/auth/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <User size={17} />
                    ចូលគណនី
                  </Link>

                  {/* Register */}

                  <Link
                    to="/auth/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    ចុះឈ្មោះ
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
