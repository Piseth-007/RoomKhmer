import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
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
  CircleCheck,
  FileText,
  AlertCircle,
} from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";

export default function AdminReports() {
  const [period, setPeriod] = useState("6months");
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersSnapshot, roomsSnapshot, bookingsSnapshot, paymentsSnapshot] =
        await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "rooms")),
          getDocs(collection(db, "bookings")),
          getDocs(collection(db, "payments")),
        ]);

      setUsers(
        usersSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })),
      );

      setRooms(
        roomsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })),
      );

      setBookings(
        bookingsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })),
      );

      setPayments(
        paymentsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })),
      );
    } catch (err) {
      console.error("Admin reports error:", err);

      if (err.code === "permission-denied") {
        setError(
          "Permission denied. Make sure the logged-in account is an admin and Firestore rules allow admin access.",
        );
      } else {
        setError(err.message || "Failed to load reports.");
      }
    } finally {
      setLoading(false);
    }
  };

  const tenantCount = useMemo(() => {
    return users.filter((user) => {
      const role = String(user.role || "").toLowerCase();

      return role === "student" || role === "tenant";
    }).length;
  }, [users]);

  const landlordCount = useMemo(() => {
    return users.filter((user) => {
      const role = String(user.role || "").toLowerCase();

      return role === "landlord" || role === "owner";
    }).length;
  }, [users]);

  const adminCount = useMemo(() => {
    return users.filter((user) => {
      return String(user.role || "").toLowerCase() === "admin";
    }).length;
  }, [users]);

  const roomStats = useMemo(() => {
    const approved = rooms.filter((room) => {
      const status = String(room.status || "").toLowerCase();

      return status === "approved" || status === "active";
    }).length;

    const pending = rooms.filter((room) => {
      return String(room.status || "").toLowerCase() === "pending";
    }).length;

    const rejected = rooms.filter((room) => {
      return String(room.status || "").toLowerCase() === "rejected";
    }).length;

    const occupied = rooms.filter((room) => {
      return String(room.status || "").toLowerCase() === "occupied";
    }).length;

    const available = rooms.filter((room) => {
      const status = String(room.status || "").toLowerCase();

      return (
        status === "available" || status === "approved" || status === "active"
      );
    }).length;

    return {
      total: rooms.length,
      approved,
      pending,
      rejected,
      occupied,
      available,
    };
  }, [rooms]);

  const bookingStats = useMemo(() => {
    const getCount = (value) => {
      return bookings.filter((booking) => {
        return String(booking.status || "").toLowerCase() === value;
      }).length;
    };

    return {
      total: bookings.length,
      pending: getCount("pending"),
      confirmed: getCount("confirmed"),
      active: getCount("active"),
      completed: getCount("completed"),
      cancelled: getCount("cancelled"),
    };
  }, [bookings]);

  const paymentStats = useMemo(() => {
    let paid = 0;
    let pending = 0;
    let refunded = 0;

    let paidRevenue = 0;
    let pendingAmount = 0;
    let refundedAmount = 0;

    payments.forEach((payment) => {
      const status = String(
        payment.status || payment.paymentStatus || "",
      ).toLowerCase();

      const amount = Number(
        payment.amount ||
          payment.total ||
          payment.monthlyAmount ||
          payment.rent ||
          0,
      );

      if (status === "paid") {
        paid += 1;
        paidRevenue += amount;
      }

      if (status === "pending") {
        pending += 1;
        pendingAmount += amount;
      }

      if (status === "refunded") {
        refunded += 1;
        refundedAmount += amount;
      }
    });

    if (payments.length === 0) {
      bookings.forEach((booking) => {
        const status = String(
          booking.paymentStatus || booking.payment || "",
        ).toLowerCase();

        const amount = Number(
          booking.amount || booking.totalRent || booking.total || 0,
        );

        if (status === "paid") {
          paid += 1;
          paidRevenue += amount;
        }

        if (status === "pending") {
          pending += 1;
          pendingAmount += amount;
        }
      });
    }

    return {
      paid,
      pending,
      refunded,
      paidRevenue,
      pendingAmount,
      refundedAmount,
    };
  }, [payments, bookings]);

  const contractValue = useMemo(() => {
    return bookings.reduce((total, booking) => {
      return (
        total +
        Number(booking.totalRent || booking.total || booking.amount || 0)
      );
    }, 0);
  }, [bookings]);

  const monthlyData = useMemo(() => {
    const count = period === "3months" ? 3 : period === "12months" ? 12 : 6;

    const result = [];

    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const monthBookings = bookings.filter((booking) => {
        return isSameMonth(
          getDateValue(booking.createdAt || booking.bookingDate),
          date,
        );
      });

      const monthUsers = users.filter((user) => {
        return isSameMonth(getDateValue(user.createdAt || user.joinedAt), date);
      });

      const monthPayments = payments.filter((payment) => {
        return isSameMonth(
          getDateValue(
            payment.paidAt || payment.createdAt || payment.paymentDate,
          ),
          date,
        );
      });

      let revenue = 0;

      monthPayments.forEach((payment) => {
        const status = String(
          payment.status || payment.paymentStatus || "",
        ).toLowerCase();

        if (status === "paid") {
          revenue += Number(
            payment.amount ||
              payment.total ||
              payment.monthlyAmount ||
              payment.rent ||
              0,
          );
        }
      });

      if (payments.length === 0) {
        monthBookings.forEach((booking) => {
          const status = String(
            booking.paymentStatus || booking.payment || "",
          ).toLowerCase();

          if (status === "paid") {
            revenue += Number(
              booking.amount || booking.totalRent || booking.total || 0,
            );
          }
        });
      }

      result.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
        }),
        revenue,
        bookings: monthBookings.length,
        users: monthUsers.length,
      });
    }

    return result;
  }, [period, bookings, payments, users]);

  const maxRevenue = Math.max(1, ...monthlyData.map((item) => item.revenue));

  const maxBookings = Math.max(1, ...monthlyData.map((item) => item.bookings));

  const bookingStatus = useMemo(() => {
    const total = Math.max(1, bookingStats.total);

    return [
      {
        label: "Completed",
        value: bookingStats.completed,
        percentage: (bookingStats.completed / total) * 100,
        icon: CircleCheck,
        className: "bg-purple-500",
        textClass: "text-purple-600",
        bgClass: "bg-purple-50",
      },
      {
        label: "Active",
        value: bookingStats.active,
        percentage: (bookingStats.active / total) * 100,
        icon: CheckCircle,
        className: "bg-green-500",
        textClass: "text-green-600",
        bgClass: "bg-green-50",
      },
      {
        label: "Confirmed",
        value: bookingStats.confirmed,
        percentage: (bookingStats.confirmed / total) * 100,
        icon: CalendarDays,
        className: "bg-blue-500",
        textClass: "text-blue-600",
        bgClass: "bg-blue-50",
      },
      {
        label: "Pending",
        value: bookingStats.pending,
        percentage: (bookingStats.pending / total) * 100,
        icon: Clock,
        className: "bg-yellow-500",
        textClass: "text-yellow-600",
        bgClass: "bg-yellow-50",
      },
      {
        label: "Cancelled",
        value: bookingStats.cancelled,
        percentage: (bookingStats.cancelled / total) * 100,
        icon: XCircle,
        className: "bg-red-500",
        textClass: "text-red-500",
        bgClass: "bg-red-50",
      },
    ];
  }, [bookingStats]);

  const locations = useMemo(() => {
    const data = {};

    rooms.forEach((room) => {
      const location = room.location || room.address || "Unknown";

      if (!data[location]) {
        data[location] = {
          name: location,
          rooms: 0,
          bookings: 0,
          revenue: 0,
        };
      }

      data[location].rooms += 1;
    });

    bookings.forEach((booking) => {
      const location = booking.location || booking.address || "Unknown";

      if (!data[location]) {
        data[location] = {
          name: location,
          rooms: 0,
          bookings: 0,
          revenue: 0,
        };
      }

      data[location].bookings += 1;
    });

    payments.forEach((payment) => {
      const status = String(
        payment.status || payment.paymentStatus || "",
      ).toLowerCase();

      if (status !== "paid") {
        return;
      }

      const location = payment.location || payment.address || "Unknown";

      if (!data[location]) {
        data[location] = {
          name: location,
          rooms: 0,
          bookings: 0,
          revenue: 0,
        };
      }

      data[location].revenue += Number(
        payment.amount ||
          payment.total ||
          payment.monthlyAmount ||
          payment.rent ||
          0,
      );
    });

    return Object.values(data)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [rooms, bookings, payments]);

  const landlords = useMemo(() => {
    const data = {};

    users.forEach((user) => {
      const role = String(user.role || "").toLowerCase();

      if (role !== "landlord" && role !== "owner") {
        return;
      }

      data[user.id] = {
        id: user.id,
        name: user.name || user.displayName || user.email || "Unknown Landlord",
        rooms: 0,
        bookings: 0,
        revenue: 0,
      };
    });

    rooms.forEach((room) => {
      const landlordId = room.landlordId;

      if (landlordId && data[landlordId]) {
        data[landlordId].rooms += 1;
      }
    });

    bookings.forEach((booking) => {
      const landlordId = booking.landlordId;

      if (landlordId && data[landlordId]) {
        data[landlordId].bookings += 1;
      }
    });

    payments.forEach((payment) => {
      const status = String(
        payment.status || payment.paymentStatus || "",
      ).toLowerCase();

      if (status !== "paid") {
        return;
      }

      const landlordId = payment.landlordId;

      if (landlordId && data[landlordId]) {
        data[landlordId].revenue += Number(
          payment.amount ||
            payment.total ||
            payment.monthlyAmount ||
            payment.rent ||
            0,
        );
      }
    });

    return Object.values(data)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [users, rooms, bookings, payments]);

  const exportReport = () => {
    const rows = [
      ["Report", "Value"],
      ["Total Users", users.length],
      ["Tenants", tenantCount],
      ["Landlords", landlordCount],
      ["Admins", adminCount],
      ["Total Rooms", roomStats.total],
      ["Approved Rooms", roomStats.approved],
      ["Pending Rooms", roomStats.pending],
      ["Rejected Rooms", roomStats.rejected],
      ["Total Bookings", bookingStats.total],
      ["Pending Bookings", bookingStats.pending],
      ["Confirmed Bookings", bookingStats.confirmed],
      ["Active Rentals", bookingStats.active],
      ["Completed Rentals", bookingStats.completed],
      ["Cancelled Bookings", bookingStats.cancelled],
      ["Paid Payments", paymentStats.paid],
      ["Pending Payments", paymentStats.pending],
      ["Paid Revenue", paymentStats.paidRevenue],
      ["Pending Amount", paymentStats.pendingAmount],
      ["Contract Value", contractValue],
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `roomkhmer-report-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            onClick={exportReport}
            className="flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Download size={15} />

            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-5">
        <ReportStat
          label="Paid Revenue"
          value={`$${paymentStats.paidRevenue.toLocaleString()}`}
          icon={<Wallet size={19} />}
          className="bg-green-50 text-green-600"
        />

        <ReportStat
          label="Bookings"
          value={bookingStats.total}
          icon={<CalendarDays size={19} />}
          className="bg-blue-50 text-blue-600"
        />

        <ReportStat
          label="Users"
          value={users.length.toLocaleString()}
          icon={<Users size={19} />}
          className="bg-purple-50 text-purple-600"
        />

        <ReportStat
          label="Rooms"
          value={roomStats.total}
          icon={<House size={19} />}
          className="bg-yellow-50 text-yellow-600"
        />

        <ReportStat
          label="Landlords"
          value={landlordCount}
          icon={<ShieldCheck size={19} />}
          className="bg-pink-50 text-pink-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Revenue Performance
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Paid payments collected by month
              </p>
            </div>

            <span className="flex items-center gap-2 text-[10px] text-gray-400">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Paid Revenue
            </span>
          </div>

          <div className="mt-8">
            <div className="flex h-64 items-end gap-3 sm:gap-5">
              {monthlyData.map((item) => {
                const height = (item.revenue / maxRevenue) * 100;

                return (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  >
                    <span className="text-[8px] font-semibold text-gray-500 sm:text-[10px]">
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
        </section>

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
                        width: `${Math.min(item.percentage, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Booking Volume</h2>

            <p className="mt-1 text-xs text-gray-400">
              Number of bookings per month
            </p>
          </div>

          <span className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            Bookings
          </span>
        </div>

        <div className="mt-8">
          <div className="flex h-52 items-end gap-3 sm:gap-6">
            {monthlyData.map((item) => {
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
                    className="w-full max-w-16 rounded-t-xl bg-purple-500"
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Room Listings</h2>

              <p className="mt-1 text-xs text-gray-400">Current room status</p>
            </div>

            <House size={20} className="text-blue-600" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <RoomCard
              label="Approved"
              value={roomStats.approved}
              className="bg-green-50 text-green-600"
            />

            <RoomCard
              label="Pending"
              value={roomStats.pending}
              className="bg-yellow-50 text-yellow-600"
            />

            <RoomCard
              label="Rejected"
              value={roomStats.rejected}
              className="bg-red-50 text-red-500"
            />

            <RoomCard
              label="Occupied"
              value={roomStats.occupied}
              className="bg-blue-50 text-blue-600"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Payment Overview
              </h2>

              <p className="mt-1 text-xs text-gray-400">Payment activity</p>
            </div>

            <Wallet size={20} className="text-green-600" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <PaymentCard
              label="Paid"
              value={paymentStats.paid}
              amount={paymentStats.paidRevenue}
              className="bg-green-50 text-green-600"
            />

            <PaymentCard
              label="Pending"
              value={paymentStats.pending}
              amount={paymentStats.pendingAmount}
              className="bg-yellow-50 text-yellow-600"
            />

            <PaymentCard
              label="Refunded"
              value={paymentStats.refunded}
              amount={paymentStats.refundedAmount}
              className="bg-red-50 text-red-500"
            />

            <PaymentCard
              label="Contract Value"
              value={bookings.length}
              amount={contractValue}
              className="bg-blue-50 text-blue-600"
            />
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Top Locations</h2>

            <p className="mt-1 text-xs text-gray-400">Highest activity areas</p>
          </div>

          <MapPin size={20} className="text-blue-600" />
        </div>

        {locations.length === 0 ? (
          <EmptyReport text="No location data available." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <TableHead>Location</TableHead>

                  <TableHead>Rooms</TableHead>

                  <TableHead>Bookings</TableHead>

                  <TableHead>Paid Revenue</TableHead>
                </tr>
              </thead>

              <tbody>
                {locations.map((location, index) => (
                  <tr
                    key={location.name}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                          {index + 1}
                        </span>

                        <span className="text-xs font-semibold text-gray-700">
                          {location.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-600">
                      {location.rooms}
                    </td>

                    <td className="px-5 py-4 text-xs font-semibold text-gray-700">
                      {location.bookings}
                    </td>

                    <td className="px-5 py-4 text-sm font-bold text-green-600">
                      ${location.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Top Landlords</h2>

            <p className="mt-1 text-xs text-gray-400">
              Landlords with the highest activity
            </p>
          </div>

          <ShieldCheck size={20} className="text-purple-600" />
        </div>

        {landlords.length === 0 ? (
          <EmptyReport text="No landlord data available." />
        ) : (
          <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-5">
            {landlords.map((landlord, index) => (
              <div key={landlord.id} className="p-5">
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
                  <div className="flex justify-between">
                    <span className="text-[10px] text-gray-400">Rooms</span>

                    <span className="text-xs font-semibold text-gray-700">
                      {landlord.rooms}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[10px] text-gray-400">Bookings</span>

                    <span className="text-xs font-semibold text-gray-700">
                      {landlord.bookings}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[10px] text-gray-400">
                      Paid Revenue
                    </span>

                    <span className="text-xs font-bold text-green-600">
                      ${landlord.revenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600">
            <FileText size={19} />
          </div>

          <div>
            <p className="text-sm font-bold text-blue-900">Report ready</p>

            <p className="mt-1 text-[10px] text-blue-600">
              Export the current platform report.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={exportReport}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
        >
          <Download size={15} />
          Download Report
        </button>
      </div>
    </div>
  );
}

function ReportStat({ label, value, icon, className }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs text-gray-500">{label}</p>

      <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
        {value}
      </p>
    </div>
  );
}

function RoomCard({ label, value, className }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div
        className={`inline-flex rounded-lg px-3 py-2 text-xs font-semibold ${className}`}
      >
        {label}
      </div>

      <p className="mt-3 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function PaymentCard({ label, value, amount, className }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div
        className={`inline-flex rounded-lg px-3 py-2 text-xs font-semibold ${className}`}
      >
        {label}
      </div>

      <p className="mt-3 text-xl font-bold text-gray-900">{value}</p>

      <p className="mt-1 text-xs text-gray-500">
        ${Number(amount || 0).toLocaleString()}
      </p>
    </div>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </th>
  );
}

function EmptyReport({ text }) {
  return (
    <div className="px-5 py-12 text-center">
      <BarChart3 size={25} className="mx-auto text-gray-300" />

      <p className="mt-3 text-xs text-gray-400">{text}</p>
    </div>
  );
}

function getDateValue(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  if (typeof value.toMillis === "function") {
    return new Date(value.toMillis());
  }

  if (value instanceof Date) {
    return value;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function isSameMonth(value, target) {
  if (!value) {
    return false;
  }

  return (
    value.getFullYear() === target.getFullYear() &&
    value.getMonth() === target.getMonth()
  );
}
