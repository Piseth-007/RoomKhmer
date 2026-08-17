import { useEffect, useRef, useState } from "react";
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
  Map,
  Info,
} from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Avatar({ size = "normal", photo, name = "Guest" }) {
  const avatarClass =
    size === "large"
      ? "h-12 w-12 text-lg"
      : size === "small"
        ? "h-8 w-8 text-sm"
        : "h-9 w-9 text-sm";

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${avatarClass} rounded-full object-cover ring-2 ring-white`}
      />
    );
  }

  return (
    <div
      className={`${avatarClass} flex items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600`}
    >
      {name?.charAt(0)?.toUpperCase() || <User size={18} />}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);
  const navigate = useNavigate();

  const { currentUser, profile, logout } = useAuth();

  const isLoggedIn = Boolean(currentUser);

  const user = {
    name:
      profile?.name ||
      currentUser?.displayName ||
      currentUser?.email?.split("@")[0] ||
      "Guest",

    email: currentUser?.email || "",

    photo: profile?.photoURL || profile?.photo || currentUser?.photoURL || null,
  };

  const navLinks = [
    {
      name: "ទំព័រដើម",
      english: "Home",
      path: "/",
    },
    {
      name: "ស្វែងរកបន្ទប់",
      english: "Rooms",
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
    setIsProfileOpen(false);
  };

  const closeProfile = () => {
    setIsProfileOpen(false);
  };

  const handleLogout = async () => {
    closeMenu();

    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition group-hover:bg-blue-700 group-hover:shadow-md">
            <House size={20} strokeWidth={2.3} />
          </div>

          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight text-gray-900">
              Room<span className="text-blue-600">Khmer</span>
            </h1>

            <p className="hidden text-[10px] text-gray-400 sm:block">
              ស្វែងរកបន្ទប់នៅទីក្រុងភ្នំពេញ
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                `relative mx-0.5 rounded-xl px-3 py-2 transition-all xl:px-4 ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-sm font-medium">{link.name}</span>

                  <span
                    className={`mt-0.5 text-[9px] ${
                      isActive ? "text-blue-400" : "text-gray-400"
                    }`}
                  >
                    {link.english}
                  </span>

                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-blue-600" />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-1 lg:flex">
          {/* Location */}
          <Link
            to="/locations"
            className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-blue-600 xl:flex"
          >
            <MapPin size={16} className="text-blue-600" />

            <span>ភ្នំពេញ</span>
          </Link>

          {/* Search */}
          <Link
            to="/rooms"
            aria-label="Search rooms"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
          >
            <Search size={18} />
          </Link>

          {/* Favorites */}
          <Link
            to="/favorites"
            aria-label="Favorites"
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 transition hover:bg-red-50 hover:text-red-500"
          >
            <Heart size={18} />
          </Link>

          <div className="mx-2 h-7 w-px bg-gray-200" />

          {/* User */}
          {isLoggedIn ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((previous) => !previous)}
                aria-expanded={isProfileOpen}
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-gray-50"
              >
                <Avatar photo={user.photo} name={user.name} />

                <div className="hidden text-left xl:block">
                  <p className="max-w-28 truncate text-sm font-semibold text-gray-800">
                    {user.name}
                  </p>

                  <p className="text-[10px] text-gray-400">My Account</p>
                </div>

                <ChevronDown
                  size={15}
                  className={`text-gray-400 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                  <div className="bg-linear-to-r from-blue-50 to-white p-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        size="large"
                        photo={user.photo}
                        name={user.name}
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    {/* Profile */}
                    <Link
                      to="/profile"
                      onClick={closeProfile}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-blue-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <User size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          គណនីរបស់ខ្ញុំ
                        </p>

                        <p className="text-[11px] text-gray-400">My Profile</p>
                      </div>
                    </Link>

                    {/* Bookings */}
                    <Link
                      to="/bookings"
                      onClick={closeProfile}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-blue-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <CalendarDays size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          ការកក់របស់ខ្ញុំ
                        </p>

                        <p className="text-[11px] text-gray-400">My Bookings</p>
                      </div>
                    </Link>

                    {/* Favorites */}
                    <Link
                      to="/favorites"
                      onClick={closeProfile}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-red-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
                        <Heart size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          បន្ទប់ដែលចូលចិត្ត
                        </p>

                        <p className="text-[11px] text-gray-400">Favorites</p>
                      </div>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-500">
                        <LogOut size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-red-500">
                          ចាកចេញ
                        </p>

                        <p className="text-[11px] text-gray-400">Logout</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
              >
                <User size={17} />
                <span>ចូលគណនី</span>
              </Link>

              <Link
                to="/auth/register"
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
              >
                ចុះឈ្មោះ
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 lg:hidden"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            {/* Mobile User */}
            {isLoggedIn && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-linear-to-r from-blue-50 to-white p-4">
                <Avatar size="large" photo={user.photo} name={user.name} />

                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {user.name}
                  </p>

                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            )}

            {/* Mobile Search */}
            <Link
              to="/rooms"
              onClick={closeMenu}
              className="mb-4 flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5 text-sm text-gray-500 transition hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
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
                  end={link.path === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-4 py-3 transition ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        {link.path === "/" && <House size={18} />}

                        {link.path === "/rooms" && <Search size={18} />}

                        {link.path === "/locations" && <Map size={18} />}

                        {link.path === "/about" && <Info size={18} />}

                        <span className="font-medium">{link.name}</span>
                      </div>

                      <span
                        className={`text-xs ${
                          isActive ? "text-blue-400" : "text-gray-400"
                        }`}
                      >
                        {link.english}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}

              {/* Favorites */}
              <NavLink
                to="/favorites"
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
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

              {/* Profile */}
              {isLoggedIn && (
                <>
                  <NavLink
                    to="/profile"
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
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
                      `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
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

            {/* Mobile Auth */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3.5 text-sm font-medium text-red-500 transition hover:bg-red-100"
                >
                  <LogOut size={17} />
                  ចាកចេញ
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/auth/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <User size={17} />
                    ចូលគណនី
                  </Link>

                  <Link
                    to="/auth/register"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
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
