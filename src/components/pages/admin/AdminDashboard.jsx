import { useMemo, useState, useEffect } from "react";

import {
  Users,
  House,
  CalendarDays,
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowRight,
  UserPlus,
  Home,
  CalendarCheck,
  ShieldCheck,
  MoreHorizontal,
  MapPin,
} from "lucide-react";

import { Link } from "react-router-dom";

import { collection, getDocs } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../../firebase/config";

export default function AdminDashboard() {
  const [period, setPeriod] = useState("6months");

  const [users, setUsers] = useState([]);

  const [rooms, setRooms] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribe;

    const loadDashboard = async (currentUser) => {
      try {
        setLoading(true);
        setError("");

        if (!currentUser) {
          setError("Please login first.");
          setLoading(false);
          return;
        }

        /*
         * =====================================================
         * USERS
         * =====================================================
         */

        const usersSnapshot = await getDocs(collection(db, "users"));

        const usersData = usersSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setUsers(usersData);

        /*
         * =====================================================
         * ROOMS
         * =====================================================
         */

        const roomsSnapshot = await getDocs(collection(db, "rooms"));

        const roomsData = roomsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setRooms(roomsData);

        /*
         * =====================================================
         * BOOKINGS
         * =====================================================
         */

        const bookingsSnapshot = await getDocs(collection(db, "bookings"));

        const bookingsData = bookingsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setBookings(bookingsData);

        /*
         * =====================================================
         * PAYMENTS
         *
         * This is the important fix.
         *
         * Revenue comes from payments, not bookings.
         * =====================================================
         */

        const paymentsSnapshot = await getDocs(collection(db, "payments"));

        const paymentsData = paymentsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setPayments(paymentsData);
      } catch (err) {
        console.error("Admin Dashboard Firebase error:", err);

        setError(
          err.code
            ? `${err.code}: ${err.message}`
            : err.message || "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      loadDashboard(currentUser);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  /*
   * ============================================================
   * USER STATISTICS
   * ============================================================
   */

  const totalUsers = users.length;

  const totalLandlords = users.filter(
    (user) => user.role === "landlord" || user.role === "owner",
  ).length;

  const totalTenants = users.filter(
    (user) => user.role === "tenant" || user.role === "student",
  ).length;

  /*
   * ============================================================
   * ROOM STATISTICS
   * ============================================================
   */

  const totalRooms = rooms.length;

  const pendingRooms = rooms.filter((room) => room.status === "pending").length;

  const activeRooms = rooms.filter(
    (room) => room.status === "approved" || room.status === "active",
  ).length;

  /*
   * ============================================================
   * BOOKING STATISTICS
   * ============================================================
   */

  const totalBookings = bookings.length;

  const successfulBookings = bookings.filter(
    (booking) =>
      booking.status === "confirmed" ||
      booking.status === "active" ||
      booking.status === "completed",
  );

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  /*
   * ============================================================
   * PAYMENT STATISTICS
   *
   * Only status === "paid" counts as revenue.
   * ============================================================
   */

  const paidPayments = payments.filter((payment) => payment.status === "paid");

  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending",
  );

  const totalRevenue = paidPayments.reduce(
    (total, payment) => total + getPaymentAmount(payment),
    0,
  );

  const pendingRevenue = pendingPayments.reduce(
    (total, payment) => total + getPaymentAmount(payment),
    0,
  );

  /*
   * ============================================================
   * MONTHLY DATA
   *
   * Uses payment date.
   * ============================================================
   */

  const monthlyData = useMemo(() => {
    const now = new Date();

    const months = [];

    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      months.push({
        month: date.toLocaleString("en-US", {
          month: "short",
        }),

        year: date.getFullYear(),

        monthIndex: date.getMonth(),

        revenue: 0,

        payments: 0,
      });
    }

    paidPayments.forEach((payment) => {
      const date = getDate(
        payment.paidAt || payment.updatedAt || payment.createdAt,
      );

      if (!date) {
        return;
      }

      const month = months.find(
        (item) =>
          item.year === date.getFullYear() &&
          item.monthIndex === date.getMonth(),
      );

      if (!month) {
        return;
      }

      month.payments += 1;

      month.revenue += getPaymentAmount(payment);
    });

    return months;
  }, [paidPayments]);

  /*
   * ============================================================
   * CHART
   * ============================================================
   */

  const chartData = useMemo(() => {
    if (period === "3months") {
      return monthlyData.slice(-3);
    }

    if (period === "6months") {
      return monthlyData.slice(-6);
    }

    return monthlyData;
  }, [period, monthlyData]);

  const maxRevenue = Math.max(...chartData.map((item) => item.revenue), 1);

  /*
   * ============================================================
   * PENDING ROOMS
   * ============================================================
   */

  const pendingRoomsData = useMemo(() => {
    return rooms
      .filter((room) => room.status === "pending")
      .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
      .slice(0, 3)
      .map((room) => ({
        id: room.id,

        name: room.name || room.title || "Untitled Room",

        landlord:
          room.landlordName ||
          room.ownerName ||
          room.landlord ||
          "Unknown Landlord",

        location: room.location || room.address || "Unknown Location",

        price: Number(room.price || room.monthlyRent || 0),

        submitted: formatRelativeTime(room.createdAt),
      }));
  }, [rooms]);

  /*
   * ============================================================
   * RECENT BOOKINGS
   * ============================================================
   */

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
      .slice(0, 5)
      .map((booking) => ({
        id: booking.id,

        tenant: booking.tenantName || booking.tenant || "Unknown Tenant",

        room: booking.roomName || booking.room || "Unknown Room",

        landlord:
          booking.landlordName ||
          booking.ownerName ||
          booking.landlord ||
          "Unknown Landlord",

        amount: Number(
          booking.monthlyRent ||
            booking.amount ||
            booking.price ||
            booking.total ||
            0,
        ),

        status: booking.status || "pending",

        date: formatDate(booking.createdAt),
      }));
  }, [bookings]);

  /*
   * ============================================================
   * RECENT ACTIVITIES
   * ============================================================
   */

  const activities = useMemo(() => {
    const result = [];

    /*
     * USERS
     */

    users
      .filter((user) => user.createdAt)
      .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
      .slice(0, 2)
      .forEach((user) => {
        result.push({
          id: `user-${user.id}`,

          type: "user",

          title:
            user.role === "landlord" || user.role === "owner"
              ? "New landlord registered"
              : "New tenant registered",

          description: `${
            user.name || user.email || "New user"
          } created an account`,

          time: formatRelativeTime(user.createdAt),

          timestamp: getTimestamp(user.createdAt),
        });
      });

    /*
     * ROOMS
     */

    rooms
      .filter((room) => room.createdAt)
      .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
      .slice(0, 2)
      .forEach((room) => {
        result.push({
          id: `room-${room.id}`,

          type: "room",

          title: "New room submitted",

          description: `${room.name || room.title || "Room"} needs approval`,

          time: formatRelativeTime(room.createdAt),

          timestamp: getTimestamp(room.createdAt),
        });
      });

    /*
     * BOOKINGS
     */

    bookings
      .filter((booking) => booking.createdAt)
      .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
      .slice(0, 2)
      .forEach((booking) => {
        result.push({
          id: `booking-${booking.id}`,

          type: "booking",

          title: "New booking received",

          description: `Booking #${booking.id} was created`,

          time: formatRelativeTime(booking.createdAt),

          timestamp: getTimestamp(booking.createdAt),
        });
      });

    /*
     * PAYMENTS
     */

    paidPayments
      .filter(
        (payment) => payment.paidAt || payment.updatedAt || payment.createdAt,
      )
      .sort(
        (a, b) =>
          getTimestamp(b.paidAt || b.updatedAt || b.createdAt) -
          getTimestamp(a.paidAt || a.updatedAt || a.createdAt),
      )
      .slice(0, 2)
      .forEach((payment) => {
        const paymentDate =
          payment.paidAt || payment.updatedAt || payment.createdAt;

        result.push({
          id: `payment-${payment.id}`,

          type: "payment",

          title: "Payment received",

          description: `$${getPaymentAmount(
            payment,
          ).toLocaleString()} payment marked as paid`,

          time: formatRelativeTime(paymentDate),

          timestamp: getTimestamp(paymentDate),
        });
      });

    return result.sort((a, b) => b.timestamp - a.timestamp).slice(0, 6);
  }, [users, rooms, bookings, paidPayments]);

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

          <p className="mt-4 text-sm text-gray-500">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-semibold text-red-700">Firebase Error</p>

            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            ផ្ទាំងគ្រប់គ្រង
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-gray-400 sm:block">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>

          <Link
            to="/admin/rooms?status=pending"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <AlertCircle size={16} />

            <span className="hidden sm:inline">Review Rooms</span>

            <span className="sm:hidden">Review</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <AdminStat
          title="Total Users"
          value={totalUsers.toLocaleString()}
          description="Registered users"
          icon={<Users size={21} />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <AdminStat
          title="Total Rooms"
          value={totalRooms.toLocaleString()}
          description="All rooms"
          icon={<House size={21} />}
          iconClass="bg-purple-50 text-purple-600"
        />

        <AdminStat
          title="Total Bookings"
          value={totalBookings.toLocaleString()}
          description={`${pendingBookings} pending`}
          icon={<CalendarDays size={21} />}
          iconClass="bg-green-50 text-green-600"
        />

        <AdminStat
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          description="Actual paid payments"
          icon={<Wallet size={21} />}
          iconClass="bg-yellow-50 text-yellow-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MiniStat
          icon={<ShieldCheck size={18} />}
          label="Landlords"
          value={totalLandlords}
          description="Registered landlords"
          className="bg-blue-50 text-blue-600"
        />

        <MiniStat
          icon={<Clock size={18} />}
          label="Pending Rooms"
          value={pendingRooms}
          description="Need your approval"
          className="bg-yellow-50 text-yellow-600"
          urgent
        />

        <MiniStat
          icon={<CheckCircle size={18} />}
          label="Active Rooms"
          value={activeRooms}
          description="Currently published"
          className="bg-green-50 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Revenue Overview
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Revenue from actual paid payments
              </p>
            </div>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-fit rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 outline-none focus:border-blue-500"
            >
              <option value="3months">Last 3 months</option>

              <option value="6months">Last 6 months</option>

              <option value="12months">Last 12 months</option>
            </select>
          </div>

          <div className="mt-8">
            <div className="flex h-64 items-end gap-3 sm:gap-6">
              {chartData.map((item) => {
                const height =
                  item.revenue === 0 ? 2 : (item.revenue / maxRevenue) * 100;

                return (
                  <div
                    key={`${item.year}-${item.monthIndex}`}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-[9px] font-semibold text-gray-500 sm:text-[10px]">
                      ${item.revenue.toLocaleString()}
                    </span>

                    <div
                      className="w-full max-w-12 rounded-t-xl bg-blue-500 transition-all duration-300 hover:bg-blue-600"
                      style={{
                        height: `${height}%`,
                        minHeight: "8px",
                      }}
                    />

                    <span className="text-[10px] text-gray-400">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs text-gray-400">Paid Revenue</p>

              <p className="mt-1 text-lg font-bold text-green-600">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Pending Payments</p>

              <p className="mt-1 text-lg font-bold text-yellow-600">
                ${pendingRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Platform Overview
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Current platform status
              </p>
            </div>

            <MoreHorizontal size={20} className="text-gray-400" />
          </div>

          <div className="mt-6 space-y-5">
            <OverviewRow
              icon={<Users size={17} />}
              label="Tenants"
              value={totalTenants}
              percentage={
                totalUsers > 0
                  ? Math.round((totalTenants / totalUsers) * 100)
                  : 0
              }
              className="bg-blue-50 text-blue-600"
            />

            <OverviewRow
              icon={<ShieldCheck size={17} />}
              label="Landlords"
              value={totalLandlords}
              percentage={
                totalUsers > 0
                  ? Math.round((totalLandlords / totalUsers) * 100)
                  : 0
              }
              className="bg-purple-50 text-purple-600"
            />

            <OverviewRow
              icon={<House size={17} />}
              label="Published Rooms"
              value={activeRooms}
              percentage={
                totalRooms > 0
                  ? Math.round((activeRooms / totalRooms) * 100)
                  : 0
              }
              className="bg-green-50 text-green-600"
            />

            <OverviewRow
              icon={<CalendarCheck size={17} />}
              label="Successful Bookings"
              value={successfulBookings.length}
              percentage={
                totalBookings > 0
                  ? Math.round(
                      (successfulBookings.length / totalBookings) * 100,
                    )
                  : 0
              }
              className="bg-yellow-50 text-yellow-600"
            />
          </div>

          <Link
            to="/admin/reports"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gray-50 py-3 text-xs font-semibold text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
          >
            View Full Reports
            <ArrowRight size={14} />
          </Link>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                Pending Room Approvals
              </h2>

              <span className="rounded-full bg-yellow-50 px-2 py-1 text-[10px] font-bold text-yellow-600">
                {pendingRooms}
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-400">
              Rooms waiting for administrator approval
            </p>
          </div>

          <Link
            to="/admin/rooms?status=pending"
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
          {pendingRoomsData.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400 md:col-span-3">
              No pending rooms.
            </div>
          ) : (
            pendingRoomsData.map((room) => (
              <div
                key={room.id}
                className="p-5 transition hover:bg-gray-50 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Home size={19} />
                  </div>

                  <span className="rounded-full bg-yellow-50 px-2 py-1 text-[9px] font-semibold text-yellow-600">
                    Pending
                  </span>
                </div>

                <h3 className="mt-4 truncate text-sm font-bold text-gray-900">
                  {room.name}
                </h3>

                <p className="mt-1 text-xs text-gray-500">{room.landlord}</p>

                <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-400">
                  <MapPin size={12} />
                  {room.location}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">
                    ${room.price.toLocaleString()}
                    <span className="text-[10px] font-normal text-gray-400">
                      /month
                    </span>
                  </p>

                  <span className="text-[10px] text-gray-400">
                    {room.submitted}
                  </span>
                </div>

                <Link
                  to={`/admin/rooms/${room.id}`}
                  className="mt-4 flex items-center justify-center rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  Review Room
                </Link>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm xl:col-span-3">
          <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Bookings
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Latest booking activity
              </p>
            </div>

            <Link
              to="/admin/bookings"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600"
            >
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="hidden overflow-x-auto md:block">
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
                    Amount
                  </th>

                  <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-5 py-10 text-center text-sm text-gray-400"
                    >
                      No bookings yet.
                    </td>
                  </tr>
                ) : (
                  recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                    >
                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-gray-800">
                          {booking.id}
                        </p>

                        <p className="mt-1 text-[9px] text-gray-400">
                          {booking.date}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-medium text-gray-700">
                          {booking.tenant}
                        </p>
                      </td>

                      <td className="max-w-37.5 px-5 py-4">
                        <p className="truncate text-xs text-gray-600">
                          {booking.room}
                        </p>

                        <p className="mt-1 truncate text-[9px] text-gray-400">
                          {booking.landlord}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-bold text-gray-800">
                          ${booking.amount.toLocaleString()}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <BookingStatus status={booking.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-xl border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      {booking.id}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      {booking.date}
                    </p>
                  </div>

                  <BookingStatus status={booking.status} />
                </div>

                <div className="mt-3">
                  <p className="text-sm font-semibold text-gray-800">
                    {booking.tenant}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">{booking.room}</p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-400">
                    {booking.landlord}
                  </span>

                  <span className="text-sm font-bold text-gray-900">
                    ${booking.amount.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Latest platform events
              </p>
            </div>

            <MoreHorizontal size={19} className="text-gray-400" />
          </div>

          <div className="mt-6">
            {activities.length === 0 ? (
              <p className="text-center text-sm text-gray-400">
                No recent activity.
              </p>
            ) : (
              activities.map((activity, index) => (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  last={index === activities.length - 1}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/*
 * ============================================================
 * PAYMENT AMOUNT
 * ============================================================
 */

function getPaymentAmount(payment) {
  return Number(
    payment.amount ??
      payment.monthlyRent ??
      payment.total ??
      payment.totalRent ??
      0,
  );
}

/*
 * ============================================================
 * FIREBASE TIMESTAMP
 * ============================================================
 */

function getTimestamp(value) {
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

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const timestamp = new Date(value).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  return 0;
}

/*
 * ============================================================
 * FIREBASE DATE
 * ============================================================
 */

function getDate(value) {
  const timestamp = getTimestamp(value);

  if (!timestamp) {
    return null;
  }

  return new Date(timestamp);
}

/*
 * ============================================================
 * FORMAT DATE
 * ============================================================
 */

function formatDate(value) {
  const date = getDate(value);

  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/*
 * ============================================================
 * RELATIVE TIME
 * ============================================================
 */

function formatRelativeTime(value) {
  const timestamp = getTimestamp(value);

  if (!timestamp) {
    return "-";
  }

  const difference = Date.now() - timestamp;

  if (difference < 60 * 1000) {
    return "Just now";
  }

  const minutes = Math.floor(difference / (60 * 1000));

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return formatDate(value);
}

/*
 * ============================================================
 * ADMIN STAT
 * ============================================================
 */

function AdminStat({ title, value, description, icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-gray-500 sm:text-sm">{title}</p>

      <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
        {value}
      </p>

      <p className="mt-2 text-[10px] text-gray-400">{description}</p>
    </div>
  );
}

/*
 * ============================================================
 * MINI STAT
 * ============================================================
 */

function MiniStat({ icon, label, value, description, className, urgent }) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 shadow-sm sm:p-5 ${
        urgent ? "border-yellow-100" : "border-gray-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-500">{label}</p>

          <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-gray-400">{description}</p>
    </div>
  );
}

/*
 * ============================================================
 * OVERVIEW ROW
 * ============================================================
 */

function OverviewRow({ icon, label, value, percentage, className }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${className}`}
          >
            {icon}
          </div>

          <span className="text-xs font-medium text-gray-600">{label}</span>
        </div>

        <span className="text-xs font-bold text-gray-800">{value}</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-blue-500"
          style={{
            width: `${Math.min(Math.max(percentage, 0), 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

/*
 * ============================================================
 * BOOKING STATUS
 * ============================================================
 */

function BookingStatus({ status }) {
  const config = {
    confirmed: {
      label: "Confirmed",
      icon: CheckCircle,
      className: "bg-green-50 text-green-600",
    },

    active: {
      label: "Active",
      icon: CheckCircle,
      className: "bg-green-50 text-green-600",
    },

    completed: {
      label: "Completed",
      icon: CheckCircle,
      className: "bg-purple-50 text-purple-600",
    },

    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-yellow-50 text-yellow-600",
    },

    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      className: "bg-red-50 text-red-500",
    },

    rejected: {
      label: "Rejected",
      icon: XCircle,
      className: "bg-red-50 text-red-500",
    },
  };

  const current = config[status] || config.pending;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${current.className}`}
    >
      <Icon size={10} />

      {current.label}
    </span>
  );
}

/*
 * ============================================================
 * ACTIVITY ITEM
 * ============================================================
 */

function ActivityItem({ activity, last }) {
  const iconConfig = {
    room: {
      icon: <House size={15} />,
      className: "bg-blue-50 text-blue-600",
    },

    user: {
      icon: <UserPlus size={15} />,
      className: "bg-purple-50 text-purple-600",
    },

    booking: {
      icon: <CalendarCheck size={15} />,
      className: "bg-green-50 text-green-600",
    },

    payment: {
      icon: <Wallet size={15} />,
      className: "bg-yellow-50 text-yellow-600",
    },
  };

  const current = iconConfig[activity.type] || iconConfig.user;

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${current.className}`}
        >
          {current.icon}
        </div>

        {!last && <div className="my-1 w-px flex-1 bg-gray-100" />}
      </div>

      <div className="min-w-0 flex-1 pb-5">
        <p className="text-xs font-semibold text-gray-800">{activity.title}</p>

        <p className="mt-1 text-[11px] leading-5 text-gray-500">
          {activity.description}
        </p>

        <p className="mt-1 text-[10px] text-gray-400">{activity.time}</p>
      </div>
    </div>
  );
}
