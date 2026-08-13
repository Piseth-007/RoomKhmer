import { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MapPin,
  User,
  Phone,
  MoreVertical,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandlordBookings() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);

  const [bookings, setBookings] = useState([
    {
      id: "BK-00125",
      tenant: "Sokha Chan",
      phone: "012 345 678",
      room: "Modern Private Room",
      location: "Toul Kork",
      checkIn: "Aug 20, 2026",
      checkOut: "Aug 20, 2027",
      amount: 180,
      status: "pending",
      createdAt: "Aug 12, 2026",
    },
    {
      id: "BK-00124",
      tenant: "Dara Kim",
      phone: "097 456 789",
      room: "Cozy Student Room",
      location: "Sen Sok",
      checkIn: "Aug 18, 2026",
      checkOut: "Aug 18, 2027",
      amount: 150,
      status: "confirmed",
      createdAt: "Aug 11, 2026",
    },
    {
      id: "BK-00123",
      tenant: "Vanna Lim",
      phone: "088 222 333",
      room: "Single Room",
      location: "Mean Chey",
      checkIn: "Aug 15, 2026",
      checkOut: "Aug 15, 2027",
      amount: 130,
      status: "confirmed",
      createdAt: "Aug 10, 2026",
    },
    {
      id: "BK-00122",
      tenant: "Sreypov Sok",
      phone: "096 555 777",
      room: "Modern Studio",
      location: "BKK1",
      checkIn: "Aug 10, 2026",
      checkOut: "Aug 10, 2027",
      amount: 250,
      status: "cancelled",
      createdAt: "Aug 9, 2026",
    },
    {
      id: "BK-00121",
      tenant: "Rithy Chea",
      phone: "010 888 999",
      room: "Budget Student Room",
      location: "Chamkarmon",
      checkIn: "Aug 5, 2026",
      checkOut: "Aug 5, 2027",
      amount: 120,
      status: "completed",
      createdAt: "Aug 3, 2026",
    },
  ]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = search.toLowerCase();

      const matchesSearch =
        booking.id.toLowerCase().includes(query) ||
        booking.tenant.toLowerCase().includes(query) ||
        booking.room.toLowerCase().includes(query);

      const matchesStatus = status === "all" || booking.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, status]);

  // ============================================================
  // UPDATE STATUS
  // ============================================================

  const updateStatus = (id, newStatus) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id ? { ...booking, status: newStatus } : booking,
      ),
    );

    setOpenMenu(null);
  };

  // ============================================================
  // COUNTS
  // ============================================================

  const pending = bookings.filter((item) => item.status === "pending").length;

  const confirmed = bookings.filter(
    (item) => item.status === "confirmed",
  ).length;

  const completed = bookings.filter(
    (item) => item.status === "completed",
  ).length;

  const cancelled = bookings.filter(
    (item) => item.status === "cancelled",
  ).length;

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">ការកក់</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage booking requests from your tenants
        </p>
      </div>

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <BookingStat
          title="Pending"
          value={pending}
          icon={<Clock size={20} />}
          className="bg-yellow-50 text-yellow-600"
        />

        <BookingStat
          title="Confirmed"
          value={confirmed}
          icon={<CheckCircle size={20} />}
          className="bg-green-50 text-green-600"
        />

        <BookingStat
          title="Completed"
          value={completed}
          icon={<CalendarDays size={20} />}
          className="bg-blue-50 text-blue-600"
        />

        <BookingStat
          title="Cancelled"
          value={cancelled}
          icon={<XCircle size={20} />}
          className="bg-red-50 text-red-500"
        />
      </div>

      {/* ======================================================
          FILTER
      ======================================================= */}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search booking, tenant or room..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-600 outline-none focus:border-blue-500"
          >
            <option value="all">All Bookings</option>

            <option value="pending">Pending</option>

            <option value="confirmed">Confirmed</option>

            <option value="completed">Completed</option>

            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* ======================================================
          DESKTOP TABLE
      ======================================================= */}

      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Booking
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Tenant
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Room
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Rental Period
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Amount
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {booking.id}
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      {booking.createdAt}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <User size={17} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {booking.tenant}
                        </p>

                        <p className="text-[11px] text-gray-400">
                          {booking.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{booking.room}</p>

                    <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                      <MapPin size={11} />
                      {booking.location}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-600">{booking.checkIn}</p>

                    <p className="my-1 text-[10px] text-gray-300">to</p>

                    <p className="text-xs text-gray-600">{booking.checkOut}</p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">
                      ${booking.amount}
                    </p>

                    <p className="text-[10px] text-gray-400">/ month</p>
                  </td>

                  <td className="px-6 py-4">
                    <BookingStatus status={booking.status} />
                  </td>

                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === booking.id ? null : booking.id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openMenu === booking.id && (
                        <BookingMenu
                          booking={booking}
                          onUpdate={updateStatus}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================
          MOBILE CARDS
      ======================================================= */}

      <div className="space-y-4 lg:hidden">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{booking.id}</p>

                <p className="mt-1 text-xs text-gray-400">
                  {booking.createdAt}
                </p>
              </div>

              <BookingStatus status={booking.status} />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {booking.tenant}
                </p>

                <p className="flex items-center gap-1 text-xs text-gray-400">
                  <Phone size={11} />
                  {booking.phone}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-3">
              <p className="text-sm font-semibold text-gray-800">
                {booking.room}
              </p>

              <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                <MapPin size={12} />
                {booking.location}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-400">Check In</p>

                <p className="mt-1 text-xs font-medium text-gray-700">
                  {booking.checkIn}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400">Check Out</p>

                <p className="mt-1 text-xs font-medium text-gray-700">
                  {booking.checkOut}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <p className="text-lg font-bold text-gray-900">
                ${booking.amount}
                <span className="ml-1 text-xs font-normal text-gray-400">
                  / month
                </span>
              </p>

              <div className="flex gap-2">
                {booking.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateStatus(booking.id, "confirmed")}
                      className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600"
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(booking.id, "cancelled")}
                      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-500"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================
          EMPTY
      ======================================================= */}

      {filteredBookings.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <CalendarDays size={25} />
          </div>

          <h2 className="mt-4 font-bold text-gray-900">No bookings found</h2>

          <p className="mt-1 text-sm text-gray-400">
            Try changing your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   STAT
============================================================ */

function BookingStat({ title, value, icon, className }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs text-gray-500">{title}</p>

      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

/* ============================================================
   STATUS
============================================================ */

function BookingStatus({ status }) {
  const config = {
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-yellow-50 text-yellow-600",
    },

    confirmed: {
      label: "Confirmed",
      icon: CheckCircle,
      className: "bg-green-50 text-green-600",
    },

    completed: {
      label: "Completed",
      icon: CheckCircle,
      className: "bg-blue-50 text-blue-600",
    },

    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      className: "bg-red-50 text-red-500",
    },
  };

  const current = config[status] || config.pending;
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold ${current.className}`}
    >
      <Icon size={12} />
      {current.label}
    </span>
  );
}

/* ============================================================
   BOOKING MENU
============================================================ */

function BookingMenu({ booking, onUpdate }) {
  return (
    <div className="absolute right-0 top-10 z-30 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
      <Link
        to={`/landlord/bookings/${booking.id}`}
        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
      >
        <Eye size={16} />
        View Details
      </Link>

      {booking.status === "pending" && (
        <>
          <button
            type="button"
            onClick={() => onUpdate(booking.id, "confirmed")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-green-600 hover:bg-green-50"
          >
            <CheckCircle size={16} />
            Accept
          </button>

          <button
            type="button"
            onClick={() => onUpdate(booking.id, "cancelled")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
          >
            <XCircle size={16} />
            Reject
          </button>
        </>
      )}

      {booking.status === "confirmed" && (
        <button
          type="button"
          onClick={() => onUpdate(booking.id, "completed")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-blue-600 hover:bg-blue-50"
        >
          <CheckCircle size={16} />
          Complete
        </button>
      )}
    </div>
  );
}
