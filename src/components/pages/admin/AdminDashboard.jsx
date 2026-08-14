import { useMemo, useState } from "react";
import {
  Users,
  House,
  CalendarDays,
  Wallet,
  TrendingUp,
  TrendingDown,
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

export default function AdminDashboard() {
  const [period, setPeriod] = useState("6months");

  // ============================================================
  // TEMPORARY DASHBOARD DATA
  // Later replace with Firebase / Firestore
  // ============================================================

  const stats = {
    users: 1248,
    landlords: 186,
    rooms: 428,
    bookings: 356,
    revenue: 28450,
    pendingRooms: 18,
  };

  const monthlyData = [
    {
      month: "Mar",
      revenue: 3200,
      bookings: 42,
    },
    {
      month: "Apr",
      revenue: 4100,
      bookings: 51,
    },
    {
      month: "May",
      revenue: 3850,
      bookings: 48,
    },
    {
      month: "Jun",
      revenue: 5200,
      bookings: 63,
    },
    {
      month: "Jul",
      revenue: 5400,
      bookings: 70,
    },
    {
      month: "Aug",
      revenue: 6700,
      bookings: 82,
    },
  ];

  const recentBookings = [
    {
      id: "BK-00125",
      tenant: "Sokha Chan",
      room: "Modern Private Room",
      landlord: "Dara Property",
      amount: 180,
      status: "confirmed",
      date: "Aug 14, 2026",
    },
    {
      id: "BK-00124",
      tenant: "Vanna Lim",
      room: "Cozy Student Room",
      landlord: "Piseth Rooms",
      amount: 150,
      status: "pending",
      date: "Aug 14, 2026",
    },
    {
      id: "BK-00123",
      tenant: "Dara Kim",
      room: "Modern Studio",
      landlord: "BKK Property",
      amount: 250,
      status: "confirmed",
      date: "Aug 13, 2026",
    },
    {
      id: "BK-00122",
      tenant: "Sreypov Sok",
      room: "Single Room",
      landlord: "Happy Home",
      amount: 130,
      status: "cancelled",
      date: "Aug 13, 2026",
    },
  ];

  const pendingRooms = [
    {
      id: "RM-00428",
      name: "Modern Private Room",
      landlord: "Sokha Property",
      location: "Toul Kork",
      price: 180,
      submitted: "10 min ago",
    },
    {
      id: "RM-00427",
      name: "Student Friendly Room",
      landlord: "Dara Home",
      location: "Sen Sok",
      price: 150,
      submitted: "35 min ago",
    },
    {
      id: "RM-00426",
      name: "Luxury Studio",
      landlord: "BKK Residence",
      location: "BKK1",
      price: 280,
      submitted: "1 hour ago",
    },
  ];

  const activities = [
    {
      id: 1,
      type: "room",
      title: "New room submitted",
      description: "Modern Private Room needs approval",
      time: "10 minutes ago",
    },
    {
      id: 2,
      type: "user",
      title: "New landlord registered",
      description: "Sokha Property joined RoomKhmer",
      time: "25 minutes ago",
    },
    {
      id: 3,
      type: "booking",
      title: "New booking received",
      description: "Booking #BK-00125 was created",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "user",
      title: "New tenant registered",
      description: "Dara Kim created an account",
      time: "2 hours ago",
    },
  ];

  // ============================================================
  // CHART DATA
  // ============================================================

  const chartData = useMemo(() => {
    if (period === "3months") {
      return monthlyData.slice(-3);
    }

    if (period === "12months") {
      return [
        {
          month: "Sep",
          revenue: 2900,
          bookings: 38,
        },
        {
          month: "Oct",
          revenue: 3100,
          bookings: 41,
        },
        {
          month: "Nov",
          revenue: 3500,
          bookings: 45,
        },
        {
          month: "Dec",
          revenue: 3900,
          bookings: 49,
        },
        {
          month: "Jan",
          revenue: 4500,
          bookings: 55,
        },
        {
          month: "Feb",
          revenue: 4700,
          bookings: 58,
        },
        ...monthlyData,
      ];
    }

    return monthlyData;
  }, [period]);

  const maxRevenue = Math.max(...chartData.map((item) => item.revenue));

  return (
    <div className="space-y-6">
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
            August 14, 2026
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

      {/* ======================================================
          MAIN STATISTICS
      ======================================================= */}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <AdminStat
          title="Total Users"
          value={stats.users.toLocaleString()}
          change="+12.5%"
          description="vs last month"
          icon={<Users size={21} />}
          iconClass="bg-blue-50 text-blue-600"
          positive
        />

        <AdminStat
          title="Total Rooms"
          value={stats.rooms.toLocaleString()}
          change="+8.2%"
          description="vs last month"
          icon={<House size={21} />}
          iconClass="bg-purple-50 text-purple-600"
          positive
        />

        <AdminStat
          title="Total Bookings"
          value={stats.bookings.toLocaleString()}
          change="+14.8%"
          description="vs last month"
          icon={<CalendarDays size={21} />}
          iconClass="bg-green-50 text-green-600"
          positive
        />

        <AdminStat
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          change="+10.4%"
          description="vs last month"
          icon={<Wallet size={21} />}
          iconClass="bg-yellow-50 text-yellow-600"
          positive
        />
      </div>

      {/* ======================================================
          SECONDARY STATS
      ======================================================= */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MiniStat
          icon={<ShieldCheck size={18} />}
          label="Landlords"
          value={stats.landlords}
          description="Registered landlords"
          className="bg-blue-50 text-blue-600"
        />

        <MiniStat
          icon={<Clock size={18} />}
          label="Pending Rooms"
          value={stats.pendingRooms}
          description="Need your approval"
          className="bg-yellow-50 text-yellow-600"
          urgent
        />

        <MiniStat
          icon={<CheckCircle size={18} />}
          label="Active Rooms"
          value={410}
          description="Currently published"
          className="bg-green-50 text-green-600"
        />
      </div>

      {/* ======================================================
          REVENUE CHART
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Revenue Overview
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Platform revenue and booking performance
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

          {/* Chart */}

          <div className="mt-8">
            <div className="flex h-64 items-end gap-3 sm:gap-6">
              {chartData.map((item) => {
                const height = (item.revenue / maxRevenue) * 100;

                return (
                  <div
                    key={item.month}
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

          {/* Chart footer */}

          <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4">
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
              <TrendingUp size={14} />
              +10.4%
            </span>

            <span className="text-xs text-gray-400">
              Revenue growth compared with previous period
            </span>
          </div>
        </section>

        {/* ====================================================
            QUICK OVERVIEW
        ===================================================== */}

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
              value="1,062"
              percentage={85}
              className="bg-blue-50 text-blue-600"
            />

            <OverviewRow
              icon={<ShieldCheck size={17} />}
              label="Landlords"
              value="186"
              percentage={15}
              className="bg-purple-50 text-purple-600"
            />

            <OverviewRow
              icon={<House size={17} />}
              label="Published Rooms"
              value="410"
              percentage={96}
              className="bg-green-50 text-green-600"
            />

            <OverviewRow
              icon={<CalendarCheck size={17} />}
              label="Successful Bookings"
              value="328"
              percentage={92}
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

      {/* ======================================================
          PENDING ROOMS
      ======================================================= */}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                Pending Room Approvals
              </h2>

              <span className="rounded-full bg-yellow-50 px-2 py-1 text-[10px] font-bold text-yellow-600">
                {stats.pendingRooms}
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
          {pendingRooms.map((room) => (
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
                  ${room.price}
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
          ))}
        </div>
      </section>

      {/* ======================================================
          BOOKINGS + ACTIVITY
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* ====================================================
            RECENT BOOKINGS
        ===================================================== */}

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

          {/* Desktop */}

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
                {recentBookings.map((booking) => (
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

                    <td className="max-w-[150px] px-5 py-4">
                      <p className="truncate text-xs text-gray-600">
                        {booking.room}
                      </p>

                      <p className="mt-1 truncate text-[9px] text-gray-400">
                        {booking.landlord}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-gray-800">
                        ${booking.amount}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <BookingStatus status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}

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
                    ${booking.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            ACTIVITY
        ===================================================== */}

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

            <button type="button" className="text-gray-400 hover:text-gray-700">
              <MoreHorizontal size={19} />
            </button>
          </div>

          <div className="mt-6">
            {activities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                last={index === activities.length - 1}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN STAT
============================================================ */

function AdminStat({
  title,
  value,
  change,
  description,
  icon,
  iconClass,
  positive,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${iconClass}`}
        >
          {icon}
        </div>

        <span
          className={`hidden items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold sm:flex ${
            positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
          }`}
        >
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}

          {change}
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-500 sm:text-sm">{title}</p>

      <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
        {value}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <span
          className={`flex items-center gap-1 text-[10px] font-semibold sm:hidden ${
            positive ? "text-green-600" : "text-red-500"
          }`}
        >
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}

          {change}
        </span>

        <span className="text-[10px] text-gray-400">{description}</span>
      </div>
    </div>
  );
}

/* ============================================================
   MINI STAT
============================================================ */

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

/* ============================================================
   OVERVIEW ROW
============================================================ */

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
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
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
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${current.className}`}
    >
      <Icon size={10} />
      {current.label}
    </span>
  );
}

/* ============================================================
   ACTIVITY ITEM
============================================================ */

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
