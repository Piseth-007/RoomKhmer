import { useEffect, useRef, useState } from "react";

import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { onAuthStateChanged, signOut } from "firebase/auth";

import { auth, db } from "../../../../firebase/config";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const profileRef = useRef(null);

  const notificationRef = useRef(null);

  const [profileOpen, setProfileOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] = useState(false);

  const [admin, setAdmin] = useState({
    uid: "",
    name: "Admin",
    email: "",
    photoURL: "",
    role: "admin",
  });

  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  /*
   * ============================================================
   * LOAD ADMIN
   * ============================================================
   */

  useEffect(() => {
    let unsubscribe;

    unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setAdmin({
            uid: "",
            name: "Admin",
            email: "",
            photoURL: "",
            role: "admin",
          });

          setLoading(false);

          return;
        }

        const profile = await loadAdminProfile(user);

        setAdmin(profile);
      } catch (error) {
        console.error("Admin profile error:", error);

        setAdmin({
          uid: user.uid,
          name: user.displayName || "Admin",
          email: user.email || "",
          photoURL: user.photoURL || "",
          role: "admin",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /*
   * ============================================================
   * LOAD NOTIFICATIONS
   * ============================================================
   */

  useEffect(() => {
    let unsubscribe;

    try {
      const notificationsRef = collection(db, "adminNotifications");

      const notificationsQuery = query(
        notificationsRef,
        orderBy("createdAt", "desc"),
        limit(10),
      );

      unsubscribe = onSnapshot(
        notificationsQuery,
        (snapshot) => {
          const data = snapshot.docs.map((notificationDoc) => {
            const item = notificationDoc.data();

            return {
              id: notificationDoc.id,

              title: item.title || "Notification",

              description: item.description || item.message || "",

              unread: item.unread !== false,

              time: formatNotificationTime(item.createdAt),

              type: item.type || "general",

              link: item.link || "",
            };
          });

          setNotifications(data);
        },
        (error) => {
          console.error("Notification error:", error);

          setNotifications([]);
        },
      );
    } catch (error) {
      console.error("Notification setup error:", error);

      setNotifications([]);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /*
   * ============================================================
   * CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
   * ============================================================
   */

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

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  const handleLogout = async () => {
    try {
      await signOut(auth);

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      localStorage.removeItem("role");

      sessionStorage.clear();

      setProfileOpen(false);
      setNotificationOpen(false);

      navigate("/auth/login", {
        replace: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /*
   * ============================================================
   * TOGGLE PROFILE
   * ============================================================
   */

  const toggleProfile = () => {
    setProfileOpen((current) => !current);

    setNotificationOpen(false);
  };

  /*
   * ============================================================
   * TOGGLE NOTIFICATION
   * ============================================================
   */

  const toggleNotifications = () => {
    setNotificationOpen((current) => !current);

    setProfileOpen(false);
  };

  /*
   * ============================================================
   * MARK ALL READ
   * ============================================================
   *
   * This version only updates local state.
   *
   * If you later create an adminNotifications collection
   * with notification documents, you can update Firestore
   * here.
   */

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      })),
    );
  };

  /*
   * ============================================================
   * MARK SINGLE NOTIFICATION READ
   * ============================================================
   */

  const handleNotificationClick = (notification) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              unread: false,
            }
          : item,
      ),
    );

    setNotificationOpen(false);

    if (notification.link) {
      navigate(notification.link);
    }
  };

  return (
    <header className="fixed right-0 top-0 z-30 h-18 border-b border-gray-200 bg-white/95 backdrop-blur-md lg:left-64">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ======================================================
            DESKTOP SEARCH
        ====================================================== */}

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

        {/* ======================================================
            MOBILE BRAND
        ====================================================== */}

        <div className="ml-12 md:hidden">
          <p className="text-sm font-bold text-gray-900">
            Room
            <span className="text-blue-600">Khmer</span>
          </p>

          <p className="text-[10px] text-gray-400">Admin Portal</p>
        </div>

        {/* ======================================================
            RIGHT ACTIONS
        ====================================================== */}

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

          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={toggleNotifications}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-50 hover:text-blue-600"
              aria-label="Notifications"
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Notifications
                    </h3>

                    <p className="text-[10px] text-gray-400">
                      {unreadCount} unread notifications
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
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
                    ))
                  ) : (
                    <div className="px-4 py-10 text-center">
                      <Bell size={25} className="mx-auto text-gray-300" />

                      <p className="mt-3 text-sm font-medium text-gray-500">
                        No notifications
                      </p>

                      <p className="mt-1 text-[10px] text-gray-400">
                        You're all caught up.
                      </p>
                    </div>
                  )}
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

          {/* ======================================================
              ADMIN PROFILE
          ====================================================== */}

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={toggleProfile}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-50"
            >
              {admin.photoURL ? (
                <img
                  src={admin.photoURL}
                  alt="Admin"
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <ShieldCheck size={18} />
                </div>
              )}

              <div className="hidden text-left lg:block">
                <p className="max-w-30 truncate text-xs font-semibold text-gray-800">
                  {loading ? "Loading..." : admin.name}
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

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                {/* User info */}

                <div className="border-b border-gray-100 p-4">
                  <div className="flex items-center gap-3">
                    {admin.photoURL ? (
                      <img
                        src={admin.photoURL}
                        alt="Admin"
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <ShieldCheck size={21} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-bold text-gray-900">
                          {admin.name}
                        </p>

                        <CheckCircle
                          size={13}
                          className="shrink-0 text-blue-600"
                        />
                      </div>

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

/*
 * ============================================================
 * LOAD ADMIN PROFILE
 * ============================================================
 */

async function loadAdminProfile(user) {
  const userRef = (await import("firebase/firestore")).doc(
    db,
    "users",
    user.uid,
  );

  const userSnapshot = await (
    await import("firebase/firestore")
  ).getDoc(userRef);

  const data = userSnapshot.exists() ? userSnapshot.data() : {};

  return {
    uid: user.uid,

    name: data.name || user.displayName || "Admin",

    email: data.email || user.email || "",

    photoURL: data.photoURL || user.photoURL || "",

    role: data.role || "admin",
  };
}

/*
 * ============================================================
 * FORMAT NOTIFICATION TIME
 * ============================================================
 */

function formatNotificationTime(value) {
  if (!value) {
    return "Recently";
  }

  let date = null;

  if (value?.toDate) {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    date = new Date(value);
  }

  if (!date || Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = Date.now();

  const difference = now - date.getTime();

  const minute = 60 * 1000;

  const hour = 60 * minute;

  const day = 24 * hour;

  if (difference < minute) {
    return "Just now";
  }

  if (difference < hour) {
    return `${Math.floor(difference / minute)} min ago`;
  }

  if (difference < day) {
    return `${Math.floor(difference / hour)} hour ago`;
  }

  if (difference < 7 * day) {
    return `${Math.floor(difference / day)} day ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
