import { useMemo, useState, useEffect } from "react";

import {
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Download,
  MoreHorizontal,
  House,
  User,
  CreditCard,
} from "lucide-react";

import { collection, getDocs, query, where } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../../firebase/config";

export default function LandlordEarnings() {
  const [period, setPeriod] = useState("6months");

  // This contains PAYMENTS, not bookings.
  const [payments, setPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // ============================================================
  // LOAD PAYMENTS
  // ============================================================

  useEffect(() => {
    let unsubscribe;

    const loadPayments = async (user) => {
      try {
        setLoading(true);
        setError("");

        if (!user) {
          setError("Please login as a landlord.");
          return;
        }

        console.log("💰 Loading payments for landlord:", user.uid);

        const paymentsQuery = query(
          collection(db, "payments"),
          where("landlordId", "==", user.uid),
        );

        const snapshot = await getDocs(paymentsQuery);

        const paymentData = snapshot.docs.map((paymentDoc) => {
          const data = paymentDoc.data();

          return {
            id: paymentDoc.id,

            ...data,

            // ------------------------------------------------
            // PAYMENT
            // ------------------------------------------------

            amount: Number(data.amount || 0),

            status: data.status || "pending",

            paymentMethod: data.paymentMethod || "Not paid",

            paidAt: data.paidAt || null,

            createdAt: data.createdAt || null,

            // ------------------------------------------------
            // ROOM
            // ------------------------------------------------

            room: data.roomName || "Unknown Room",

            roomId: data.roomId || "",

            location: data.location || data.roomLocation || "",

            // ------------------------------------------------
            // TENANT
            // ------------------------------------------------

            tenant: data.tenantName || "Unknown Tenant",

            tenantId: data.tenantId || "",

            // ------------------------------------------------
            // PERIOD
            // ------------------------------------------------

            periodNumber: Number(data.periodNumber || 1),

            periodStart: data.periodStart || null,

            periodEnd: data.periodEnd || null,

            dueDate: data.dueDate || null,
          };
        });

        setPayments(paymentData);

        console.log("💰 Payments loaded:", paymentData);
      } catch (err) {
        console.error("❌ Earnings error:", err);

        setError(
          err.code
            ? `${err.code}: ${err.message}`
            : err.message || "Failed to load earnings.",
        );
      } finally {
        setLoading(false);
      }
    };

    // ------------------------------------------------------------
    // IMPORTANT
    // ------------------------------------------------------------
    // Don't use auth.currentUser immediately.
    // Wait until Firebase Authentication finishes restoring
    // the login session.
    // ------------------------------------------------------------

    unsubscribe = onAuthStateChanged(auth, (user) => {
      loadPayments(user);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // ============================================================
  // PAID PAYMENTS
  // ============================================================

  const paidPayments = useMemo(() => {
    return payments.filter((payment) => payment.status === "paid");
  }, [payments]);

  // ============================================================
  // PENDING PAYMENTS
  // ============================================================

  const pendingPayments = useMemo(() => {
    return payments.filter((payment) => payment.status === "pending");
  }, [payments]);

  // ============================================================
  // TOTAL PAID
  // ============================================================

  const paidAmount = useMemo(() => {
    return paidPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0,
    );
  }, [paidPayments]);

  // ============================================================
  // TOTAL PENDING
  // ============================================================

  const pendingAmount = useMemo(() => {
    return pendingPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0,
    );
  }, [pendingPayments]);

  // ============================================================
  // MONTHLY EARNINGS
  // ============================================================
  //
  // IMPORTANT:
  // Only PAID payments are counted.
  //
  // ============================================================

  const monthlyEarnings = useMemo(() => {
    const months = [];

    const now = new Date();

    const count = period === "3months" ? 3 : period === "12months" ? 12 : 6;

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      months.push({
        month: date.toLocaleString("en-US", {
          month: "short",
        }),

        year: date.getFullYear(),

        monthIndex: date.getMonth(),

        amount: 0,
      });
    }

    paidPayments.forEach((payment) => {
      // ----------------------------------------------------
      // Prefer paidAt because earnings should be recorded
      // when the payment was actually paid.
      // ----------------------------------------------------

      const date = getPaymentDate(payment.paidAt, payment.createdAt);

      if (!date) {
        return;
      }

      const month = months.find(
        (item) =>
          item.year === date.getFullYear() &&
          item.monthIndex === date.getMonth(),
      );

      if (month) {
        month.amount += Number(payment.amount || 0);
      }
    });

    return months;
  }, [paidPayments, period]);

  // ============================================================
  // TOTAL EARNINGS FOR SELECTED PERIOD
  // ============================================================

  // ============================================================
  // CURRENT MONTH
  // ============================================================

  const currentMonth = monthlyEarnings[monthlyEarnings.length - 1]?.amount || 0;

  // ============================================================
  // PREVIOUS MONTH
  // ============================================================

  const previousMonth =
    monthlyEarnings[monthlyEarnings.length - 2]?.amount || 0;

  // ============================================================
  // GROWTH
  // ============================================================

  const growth =
    previousMonth > 0
      ? ((currentMonth - previousMonth) / previousMonth) * 100
      : currentMonth > 0
        ? 100
        : 0;

  // ============================================================
  // EARNINGS BY ROOM
  // ============================================================

  const roomEarnings = useMemo(() => {
    const rooms = {};

    // Only PAID payments
    paidPayments.forEach((payment) => {
      const key = payment.roomId || payment.room || "unknown";

      if (!rooms[key]) {
        rooms[key] = {
          name: payment.room || "Unknown Room",

          location: payment.location || "Unknown Location",

          earnings: 0,

          payments: 0,
        };
      }

      rooms[key].earnings += Number(payment.amount || 0);

      rooms[key].payments += 1;
    });

    return Object.values(rooms).sort((a, b) => b.earnings - a.earnings);
  }, [paidPayments]);

  const maxRoomEarning = Math.max(
    ...roomEarnings.map((room) => room.earnings),
    1,
  );

  // ============================================================
  // RECENT TRANSACTIONS
  // ============================================================

  const transactions = useMemo(() => {
    return [...payments]
      .sort((a, b) => {
        const aTime = getTimestamp(a.paidAt || a.createdAt);

        const bTime = getTimestamp(b.paidAt || b.createdAt);

        return bTime - aTime;
      })
      .slice(0, 10)
      .map((payment) => ({
        id: payment.id,

        tenant: payment.tenant,

        room: payment.room,

        date: formatDate(payment.paidAt || payment.createdAt),

        amount: Number(payment.amount || 0),

        status: payment.status,

        method: payment.paymentMethod || "Not paid",
      }));
  }, [payments]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500">Loading earnings...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ====================================================== */}

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
          ERROR
      ====================================================== */}

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <EarningStat
          title="Total Earnings"
          subtitle="Actual paid payments"
          value={`$${paidAmount.toLocaleString()}`}
          icon={<Wallet size={21} />}
          iconClass="bg-blue-50 text-blue-600"
        />

        <EarningStat
          title="This Month"
          subtitle="Paid payments"
          value={`$${currentMonth.toLocaleString()}`}
          icon={<TrendingUp size={21} />}
          iconClass="bg-green-50 text-green-600"
          growth={growth}
        />

        <EarningStat
          title="Pending Income"
          subtitle="Payments not paid yet"
          value={`$${pendingAmount.toLocaleString()}`}
          icon={<Clock size={21} />}
          iconClass="bg-yellow-50 text-yellow-600"
        />

        <EarningStat
          title="Paid Payments"
          subtitle="Successful payments"
          value={paidPayments.length}
          icon={<CheckCircle size={21} />}
          iconClass="bg-purple-50 text-purple-600"
        />
      </div>

      {/* ======================================================
          CHART + SUMMARY
      ====================================================== */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* CHART */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Earnings Overview
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Actual paid rental income
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
              {monthlyEarnings.map((item) => {
                const maxEarning = Math.max(
                  ...monthlyEarnings.map((item) => item.amount),
                  1,
                );

                const height = (item.amount / maxEarning) * 100;

                return (
                  <div
                    key={`${item.month}-${item.year}`}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-[10px] font-semibold text-gray-500">
                      ${item.amount.toLocaleString()}
                    </span>

                    <div
                      className="w-full max-w-14 rounded-t-xl bg-blue-500 transition-all duration-300"
                      style={{
                        height: `${height}%`,
                        minHeight: item.amount > 0 ? "8px" : "0px",
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

        {/* SUMMARY */}

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Income Summary</h2>

          <p className="mt-1 text-xs text-gray-400">This month</p>

          <div className="mt-6 space-y-5">
            <SummaryRow
              label="Paid Rent"
              value={`$${currentMonth.toLocaleString()}`}
              percentage={currentMonth > 0 ? "100%" : "0%"}
            />

            <SummaryRow
              label="Platform Fee"
              value="$0"
              percentage="0%"
              negative
            />

            <SummaryRow
              label="Net Income"
              value={`$${currentMonth.toLocaleString()}`}
              percentage={currentMonth > 0 ? "100%" : "0%"}
              highlight
            />
          </div>

          <div className="mt-7 rounded-xl bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp size={18} />

              <span className="text-sm font-semibold">
                {growth >= 0 ? "+" : ""}
                {growth.toFixed(1)}%
              </span>
            </div>

            <p className="mt-1 text-xs text-green-600">
              Compared with last month.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          ROOM EARNINGS
      ====================================================== */}

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Earnings by Room
            </h2>

            <p className="mt-1 text-xs text-gray-400">Paid payments only</p>
          </div>

          <MoreHorizontal size={20} className="text-gray-400" />
        </div>

        <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
          {roomEarnings.length === 0 ? (
            <div className="col-span-full p-10 text-center text-sm text-gray-400">
              No paid payments yet.
            </div>
          ) : (
            roomEarnings.map((room) => (
              <div
                key={`${room.name}-${room.location}`}
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
                        ${room.earnings.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{
                            width: `${Math.min(
                              (room.earnings / maxRoomEarning) * 100,
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-2 flex justify-between">
                      <span className="text-[10px] text-gray-400">
                        {room.payments} paid
                      </span>

                      <span className="text-[10px] font-medium text-gray-500">
                        {paidAmount > 0
                          ? Math.round((room.earnings / paidAmount) * 100)
                          : 0}
                        % of total
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ======================================================
          TRANSACTIONS
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-xs text-gray-400">Payment history</p>
          </div>
        </div>

        {/* DESKTOP */}

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
                  Type
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
                      ${transaction.amount.toLocaleString()}
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

        {/* MOBILE */}

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
                  ${transaction.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {transactions.length === 0 && (
          <div className="p-10 text-center text-sm text-gray-400">
            No payment transactions yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// EARNING STAT
// ============================================================

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
            {growth >= 0 ? "+" : ""}
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

// ============================================================
// SUMMARY
// ============================================================

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

// ============================================================
// PAYMENT STATUS
// ============================================================

function PaymentStatus({ status }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1.5 text-[10px] font-semibold text-green-600">
        <CheckCircle size={12} />
        Paid
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1.5 text-[10px] font-semibold text-red-500">
        Payment Failed
      </span>
    );
  }

  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1.5 text-[10px] font-semibold text-gray-500">
        Cancelled
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

// ============================================================
// DATE HELPERS
// ============================================================

function getPaymentDate(paidAt, createdAt) {
  const preferred = paidAt || createdAt;

  if (!preferred) {
    return null;
  }

  if (typeof preferred.toDate === "function") {
    return preferred.toDate();
  }

  if (preferred instanceof Date) {
    return preferred;
  }

  const date = new Date(preferred);

  return Number.isNaN(date.getTime()) ? null : date;
}

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

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  let date = null;

  if (typeof value.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string") {
    // Handles YYYY-MM-DD
    // without timezone shifting.
    const parts = value.split("-");

    if (parts.length === 3) {
      date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    } else {
      date = new Date(value);
    }
  }

  if (!date || Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}
