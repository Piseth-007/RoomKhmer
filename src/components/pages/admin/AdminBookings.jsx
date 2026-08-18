import { useEffect, useMemo, useState } from "react";

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
  CircleCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import { collection, getDocs } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../../firebase/config";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [status, setStatus] = useState("all");

  const [payment, setPayment] = useState("all");

  const [search, setSearch] = useState("");

  const [dateFilter, setDateFilter] = useState("all");

  const [page, setPage] = useState(1);

  const PAGE_SIZE = 10;


  useEffect(() => {
    let unsubscribe;

    const loadBookings = async (currentUser) => {
      try {
        setLoading(true);
        setError("");

        if (!currentUser) {
          setError("Please login as admin.");

          setLoading(false);
          return;
        }


        const snapshot = await getDocs(collection(db, "bookings"));

        const data = snapshot.docs.map((bookingDoc) => {
          const raw = bookingDoc.data();

          return normalizeBooking(bookingDoc.id, raw);
        });


        data.sort((a, b) => b.createdAtMs - a.createdAtMs);

        setBookings(data);
      } catch (err) {
        console.error("Admin bookings error:", err);

        setError(firebaseError(err, "Failed to load bookings."));
      } finally {
        setLoading(false);
      }
    };

    unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      loadBookings(currentUser);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);


  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase().trim();

    const now = new Date();

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.id.toLowerCase().includes(query) ||
        booking.tenant.toLowerCase().includes(query) ||
        booking.landlord.toLowerCase().includes(query) ||
        booking.room.toLowerCase().includes(query) ||
        booking.location.toLowerCase().includes(query);

      const matchesStatus = status === "all" || booking.status === status;

      const matchesPayment = payment === "all" || booking.payment === payment;

      const matchesDate = matchDateFilter(booking.createdAtMs, dateFilter, now);

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [bookings, search, status, payment, dateFilter]);


  const totalCount = bookings.length;

  const pendingCount = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;

  const activeCount = bookings.filter(
    (booking) => booking.status === "active",
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

  const paymentPendingCount = bookings.filter(
    (booking) => booking.payment === "pending",
  ).length;

  const totalRevenue = bookings
    .filter((booking) => booking.payment === "paid")
    .reduce((total, booking) => total + Number(booking.amount || 0), 0);


  const totalPages = Math.max(
    1,
    Math.ceil(filteredBookings.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );


  useEffect(() => {
    setPage(1);
  }, [search, status, payment, dateFilter]);


  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPayment("all");
    setDateFilter("all");
    setPage(1);
  };


  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500">Loading bookings...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays size={19} className="text-blue-600" />

            <span className="text-xs font-semibold text-blue-600">
              BOOKING MONITORING
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">ការកក់</h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor room bookings and payment activity
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-700">
          <ShieldCheck size={16} />
          Admin monitoring
        </div>
      </div>


      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-semibold text-red-700">Error</p>

            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}


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
          label="Paid Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<Wallet size={19} />}
          className="bg-emerald-50 text-emerald-600"
        />
      </div>


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
            type="warning"
          />

          <StatusTab
            label="Confirmed"
            count={confirmedCount}
            active={status === "confirmed"}
            onClick={() => setStatus("confirmed")}
            type="success"
          />

          <StatusTab
            label="Active"
            count={activeCount}
            active={status === "active"}
            onClick={() => setStatus("active")}
            type="success"
          />

          <StatusTab
            label="Completed"
            count={completedCount}
            active={status === "completed"}
            onClick={() => setStatus("completed")}
            type="purple"
          />

          <StatusTab
            label="Cancelled"
            count={cancelledCount}
            active={status === "cancelled"}
            onClick={() => setStatus("cancelled")}
            type="danger"
          />
        </div>
      </div>


      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
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

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-600 outline-none focus:border-blue-500"
          >
            <option value="all">All Dates</option>

            <option value="today">Today</option>

            <option value="week">This Week</option>

            <option value="month">This Month</option>
          </select>

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
          value={paymentPendingCount}
          className="bg-yellow-50 text-yellow-600"
        />

        <SummaryBadge
          icon={<Wallet size={14} />}
          label="Paid Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          className="bg-blue-50 text-blue-600"
        />
      </div>


      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <p className="text-xs font-medium text-blue-700">
          Payment status is managed by the landlord. This admin page is for
          monitoring bookings, payment status, and rental activity.
        </p>
      </div>


      <div className="hidden overflow-visible rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <TableHead>Booking</TableHead>

                <TableHead>Tenant</TableHead>

                <TableHead>Room</TableHead>

                <TableHead>Landlord</TableHead>

                <TableHead>Rental</TableHead>

                <TableHead>Amount</TableHead>

                <TableHead>Status</TableHead>

                <TableHead>Payment</TableHead>

                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {paginatedBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-5 py-4">
                    <p className="max-w-32.5 truncate text-xs font-bold text-gray-800">
                      {booking.id}
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      {booking.bookingDate}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <User size={14} />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-700">
                          {booking.tenant}
                        </p>

                        <p className="mt-1 max-w-30 truncate text-[9px] text-gray-400">
                          {booking.tenantEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="max-w-40 px-5 py-4">
                    <p className="truncate text-xs font-medium text-gray-700">
                      {booking.room}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-[9px] text-gray-400">
                      <MapPin size={10} />

                      {booking.location}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs text-gray-600">{booking.landlord}</p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-medium text-gray-700">
                      {booking.rentalMonths} month
                      {booking.rentalMonths > 1 ? "s" : ""}
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      {booking.startDate}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-gray-800">
                      $
                      {Number(
                        booking.totalRent || booking.amount || 0,
                      ).toLocaleString()}
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      ${Number(booking.monthlyRent || 0).toLocaleString()}
                      /month
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <BookingStatus status={booking.status} />
                  </td>

                  <td className="px-5 py-4">
                    <PaymentStatus status={booking.payment} />
                  </td>

                  <td className="px-5 py-4">
                    <Link
                      to={`/admin/bookings/${booking.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                      <Eye size={17} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TableFooter
          page={currentPage}
          totalPages={totalPages}
          count={paginatedBookings.length}
          total={filteredBookings.length}
          onPrevious={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>


      <div className="space-y-4 lg:hidden">
        {paginatedBookings.map((booking) => (
          <div
            key={booking.id}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="max-w-45 truncate text-xs font-bold text-gray-800">
                  {booking.id}
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  {booking.bookingDate}
                </p>
              </div>

              <BookingStatus status={booking.status} />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {booking.tenant}
                </p>

                <p className="text-[10px] text-gray-400">
                  {booking.tenantEmail}
                </p>
              </div>
            </div>

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

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-400">Rental</p>

                <p className="mt-1 text-xs font-semibold text-gray-700">
                  {booking.rentalMonths} month
                  {booking.rentalMonths > 1 ? "s" : ""}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400">Total</p>

                <p className="mt-1 text-xs font-bold text-gray-800">
                  $
                  {Number(
                    booking.totalRent || booking.amount || 0,
                  ).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 p-3">
              <div>
                <p className="text-[10px] text-gray-400">Payment</p>

                <PaymentStatus status={booking.payment} />
              </div>

              <Link
                to={`/admin/bookings/${booking.id}`}
                className="flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-600"
              >
                <Eye size={15} />
                View
              </Link>
            </div>
          </div>
        ))}
      </div>


      {paginatedBookings.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 lg:hidden">
          <p className="text-xs text-gray-400">
            Page{" "}
            <span className="font-semibold text-gray-700">{currentPage}</span>{" "}
            of <span className="font-semibold text-gray-700">{totalPages}</span>
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}


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


function normalizeBooking(id, raw) {
  const createdAtMs = getTimestampMs(raw.createdAt || raw.bookingDate);

  return {
    id,

    ...raw,

    tenant: raw.tenantName || raw.tenant || "Unknown Tenant",

    tenantEmail: raw.tenantEmail || raw.email || "",

    tenantPhone: raw.tenantPhone || raw.phone || "",

    landlord:
      raw.landlordName || raw.landlord || raw.ownerName || "Unknown Landlord",

    room: raw.roomName || raw.room || raw.roomTitle || "Unknown Room",

    location: raw.location || raw.address || "",

    monthlyRent: Number(raw.monthlyRent || raw.price || 0),

    rentalMonths: Number(raw.rentalMonths || raw.months || 1),

    totalRent: Number(raw.totalRent || raw.total || raw.amount || 0),

    amount: Number(raw.amount || raw.totalRent || raw.total || 0),

    status: normalizeBookingStatus(raw.status),

    payment: normalizePaymentStatus(raw.paymentStatus || raw.payment),

    startDate: formatDate(raw.startDate || raw.moveInDate),

    endDate: formatDate(raw.endDate),

    bookingDate: formatDate(raw.createdAt || raw.bookingDate),

    createdAtMs,
  };
}


function normalizeBookingStatus(status) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (value === "confirmed") {
    return "confirmed";
  }

  if (value === "active") {
    return "active";
  }

  if (value === "completed") {
    return "completed";
  }

  if (value === "cancelled") {
    return "cancelled";
  }

  return "pending";
}


function normalizePaymentStatus(status) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (value === "paid") {
    return "paid";
  }

  if (value === "refunded") {
    return "refunded";
  }

  return "pending";
}


function getTimestampMs(value) {
  if (!value) {
    return 0;
  }

  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}


function formatDate(value) {
  if (!value) {
    return "-";
  }

  const ms = getTimestampMs(value);

  if (!ms) {
    return "-";
  }

  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}


function matchDateFilter(timestamp, filter, now) {
  if (filter === "all") {
    return true;
  }

  if (!timestamp) {
    return false;
  }

  const date = new Date(timestamp);

  if (filter === "today") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }

  if (filter === "week") {
    const start = new Date(now);

    start.setDate(now.getDate() - now.getDay());

    start.setHours(0, 0, 0, 0);

    return date >= start;
  }

  if (filter === "month") {
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth()
    );
  }

  return true;
}


function firebaseError(error, fallback) {
  if (error?.code === "permission-denied") {
    return "Permission denied. Make sure you are logged in as an admin and your Firestore rules allow admin read access to bookings.";
  }

  if (error?.code === "failed-precondition") {
    return "Firestore could not complete this request because a required condition is missing.";
  }

  if (error?.code === "unavailable") {
    return "Firebase is temporarily unavailable. Please try again.";
  }

  return error?.message || fallback;
}


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


function StatusTab({ label, count, active, onClick, type }) {
  let activeClass = "bg-blue-600 text-white";

  if (type === "warning") {
    activeClass = "bg-yellow-500 text-white";
  }

  if (type === "success") {
    activeClass = "bg-green-600 text-white";
  }

  if (type === "purple") {
    activeClass = "bg-purple-600 text-white";
  }

  if (type === "danger") {
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

    active: {
      label: "Active",
      icon: CheckCircle,
      className: "bg-blue-50 text-blue-600",
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


function PaymentStatus({ status }) {
  const config = {
    paid: {
      label: "Paid",
      className: "bg-green-50 text-green-600",
    },

    pending: {
      label: "Payment Pending",
      className: "bg-yellow-50 text-yellow-600",
    },

    refunded: {
      label: "Refunded",
      className: "bg-red-50 text-red-500",
    },
  };

  const current = config[status] || config.pending;

  return (
    <span
      className={`mt-1 inline-flex rounded-full px-2 py-1 text-[9px] font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}


function TableHead({ children }) {
  return (
    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </th>
  );
}


function TableFooter({ page, totalPages, count, total, onPrevious, onNext }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-700">{count}</span> of{" "}
        <span className="font-semibold text-gray-700">{total}</span> bookings
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
