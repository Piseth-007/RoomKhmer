import { useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  House,
  CalendarDays,
  Wallet,
  Download,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Clock,
  XCircle,
  ArrowUpRight,
  FileText,
} from "lucide-react";

export default function AdminReports() {
  const [period, setPeriod] = useState("6months");

  // ============================================================
  // TEMPORARY REPORT DATA
  // Later replace with Firebase / Firestore data
  // ============================================================

  const reportData = {
    totalRevenue: 28450,
    totalBookings: 356,
    totalUsers: 1248,
    totalRooms: 428,
    totalLandlords: 186,

    revenueGrowth: 10.4,
    bookingGrowth: 14.8,
    userGrowth: 12.5,

    pendingBookings: 18,
    confirmedBookings: 286,
    completedBookings: 328,
    cancelledBookings: 42,
  };

  const monthlyData = [
    {
      month: "Mar",
      revenue: 3200,
      bookings: 42,
      users: 108,
    },
    {
      month: "Apr",
      revenue: 4100,
      bookings: 51,
      users: 126,
    },
    {
      month: "May",
      revenue: 3850,
      bookings: 48,
      users: 142,
    },
    {
      month: "Jun",
      revenue: 5200,
      bookings: 63,
      users: 178,
    },
    {
      month: "Jul",
      revenue: 5400,
      bookings: 70,
      users: 201,
    },
    {
      month: "Aug",
      revenue: 6700,
      bookings: 82,
      users: 236,
    },
  ];

  const yearlyData = [
    {
      month: "Sep",
      revenue: 2900,
      bookings: 38,
      users: 92,
    },
    {
      month: "Oct",
      revenue: 3100,
      bookings: 41,
      users: 98,
    },
    {
      month: "Nov",
      revenue: 3500,
      bookings: 45,
      users: 110,
    },
    {
      month: "Dec",
      revenue: 3900,
      bookings: 49,
      users: 120,
    },
    {
      month: "Jan",
      revenue: 4500,
      bookings: 55,
      users: 145,
    },
    {
      month: "Feb",
      revenue: 4700,
      bookings: 58,
      users: 155,
    },
    ...monthlyData,
  ];

  const chartData = useMemo(() => {
    if (period === "3months") {
      return monthlyData.slice(-3);
    }

    if (period === "12months") {
      return yearlyData;
    }

    return monthlyData;
  }, [period]);

  const maxRevenue = Math.max(...chartData.map((item) => item.revenue));

  const maxBookings = Math.max(...chartData.map((item) => item.bookings));

  // ============================================================
  // BOOKING STATUS
  // ============================================================

  const bookingStatus = [
    {
      label: "Completed",
      value: 328,
      percentage: 82,
      icon: CheckCircle,
      className: "bg-green-500",
      textClass: "text-green-600",
      bgClass: "bg-green-50",
    },
    {
      label: "Confirmed",
      value: 286,
      percentage: 72,
      icon: CalendarDays,
      className: "bg-blue-500",
      textClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    {
      label: "Pending",
      value: 18,
      percentage: 5,
      icon: Clock,
      className: "bg-yellow-500",
      textClass: "text-yellow-600",
      bgClass: "bg-yellow-50",
    },
    {
      label: "Cancelled",
      value: 42,
      percentage: 10,
      icon: XCircle,
      className: "bg-red-500",
      textClass: "text-red-500",
      bgClass: "bg-red-50",
    },
  ];

  // ============================================================
  // ROOM DATA
  // ============================================================

  const roomStatus = [
    {
      label: "Approved",
      value: 410,
      percentage: 96,
      className: "bg-green-500",
    },
    {
      label: "Pending",
      value: 18,
      percentage: 4,
      className: "bg-yellow-500",
    },
    {
      label: "Rejected",
      value: 12,
      percentage: 3,
      className: "bg-red-500",
    },
  ];

  // ============================================================
  // LOCATIONS
  // ============================================================

  const locations = [
    {
      name: "Toul Kork",
      rooms: 86,
      bookings: 74,
      revenue: 6240,
    },
    {
      name: "Sen Sok",
      rooms: 72,
      bookings: 68,
      revenue: 5120,
    },
    {
      name: "BKK1",
      rooms: 64,
      bookings: 61,
      revenue: 4870,
    },
    {
      name: "Chamkarmon",
      rooms: 58,
      bookings: 52,
      revenue: 3980,
    },
    {
      name: "Daun Penh",
      rooms: 47,
      bookings: 42,
      revenue: 3260,
    },
  ];

  // ============================================================
  // TOP LANDLORDS
  // ============================================================

  const landlords = [
    {
      name: "Dara Property",
      rooms: 28,
      bookings: 46,
      revenue: 4820,
    },
    {
      name: "BKK Residence",
      rooms: 24,
      bookings: 39,
      revenue: 4210,
    },
    {
      name: "Sokha Property",
      rooms: 21,
      bookings: 35,
      revenue: 3650,
    },
    {
      name: "Happy Home",
      rooms: 18,
      bookings: 31,
      revenue: 3180,
    },
    {
      name: "City Living",
      rooms: 15,
      bookings: 28,
      revenue: 2940,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 size={19} className="text-blue-600" />

            <span className="text-xs font-semibold text-blue-600">
              ANALYTICS & REPORTS
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">របាយការណ៍</h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor RoomKhmer platform performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-xs font-medium text-gray-600 outline-none focus:border-blue-500"
          >
            <option value="3months">Last 3 Months</option>

            <option value="6months">Last 6 Months</option>

            <option value="12months">Last 12 Months</option>
          </select>

          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* ======================================================
          OVERVIEW STATS
      ======================================================= */}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <ReportStat
          label="Revenue"
          value={`$${reportData.totalRevenue.toLocaleString()}`}
          change={`+${reportData.revenueGrowth}%`}
          icon={<Wallet size={19} />}
          className="bg-green-50 text-green-600"
        />

        <ReportStat
          label="Bookings"
          value={reportData.totalBookings}
          change={`+${reportData.bookingGrowth}%`}
          icon={<CalendarDays size={19} />}
          className="bg-blue-50 text-blue-600"
        />

        <ReportStat
          label="Users"
          value={reportData.totalUsers.toLocaleString()}
          change={`+${reportData.userGrowth}%`}
          icon={<Users size={19} />}
          className="bg-purple-50 text-purple-600"
        />

        <ReportStat
          label="Rooms"
          value={reportData.totalRooms}
          change="+8.2%"
          icon={<House size={19} />}
          className="bg-yellow-50 text-yellow-600"
        />

        <ReportStat
          label="Landlords"
          value={reportData.totalLandlords}
          change="+6.4%"
          icon={<ShieldCheck size={19} />}
          className="bg-pink-50 text-pink-600"
        />
      </div>

      {/* ======================================================
          REVENUE + BOOKING CHART
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Revenue Chart */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Revenue Performance
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Monthly platform revenue
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />

              <span className="text-[10px] text-gray-400">Revenue</span>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex h-64 items-end gap-3 sm:gap-5">
              {chartData.map((item) => {
                const height = (item.revenue / maxRevenue) * 100;

                return (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-[8px] font-semibold text-gray-500 sm:text-[10px]">
                      ${item.revenue}
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

          <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
              <TrendingUp size={14} />
              +10.4%
            </span>

            <span className="text-[10px] text-gray-400">
              Compared with previous period
            </span>
          </div>
        </section>

        {/* Booking Overview */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Booking Overview</h2>

          <p className="mt-1 text-xs text-gray-400">
            Current booking distribution
          </p>

          <div className="mt-6 space-y-5">
            {bookingStatus.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bgClass} ${item.textClass}`}
                      >
                        <Icon size={15} />
                      </div>

                      <span className="text-xs font-medium text-gray-600">
                        {item.label}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-gray-800">
                      {item.value}
                    </span>
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${item.className}`}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ======================================================
          BOOKING VOLUME CHART
      ======================================================= */}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Booking Volume</h2>

            <p className="mt-1 text-xs text-gray-400">
              Number of bookings per month
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />

            <span className="text-[10px] text-gray-400">Bookings</span>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex h-52 items-end gap-3 sm:gap-6">
            {chartData.map((item) => {
              const height = (item.bookings / maxBookings) * 100;

              return (
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[9px] font-semibold text-gray-500">
                    {item.bookings}
                  </span>

                  <div
                    className="w-full max-w-16 rounded-t-xl bg-purple-500 transition-all duration-300 hover:bg-purple-600"
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
      </section>

      {/* ======================================================
          ROOM STATUS + USER OVERVIEW
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Room Status */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Room Listings</h2>

              <p className="mt-1 text-xs text-gray-400">
                Current room approval status
              </p>
            </div>

            <House size={20} className="text-blue-600" />
          </div>

          <div className="mt-6 space-y-5">
            {roomStatus.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    {item.label}
                  </span>

                  <span className="text-xs font-bold text-gray-800">
                    {item.value}
                  </span>
                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.className}`}
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>

                <p className="mt-1 text-right text-[9px] text-gray-400">
                  {item.percentage}%
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* User Overview */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">User Overview</h2>

              <p className="mt-1 text-xs text-gray-400">
                Platform user distribution
              </p>
            </div>

            <Users size={20} className="text-purple-600" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <UserOverviewCard
              icon={<Users size={18} />}
              label="Tenants"
              value="1,062"
              percentage="85%"
              className="bg-blue-50 text-blue-600"
            />

            <UserOverviewCard
              icon={<ShieldCheck size={18} />}
              label="Landlords"
              value="186"
              percentage="15%"
              className="bg-purple-50 text-purple-600"
            />
          </div>

          <div className="mt-5">
            <div className="flex h-3 overflow-hidden rounded-full">
              <div className="bg-blue-500" style={{ width: "85%" }} />

              <div className="bg-purple-500" style={{ width: "15%" }} />
            </div>

            <div className="mt-2 flex justify-between text-[9px] text-gray-400">
              <span>85% Tenants</span>

              <span>15% Landlords</span>
            </div>
          </div>
        </section>
      </div>

      {/* ======================================================
          TOP LOCATIONS
      ======================================================= */}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Top Locations</h2>

            <p className="mt-1 text-xs text-gray-400">
              Highest performing areas
            </p>
          </div>

          <MapPin size={20} className="text-blue-600" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-4 text-[10px] uppercase tracking-wide text-gray-400">
                  Location
                </th>

                <th className="px-5 py-4 text-[10px] uppercase tracking-wide text-gray-400">
                  Rooms
                </th>

                <th className="px-5 py-4 text-[10px] uppercase tracking-wide text-gray-400">
                  Bookings
                </th>

                <th className="px-5 py-4 text-[10px] uppercase tracking-wide text-gray-400">
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody>
              {locations.map((location, index) => (
                <tr
                  key={location.name}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                        {index + 1}
                      </span>

                      <div>
                        <p className="text-xs font-semibold text-gray-700">
                          {location.name}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-[9px] text-gray-400">
                          <MapPin size={9} />
                          Phnom Penh
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-xs text-gray-600">
                    {location.rooms}
                  </td>

                  <td className="px-5 py-4 text-xs font-semibold text-gray-700">
                    {location.bookings}
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-gray-800">
                      ${location.revenue.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================
          TOP LANDLORDS
      ======================================================= */}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Top Landlords</h2>

            <p className="mt-1 text-xs text-gray-400">
              Landlords generating the most activity
            </p>
          </div>

          <ShieldCheck size={20} className="text-purple-600" />
        </div>

        <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-5">
          {landlords.map((landlord, index) => (
            <div
              key={landlord.name}
              className="p-5 transition hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <ShieldCheck size={17} />
                </div>

                <span className="text-[10px] font-bold text-gray-300">
                  #{index + 1}
                </span>
              </div>

              <h3 className="mt-4 truncate text-sm font-bold text-gray-800">
                {landlord.name}
              </h3>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Rooms</span>

                  <span className="text-xs font-semibold text-gray-700">
                    {landlord.rooms}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Bookings</span>

                  <span className="text-xs font-semibold text-gray-700">
                    {landlord.bookings}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">Revenue</span>

                  <span className="text-xs font-bold text-green-600">
                    ${landlord.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================
          REPORT FOOTER
      ======================================================= */}

      <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
            <FileText size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-blue-900">
              Need a detailed report?
            </p>

            <p className="mt-1 text-[10px] text-blue-600">
              Export your platform data for further analysis.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          <Download size={15} />
          Download Report
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   REPORT STAT
============================================================ */

function ReportStat({ label, value, change, icon, className }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
        >
          {icon}
        </div>

        <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
          <TrendingUp size={11} />
          {change}
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-500">{label}</p>

      <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   USER OVERVIEW CARD
============================================================ */

function UserOverviewCard({ icon, label, value, percentage, className }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${className}`}
      >
        {icon}
      </div>

      <p className="mt-3 text-[10px] text-gray-400">{label}</p>

      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-lg font-bold text-gray-800">{value}</p>

        <span className="text-[10px] font-semibold text-gray-400">
          {percentage}
        </span>
      </div>
    </div>
  );
}
