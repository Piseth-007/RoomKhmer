import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  ExternalLink,
  User,
  Settings,
  LogOut,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { doc, onSnapshot } from "firebase/firestore";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth, db } from "../../../../firebase/config";

export default function LandlordNavbar() {
  const [profileOpen, setProfileOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [landlord, setLandlord] = useState({
    name: "Landlord",
    email: "",
    photoURL: "",
    role: "Landlord",
  });

  const [notifications, setNotifications] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(true);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // ============================================================
  // LOAD LANDLORD PROFILE
  // ============================================================

  useEffect(() => {
    let unsubscribeAuth;
    let unsubscribeUser;

    unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLandlord({
          name: "Landlord",
          email: "",
          photoURL: "",
          role: "Landlord",
        });

        setLoadingProfile(false);
        return;
      }

      unsubscribeUser = onSnapshot(
        doc(db, "users", user.uid),
        (snapshot) => {
          const data = snapshot.exists() ? snapshot.data() : {};

          setLandlord({
            name: data.name || user.displayName || "Landlord",

            email: data.email || user.email || "",

            photoURL: data.photoURL || user.photoURL || "",

            role: data.role === "owner" ? "Owner" : "Landlord",
          });

          setLoadingProfile(false);
        },
        (error) => {
          console.error("Load landlord profile error:", error);

          setLoadingProfile(false);
        },
      );
    });

    return () => {
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }

      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, []);

  // ============================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ============================================================
  // ESCAPE KEY
  // ============================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // ============================================================
  // DEMO NOTIFICATIONS
  // Replace this with Firestore notifications later.
  // ============================================================

  useEffect(() => {
    setNotifications([
      {
        id: 1,
        type: "request",
        title: "New booking request",
        description: "A student requested one of your rooms.",
        time: "Recently",
        unread: true,
      },
      {
        id: 2,
        type: "payment",
        title: "Payment pending",
        description: "A rental payment is waiting for confirmation.",
        time: "Today",
        unread: true,
      },
    ]);
  }, []);

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      setProfileOpen(false);
      setNotificationOpen(false);

      navigate("/auth/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ============================================================
  // NOTIFICATION
  // ============================================================

  const unreadCount = notifications.filter((item) => item.unread).length;

  const markNotificationsRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      })),
    );
  };

  // ============================================================
  // ACTIVE ROUTE
  // ============================================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur sm:h-17">
      <div className="flex h-full items-center justify-between px-3 sm:px-5 lg:px-7">
        {/* =====================================================
            LEFT
        ====================================================== */}

        <div className="min-w-0 pl-12 lg:pl-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-base font-bold text-gray-900 sm:text-lg">
              ផ្ទាំងគ្រប់គ្រងម្ចាស់ផ្ទះ
            </h1>

            <span className="hidden rounded-full bg-blue-50 px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-blue-600 sm:inline-flex">
              {landlord.role}
            </span>
          </div>

          <p className="mt-0.5 hidden text-[11px] text-gray-400 sm:block">
            Manage your rooms and rental activities
          </p>
        </div>

        {/* =====================================================
            RIGHT
        ====================================================== */}

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* ===================================================
              NOTIFICATIONS
          ==================================================== */}

          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationOpen((current) => !current);

                setProfileOpen(false);

                if (!notificationOpen) {
                  markNotificationsRead();
                }
              }}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
                notificationOpen
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
              }`}
              aria-label="Notifications"
              aria-expanded={notificationOpen}
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}

            {notificationOpen && (
              <div className="absolute right-0 top-12 w-[calc(100vw-24px)] max-w-sm overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl sm:w-80">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Notifications
                    </h3>

                    <p className="mt-0.5 text-[10px] text-gray-400">
                      Recent rental activities
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-semibold text-red-500">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                      />
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <Bell size={22} className="mx-auto text-gray-300" />

                      <p className="mt-2 text-xs font-medium text-gray-500">
                        No notifications
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 p-2">
                  <Link
                    to="/landlord/bookings"
                    onClick={() => setNotificationOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-center text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                  >
                    View booking activities
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="mx-1 hidden h-7 w-px bg-gray-200 sm:block" />

          {/* ===================================================
              PROFILE
          ==================================================== */}

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((current) => !current);

                setNotificationOpen(false);
              }}
              className={`flex items-center gap-2 rounded-xl px-1.5 py-1.5 transition sm:gap-3 sm:px-2 ${
                profileOpen ? "bg-gray-50" : "hover:bg-gray-50"
              }`}
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              {/* Avatar */}

              <Avatar
                photoURL={landlord.photoURL}
                name={landlord.name}
                size="small"
              />

              {/* Desktop profile information */}

              <div className="hidden min-w-0 text-left md:block">
                <p className="max-w-32.5 truncate text-xs font-semibold text-gray-800 lg:max-w-42.5 lg:text-sm">
                  {loadingProfile ? "Loading..." : landlord.name}
                </p>

                <p className="mt-0.5 text-[9px] text-gray-400">
                  {landlord.role}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`hidden text-gray-400 transition-transform sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================== */}

            {profileOpen && (
              <div className="absolute right-0 top-12 w-[calc(100vw-24px)] max-w-xs overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl sm:w-72">
                {/* Profile header */}

                <div className="border-b border-gray-100 bg-gray-50/70 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      photoURL={landlord.photoURL}
                      name={landlord.name}
                      size="large"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {landlord.name}
                      </p>

                      <p className="mt-1 truncate text-[11px] text-gray-400">
                        {landlord.email}
                      </p>

                      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-1 text-[9px] font-semibold text-green-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Active account
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu */}

                <div className="p-2">
                  <ProfileMenuItem
                    to="/landlord/profile"
                    icon={<User size={17} />}
                    khmer="ប្រវត្តិរូប"
                    english="My Profile"
                    active={isActive("/landlord/profile")}
                    onClick={() => setProfileOpen(false)}
                  />

                  <ProfileMenuItem
                    to="/landlord/settings"
                    icon={<Settings size={17} />}
                    khmer="ការកំណត់"
                    english="Settings"
                    active={isActive("/landlord/settings")}
                    onClick={() => setProfileOpen(false)}
                  />

                  <ProfileMenuItem
                    to="/"
                    icon={<ExternalLink size={17} />}
                    khmer="មើលគេហទំព័រ"
                    english="View Website"
                    onClick={() => setProfileOpen(false)}
                  />
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
                      <p className="text-sm font-medium text-red-500">ចាកចេញ</p>

                      <p className="mt-0.5 text-[10px] text-red-300">Logout</p>
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

// ============================================================
// AVATAR
// ============================================================

function Avatar({ photoURL, name, size = "small" }) {
  const sizes = {
    small: "h-9 w-9",
    large: "h-11 w-11",
  };

  const iconSizes = {
    small: 17,
    large: 21,
  };

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className={`${sizes[size]} shrink-0 rounded-full border border-gray-100 object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizes[size]} shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600`}
    >
      <User size={iconSizes[size]} />
    </div>
  );
}

