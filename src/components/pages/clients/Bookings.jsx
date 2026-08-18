import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  BedDouble,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../../firebase/config";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) {
        return;
      }

      if (!user) {
        setBookings([]);
        setError("Please login to view your bookings.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const bookingsRef = collection(db, "bookings");

        const bookingsQuery = query(
          bookingsRef,
          where("tenantId", "==", user.uid),
        );

        const snapshot = await getDocs(bookingsQuery);

        const bookingData = await Promise.all(
          snapshot.docs.map(async (bookingDoc) => {
            const booking = bookingDoc.data();

            let room = {};

            if (booking.roomId) {
              try {
                const roomRef = doc(db, "rooms", booking.roomId);

                const roomSnapshot = await getDoc(roomRef);

                if (roomSnapshot.exists()) {
                  room = roomSnapshot.data();
                }
              } catch (roomError) {
                console.error("Failed to load room:", roomError);
              }
            }

            return {
              id: bookingDoc.id,
              roomId: booking.roomId || "",
              roomName: room.name || booking.roomName || "Room",
              location:
                room.location || booking.location || "Location unavailable",
              address: room.address || booking.address || "",
              image: getRoomImage(room) || "",
              price: Number(
                booking.monthlyRent ?? booking.price ?? room.price ?? 0,
              ),
              period: "month",
              moveIn: booking.startDate || booking.moveIn || "",
              endDate: booking.endDate || "",
              bookedAt: booking.createdAt || booking.bookedAt || null,
              status: booking.status || "pending",
              rentalMonths: Number(booking.rentalMonths || 1),
              totalRent: Number(booking.totalRent || 0),
              landlordId: booking.landlordId || room.landlordId || "",
            };
          }),
        );

        bookingData.sort(
          (a, b) => getTimestamp(b.bookedAt) - getTimestamp(a.bookedAt),
        );

        if (isMounted) {
          setBookings(bookingData);
        }
      } catch (err) {
        console.error("Failed to load bookings:", err);

        if (isMounted) {
          setError(getFirebaseErrorMessage(err));
          setBookings([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "confirmed" || booking.status === "active",
  ).length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending" || booking.status === "requested",
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) =>
      booking.status === "cancelled" || booking.status === "rejected",
  ).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <PageHeader />

          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-100 bg-white">
            <div className="text-center">
              <LoaderCircle
                size={32}
                className="mx-auto animate-spin text-blue-600"
              />

              <p className="mt-4 text-sm font-semibold text-gray-700">
                Loading your bookings...
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Please wait while we retrieve your booking information.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <PageHeader />

          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertCircle size={28} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Unable to load bookings
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <PageHeader />

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <SummaryCard
            icon={<CalendarDays size={21} />}
            label="Total"
            value={totalBookings}
          />

          <SummaryCard
            icon={<CheckCircle size={21} />}
            label="Confirmed"
            value={confirmedBookings}
          />

          <SummaryCard
            icon={<Clock size={21} />}
            label="Pending"
            value={pendingBookings}
          />

          <SummaryCard
            icon={<XCircle size={21} />}
            label="Cancelled"
            value={cancelledBookings}
          />
        </div>

        <div className="space-y-5">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <EmptyBookings />
          )}
        </div>
      </div>
    </div>
  );
}

function PageHeader() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

      <p className="mt-2 text-gray-500">
        Manage your room requests and bookings
      </p>
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function BookingCard({ booking }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        <div className="h-56 w-full shrink-0 bg-gray-100 md:h-auto md:w-64">
          {booking.image ? (
            <img
              src={booking.image}
              alt={booking.roomName}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full min-h-56 items-center justify-center text-gray-400">
              <BedDouble size={42} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {booking.roomName}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin size={16} className="shrink-0 text-blue-600" />

                <span>{booking.location}</span>
              </div>

              {booking.address && (
                <p className="mt-1 text-xs text-gray-400">{booking.address}</p>
              )}
            </div>

            <StatusBadge status={booking.status} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Detail
              icon={<BedDouble size={17} />}
              label="Monthly Rent"
              value={`$${formatNumber(booking.price)}/${booking.period}`}
            />

            <Detail
              icon={<CalendarDays size={17} />}
              label="Move-in Date"
              value={formatDate(booking.moveIn) || "Not specified"}
            />

            <Detail
              icon={<Clock size={17} />}
              label="Requested On"
              value={formatDate(booking.bookedAt) || "Not available"}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {booking.rentalMonths > 0 && (
              <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                {booking.rentalMonths}{" "}
                {booking.rentalMonths === 1 ? "month" : "months"}
              </span>
            )}

            {booking.totalRent > 0 && (
              <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                Total: ${formatNumber(booking.totalRent)}
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-400">
              Booking ID: #{booking.id.slice(0, 8).toUpperCase()}
            </p>

            <Link
              to={`/bookings/${booking.id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View Details
              <ChevronRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
      <div className="text-blue-600">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>

        <p className="truncate text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus = String(status || "pending").toLowerCase();

  const statusConfig = {
    confirmed: {
      label: "Confirmed",
      icon: <CheckCircle size={15} />,
      className: "bg-green-50 text-green-600",
    },

    active: {
      label: "Active",
      icon: <CheckCircle size={15} />,
      className: "bg-green-50 text-green-600",
    },

    pending: {
      label: "Pending",
      icon: <AlertCircle size={15} />,
      className: "bg-yellow-50 text-yellow-600",
    },

    requested: {
      label: "Requested",
      icon: <Clock size={15} />,
      className: "bg-yellow-50 text-yellow-600",
    },

    cancelled: {
      label: "Cancelled",
      icon: <XCircle size={15} />,
      className: "bg-red-50 text-red-500",
    },

    rejected: {
      label: "Rejected",
      icon: <XCircle size={15} />,
      className: "bg-red-50 text-red-500",
    },

    completed: {
      label: "Completed",
      icon: <CheckCircle size={15} />,
      className: "bg-blue-50 text-blue-600",
    },
  };

  const config = statusConfig[normalizedStatus] || statusConfig.pending;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function EmptyBookings() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <CalendarDays size={30} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900">No bookings yet</h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        You haven't booked or requested any rooms yet. Find your perfect room
        and make your first booking.
      </p>

      <Link
        to="/rooms"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Find a Room
        <ChevronRight size={17} />
      </Link>
    </div>
  );
}

function getRoomImage(room) {
  if (!room) {
    return "";
  }

  if (Array.isArray(room.images) && room.images.length > 0) {
    return room.images[0];
  }

  if (typeof room.image === "string") {
    return room.image;
  }

  return "";
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  let date;

  if (value && typeof value.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatNumber(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0";
  }

  return number.toLocaleString("en-US");
}

function getFirebaseErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "You do not have permission to view these bookings.";
  }

  if (error?.code === "unauthenticated") {
    return "Please login to view your bookings.";
  }

  return error?.message || "Unable to load your bookings.";
}
