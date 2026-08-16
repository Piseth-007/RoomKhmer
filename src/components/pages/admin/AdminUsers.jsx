import { useEffect, useMemo, useState } from "react";

import {
  Users,
  Search,
  User,
  ShieldCheck,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  MoreVertical,
  UserCheck,
  UserX,
  Home,
  CalendarDays,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase/config";

const PAGE_SIZE = 10;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");

  const [role, setRole] = useState("all");

  const [status, setStatus] = useState("all");

  const [search, setSearch] = useState("");

  const [location, setLocation] = useState("all");

  const [openMenu, setOpenMenu] = useState(null);

  const [page, setPage] = useState(1);

  /*
   * ============================================================
   * LOAD USERS
   * ============================================================
   */

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const snapshot = await getDocs(collection(db, "users"));

      const userData = snapshot.docs.map((userDoc) => {
        const data = userDoc.data();

        return {
          id: userDoc.id,

          name: data.name || data.displayName || "Unknown User",

          email: data.email || "No email",

          phone: data.phone || data.phoneNumber || "No phone",

          role: normalizeRole(data.role),

          location: data.location || data.address || "Unknown",

          status: normalizeStatus(data.status),

          joined: data.createdAt || null,

          /*
           * These values are only used if
           * you actually store them inside
           * the user document.
           */
          bookings: Number(data.bookings || 0),

          rooms: Number(data.rooms || 0),
        };
      });

      setUsers(userData);
    } catch (err) {
      console.error("Load users error:", err);

      setError(getFirebaseError(err, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  /*
   * ============================================================
   * RESET PAGE WHEN FILTER CHANGES
   * ============================================================
   */

  useEffect(() => {
    setPage(1);
  }, [search, role, status, location]);

  /*
   * ============================================================
   * FILTER USERS
   * ============================================================
   */

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const id = String(user.id || "").toLowerCase();

      const name = String(user.name || "").toLowerCase();

      const email = String(user.email || "").toLowerCase();

      const phone = String(user.phone || "").toLowerCase();

      const userLocation = String(user.location || "").toLowerCase();

      const matchesSearch =
        !query ||
        id.includes(query) ||
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        userLocation.includes(query);

      const matchesRole = role === "all" || user.role === role;

      const matchesStatus = status === "all" || user.status === status;

      const matchesLocation = location === "all" || user.location === location;

      return matchesSearch && matchesRole && matchesStatus && matchesLocation;
    });
  }, [users, role, status, search, location]);

  /*
   * ============================================================
   * COUNTS
   * ============================================================
   */

  const totalUsers = users.length;

  const tenantCount = users.filter((user) => user.role === "tenant").length;

  const landlordCount = users.filter((user) => user.role === "landlord").length;

  const adminCount = users.filter((user) => user.role === "admin").length;

  const activeCount = users.filter((user) => user.status === "active").length;

  const pendingCount = users.filter((user) => user.status === "pending").length;

  const suspendedCount = users.filter(
    (user) => user.status === "suspended",
  ).length;

  /*
   * ============================================================
   * LOCATIONS
   * ============================================================
   */

  const locations = useMemo(() => {
    return [
      ...new Set(
        users
          .map((user) => user.location)
          .filter((value) => value && value !== "Unknown"),
      ),
    ].sort();
  }, [users]);

  /*
   * ============================================================
   * PAGINATION
   * ============================================================
   */

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  /*
   * ============================================================
   * UPDATE USER STATUS
   * ============================================================
   */

  const updateStatus = async (user, newStatus) => {
    /*
     * Do not allow changing
     * another admin's status.
     */
    if (user.role === "admin") {
      setError(
        "Admin accounts cannot be suspended or approved from this page.",
      );

      setOpenMenu(null);

      return;
    }

    try {
      setActionLoading(user.id);

      setError("");

      await updateDoc(doc(db, "users", user.id), {
        status: newStatus,

        updatedAt: serverTimestamp(),
      });

      setUsers((current) =>
        current.map((item) =>
          item.id === user.id
            ? {
                ...item,
                status: newStatus,
              }
            : item,
        ),
      );

      setOpenMenu(null);
    } catch (err) {
      console.error("Update user error:", err);

      setError(getFirebaseError(err, "Failed to update user."));
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * ============================================================
   * DELETE USER
   * ============================================================
   */

  const deleteUser = async (user) => {
    /*
     * Protect admin accounts.
     */
    if (user.role === "admin") {
      setError("Admin accounts cannot be deleted from this page.");

      setOpenMenu(null);

      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(user.id);

      setError("");

      await deleteDoc(doc(db, "users", user.id));

      setUsers((current) => current.filter((item) => item.id !== user.id));

      setOpenMenu(null);
    } catch (err) {
      console.error("Delete user error:", err);

      setError(getFirebaseError(err, "Failed to delete user."));
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * ============================================================
   * CLEAR FILTERS
   * ============================================================
   */

  const clearFilters = () => {
    setSearch("");
    setRole("all");
    setStatus("all");
    setLocation("all");
    setPage(1);
  };

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users size={19} className="text-blue-600" />

            <span className="text-xs font-semibold text-blue-600">
              USER MANAGEMENT
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            អ្នកប្រើប្រាស់
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage tenants and landlords on RoomKhmer
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="flex w-fit items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-2.5 text-xs font-semibold text-yellow-700">
            <AlertCircle size={16} />
            {pendingCount} pending account
            {pendingCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-red-700">Firebase error</p>

            <p className="mt-1 wrap-break-word text-xs text-red-600">{error}</p>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto text-xs text-red-500"
          >
            Close
          </button>
        </div>
      )}

      {/* STATS */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <UserStat
          label="Total Users"
          value={totalUsers}
          icon={<Users size={19} />}
          className="bg-blue-50 text-blue-600"
        />

        <UserStat
          label="Tenants"
          value={tenantCount}
          icon={<User size={19} />}
          className="bg-green-50 text-green-600"
        />

        <UserStat
          label="Landlords"
          value={landlordCount}
          icon={<ShieldCheck size={19} />}
          className="bg-purple-50 text-purple-600"
        />

        <UserStat
          label="Active Users"
          value={activeCount}
          icon={<UserCheck size={19} />}
          className="bg-yellow-50 text-yellow-600"
        />
      </div>

      {/* ROLE TABS */}

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-xl border border-gray-100 bg-white p-1.5 shadow-sm">
          <RoleTab
            label="All Users"
            count={totalUsers}
            active={role === "all"}
            onClick={() => setRole("all")}
          />

          <RoleTab
            label="Tenants"
            count={tenantCount}
            active={role === "tenant"}
            onClick={() => setRole("tenant")}
          />

          <RoleTab
            label="Landlords"
            count={landlordCount}
            active={role === "landlord"}
            onClick={() => setRole("landlord")}
          />

          <RoleTab
            label="Admins"
            count={adminCount}
            active={role === "admin"}
            onClick={() => setRole("admin")}
          />
        </div>
      </div>

      {/* FILTERS */}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone, location or ID..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* STATUS */}

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>

            <option value="active">Active</option>

            <option value="pending">Pending</option>

            <option value="suspended">Suspended</option>
          </select>

          {/* LOCATION */}

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 outline-none focus:border-blue-500"
          >
            <option value="all">All Locations</option>

            {locations.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          {/* CLEAR */}

          <button
            type="button"
            onClick={clearFilters}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <Filter size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* STATUS SUMMARY */}

      <div className="flex flex-wrap gap-3">
        <StatusSummary
          icon={<CheckCircle size={14} />}
          label="Active"
          value={activeCount}
          className="bg-green-50 text-green-600"
        />

        <StatusSummary
          icon={<Clock size={14} />}
          label="Pending"
          value={pendingCount}
          className="bg-yellow-50 text-yellow-600"
        />

        <StatusSummary
          icon={<UserX size={14} />}
          label="Suspended"
          value={suspendedCount}
          className="bg-red-50 text-red-500"
        />

        <StatusSummary
          icon={<ShieldCheck size={14} />}
          label="Admins"
          value={adminCount}
          className="bg-purple-50 text-purple-600"
        />
      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden overflow-visible rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <TableHead>User</TableHead>

                <TableHead>Contact</TableHead>

                <TableHead>Role</TableHead>

                <TableHead>Location</TableHead>

                <TableHead>Activity</TableHead>

                <TableHead>Status</TableHead>

                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {paginatedUsers.map((user) => {
                const busy = actionLoading === user.id;

                return (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                  >
                    {/* USER */}

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} />

                        <div className="min-w-0">
                          <p className="max-w-42.5 truncate text-sm font-semibold text-gray-800">
                            {user.name}
                          </p>

                          <p className="mt-1 max-w-42.5 truncate text-[10px] text-gray-400">
                            {user.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}

                    <td className="px-5 py-4">
                      <p className="flex max-w-55 items-center gap-1.5 truncate text-xs text-gray-600">
                        <Mail size={12} className="shrink-0 text-gray-400" />

                        {user.email}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-400">
                        <Phone size={11} />

                        {user.phone}
                      </p>
                    </td>

                    {/* ROLE */}

                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* LOCATION */}

                    <td className="px-5 py-4">
                      <span className="flex max-w-32.5 items-center gap-1.5 truncate text-xs text-gray-600">
                        <MapPin size={13} className="shrink-0 text-gray-400" />

                        {user.location}
                      </span>
                    </td>

                    {/* ACTIVITY */}

                    <td className="px-5 py-4">
                      {user.role === "landlord" ? (
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                            <Home size={13} />
                            {user.rooms} Rooms
                          </p>

                          <p className="mt-1 text-[9px] text-gray-400">
                            {user.bookings} Bookings
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
                            <CalendarDays size={13} />
                            {user.bookings} Bookings
                          </p>

                          <p className="mt-1 text-[9px] text-gray-400">
                            {user.role === "admin" ? "Administrator" : "Tenant"}
                          </p>
                        </div>
                      )}
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <UserStatus status={user.status} />
                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">
                      <div className="relative">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            setOpenMenu(openMenu === user.id ? null : user.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-40"
                        >
                          <MoreVertical size={17} />
                        </button>

                        {openMenu === user.id && (
                          <UserMenu
                            user={user}
                            busy={busy}
                            onUpdateStatus={updateStatus}
                            onDelete={deleteUser}
                            closeMenu={() => setOpenMenu(null)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <TableFooter
          page={safePage}
          totalPages={totalPages}
          count={paginatedUsers.length}
          total={filteredUsers.length}
          onPrevious={() => setPage((current) => Math.max(1, current - 1))}
          onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
        />
      </div>

      {/* MOBILE */}

      <div className="space-y-4 lg:hidden">
        {paginatedUsers.map((user) => (
          <MobileUserCard
            key={user.id}
            user={user}
            actionLoading={actionLoading}
            updateStatus={updateStatus}
            deleteUser={deleteUser}
          />
        ))}
      </div>

      {/* MOBILE PAGINATION */}

      {paginatedUsers.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 lg:hidden">
          <p className="text-xs text-gray-400">
            Page <span className="font-semibold text-gray-700">{safePage}</span>{" "}
            of <span className="font-semibold text-gray-700">{totalPages}</span>
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* EMPTY */}

      {filteredUsers.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <Users size={25} />
          </div>

          <h2 className="mt-4 text-sm font-bold text-gray-900">
            No users found
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}

/*
 * ============================================================
 * MOBILE USER CARD
 * ============================================================
 */

function MobileUserCard({ user, actionLoading, updateStatus, deleteUser }) {
  const busy = actionLoading === user.id;

  const isAdmin = user.role === "admin";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar user={user} />

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900">
              {user.name}
            </p>

            <p className="mt-1 truncate text-[10px] text-gray-400">{user.id}</p>
          </div>
        </div>

        <UserStatus status={user.status} />
      </div>

      <div className="mt-4 space-y-2 border-y border-gray-100 py-4">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Mail size={14} />

          <span className="truncate">{user.email}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Phone size={14} />

          {user.phone}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin size={14} />

          {user.location}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <RoleBadge role={user.role} />

        {user.role === "landlord" ? (
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Home size={12} />
              {user.rooms} rooms
            </span>

            <span className="flex items-center gap-1">
              <CalendarDays size={12} />
              {user.bookings} bookings
            </span>
          </div>
        ) : (
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <CalendarDays size={12} />
            {user.bookings} bookings
          </span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Link
          to={`/admin/users/${user.id}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <Eye size={15} />
          View
        </Link>

        {!isAdmin && user.status === "active" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => updateStatus(user, "suspended")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-100 disabled:opacity-50"
          >
            <UserX size={15} />
            Suspend
          </button>
        )}

        {!isAdmin && user.status === "suspended" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => updateStatus(user, "active")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 py-2.5 text-xs font-semibold text-green-600 transition hover:bg-green-100 disabled:opacity-50"
          >
            <UserCheck size={15} />
            Activate
          </button>
        )}

        {!isAdmin && user.status === "pending" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => updateStatus(user, "active")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
          >
            <CheckCircle size={15} />
            Approve
          </button>
        )}

        {!isAdmin && (
          <button
            type="button"
            disabled={busy}
            onClick={() => deleteUser(user)}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

/*
 * ============================================================
 * USER STAT
 * ============================================================
 */

function UserStat({ label, value, icon, className }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs text-gray-500">{label}</p>

      <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

/*
 * ============================================================
 * ROLE TAB
 * ============================================================
 */

function RoleTab({ label, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
        active ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      {label}

      <span
        className={`rounded-full px-1.5 py-0.5 text-[9px] ${
          active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/*
 * ============================================================
 * STATUS SUMMARY
 * ============================================================
 */

function StatusSummary({ icon, label, value, className }) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${className}`}
    >
      {icon}

      <span className="text-[11px] font-semibold">{label}</span>

      <span className="text-[11px] font-bold">{value}</span>
    </div>
  );
}

/*
 * ============================================================
 * AVATAR
 * ============================================================
 */

function UserAvatar({ user }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
        user.role === "landlord"
          ? "bg-purple-50 text-purple-600"
          : user.role === "admin"
            ? "bg-red-50 text-red-600"
            : "bg-blue-50 text-blue-600"
      }`}
    >
      {user.role === "landlord" ? (
        <ShieldCheck size={20} />
      ) : user.role === "admin" ? (
        <ShieldCheck size={20} />
      ) : (
        <User size={20} />
      )}
    </div>
  );
}

/*
 * ============================================================
 * ROLE BADGE
 * ============================================================
 */

function RoleBadge({ role }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1.5 text-[9px] font-semibold text-red-600">
        <ShieldCheck size={11} />
        Admin
      </span>
    );
  }

  if (role === "landlord") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1.5 text-[9px] font-semibold text-purple-600">
        <ShieldCheck size={11} />
        Landlord
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1.5 text-[9px] font-semibold text-blue-600">
      <User size={11} />
      Tenant
    </span>
  );
}

/*
 * ============================================================
 * USER STATUS
 * ============================================================
 */

function UserStatus({ status }) {
  const config = {
    active: {
      label: "Active",
      icon: CheckCircle,
      className: "bg-green-50 text-green-600",
    },

    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-yellow-50 text-yellow-600",
    },

    suspended: {
      label: "Suspended",
      icon: XCircle,
      className: "bg-red-50 text-red-500",
    },
  };

  const current = config[status] || config.active;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[9px] font-semibold ${current.className}`}
    >
      <Icon size={11} />

      {current.label}
    </span>
  );
}

/*
 * ============================================================
 * USER MENU
 * ============================================================
 */

function UserMenu({ user, busy, onUpdateStatus, onDelete, closeMenu }) {
  const isAdmin = user.role === "admin";

  return (
    <div className="absolute right-0 top-10 z-50 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
      <Link
        to={`/admin/users/${user.id}`}
        onClick={closeMenu}
        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50"
      >
        <Eye size={15} />
        View Profile
      </Link>

      {!isAdmin && user.status === "pending" && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onUpdateStatus(user, "active")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50 disabled:opacity-50"
        >
          <CheckCircle size={15} />
          Approve User
        </button>
      )}

      {!isAdmin && user.status === "active" && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onUpdateStatus(user, "suspended")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
        >
          <UserX size={15} />
          Suspend User
        </button>
      )}

      {!isAdmin && user.status === "suspended" && (
        <button
          type="button"
          disabled={busy}
          onClick={() => onUpdateStatus(user, "active")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50 disabled:opacity-50"
        >
          <UserCheck size={15} />
          Activate User
        </button>
      )}

      {!isAdmin && (
        <>
          <div className="my-1 border-t border-gray-100" />

          <button
            type="button"
            disabled={busy}
            onClick={() => onDelete(user)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={15} />
            Delete User
          </button>
        </>
      )}

      {isAdmin && (
        <div className="px-3 py-2 text-[10px] text-gray-400">Admin account</div>
      )}
    </div>
  );
}

/*
 * ============================================================
 * TABLE HEAD
 * ============================================================
 */

function TableHead({ children }) {
  return (
    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </th>
  );
}

/*
 * ============================================================
 * TABLE FOOTER
 * ============================================================
 */

function TableFooter({ page, totalPages, count, total, onPrevious, onNext }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-700">{count}</span> of{" "}
        <span className="font-semibold text-gray-700">{total}</span> users
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={onPrevious}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={15} />
        </button>

        <span className="min-w-8 text-center text-xs font-semibold text-gray-700">
          {page}
        </span>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * NORMALIZE ROLE
 * ============================================================
 */

function normalizeRole(role) {
  const value = String(role || "")
    .trim()
    .toLowerCase();

  if (value === "landlord" || value === "owner") {
    return "landlord";
  }

  if (value === "student" || value === "tenant") {
    return "tenant";
  }

  if (value === "admin") {
    return "admin";
  }

  return "tenant";
}

/*
 * ============================================================
 * NORMALIZE STATUS
 * ============================================================
 */

function normalizeStatus(status) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (value === "suspended") {
    return "suspended";
  }

  if (value === "pending") {
    return "pending";
  }

  return "active";
}

/*
 * ============================================================
 * FIREBASE ERROR
 * ============================================================
 */

function getFirebaseError(error, fallback) {
  if (!error) {
    return fallback;
  }

  if (error.code === "permission-denied") {
    return "Permission denied. Make sure you are logged in as an admin and your Firestore rules allow admin access to users.";
  }

  if (error.code === "not-found") {
    return "The user document no longer exists.";
  }

  if (error.code === "unavailable") {
    return "Firebase is temporarily unavailable. Please try again.";
  }

  return error.message || fallback;
}