// ============================================================
// PROFILE MENU ITEM
// ============================================================

function ProfileMenuItem({
  to,
  icon,
  khmer,
  english,
  active = false,
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
        active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          active ? "bg-white text-blue-600" : "bg-gray-50 text-gray-500"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold">{khmer}</p>

        <p
          className={`mt-0.5 text-[9px] ${
            active ? "text-blue-400" : "text-gray-400"
          }`}
        >
          {english}
        </p>
      </div>
    </Link>
  );
}

// ============================================================
// NOTIFICATION ITEM
// ============================================================

function NotificationItem({ notification }) {
  const isPayment = notification.type === "payment";

  return (
    <div
      className={`flex gap-3 border-b border-gray-50 px-4 py-3 transition hover:bg-gray-50 ${
        notification.unread ? "bg-blue-50/30" : ""
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          isPayment ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
        }`}
      >
        {isPayment ? <CheckCircle size={16} /> : <Clock size={16} />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold text-gray-800">
            {notification.title}
          </p>

          {notification.unread && (
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
          )}
        </div>

        <p className="mt-1 text-[10px] leading-4 text-gray-400">
          {notification.description}
        </p>

        <p className="mt-1.5 text-[9px] font-medium text-gray-300">
          {notification.time}
        </p>
      </div>
    </div>
  );
}
