import { useState } from "react";
import { Menu, X, Search, Heart, User, MapPin, House } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-md">
      {/* =========================
          DESKTOP / MOBILE HEADER
      ========================== */}

      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* =========================
            LOGO
        ========================== */}

        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <House size={21} strokeWidth={2.2} />
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              Room<span className="text-blue-600">Khmer</span>
            </h1>

            <p className="hidden text-[11px] text-gray-400 sm:block">
              Find your room in Phnom Penh
            </p>
          </div>
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

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
                  <span className=" font-medium">{link.name}</span>

                  <span
                    className={`text-[10px] ${
                      isActive ? "text-blue-400" : "text-gray-400"
                    }`}
                  >
                    {link.english}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-blue-600" />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* =========================
            DESKTOP ACTIONS
        ========================== */}

        <div className="hidden items-center gap-1 lg:flex">
          {/* Location */}

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
          >
            <MapPin size={17} className="text-blue-600" />

            <span>ភ្នំពេញ</span>
          </button>

          {/* Search */}

          <Link
            to="/rooms"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
            aria-label="Search rooms"
          >
            <Search size={19} />
          </Link>

          {/* Favorites */}

          <Link
            to="/favorites"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Favorites"
          >
            <Heart size={19} />
          </Link>

          {/* Divider */}

          <div className="mx-2 h-7 w-px bg-gray-200" />

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
        </div>

        {/* =========================
            MOBILE MENU BUTTON
        ========================== */}

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

      {/* =========================
          MOBILE MENU
      ========================== */}

      {isOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {/* Mobile Search */}

            <Link
              to="/rooms"
              onClick={closeMenu}
              className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-500"
            >
              <Search size={18} />

              <span>ស្វែងរកបន្ទប់...</span>
            </Link>

            {/* Navigation */}

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

              {/* Favorites */}

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

                <span className="font-medium">បន្ទប់ដែលចូលចិត្ត</span>
              </NavLink>
            </nav>

            {/* Authentication */}

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
              <Link
                to="/auth/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <User size={17} />
                ចូលគណនី
              </Link>

              <Link
                to="/auth/register"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                ចុះឈ្មោះ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
