import { useMemo, useState } from "react";
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

export default function AdminUsers() {
  const [users, setUsers] = useState([
    {
      id: "USR-001",
      name: "Sokha Chan",
      email: "sokha@example.com",
      phone: "012 345 678",
      role: "tenant",
      location: "Toul Kork",
      status: "active",
      joined: "Aug 14, 2026",
      bookings: 3,
      rooms: 0,
    },
    {
      id: "USR-002",
      name: "Dara Kim",
      email: "dara@example.com",
      phone: "010 222 333",
      role: "tenant",
      location: "Sen Sok",
      status: "active",
      joined: "Aug 12, 2026",
      bookings: 5,
      rooms: 0,
    },
    {
      id: "USR-003",
      name: "Sreypov Sok",
      email: "sreypov@example.com",
      phone: "096 444 555",
      role: "tenant",
      location: "Chamkarmon",
      status: "suspended",
      joined: "Aug 10, 2026",
      bookings: 1,
      rooms: 0,
    },
    {
      id: "LL-001",
      name: "Sokha Property",
      email: "sokha.property@example.com",
      phone: "012 888 999",
      role: "landlord",
      location: "Toul Kork",
      status: "active",
      joined: "Aug 08, 2026",
      bookings: 12,
      rooms: 8,
    },
    {
      id: "LL-002",
      name: "Dara Home",
      email: "dara.home@example.com",
      phone: "010 777 888",
      role: "landlord",
      location: "Sen Sok",
      status: "active",
      joined: "Aug 05, 2026",
      bookings: 18,
      rooms: 12,
    },
    {
      id: "LL-003",
      name: "BKK Residence",
      email: "bkk.residence@example.com",
      phone: "096 111 222",
      role: "landlord",
      location: "BKK1",
      status: "pending",
      joined: "Aug 14, 2026",
      bookings: 0,
      rooms: 2,
    },
    {
      id: "LL-004",
      name: "Happy Home",
      email: "happy.home@example.com",
      phone: "097 333 444",
      role: "landlord",
      location: "Daun Penh",
      status: "suspended",
      joined: "Jul 28, 2026",
      bookings: 7,
      rooms: 4,
    },
  ]);

  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);

  // ============================================================
  // FILTER USERS
  // ============================================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.toLowerCase();

      const matchesSearch =
        user.id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query);

      const matchesRole = role === "all" || user.role === role;

      const matchesStatus = status === "all" || user.status === status;

      const matchesLocation = location === "all" || user.location === location;

      return matchesSearch && matchesRole && matchesStatus && matchesLocation;
    });
  }, [users, role, status, search, location]);

  // ============================================================
  // COUNTS
  // ============================================================

  const totalUsers = users.length;

  const tenantCount = users.filter((user) => user.role === "tenant").length;

  const landlordCount = users.filter((user) => user.role === "landlord").length;

  const activeCount = users.filter((user) => user.status === "active").length;

  const pendingCount = users.filter((user) => user.status === "pending").length;

  const suspendedCount = users.filter(
    (user) => user.status === "suspended",
  ).length;

  // ============================================================
  // UPDATE STATUS
  // ============================================================

  const updateStatus = (id, newStatus) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? {
              ...user,
              status: newStatus,
            }
          : user,
      ),
    );

    setOpenMenu(null);
  };

  // ============================================================
  // DELETE USER
  // ============================================================

  const deleteUser = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    setUsers((current) => current.filter((user) => user.id !== id));

    setOpenMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}

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

      {/* ======================================================
          STATISTICS
      ======================================================= */}

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

      {/* ======================================================
          ROLE TABS
      ======================================================= */}

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
        </div>
      </div>

      {/* ======================================================
          FILTERS
      ======================================================= */}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          {/* Search */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone or ID..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Status */}

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

          {/* Location */}

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 outline-none focus:border-blue-500"
          >
            <option value="all">All Locations</option>

            <option value="Toul Kork">Toul Kork</option>

            <option value="Sen Sok">Sen Sok</option>

            <option value="BKK1">BKK1</option>

            <option value="Chamkarmon">Chamkarmon</option>

            <option value="Daun Penh">Daun Penh</option>
          </select>

          <button
            type="button"
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* ======================================================
          STATUS SUMMARY
      ======================================================= */}

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
      </div>

      {/* ======================================================
          DESKTOP TABLE
      ======================================================= */}

      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  User
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Contact
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Role
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Location
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Activity
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Status
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  {/* User */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} />

                      <div className="min-w-0">
                        <p className="max-w-[170px] truncate text-sm font-semibold text-gray-800">
                          {user.name}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {user.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}

                  <td className="px-5 py-4">
                    <p className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Mail size={12} className="text-gray-400" />
                      {user.email}
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-400">
                      <Phone size={11} />
                      {user.phone}
                    </p>
                  </td>

                  {/* Role */}

                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* Location */}

                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-gray-600">
                      <MapPin size={13} className="text-gray-400" />
                      {user.location}
                    </span>
                  </td>

                  {/* Activity */}

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

                        <p className="mt-1 text-[9px] text-gray-400">Tenant</p>
                      </div>
                    )}
                  </td>

                  {/* Status */}

                  <td className="px-5 py-4">
                    <UserStatus status={user.status} />
                  </td>

                  {/* Action */}

                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(openMenu === user.id ? null : user.id)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <MoreVertical size={17} />
                      </button>

                      {openMenu === user.id && (
                        <UserMenu
                          user={user}
                          onUpdateStatus={updateStatus}
                          onDelete={deleteUser}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TableFooter count={filteredUsers.length} total={users.length} />
      </div>

      {/* ======================================================
          MOBILE CARDS
      ======================================================= */}

      <div className="space-y-4 lg:hidden">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar user={user} />

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {user.name}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-400">{user.id}</p>
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

              {user.status === "active" && (
                <button
                  type="button"
                  onClick={() => updateStatus(user.id, "suspended")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 py-2.5 text-xs font-semibold text-red-500 transition hover:bg-red-100"
                >
                  <UserX size={15} />
                  Suspend
                </button>
              )}

              {user.status === "suspended" && (
                <button
                  type="button"
                  onClick={() => updateStatus(user.id, "active")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 py-2.5 text-xs font-semibold text-green-600 transition hover:bg-green-100"
                >
                  <UserCheck size={15} />
                  Activate
                </button>
              )}

              {user.status === "pending" && (
                <button
                  type="button"
                  onClick={() => updateStatus(user.id, "active")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                >
                  <CheckCircle size={15} />
                  Approve
                </button>
              )}

              <button
                type="button"
                onClick={() => deleteUser(user.id)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================
          EMPTY STATE
      ======================================================= */}

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

/* ============================================================
   USER STAT
============================================================ */

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

/* ============================================================
   ROLE TAB
============================================================ */

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

/* ============================================================
   STATUS SUMMARY
============================================================ */

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

/* ============================================================
   USER AVATAR
============================================================ */

function UserAvatar({ user }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
        user.role === "landlord"
          ? "bg-purple-50 text-purple-600"
          : "bg-blue-50 text-blue-600"
      }`}
    >
      {user.role === "landlord" ? (
        <ShieldCheck size={20} />
      ) : (
        <User size={20} />
      )}
    </div>
  );
}

/* ============================================================
   ROLE BADGE
============================================================ */

function RoleBadge({ role }) {
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

/* ============================================================
   USER STATUS
============================================================ */

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

/* ============================================================
   USER MENU
============================================================ */

function UserMenu({ user, onUpdateStatus, onDelete }) {
  return (
    <div className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
      <Link
        to={`/admin/users/${user.id}`}
        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50"
      >
        <Eye size={15} />
        View Profile
      </Link>

      {user.status === "pending" && (
        <button
          type="button"
          onClick={() => onUpdateStatus(user.id, "active")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50"
        >
          <CheckCircle size={15} />
          Approve User
        </button>
      )}

      {user.status === "active" && (
        <button
          type="button"
          onClick={() => onUpdateStatus(user.id, "suspended")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50"
        >
          <UserX size={15} />
          Suspend User
        </button>
      )}

      {user.status === "suspended" && (
        <button
          type="button"
          onClick={() => onUpdateStatus(user.id, "active")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50"
        >
          <UserCheck size={15} />
          Activate User
        </button>
      )}

      <div className="my-1 border-t border-gray-100" />

      <button
        type="button"
        onClick={() => onDelete(user.id)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50"
      >
        <Trash2 size={15} />
        Delete User
      </button>
    </div>
  );
}

/* ============================================================
   TABLE FOOTER
============================================================ */

function TableFooter({ count, total }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-700">{count}</span> of{" "}
        <span className="font-semibold text-gray-700">{total}</span> users
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"
        >
          <ChevronLeft size={15} />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white"
        >
          1
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          2
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
