import { useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  User,
  House,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Wallet,
  Eye,
  Trash2,
  MoreVertical,
  Check,
  Ban,
  CircleCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([
    {
      id: "BK-00125",
      tenant: "Sokha Chan",
      tenantEmail: "sokha@example.com",
      landlord: "Dara Property",
      room: "Modern Private Room",
      location: "Toul Kork",
      amount: 180,
      bookingDate: "Aug 14, 2026",
      moveInDate: "Sep 01, 2026",
      status: "confirmed",
      payment: "paid",
    },

    {
      id: "BK-00124",
      tenant: "Vanna Lim",
      tenantEmail: "vanna@example.com",
      landlord: "Piseth Rooms",
      room: "Cozy Student Room",
      location: "Sen Sok",
      amount: 150,
      bookingDate: "Aug 14, 2026",
      moveInDate: "Sep 05, 2026",
      status: "pending",
      payment: "pending",
    },

    {
      id: "BK-00123",
      tenant: "Dara Kim",
      tenantEmail: "dara@example.com",
      landlord: "BKK Property",
      room: "Modern Studio",
      location: "BKK1",
      amount: 250,
      bookingDate: "Aug 13, 2026",
      moveInDate: "Sep 01, 2026",
      status: "confirmed",
      payment: "paid",
    },

    {
      id: "BK-00122",
      tenant: "Sreypov Sok",
      tenantEmail: "sreypov@example.com",
      landlord: "Happy Home",
      room: "Single Room",
      location: "Chamkarmon",
      amount: 130,
      bookingDate: "Aug 13, 2026",
      moveInDate: "Aug 20, 2026",
      status: "cancelled",
      payment: "refunded",
    },

    {
      id: "BK-00121",
      tenant: "Rithy Long",
      tenantEmail: "rithy@example.com",
      landlord: "City Living",
      room: "Modern Apartment",
      location: "7 Makara",
      amount: 320,
      bookingDate: "Aug 10, 2026",
      moveInDate: "Aug 15, 2026",
      status: "completed",
      payment: "paid",
    },

    {
      id: "BK-00120",
      tenant: "Sokunthea Mey",
      tenantEmail: "sokunthea@example.com",
      landlord: "Happy Home",
      room: "Affordable Room",
      location: "Daun Penh",
      amount: 120,
      bookingDate: "Aug 09, 2026",
      moveInDate: "Aug 20, 2026",
      status: "pending",
      payment: "pending",
    },
  ]);

  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = search.toLowerCase();

      const matchesSearch =
        booking.id.toLowerCase().includes(query) ||
        booking.tenant.toLowerCase().includes(query) ||
        booking.landlord.toLowerCase().includes(query) ||
        booking.room.toLowerCase().includes(query) ||
        booking.location.toLowerCase().includes(query);

      const matchesStatus = status === "all" || booking.status === status;

      const matchesPayment = payment === "all" || booking.payment === payment;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, search, status, payment]);

  // ============================================================
  // COUNTS
  // ============================================================

  const totalCount = bookings.length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;

  const paidCount = bookings.filter(
    (booking) => booking.payment === "paid",
  ).length;

  // ============================================================
  // REVENUE
  // ============================================================

  const totalRevenue = bookings
    .filter((booking) => booking.payment === "paid")
    .reduce((total, booking) => total + booking.amount, 0);

  // ============================================================
  // UPDATE STATUS
  // ============================================================

  const updateStatus = (id, newStatus) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              status: newStatus,
            }
          : booking,
      ),
    );

    setOpenMenu(null);
  };

  // ============================================================
  // UPDATE PAYMENT
  // ============================================================

  const updatePayment = (id, newPayment) => {
    setBookings((current) =>
      current.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              payment: newPayment,
            }
          : booking,
      ),
    );

    setOpenMenu(null);
  };

  // ============================================================
  // DELETE
  // ============================================================

  const deleteBooking = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?",
    );

    if (!confirmed) return;

    setBookings((current) => current.filter((booking) => booking.id !== id));

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
            <CalendarDays size={19} className="text-blue-600" />

            <span className="text-xs font-semibold text-blue-600">
              BOOKING MANAGEMENT
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">ការកក់</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage all room bookings and payments
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="flex w-fit items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-2.5 text-xs font-semibold text-yellow-700">
            <AlertCircle size={16} />
            {pendingCount} pending booking
            {pendingCount > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <BookingStat
          label="Total Bookings"
          value={totalCount}
          icon={<CalendarDays size={19} />}
          className="bg-blue-50 text-blue-600"
        />

        <BookingStat
          label="Pending"
          value={pendingCount}
          icon={<Clock size={19} />}
          className="bg-yellow-50 text-yellow-600"
        />

        <BookingStat
          label="Confirmed"
          value={confirmedCount}
          icon={<CheckCircle size={19} />}
          className="bg-green-50 text-green-600"
        />

        <BookingStat
          label="Completed"
          value={completedCount}
          icon={<CircleCheck size={19} />}
          className="bg-purple-50 text-purple-600"
        />

        <BookingStat
          label="Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<Wallet size={19} />}
          className="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* ======================================================
          STATUS TABS
      ======================================================= */}

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-xl border border-gray-100 bg-white p-1.5 shadow-sm">
          <StatusTab
            label="All"
            count={totalCount}
            active={status === "all"}
            onClick={() => setStatus("all")}
          />

          <StatusTab
            label="Pending"
            count={pendingCount}
            active={status === "pending"}
            onClick={() => setStatus("pending")}
            warning
          />

          <StatusTab
            label="Confirmed"
            count={confirmedCount}
            active={status === "confirmed"}
            success
          />

          <StatusTab
            label="Completed"
            count={completedCount}
            active={status === "completed"}
            purple
          />

          <StatusTab
            label="Cancelled"
            count={cancelledCount}
            active={status === "cancelled"}
            danger
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
              placeholder="Search booking, tenant, landlord or room..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Payment */}

          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 outline-none focus:border-blue-500"
          >
            <option value="all">All Payments</option>

            <option value="paid">Paid</option>

            <option value="pending">Pending</option>

            <option value="refunded">Refunded</option>
          </select>

          {/* Date */}

          <select className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 outline-none focus:border-blue-500">
            <option>All Dates</option>

            <option>Today</option>

            <option>This Week</option>

            <option>This Month</option>
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
          PAYMENT SUMMARY
      ======================================================= */}

      <div className="flex flex-wrap gap-3">
        <SummaryBadge
          icon={<Wallet size={14} />}
          label="Paid"
          value={paidCount}
          className="bg-green-50 text-green-600"
        />

        <SummaryBadge
          icon={<Clock size={14} />}
          label="Payment Pending"
          value={
            bookings.filter((booking) => booking.payment === "pending").length
          }
          className="bg-yellow-50 text-yellow-600"
        />

        <SummaryBadge
          icon={<XCircle size={14} />}
          label="Refunded"
          value={
            bookings.filter((booking) => booking.payment === "refunded").length
          }
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
                  Booking
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Tenant
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Room
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Landlord
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Move In
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Amount
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
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  {/* Booking */}

                  <td className="px-5 py-4">
                    <p className="text-xs font-bold text-gray-800">
                      {booking.id}
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      {booking.bookingDate}
                    </p>
                  </td>

                  {/* Tenant */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <User size={14} />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-700">
                          {booking.tenant}
                        </p>

                        <p className="mt-1 max-w-[120px] truncate text-[9px] text-gray-400">
                          {booking.tenantEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Room */}

                  <td className="max-w-[160px] px-5 py-4">
                    <p className="truncate text-xs font-medium text-gray-700">
                      {booking.room}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-[9px] text-gray-400">
                      <MapPin size={10} />
                      {booking.location}
                    </p>
                  </td>

                  {/* Landlord */}

                  <td className="px-5 py-4">
                    <p className="text-xs text-gray-600">{booking.landlord}</p>
                  </td>

                  {/* Move in */}

                  <td className="px-5 py-4">
                    <p className="text-xs font-medium text-gray-700">
                      {booking.moveInDate}
                    </p>
                  </td>

                  {/* Amount */}

                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-gray-800">
                      ${booking.amount}
                    </p>

                    <PaymentStatus status={booking.payment} />
                  </td>

                  {/* Status */}

                  <td className="px-5 py-4">
                    <BookingStatus status={booking.status} />
                  </td>

                  {/* Action */}

                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === booking.id ? null : booking.id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <MoreVertical size={17} />
                      </button>

                      {openMenu === booking.id && (
                        <BookingMenu
                          booking={booking}
                          onUpdateStatus={updateStatus}
                          onUpdatePayment={updatePayment}
                          onDelete={deleteBooking}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TableFooter count={filteredBookings.length} total={bookings.length} />
      </div>

      {/* ======================================================
          MOBILE CARDS
      ======================================================= */}

      <div className="space-y-4 lg:hidden">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            {/* Header */}

            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-gray-800">{booking.id}</p>

                <p className="mt-1 text-[10px] text-gray-400">
                  {booking.bookingDate}
                </p>
              </div>

              <BookingStatus status={booking.status} />
            </div>

            {/* Tenant */}

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {booking.tenant}
                </p>

                <p className="text-[10px] text-gray-400">Tenant</p>
              </div>
            </div>

            {/* Room */}

            <div className="mt-4 rounded-xl bg-gray-50 p-3">
              <div className="flex items-center gap-2">
                <House size={15} className="text-blue-600" />

                <p className="text-xs font-semibold text-gray-700">
                  {booking.room}
                </p>
              </div>

              <p className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                <MapPin size={11} />
                {booking.location}
              </p>

              <p className="mt-1 text-[10px] text-gray-400">
                Landlord: {booking.landlord}
              </p>
            </div>

            {/* Details */}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-400">Move In</p>

                <p className="mt-1 text-xs font-semibold text-gray-700">
                  {booking.moveInDate}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400">Amount</p>

                <p className="mt-1 text-xs font-bold text-gray-800">
                  ${booking.amount}
                </p>

                <PaymentStatus status={booking.payment} />
              </div>
            </div>

            {/* Actions */}

            <div className="mt-4 flex gap-2">
              <Link
                to={`/admin/bookings/${booking.id}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Eye size={15} />
                View
              </Link>

              {booking.status === "pending" && (
                <button
                  type="button"
                  onClick={() => updateStatus(booking.id, "confirmed")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 py-2.5 text-xs font-semibold text-green-600 hover:bg-green-100"
                >
                  <Check size={15} />
                  Confirm
                </button>
              )}

              {booking.status === "confirmed" && (
                <button
                  type="button"
                  onClick={() => updateStatus(booking.id, "completed")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                >
                  <CircleCheck size={15} />
                  Complete
                </button>
              )}

              {booking.status === "pending" && (
                <button
                  type="button"
                  onClick={() => updateStatus(booking.id, "cancelled")}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
                >
                  <Ban size={16} />
                </button>
              )}

              {booking.status === "completed" && (
                <button
                  type="button"
                  onClick={() => deleteBooking(booking.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================
          EMPTY STATE
      ======================================================= */}

      {filteredBookings.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <CalendarDays size={25} />
          </div>

          <h2 className="mt-4 text-sm font-bold text-gray-900">
            No bookings found
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
   BOOKING STAT
============================================================ */

function BookingStat({ label, value, icon, className }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs text-gray-500">{label}</p>

      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

/* ============================================================
   STATUS TAB
============================================================ */

function StatusTab({
  label,
  count,
  active,
  onClick,
  warning,
  success,
  purple,
  danger,
}) {
  let activeClass = "bg-blue-600 text-white";

  if (warning) {
    activeClass = "bg-yellow-500 text-white";
  }

  if (success) {
    activeClass = "bg-green-600 text-white";
  }

  if (purple) {
    activeClass = "bg-purple-600 text-white";
  }

  if (danger) {
    activeClass = "bg-red-500 text-white";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
        active ? activeClass : "text-gray-500 hover:bg-gray-50"
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
   SUMMARY BADGE
============================================================ */

function SummaryBadge({ icon, label, value, className }) {
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
   BOOKING STATUS
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
      icon: CircleCheck,
      className: "bg-purple-50 text-purple-600",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[9px] font-semibold ${current.className}`}
    >
      <Icon size={11} />
      {current.label}
    </span>
  );
}

/* ============================================================
   PAYMENT STATUS
============================================================ */

function PaymentStatus({ status }) {
  const config = {
    paid: {
      label: "Paid",
      className: "text-green-600",
    },

    pending: {
      label: "Payment pending",
      className: "text-yellow-600",
    },

    refunded: {
      label: "Refunded",
      className: "text-red-500",
    },
  };

  const current = config[status] || config.pending;

  return (
    <p className={`mt-1 text-[9px] font-medium ${current.className}`}>
      {current.label}
    </p>
  );
}

/* ============================================================
   BOOKING MENU
============================================================ */

function BookingMenu({ booking, onUpdateStatus, onUpdatePayment, onDelete }) {
  return (
    <div className="absolute right-0 top-10 z-30 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
      <Link
        to={`/admin/bookings/${booking.id}`}
        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50"
      >
        <Eye size={15} />
        View Booking
      </Link>

      {booking.status === "pending" && (
        <>
          <button
            type="button"
            onClick={() => onUpdateStatus(booking.id, "confirmed")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50"
          >
            <CheckCircle size={15} />
            Confirm Booking
          </button>

          <button
            type="button"
            onClick={() => onUpdateStatus(booking.id, "cancelled")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50"
          >
            <Ban size={15} />
            Cancel Booking
          </button>
        </>
      )}

      {booking.status === "confirmed" && (
        <>
          <button
            type="button"
            onClick={() => onUpdateStatus(booking.id, "completed")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-purple-600 hover:bg-purple-50"
          >
            <CircleCheck size={15} />
            Mark Completed
          </button>

          <button
            type="button"
            onClick={() => onUpdateStatus(booking.id, "cancelled")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50"
          >
            <Ban size={15} />
            Cancel Booking
          </button>
        </>
      )}

      {booking.payment === "pending" && (
        <button
          type="button"
          onClick={() => onUpdatePayment(booking.id, "paid")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50"
        >
          <Wallet size={15} />
          Mark Payment Paid
        </button>
      )}

      {booking.payment === "paid" && booking.status === "cancelled" && (
        <button
          type="button"
          onClick={() => onUpdatePayment(booking.id, "refunded")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-blue-600 hover:bg-blue-50"
        >
          <Wallet size={15} />
          Mark Refunded
        </button>
      )}

      <div className="my-1 border-t border-gray-100" />

      <button
        type="button"
        onClick={() => onDelete(booking.id)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50"
      >
        <Trash2 size={15} />
        Delete Booking
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
        <span className="font-semibold text-gray-700">{total}</span> bookings
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
