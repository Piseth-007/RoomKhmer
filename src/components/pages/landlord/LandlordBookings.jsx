import { useEffect, useMemo, useState } from "react";

import {
  Search,
  CalendarDays,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MapPin,
  User,
  Phone,
  MoreVertical,
  AlertCircle,
  Wallet,
  House,
  CircleCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  writeBatch,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../../firebase/config";

export default function LandlordBookings() {
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [openMenu, setOpenMenu] = useState(null);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    let unsubscribe;

    const loadData = async (user) => {
      try {
        setLoading(true);
        setError("");

        if (!user) {
          throw new Error("Please login as a landlord.");
        }

        const landlordId = user.uid;

        const requestQuery = query(
          collection(db, "roomRequests"),
          where("landlordId", "==", landlordId),
        );

        const bookingQuery = query(
          collection(db, "bookings"),
          where("landlordId", "==", landlordId),
        );

        const paymentQuery = query(
          collection(db, "payments"),
          where("landlordId", "==", landlordId),
        );

        const [requestSnapshot, bookingSnapshot, paymentSnapshot] =
          await Promise.all([
            getDocs(requestQuery),
            getDocs(bookingQuery),
            getDocs(paymentQuery),
          ]);

        const requestData = requestSnapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,
            source: "request",

            ...data,

            tenant:
              data.tenantName ||
              data.tenant ||
              data.userName ||
              "Unknown Tenant",

            tenantId: data.tenantId || data.userId || "",

            email: data.tenantEmail || data.email || "",

            phone:
              data.tenantPhone || data.phone || data.phoneNumber || "No phone",

            room:
              data.roomName || data.room || data.roomTitle || "Unknown Room",

            roomId: data.roomId || "",

            location: data.location || data.roomLocation || "Unknown Location",

            checkIn: data.moveInDate || data.checkIn || data.startDate || "",

            checkOut: data.endDate || data.checkOut || "",

            monthlyRent: Number(
              data.monthlyRent ||
                data.roomPrice ||
                data.amount ||
                data.price ||
                0,
            ),

            rentalMonths: Math.max(
              1,
              Number(data.rentalMonths || data.months || 1),
            ),

            status: data.status || "pending",

            createdAt: data.createdAt || null,

            landlordId: data.landlordId || "",
          };
        });

        const bookingData = bookingSnapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,
            source: "booking",

            ...data,

            tenant: data.tenantName || data.tenant || "Unknown Tenant",

            tenantId: data.tenantId || "",

            email: data.tenantEmail || "",

            phone: data.tenantPhone || data.phone || "No phone",

            room: data.roomName || data.room || "Unknown Room",

            roomId: data.roomId || "",

            location: data.location || "Unknown Location",

            checkIn: data.startDate || data.moveInDate || "",

            checkOut: data.endDate || "",

            monthlyRent: Number(data.monthlyRent || data.amount || 0),

            rentalMonths: Math.max(1, Number(data.rentalMonths || 1)),

            totalRent: Number(data.totalRent || 0),

            status: data.status || "active",

            createdAt: data.createdAt || null,

            landlordId: data.landlordId || "",
          };
        });

        const paymentData = paymentSnapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,

            ...data,

            amount: Number(data.amount || 0),

            status: data.status || "pending",

            periodNumber: Number(data.periodNumber || 1),
          };
        });

        setRequests(requestData);
        setBookings(bookingData);
        setPayments(paymentData);
      } catch (err) {
        console.error("Landlord bookings error:", err);

        setError(
          err.code
            ? `${err.code}: ${err.message}`
            : err.message || "Failed to load bookings.",
        );
      } finally {
        setLoading(false);
      }
    };

    unsubscribe = onAuthStateChanged(auth, (user) => {
      loadData(user);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // ============================================================
  // MERGE DATA
  // ============================================================

  const allBookings = useMemo(() => {
    const bookingIds = new Set(bookings.map((booking) => booking.id));

    const bookingRows = bookings.map((booking) => {
      const bookingPayments = payments
        .filter((payment) => payment.bookingId === booking.id)
        .sort((a, b) => a.periodNumber - b.periodNumber);

      const paidPayments = bookingPayments.filter(
        (payment) => payment.status === "paid",
      );

      const pendingPayments = bookingPayments.filter(
        (payment) => payment.status === "pending",
      );

      const paidAmount = paidPayments.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0,
      );

      let paymentStatus = "pending";

      if (
        bookingPayments.length > 0 &&
        pendingPayments.length === 0 &&
        paidPayments.length > 0
      ) {
        paymentStatus = "paid";
      } else if (paidPayments.length > 0) {
        paymentStatus = "partial";
      }

      return {
        ...booking,

        payments: bookingPayments,

        paidPayments,

        pendingPayments,

        paidCount: paidPayments.length,

        pendingCount: pendingPayments.length,

        paidAmount,

        paymentStatus,
      };
    });

    const requestRows = requests
      .filter((request) => !request.bookingId && !bookingIds.has(request.id))
      .map((request) => ({
        ...request,

        source: "request",

        totalRent: request.monthlyRent * request.rentalMonths,

        payments: [],

        paidPayments: [],

        pendingPayments: [],

        paidCount: 0,

        pendingCount: 0,

        paidAmount: 0,

        paymentStatus: "pending",
      }));

    return [...requestRows, ...bookingRows].sort(
      (a, b) => getTime(b.createdAt) - getTime(a.createdAt),
    );
  }, [requests, bookings, payments]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredBookings = useMemo(() => {
    return allBookings.filter((booking) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        String(booking.id).toLowerCase().includes(searchText) ||
        String(booking.tenant).toLowerCase().includes(searchText) ||
        String(booking.room).toLowerCase().includes(searchText) ||
        String(booking.location).toLowerCase().includes(searchText);

      const matchesStatus =
        status === "all" ||
        normalizeStatus(booking.status) === normalizeStatus(status);

      return matchesSearch && matchesStatus;
    });
  }, [allBookings, search, status]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const pendingCount = allBookings.filter(
    (item) => item.source === "request" && item.status === "pending",
  ).length;

  const activeCount = allBookings.filter(
    (item) => item.status === "active",
  ).length;

  const completedCount = allBookings.filter(
    (item) => item.status === "completed",
  ).length;

  const cancelledCount = allBookings.filter(
    (item) => item.status === "cancelled" || item.status === "rejected",
  ).length;

  // ============================================================
  // EARNINGS
  // ============================================================

  const earnings = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  // ============================================================
  // PENDING AMOUNT
  // ============================================================

  const pendingAmount = payments
    .filter((payment) => payment.status === "pending")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  // ============================================================
  // ACCEPT REQUEST
  // ============================================================

  const acceptRequest = async (request) => {
    try {
      setActionLoading(request.id);

      setError("");

      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please login as landlord.");
      }

      if (request.landlordId !== user.uid) {
        throw new Error("You cannot manage this request.");
      }

      if (request.status !== "pending") {
        throw new Error("This request has already been processed.");
      }

      const monthlyRent = Number(
        request.monthlyRent ||
          request.amount ||
          request.roomPrice ||
          request.price ||
          0,
      );

      const rentalMonths = Math.max(
        1,
        Number(request.rentalMonths || request.months || 1),
      );

      if (monthlyRent <= 0) {
        throw new Error("Invalid monthly rent.");
      }

      const startDate = parseDate(
        request.checkIn || request.moveInDate || request.startDate,
      );

      if (!startDate) {
        throw new Error("Move-in date is required.");
      }

      const endDate = addMonths(startDate, rentalMonths);

      const totalRent = monthlyRent * rentalMonths;

      const confirmed = window.confirm(
        `Accept this rental?\n\n` +
          `Tenant: ${request.tenant}\n` +
          `Room: ${request.room}\n` +
          `Monthly rent: $${monthlyRent}\n` +
          `Rental period: ${rentalMonths} month(s)\n` +
          `Total: $${totalRent}`,
      );

      if (!confirmed) {
        return;
      }

      const batch = writeBatch(db);

      const bookingRef = doc(collection(db, "bookings"));

      // ------------------------------------------------------
      // REQUEST
      // ------------------------------------------------------

      batch.update(doc(db, "roomRequests", request.id), {
        status: "accepted",

        bookingId: bookingRef.id,

        updatedAt: serverTimestamp(),
      });

      // ------------------------------------------------------
      // BOOKING
      // ------------------------------------------------------

      batch.set(bookingRef, {
        requestId: request.id,

        tenantId: request.tenantId,

        tenantName: request.tenant,

        tenantEmail: request.email || "",

        tenantPhone: request.phone || "",

        landlordId: user.uid,

        landlordName: user.displayName || "",

        roomId: request.roomId,

        roomName: request.room,

        location: request.location || "",

        monthlyRent,

        rentalMonths,

        totalRent,

        startDate: formatDateForFirestore(startDate),

        endDate: formatDateForFirestore(endDate),

        status: "active",

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      });

      // ------------------------------------------------------
      // MONTHLY PAYMENTS
      // ------------------------------------------------------

      for (let i = 0; i < rentalMonths; i++) {
        const periodStart = addMonths(startDate, i);

        const periodEnd = addMonths(startDate, i + 1);

        const paymentRef = doc(collection(db, "payments"));

        batch.set(paymentRef, {
          bookingId: bookingRef.id,

          tenantId: request.tenantId,

          tenantName: request.tenant,

          tenantEmail: request.email || "",

          landlordId: user.uid,

          roomId: request.roomId,

          roomName: request.room,

          location: request.location || "",

          amount: monthlyRent,

          currency: "USD",

          periodNumber: i + 1,

          periodStart: formatDateForFirestore(periodStart),

          periodEnd: formatDateForFirestore(periodEnd),

          dueDate: formatDateForFirestore(periodStart),

          paymentMethod: null,

          status: "pending",

          paidAt: null,

          createdAt: serverTimestamp(),

          updatedAt: serverTimestamp(),
        });
      }

      // ------------------------------------------------------
      // ROOM
      // ------------------------------------------------------

      if (request.roomId) {
        batch.update(doc(db, "rooms", request.roomId), {
          status: "occupied",

          updatedAt: serverTimestamp(),
        });
      }

      // ------------------------------------------------------
      // COMMIT
      // ------------------------------------------------------

      await batch.commit();

      await reloadLandlordData();

      setOpenMenu(null);
    } catch (err) {
      console.error("Accept request error:", err);

      setError(
        err.code
          ? `${err.code}: ${err.message}`
          : err.message || "Failed to accept request.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // REJECT REQUEST
  // ============================================================

  const rejectRequest = async (request) => {
    try {
      setActionLoading(request.id);

      setError("");

      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please login first.");
      }

      if (request.landlordId !== user.uid) {
        throw new Error("You cannot manage this request.");
      }

      const confirmed = window.confirm("Reject this room request?");

      if (!confirmed) {
        return;
      }

      await updateDoc(doc(db, "roomRequests", request.id), {
        status: "rejected",

        updatedAt: serverTimestamp(),
      });

      setRequests((current) =>
        current.map((item) =>
          item.id === request.id
            ? {
                ...item,
                status: "rejected",
              }
            : item,
        ),
      );

      setOpenMenu(null);
    } catch (err) {
      console.error("Reject request error:", err);

      setError(
        err.code
          ? `${err.code}: ${err.message}`
          : err.message || "Failed to reject request.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // MARK PAYMENT PAID
  // ============================================================

  const markPaymentPaid = async (payment) => {
    try {
      setActionLoading(payment.id);

      setError("");

      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please login as landlord.");
      }

      if (payment.landlordId !== user.uid) {
        throw new Error("You cannot manage this payment.");
      }

      if (payment.status === "paid") {
        throw new Error("This payment is already paid.");
      }

      const confirmed = window.confirm(
        `Confirm payment received?\n\n` +
          `Month: ${payment.periodNumber}\n` +
          `Amount: $${Number(payment.amount || 0).toLocaleString()}`,
      );

      if (!confirmed) {
        return;
      }

      await updateDoc(doc(db, "payments", payment.id), {
        status: "paid",

        paidAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      });

      setPayments((current) =>
        current.map((item) =>
          item.id === payment.id
            ? {
                ...item,
                status: "paid",
              }
            : item,
        ),
      );

      setOpenMenu(null);
    } catch (err) {
      console.error("Payment update error:", err);

      setError(
        err.code
          ? `${err.code}: ${err.message}`
          : err.message || "Failed to update payment.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // COMPLETE BOOKING
  // ============================================================

  const completeBooking = async (booking) => {
    try {
      setActionLoading(booking.id);

      setError("");

      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please login first.");
      }

      if (booking.landlordId !== user.uid) {
        throw new Error("You cannot manage this booking.");
      }

      const confirmed = window.confirm("Mark this rental as completed?");

      if (!confirmed) {
        return;
      }

      const batch = writeBatch(db);

      batch.update(doc(db, "bookings", booking.id), {
        status: "completed",

        updatedAt: serverTimestamp(),
      });

      if (booking.requestId) {
        batch.update(doc(db, "roomRequests", booking.requestId), {
          status: "completed",

          updatedAt: serverTimestamp(),
        });
      }

      if (booking.roomId) {
        batch.update(doc(db, "rooms", booking.roomId), {
          status: "available",

          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();

      await reloadLandlordData();

      setOpenMenu(null);
    } catch (err) {
      console.error("Complete booking error:", err);

      setError(
        err.code
          ? `${err.code}: ${err.message}`
          : err.message || "Failed to complete booking.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // CANCEL BOOKING
  // ============================================================

  const cancelBooking = async (booking) => {
    try {
      setActionLoading(booking.id);

      setError("");

      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please login first.");
      }

      if (booking.landlordId !== user.uid) {
        throw new Error("You cannot manage this booking.");
      }

      const confirmed = window.confirm("Cancel this booking?");

      if (!confirmed) {
        return;
      }

      const batch = writeBatch(db);

      batch.update(doc(db, "bookings", booking.id), {
        status: "cancelled",

        updatedAt: serverTimestamp(),
      });

      if (booking.requestId) {
        batch.update(doc(db, "roomRequests", booking.requestId), {
          status: "cancelled",

          updatedAt: serverTimestamp(),
        });
      }

      if (booking.roomId) {
        batch.update(doc(db, "rooms", booking.roomId), {
          status: "available",

          updatedAt: serverTimestamp(),
        });
      }

      await batch.commit();

      await reloadLandlordData();

      setOpenMenu(null);
    } catch (err) {
      console.error("Cancel booking error:", err);

      setError(
        err.code
          ? `${err.code}: ${err.message}`
          : err.message || "Failed to cancel booking.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // RELOAD
  // ============================================================

  const reloadLandlordData = async () => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }

    const landlordId = user.uid;

    try {
      const [requestSnapshot, bookingSnapshot, paymentSnapshot] =
        await Promise.all([
          getDocs(
            query(
              collection(db, "roomRequests"),
              where("landlordId", "==", landlordId),
            ),
          ),

          getDocs(
            query(
              collection(db, "bookings"),
              where("landlordId", "==", landlordId),
            ),
          ),

          getDocs(
            query(
              collection(db, "payments"),
              where("landlordId", "==", landlordId),
            ),
          ),
        ]);

      setRequests(
        requestSnapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,
            source: "request",

            ...data,

            tenant: data.tenantName || data.tenant || "Unknown Tenant",

            tenantId: data.tenantId || data.userId || "",

            email: data.tenantEmail || data.email || "",

            phone: data.tenantPhone || data.phone || "No phone",

            room: data.roomName || data.room || "Unknown Room",

            roomId: data.roomId || "",

            location: data.location || "",

            checkIn: data.moveInDate || data.checkIn || data.startDate || "",

            checkOut: data.endDate || data.checkOut || "",

            monthlyRent: Number(
              data.monthlyRent || data.amount || data.roomPrice || 0,
            ),

            rentalMonths: Math.max(1, Number(data.rentalMonths || 1)),

            status: data.status || "pending",

            createdAt: data.createdAt || null,

            landlordId: data.landlordId || "",
          };
        }),
      );

      setBookings(
        bookingSnapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,
            source: "booking",

            ...data,

            tenant: data.tenantName || data.tenant || "Unknown Tenant",

            tenantId: data.tenantId || "",

            email: data.tenantEmail || "",

            phone: data.tenantPhone || data.phone || "No phone",

            room: data.roomName || data.room || "Unknown Room",

            roomId: data.roomId || "",

            location: data.location || "",

            checkIn: data.startDate || data.moveInDate || "",

            checkOut: data.endDate || "",

            monthlyRent: Number(data.monthlyRent || 0),

            rentalMonths: Math.max(1, Number(data.rentalMonths || 1)),

            totalRent: Number(data.totalRent || 0),

            status: data.status || "active",

            createdAt: data.createdAt || null,

            landlordId: data.landlordId || "",
          };
        }),
      );

      setPayments(
        paymentSnapshot.docs.map((item) => {
          const data = item.data();

          return {
            id: item.id,

            ...data,

            amount: Number(data.amount || 0),

            status: data.status || "pending",

            periodNumber: Number(data.periodNumber || 1),
          };
        }),
      );
    } catch (err) {
      console.error("Reload error:", err);

      setError(err.message || "Failed to reload data.");
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

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

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage room requests, rentals and payments
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-semibold text-red-700">Booking Error</p>

            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <BookingStat
          title="Pending Requests"
          value={pendingCount}
          icon={<Clock size={20} />}
          className="bg-yellow-50 text-yellow-600"
        />

        <BookingStat
          title="Active"
          value={activeCount}
          icon={<CheckCircle size={20} />}
          className="bg-green-50 text-green-600"
        />

        <BookingStat
          title="Completed"
          value={completedCount}
          icon={<CircleCheck size={20} />}
          className="bg-blue-50 text-blue-600"
        />

        <BookingStat
          title="Cancelled"
          value={cancelledCount}
          icon={<XCircle size={20} />}
          className="bg-red-50 text-red-500"
        />

        <BookingStat
          title="Earnings"
          value={`$${earnings.toLocaleString()}`}
          icon={<Wallet size={20} />}
          className="bg-purple-50 text-purple-600"
        />
      </div>

      {pendingAmount > 0 && (
        <div className="rounded-2xl border border-yellow-100 bg-yellow-50 p-4">
          <div className="flex items-center gap-3">
            <Wallet size={20} className="text-yellow-600" />

            <div>
              <p className="text-sm font-semibold text-yellow-800">
                Pending payments
              </p>

              <p className="mt-1 text-xs text-yellow-700">
                ${pendingAmount.toLocaleString()} is waiting for payment
                confirmation.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search booking, tenant or room..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-600 outline-none"
          >
            <option value="all">All Bookings</option>

            <option value="pending">Pending</option>

            <option value="accepted">Accepted</option>

            <option value="active">Active</option>

            <option value="completed">Completed</option>

            <option value="cancelled">Cancelled</option>

            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

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
                  Rental Period
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Payment
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
                  key={`${booking.source}-${booking.id}`}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  <td className="px-5 py-4">
                    <p className="max-w-37.5 truncate text-xs font-bold text-gray-800">
                      {booking.id}
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      {formatDateValue(booking.createdAt)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <User size={16} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-800">
                          {booking.tenant}
                        </p>

                        <p className="mt-1 text-[9px] text-gray-400">
                          {booking.phone}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-semibold text-gray-700">
                      {booking.room}
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-[9px] text-gray-400">
                      <MapPin size={10} />

                      {booking.location}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-xs font-medium text-gray-700">
                      {formatDateValue(booking.checkIn)}
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      to {formatDateValue(booking.checkOut)}
                    </p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      {booking.rentalMonths} month
                      {booking.rentalMonths !== 1 ? "s" : ""}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-gray-800">
                      ${booking.monthlyRent.toLocaleString()}
                    </p>

                    <p className="text-[9px] text-gray-400">/ month</p>

                    <p className="mt-1 text-[9px] text-gray-400">
                      Total ${booking.totalRent.toLocaleString()}
                    </p>

                    {booking.source === "booking" && (
                      <div className="mt-2">
                        {booking.paymentStatus === "paid" ? (
                          <span className="text-[9px] font-semibold text-green-600">
                            All payments paid
                          </span>
                        ) : booking.paymentStatus === "partial" ? (
                          <span className="text-[9px] font-semibold text-blue-600">
                            {booking.paidCount}/{booking.rentalMonths} paid
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-yellow-600">
                            Payment pending
                          </span>
                        )}
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <BookingStatus status={booking.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        type="button"
                        disabled={actionLoading === booking.id}
                        onClick={() =>
                          setOpenMenu(
                            openMenu === booking.id ? null : booking.id,
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                      >
                        {actionLoading === booking.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                        ) : (
                          <MoreVertical size={17} />
                        )}
                      </button>

                      {openMenu === booking.id && (
                        <BookingMenu
                          booking={booking}
                          onAccept={acceptRequest}
                          onReject={rejectRequest}
                          onComplete={completeBooking}
                          onCancel={cancelBooking}
                          onMarkPaymentPaid={markPaymentPaid}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 lg:hidden">
        {filteredBookings.map((booking) => (
          <div
            key={`${booking.source}-${booking.id}`}
            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-gray-800">{booking.id}</p>

                <p className="mt-1 text-[10px] text-gray-400">
                  {formatDateValue(booking.createdAt)}
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

                <p className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
                  <Phone size={10} />

                  {booking.phone}
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
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-gray-400">Move In</p>

                <p className="mt-1 text-xs font-semibold text-gray-700">
                  {formatDateValue(booking.checkIn)}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400">Move Out</p>

                <p className="mt-1 text-xs font-semibold text-gray-700">
                  {formatDateValue(booking.checkOut)}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="text-lg font-bold text-gray-900">
                ${booking.monthlyRent.toLocaleString()}
                <span className="ml-1 text-xs font-normal text-gray-400">
                  / month
                </span>
              </p>

              {booking.source === "request" && booking.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => acceptRequest(booking)}
                    disabled={actionLoading === booking.id}
                    className="flex-1 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-600"
                  >
                    Accept
                  </button>

                  <button
                    type="button"
                    onClick={() => rejectRequest(booking)}
                    disabled={actionLoading === booking.id}
                    className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-500"
                  >
                    Reject
                  </button>
                </div>
              )}

              {booking.source === "booking" &&
                booking.pendingPayments?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => markPaymentPaid(booking.pendingPayments[0])}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-green-50 px-3 py-2.5 text-xs font-semibold text-green-600"
                  >
                    <Wallet size={14} />
                    Confirm Payment Received
                    <span className="text-[10px]">
                      $
                      {Number(
                        booking.pendingPayments[0].amount || 0,
                      ).toLocaleString()}
                    </span>
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <CalendarDays size={25} />
          </div>

          <h2 className="mt-4 font-bold text-gray-900">No bookings found</h2>

          <p className="mt-1 text-sm text-gray-400">
            Try changing your search or filter.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STAT
// ============================================================

function BookingStat({ title, value, icon, className }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs text-gray-500">{title}</p>

      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// ============================================================
// STATUS
// ============================================================

function BookingStatus({ status }) {
  const config = {
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-yellow-50 text-yellow-600",
    },

    accepted: {
      label: "Accepted",
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
      icon: CircleCheck,
      className: "bg-blue-50 text-blue-600",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[9px] font-semibold ${current.className}`}
    >
      <Icon size={11} />

      {current.label}
    </span>
  );
}

// ============================================================
// MENU
// ============================================================

function BookingMenu({
  booking,
  onAccept,
  onReject,
  onComplete,
  onCancel,
  onMarkPaymentPaid,
}) {
  const nextPayment = booking.pendingPayments?.[0];

  return (
    <div className="absolute right-0 top-10 z-30 w-56 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
      {booking.source === "booking" && (
        <Link
          to={`/landlord/bookings/${booking.id}`}
          className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50"
        >
          <Eye size={15} />
          View Booking
        </Link>
      )}

      {booking.source === "request" && booking.status === "pending" && (
        <>
          <button
            type="button"
            onClick={() => onAccept(booking)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50"
          >
            <CheckCircle size={15} />
            Accept Request
          </button>

          <button
            type="button"
            onClick={() => onReject(booking)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50"
          >
            <XCircle size={15} />
            Reject Request
          </button>
        </>
      )}

      {booking.source === "booking" && nextPayment && (
        <>
          <div className="my-1 border-t border-gray-100" />

          <div className="px-3 py-2">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
              Next Payment
            </p>

            <p className="mt-1 text-xs font-semibold text-gray-700">
              Month {nextPayment.periodNumber}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              ${Number(nextPayment.amount || 0).toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onMarkPaymentPaid(nextPayment)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50"
          >
            <Wallet size={15} />
            Confirm Payment Received
          </button>
        </>
      )}

      {booking.source === "booking" &&
        (booking.status === "active" || booking.status === "accepted") && (
          <>
            <button
              type="button"
              onClick={() => onComplete(booking)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-blue-600 hover:bg-blue-50"
            >
              <CircleCheck size={15} />
              Complete Rental
            </button>

            <button
              type="button"
              onClick={() => onCancel(booking)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50"
            >
              <XCircle size={15} />
              Cancel Booking
            </button>
          </>
        )}
    </div>
  );
}

// ============================================================
// DATE
// ============================================================

function parseDate(value) {
  if (!value) {
    return null;
  }

  if (value?.toDate) {
    return value.toDate();
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value);
  }

  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);

      return new Date(year, month - 1, day);
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

// ============================================================
// ADD MONTHS
// ============================================================

function addMonths(date, months) {
  const result = new Date(date);

  result.setMonth(result.getMonth() + months);

  return result;
}

// ============================================================
// FIRESTORE DATE
// ============================================================

function formatDateForFirestore(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ============================================================
// DISPLAY DATE
// ============================================================

function formatDateValue(value) {
  if (!value) {
    return "-";
  }

  const date = parseDate(value);

  if (!date) {
    return String(value);
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

// ============================================================
// TIMESTAMP
// ============================================================

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

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

// ============================================================
// STATUS FILTER
// ============================================================

function normalizeStatus(status) {
  return status;
}
