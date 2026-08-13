import { useMemo, useState } from "react";
import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  Download,
  MoreHorizontal,
  House,
  User,
  CreditCard,
} from "lucide-react";

export default function LandlordEarnings() {
  const [period, setPeriod] = useState("6months");

  // ============================================================
  // TEMPORARY DATA
  // Later this will come from Firebase / Firestore
  // ============================================================

  const monthlyEarnings = [
    {
      month: "Mar",
      amount: 1500,
    },
    {
      month: "Apr",
      amount: 1800,
    },
    {
      month: "May",
      amount: 1650,
    },
    {
      month: "Jun",
      amount: 2100,
    },
    {
      month: "Jul",
      amount: 2050,
    },
    {
      month: "Aug",
      amount: 2450,
    },
  ];

  const transactions = [
    {
      id: "TXN-00125",
      tenant: "Sokha Chan",
      room: "Modern Private Room",
      date: "Aug 12, 2026",
      amount: 180,
      status: "paid",
      method: "ABA Pay",
    },
    {
      id: "TXN-00124",
      tenant: "Dara Kim",
      room: "Cozy Student Room",
      date: "Aug 11, 2026",
      amount: 150,
      status: "paid",
      method: "ACLEDA",
    },
    {
      id: "TXN-00123",
      tenant: "Vanna Lim",
      room: "Single Room",
      date: "Aug 10, 2026",
      amount: 130,
      status: "pending",
      method: "Cash",
    },
    {
      id: "TXN-00122",
      tenant: "Rithy Chea",
      room: "Budget Student Room",
      date: "Aug 08, 2026",
      amount: 120,
      status: "paid",
      method: "ABA Pay",
    },
    {
      id: "TXN-00121",
      tenant: "Sreypov Sok",
      room: "Modern Studio",
      date: "Aug 05, 2026",
      amount: 250,
      status: "paid",
      method: "Credit Card",
    },
  ];

  const roomEarnings = [
    {
      name: "Modern Private Room",
      location: "Toul Kork",
      earnings: 720,
      bookings: 4,
    },
    {
      name: "Cozy Student Room",
      location: "Sen Sok",
      earnings: 600,
      bookings: 4,
    },
    {
      name: "Modern Studio",
      location: "BKK1",
      earnings: 500,
      bookings: 2,
    },
    {
      name: "Budget Student Room",
      location: "Chamkarmon",
      earnings: 360,
      bookings: 3,
    },
  ];

  // ============================================================
  // CALCULATIONS
  // ============================================================

  const totalEarnings = monthlyEarnings.reduce(
    (total, item) => total + item.amount,
    0,
  );

  const currentMonth = monthlyEarnings[monthlyEarnings.length - 1].amount;

  const previousMonth = monthlyEarnings[monthlyEarnings.length - 2].amount;

  const growth = ((currentMonth - previousMonth) / previousMonth) * 100;

  const pendingAmount = transactions
    .filter((item) => item.status === "pending")
    .reduce((total, item) => total + item.amount, 0);

  const paidAmount = transactions
    .filter((item) => item.status === "paid")
    .reduce((total, item) => total + item.amount, 0);

  const maxEarning = Math.max(...monthlyEarnings.map((item) => item.amount));

  // ============================================================
  // FILTERED CHART
  // ============================================================

  const chartData = useMemo(() => {
    if (period === "3months") {
      return monthlyEarnings.slice(-3);
    }

    if (period === "12months") {
      return [
        ...monthlyEarnings,
        {
          month: "Sep",
          amount: 2200,
        },
        {
          month: "Oct",
          amount: 2350,
        },
        {
          month: "Nov",
          amount: 2500,
        },
        {
          month: "Dec",
          amount: 2700,
        },
        {
          month: "Jan",
          amount: 2900,
        },
        {
          month: "Feb",
          amount: 3100,
        },
      ];
    }

    return monthlyEarnings;
  }, [period]);

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ចំណូល</h1>

          <p className="mt-1 text-sm text-gray-500">
            Track your rental income and payment history
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Download size={17} />
          Export Report
        </button>
      </div>

      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <EarningStat
          title="Total Earnings"
          subtitle="Last 6 months"
          value={`$${totalEarnings.toLocaleString()}`}
          icon={<Wallet size={21} />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <EarningStat
          title="This Month"
          subtitle="August 2026"
          value={`$${currentMonth.toLocaleString()}`}
          icon={<TrendingUp size={21} />}
          iconClass="bg-green-50 text-green-600"
          growth={growth}
        />

        <EarningStat
          title="Pending Payments"
          subtitle="Awaiting payment"
          value={`$${pendingAmount.toLocaleString()}`}
          icon={<Clock size={21} />}
          iconClass="bg-yellow-50 text-yellow-600"
        />

        <EarningStat
          title="Paid Amount"
          subtitle="Completed payments"
          value={`$${paidAmount.toLocaleString()}`}
          icon={<CheckCircle size={21} />}
          iconClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* ======================================================
          CHART + SUMMARY
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* ====================================================
            EARNINGS CHART
        ===================================================== */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Earnings Overview
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Monthly rental income
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
                const height = (item.amount / maxEarning) * 100;

                return (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-[10px] font-semibold text-gray-500">
                      ${item.amount.toLocaleString()}
                    </span>

                    <div
                      className="w-full max-w-14 rounded-t-xl bg-blue-500 transition-all duration-300 hover:bg-blue-600"
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
        </div>

        {/* ====================================================
            EARNING SUMMARY
        ===================================================== */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Income Summary</h2>

          <p className="mt-1 text-xs text-gray-400">August 2026</p>

          <div className="mt-6 space-y-5">
            <SummaryRow label="Room Rent" value="$2,450" percentage="100%" />

            <SummaryRow
              label="Platform Fee"
              value="$0"
              percentage="0%"
              negative
            />

            <SummaryRow
              label="Net Income"
              value="$2,450"
              percentage="100%"
              highlight
            />
          </div>

          {/* Growth */}

          <div className="mt-7 rounded-xl bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp size={18} />

              <span className="text-sm font-semibold">
                +{growth.toFixed(1)}%
              </span>
            </div>

            <p className="mt-1 text-xs text-green-600">
              Your income increased compared with last month.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          ROOM EARNINGS
      ======================================================= */}

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Earnings by Room
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              See which rooms generate the most income
            </p>
          </div>

          <button type="button" className="text-gray-400 hover:text-gray-700">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
          {roomEarnings.map((room) => (
            <div
              key={room.name}
              className="p-5 transition hover:bg-gray-50 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <House size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="truncate text-sm font-bold text-gray-900">
                        {room.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {room.location}
                      </p>
                    </div>

                    <p className="shrink-0 text-sm font-bold text-gray-900">
                      ${room.earnings}
                    </p>
                  </div>

                  {/* Progress */}

                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-blue-500"
                        style={{
                          width: `${Math.min(
                            (room.earnings / 720) * 100,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between">
                    <span className="text-[10px] text-gray-400">
                      {room.bookings} bookings
                    </span>

                    <span className="text-[10px] font-medium text-gray-500">
                      {Math.round((room.earnings / totalEarnings) * 100)}% of
                      total
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================
          TRANSACTIONS
      ======================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Your latest rental payments
            </p>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Desktop */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Transaction
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Tenant
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Room
                </th>

                <th className="px-6 py-4 text-xs font-medium text-gray-400">
                  Payment
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
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {transaction.id}
                    </p>

                    <p className="mt-1 text-[10px] text-gray-400">
                      {transaction.date}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <User size={15} />
                      </div>

                      <span className="text-sm text-gray-700">
                        {transaction.tenant}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {transaction.room}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard size={15} className="text-gray-400" />

                      <span className="text-xs text-gray-600">
                        {transaction.method}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-gray-800">
                      ${transaction.amount}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <PaymentStatus status={transaction.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}

        <div className="space-y-3 p-4 md:hidden">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-xl border border-gray-100 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-800">
                    {transaction.id}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {transaction.date}
                  </p>
                </div>

                <PaymentStatus status={transaction.status} />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <User size={16} />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {transaction.tenant}
                  </p>

                  <p className="text-xs text-gray-400">{transaction.room}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <CreditCard size={13} />
                  {transaction.method}
                </div>

                <p className="text-sm font-bold text-gray-900">
                  ${transaction.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EARNING STAT
============================================================ */

function EarningStat({ title, subtitle, value, icon, iconClass, growth }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>

        {growth !== undefined && (
          <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-[10px] font-semibold text-green-600">
            <ArrowUpRight size={12} />
            {growth.toFixed(1)}%
          </span>
        )}
      </div>

      <p className="mt-5 text-sm text-gray-500">{title}</p>

      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>

      <p className="mt-2 text-[11px] text-gray-400">{subtitle}</p>
    </div>
  );
}

/* ============================================================
   SUMMARY ROW
============================================================ */

function SummaryRow({
  label,
  value,
  percentage,
  negative = false,
  highlight = false,
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span
          className={`text-sm ${
            highlight ? "font-bold text-gray-900" : "text-gray-500"
          }`}
        >
          {label}
        </span>

        <span
          className={`text-sm font-semibold ${
            negative
              ? "text-red-500"
              : highlight
                ? "text-blue-600"
                : "text-gray-800"
          }`}
        >
          {value}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full ${
              highlight ? "bg-blue-500" : "bg-gray-300"
            }`}
            style={{
              width: percentage,
            }}
          />
        </div>

        <span className="w-8 text-right text-[10px] text-gray-400">
          {percentage}
        </span>
      </div>
    </div>
  );
}

/* ============================================================
   PAYMENT STATUS
============================================================ */

function PaymentStatus({ status }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1.5 text-[10px] font-semibold text-green-600">
        <CheckCircle size={12} />
        Paid
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1.5 text-[10px] font-semibold text-yellow-600">
      <Clock size={12} />
      Pending
    </span>
  );
}
