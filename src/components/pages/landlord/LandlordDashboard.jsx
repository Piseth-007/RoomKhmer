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
  MoreHorizontal,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandlordDashboard() {
  // ============================================================
  // TEMPORARY DASHBOARD DATA
  // Later this will come from your Laravel API
  // ============================================================

  const stats = [
    {
      title: "បន្ទប់របស់ខ្ញុំ",
      english: "My Rooms",
      value: "12",
      description: "8 occupied",
      icon: House,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "ការកក់",
      english: "Bookings",
      value: "24",
      description: "3 pending",
      icon: CalendarDays,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "ចំណូលខែនេះ",
      english: "Monthly Earnings",
      value: "$2,450",
      description: "+12.5% this month",
      icon: Wallet,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "អ្នកជួល",
      english: "Tenants",
      value: "18",
      description: "2 new tenants",
      icon: Users,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  // ============================================================
  // RECENT BOOKINGS
  // ============================================================

  const recentBookings = [
    {
      id: "BK-00125",
      tenant: "Sokha Chan",
      room: "Modern Private Room",
      location: "Toul Kork",
      date: "Aug 12, 2026",
      amount: "$180",
      status: "pending",
    },
    {
      id: "BK-00124",
      tenant: "Dara Kim",
      room: "Cozy Student Room",
      location: "Sen Sok",
      date: "Aug 11, 2026",
      amount: "$150",
      status: "confirmed",
    },
    {
      id: "BK-00123",
      tenant: "Vanna Lim",
      room: "Single Room",
      location: "Mean Chey",
      date: "Aug 10, 2026",
      amount: "$130",
      status: "confirmed",
    },
    {
      id: "BK-00122",
      tenant: "Sreypov Sok",
      room: "Modern Studio",
      location: "BKK1",
      date: "Aug 09, 2026",
      amount: "$250",
      status: "cancelled",
    },
  ];

  // ============================================================
  // ROOM DATA
  // ============================================================

  const rooms = [
    {
      id: 1,
      name: "Modern Private Room",
      location: "Toul Kork, Phnom Penh",
      price: 180,
      status: "rented",
    },
    {
      id: 2,
      name: "Cozy Student Room",
      location: "Sen Sok, Phnom Penh",
      price: 150,
      status: "available",
    },
    {
      id: 3,
      name: "Modern Studio",
      location: "BKK1, Phnom Penh",
      price: 250,
      status: "pending",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ========================================================
          WELCOME HEADER
      ========================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">សួស្តី Piseth</h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back! Here's what's happening with your rooms.
          </p>
        </div>

      </div>

      {/* ========================================================
          STATISTICS
      ========================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                >
                  <Icon size={21} />
                </div>

                <button
                  type="button"
                  className="text-gray-400 transition hover:text-gray-700"
                >
                  <MoreHorizontal size={19} />
                </button>
              </div>

              <p className="mt-5 text-sm text-gray-500">{stat.title}</p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>

              <div className="mt-2 flex items-center gap-1">
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

      {/* ========================================================
          MAIN CONTENT
      ========================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ======================================================
            EARNINGS CHART
        ======================================================= */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">ចំណូល</h2>

              <p className="mt-1 text-xs text-gray-400">
                Earnings Overview · Last 6 months
              </p>
            </div>

            <select className="w-fit rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 outline-none focus:border-blue-500">
              <option>Last 6 months</option>

              <option>Last 12 months</option>

              <option>This year</option>
            </select>
          </div>

          {/* Chart */}

          <div className="mt-8">
            <div className="flex h-56 items-end gap-3 sm:gap-5">
              {[
                {
                  month: "Mar",
                  value: "$1.5k",
                  height: 45,
                },
                {
                  month: "Apr",
                  value: "$1.8k",
                  height: 58,
                },
                {
                  month: "May",
                  value: "$1.6k",
                  height: 50,
                },
                {
                  month: "Jun",
                  value: "$2.1k",
                  height: 68,
                },
                {
                  month: "Jul",
                  value: "$2.0k",
                  height: 63,
                },
                {
                  month: "Aug",
                  value: "$2.45k",
                  height: 88,
                },
              ].map((item) => (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[10px] font-medium text-gray-500">
                    {item.value}
                  </span>

                  <div
                    className="w-full max-w-12 rounded-t-lg bg-blue-500 transition hover:bg-blue-600"
                    style={{
                      height: `${item.height}%`,
                    }}
                  />

                  <span className="text-[10px] text-gray-400">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================
            QUICK ACTIONS
        ======================================================= */}

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

      {/* ========================================================
          RECENT BOOKINGS
      ========================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Header */}

        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">ការកក់ថ្មីៗ</h2>

            <p className="mt-1 text-xs text-gray-400">
              Recent booking requests
            </p>
          </div>

          <Link
            to="/landlord/bookings"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {/* ======================================================
            DESKTOP TABLE
        ======================================================= */}

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
                  Amount
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
                    <span className="text-sm text-gray-700">
                      {booking.tenant}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-700">{booking.room}</p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={12} />
                        {booking.location}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {booking.date}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-gray-800">
                      {booking.amount}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <BookingStatus status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ======================================================
            MOBILE BOOKING CARDS
        ======================================================= */}

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
                  {booking.date}
                </div>

                <span className="text-sm font-bold text-gray-800">
                  {booking.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          MY ROOMS PREVIEW
      ========================================================= */}

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

        <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
          {rooms.map((room) => (
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
                  ${room.price}
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
      </div>
    </div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

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

/* ============================================================
   BOOKING STATUS
============================================================ */

function BookingStatus({ status }) {
  const config = {
    confirmed: {
      label: "Confirmed",
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

/* ============================================================
   ROOM STATUS
============================================================ */

function RoomStatus({ status }) {
  const config = {
    rented: {
      label: "Rented",
      className: "bg-green-50 text-green-600",
    },

    available: {
      label: "Available",
      className: "bg-blue-50 text-blue-600",
    },

    pending: {
      label: "Pending",
      className: "bg-yellow-50 text-yellow-600",
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
