import { useEffect, useMemo, useState } from "react";

import {
  House,
  CalendarDays,
  Wallet,
  Users,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  CircleCheck,
  AlertCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import { collection, getDocs, query, where } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../../firebase/config";

export default function LandlordDashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribe;

    const loadDashboard = async (user) => {
      try {
        setLoading(true);
        setError("");

        if (!user) {
          setError("Please login as a landlord.");
          setLoading(false);
          return;
        }

        const landlordId = user.uid;

        const roomsQuery = query(
          collection(db, "rooms"),
          where("landlordId", "==", landlordId),
        );

        const roomsSnapshot = await getDocs(roomsQuery);

        const landlordRooms = roomsSnapshot.docs.map((roomDoc) => {
          const data = roomDoc.data();

          return {
            id: roomDoc.id,
            ...data,
            name:
              data.name || data.title || data.englishTitle || "Untitled Room",
            location: data.location || data.address || "Unknown Location",
            price: Number(data.price || data.monthlyRent || 0),
            images: Array.isArray(data.images) ? data.images : [],
            status: data.status || "pending",
            landlordId: data.landlordId || "",
          };
        });

        setRooms(landlordRooms);

        const bookingsQuery = query(
          collection(db, "bookings"),
          where("landlordId", "==", landlordId),
        );

        const bookingsSnapshot = await getDocs(bookingsQuery);

        const landlordBookings = bookingsSnapshot.docs.map((bookingDoc) => {
          const data = bookingDoc.data();

          return {
            id: bookingDoc.id,
            ...data,

            tenant:
              data.tenantName ||
              data.tenant ||
              data.userName ||
              data.name ||
              "Unknown Tenant",

            tenantId: data.tenantId || "",

            tenantEmail: data.tenantEmail || data.email || "",

            tenantPhone: data.tenantPhone || data.phone || "",

            room:
              data.roomName || data.room || data.roomTitle || "Unknown Room",

            roomId: data.roomId || "",

            landlordId: data.landlordId || "",

            location: data.location || data.roomLocation || "",

            monthlyRent: Number(
              data.monthlyRent || data.price || data.amount || 0,
            ),

            rentalMonths: Number(data.rentalMonths || 1),

            totalRent: Number(data.totalRent || data.total || 0),

            status: data.status || "pending",

            date: data.createdAt || data.bookingDate || data.date || null,

            moveInDate: data.moveInDate || data.startDate || "",

            endDate: data.endDate || "",
          };
        });

        setBookings(landlordBookings);

        const paymentsQuery = query(
          collection(db, "payments"),
          where("landlordId", "==", landlordId),
        );

        const paymentsSnapshot = await getDocs(paymentsQuery);

        const landlordPayments = paymentsSnapshot.docs.map((paymentDoc) => {
          const data = paymentDoc.data();

          return {
            id: paymentDoc.id,
            ...data,

            amount: Number(data.amount || 0),

            status: data.status || "pending",

            periodNumber: Number(data.periodNumber || 1),

            tenantId: data.tenantId || "",

            bookingId: data.bookingId || "",

            roomId: data.roomId || "",

            landlordId: data.landlordId || "",
          };
        });

        setPayments(landlordPayments);
      } catch (err) {
        console.error("Dashboard Firebase error:", err);

        setError(
          err.code
            ? `${err.code}: ${err.message}`
            : err.message || "Failed to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    unsubscribe = onAuthStateChanged(auth, (user) => {
      loadDashboard(user);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const totalRooms = rooms.length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "rented" || room.status === "occupied",
  ).length;

  const availableRooms = rooms.filter(
    (room) => room.status === "available" || room.status === "approved",
  ).length;

  const pendingRooms = rooms.filter((room) => room.status === "pending").length;

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending",
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "active",
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status === "completed",
  ).length;

  const paidPayments = payments.filter((payment) => payment.status === "paid");

  const pendingPayments = payments.filter(
    (payment) => payment.status === "pending",
  );

  const totalEarnings = paidPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0,
  );

  const pendingPaymentAmount = pendingPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0,
  );

  const paidPaymentCount = paidPayments.length;

  const pendingPaymentCount = pendingPayments.length;

  const currentMonthEarnings = useMemo(() => {
    const now = new Date();

    const currentYear = now.getFullYear();

    const currentMonth = now.getMonth();

    return paidPayments
      .filter((payment) => {
        const paidDate = getDate(payment.paidAt);

        if (!paidDate) {
          return true;
        }

        return (
          paidDate.getFullYear() === currentYear &&
          paidDate.getMonth() === currentMonth
        );
      })
      .reduce((total, payment) => total + Number(payment.amount || 0), 0);
  }, [paidPayments]);

  const tenants = useMemo(() => {
    const unique = new Set();

    bookings.forEach((booking) => {
      const key = booking.tenantId || booking.tenantEmail || booking.tenant;

      if (key) {
        unique.add(key);
      }
    });

    return unique.size;
  }, [bookings]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => {
        return getTime(b.date) - getTime(a.date);
      })
      .slice(0, 5);
  }, [bookings]);

  const stats = [
    {
      title: "បន្ទប់របស់ខ្ញុំ",
      english: "My Rooms",
      value: totalRooms,
      description: `${occupiedRooms} occupied`,
      icon: House,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "ការកក់",
      english: "Bookings",
      value: totalBookings,
      description: `${pendingBookings} pending`,
      icon: CalendarDays,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "ចំណូលខែនេះ",
      english: "Monthly Earnings",
      value: `$${currentMonthEarnings.toLocaleString()}`,
      description: `$${totalEarnings.toLocaleString()} total paid`,
      icon: Wallet,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "អ្នកជួល",
      english: "Tenants",
      value: tenants,
      description: "Unique tenants",
      icon: Users,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500">
            Loading landlord dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-semibold text-red-700">
              Dashboard Error
            </p>

            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">សួស្តី Piseth</h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your rooms.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
              >
                <Icon size={21} />
              </div>

              <p className="mt-5 text-sm text-gray-500">{stat.title}</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-1">
                <span className="text-xs text-gray-400">{stat.english}</span>

                <span className="text-xs text-gray-300">•</span>

                <span className="text-xs text-gray-400">
                  {stat.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <PaymentSummary
          title="Total Earnings"
          value={`$${totalEarnings.toLocaleString()}`}
          description="All paid payments"
          icon={<Wallet size={18} />}
          className="bg-green-50 text-green-600"
        />

        <PaymentSummary
          title="Pending Payments"
          value={`$${pendingPaymentAmount.toLocaleString()}`}
          description={`${pendingPaymentCount} payment(s) pending`}
          icon={<Clock size={18} />}
          className="bg-yellow-50 text-yellow-600"
        />

        <PaymentSummary
          title="Paid Payments"
          value={paidPaymentCount}
          description={`${completedBookings} completed booking(s)`}
          icon={<CheckCircle size={18} />}
          className="bg-blue-50 text-blue-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">ចំណូល</h2>

              <p className="mt-1 text-xs text-gray-400">Earnings Overview</p>
            </div>

            <Link
              to="/landlord/earnings"
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View Earnings
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-xs text-green-600">Total Paid</p>

              <p className="mt-1 text-xl font-bold text-green-700">
                ${totalEarnings.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-4">
              <p className="text-xs text-yellow-600">Pending</p>

              <p className="mt-1 text-xl font-bold text-yellow-700">
                ${pendingPaymentAmount.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex h-56 items-end gap-3 sm:gap-5">
              {[
                {
                  month: "Mar",
                  value: 0,
                },
                {
                  month: "Apr",
                  value: 0,
                },
                {
                  month: "May",
                  value: 0,
                },
                {
                  month: "Jun",
                  value: 0,
                },
                {
                  month: "Jul",
                  value: 0,
                },
                {
                  month: "Aug",
                  value: currentMonthEarnings,
                },
              ].map((item) => {
                const max = Math.max(currentMonthEarnings, 1);

                const height =
                  item.value > 0 ? Math.max(12, (item.value / max) * 80) : 5;

                return (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-[10px] font-medium text-gray-500">
                      {item.value > 0
                        ? `$${item.value.toLocaleString()}`
                        : "$0"}
                    </span>

                    <div
                      className="w-full max-w-12 rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                      style={{
                        height: `${height}%`,
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
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>

          <p className="mt-1 text-xs text-gray-400">
            Manage your rental business
          </p>

          <div className="mt-5 space-y-3">
            <QuickAction
              to="/landlord/rooms/create"
              icon={<Plus size={18} />}
              title="បន្ថែមបន្ទប់"
              subtitle="Add a new room"
            />

            <QuickAction
              to="/landlord/rooms"
              icon={<House size={18} />}
              title="បន្ទប់របស់ខ្ញុំ"
              subtitle="Manage your rooms"
            />

            <QuickAction
              to="/landlord/bookings"
              icon={<CalendarDays size={18} />}
              title="ការកក់"
              subtitle="Manage booking requests"
            />

            <QuickAction
              to="/landlord/earnings"
              icon={<Wallet size={18} />}
              title="ចំណូល"
              subtitle="View your earnings"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">ការកក់ថ្មីៗ</h2>

            <p className="mt-1 text-xs text-gray-400">Recent bookings</p>
          </div>

          <Link
            to="/landlord/bookings"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Booking ID
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Tenant
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Room
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Date
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Monthly Rent
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-800">
                      {booking.id}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-700">{booking.tenant}</p>

                      {booking.tenantEmail && (
                        <p className="mt-1 text-[10px] text-gray-400">
                          {booking.tenantEmail}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-700">{booking.room}</p>

                      {booking.location && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                          <MapPin size={12} />
                          {booking.location}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(booking.date)}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-800">
                      ${Number(booking.monthlyRent || 0).toLocaleString()}
                    </span>

                    <span className="ml-1 text-[10px] text-gray-400">
                      /month
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <BookingStatus status={booking.status} />
                  </td>
                </tr>
              ))}

              {recentBookings.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-sm text-gray-400"
                  >
                    No bookings yet.
                  </td>
                </tr>
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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {booking.tenant}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">{booking.room}</p>
                </div>

                <BookingStatus status={booking.status} />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <CalendarDays size={13} />
                  {formatDate(booking.date)}
                </div>

                <span className="text-sm font-bold text-gray-800">
                  ${Number(booking.monthlyRent || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {recentBookings.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-400">
              No bookings yet.
            </p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">បន្ទប់របស់ខ្ញុំ</h2>

            <p className="mt-1 text-xs text-gray-400">My Rooms</p>
          </div>

          <Link
            to="/landlord/rooms"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </Link>
        </div>

        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
            {rooms.slice(0, 3).map((room) => (
              <div key={room.id} className="p-5 transition hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <House size={19} />
                  </div>

                  <RoomStatus status={room.status} />
                </div>

                <h3 className="mt-4 text-sm font-bold text-gray-900">
                  {room.name}
                </h3>

                <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={13} />
                  {room.location}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">
                    ${room.price.toLocaleString()}
                    <span className="text-xs font-normal text-gray-400">
                      /month
                    </span>
                  </p>

                  <Link
                    to={`/landlord/rooms/${room.id}/edit`}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <House size={30} className="mx-auto text-gray-300" />

            <p className="mt-3 text-sm text-gray-500">
              You don't have any rooms yet.
            </p>

            <Link
              to="/landlord/rooms/create"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
            >
              <Plus size={16} />
              Add your first room
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentSummary({ title, value, description, icon, className }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
        >
          {icon}
        </div>

        <div>
          <p className="text-xs text-gray-400">{title}</p>

          <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
        </div>
      </div>

      <p className="mt-3 text-[10px] text-gray-400">{description}</p>
    </div>
  );
}

function QuickAction({ to, icon, title, subtitle }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition hover:border-blue-100 hover:bg-blue-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800">{title}</p>

        <p className="truncate text-[11px] text-gray-400">{subtitle}</p>
      </div>

      <ArrowUpRight
        size={16}
        className="text-gray-300 transition group-hover:text-blue-500"
      />
    </Link>
  );
}

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

    completed: {
      label: "Completed",
      icon: CircleCheck,
      className: "bg-purple-50 text-purple-600",
    },
  };

  const current = config[status] || config.pending;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${current.className}`}
    >
      <Icon size={13} />
      {current.label}
    </span>
  );
}

function RoomStatus({ status }) {
  const config = {
    rented: {
      label: "Rented",
      className: "bg-green-50 text-green-600",
    },

    occupied: {
      label: "Occupied",
      className: "bg-green-50 text-green-600",
    },

    available: {
      label: "Available",
      className: "bg-blue-50 text-blue-600",
    },

    approved: {
      label: "Available",
      className: "bg-blue-50 text-blue-600",
    },

    pending: {
      label: "Pending",
      className: "bg-yellow-50 text-yellow-600",
    },

    rejected: {
      label: "Rejected",
      className: "bg-red-50 text-red-500",
    },
  };

  const current = config[status] || config.pending;

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}

function getDate(value) {
  if (!value) {
    return null;
  }

  if (value?.toDate) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function getTime(value) {
  if (!value) {
    return 0;
  }

  if (value?.toMillis) {
    return value.toMillis();
  }

  if (value?.toDate) {
    return value.toDate().getTime();
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === "string") {
    const time = new Date(value).getTime();

    return Number.isNaN(time) ? 0 : time;
  }

  return 0;
}

function formatDate(value) {
  const date = getDate(value);

  if (!date) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
