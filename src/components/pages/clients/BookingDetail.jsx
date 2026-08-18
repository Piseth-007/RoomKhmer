import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Home,
  Wallet,
  FileText,
  LoaderCircle,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../../../firebase/config";

export default function BookingDetail() {
  const { bookingId } = useParams();

  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);

  const [room, setRoom] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) {
        return;
      }

      if (!user) {
        setError("Please login to view this booking.");
        setLoading(false);
        return;
      }

      if (!bookingId) {
        setError("Booking ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const bookingRef = doc(db, "bookings", bookingId);

        const bookingSnapshot = await getDoc(bookingRef);

        if (!bookingSnapshot.exists()) {
          throw new Error("Booking not found.");
        }

        const bookingData = bookingSnapshot.data();

        if (bookingData.tenantId !== user.uid) {
          throw new Error("You do not have permission to view this booking.");
        }

        let roomData = null;

        if (bookingData.roomId) {
          const roomRef = doc(db, "rooms", bookingData.roomId);

          const roomSnapshot = await getDoc(roomRef);

          if (roomSnapshot.exists()) {
            roomData = roomSnapshot.data();
          }
        }

        if (mounted) {
          setBooking({
            id: bookingSnapshot.id,
            ...bookingData,
          });

          setRoom(roomData);
        }
      } catch (err) {
        console.error("Failed to load booking:", err);

        if (mounted) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[500px] max-w-5xl items-center justify-center">
          <div className="rounded-2xl border border-gray-100 bg-white px-10 py-12 text-center shadow-sm">
            <LoaderCircle
              size={36}
              className="mx-auto animate-spin text-blue-600"
            />

            <h2 className="mt-5 text-lg font-bold text-gray-900">
              Loading booking
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Please wait while we retrieve your booking information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={18} />
            Back to Bookings
          </button>

          <div className="rounded-2xl border border-red-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertCircle size={30} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">
              Unable to load booking
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {error}
            </p>

            <Link
              to="/bookings"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Bookings
              <ArrowLeft size={17} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const roomName = room?.name || booking.roomName || "Room";

  const location = room?.location || booking.location || "Location unavailable";

  const address = room?.address || booking.address || "";

  const image = getRoomImage(room);

  const price = Number(
    booking.monthlyRent ?? booking.price ?? room?.price ?? 0,
  );

  const rentalMonths = Number(booking.rentalMonths || 1);

  const totalRent = Number(booking.totalRent || price * rentalMonths);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/bookings")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Bookings
        </button>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Booking Details</p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {roomName}
            </h1>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <MapPin size={17} className="text-blue-600" />

              {location}
            </div>
          </div>

          <StatusBadge status={booking.status} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="h-72 w-full bg-gray-100 sm:h-96">
                {image ? (
                  <img
                    src={image}
                    alt={roomName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <BedDouble size={54} />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {roomName}
                    </h2>

                    <div className="mt-2 flex items-start gap-2 text-sm text-gray-500">
                      <MapPin
                        size={18}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />

                      <div>
                        <p>{location}</p>

                        {address && (
                          <p className="mt-1 text-xs text-gray-400">
                            {address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-xs text-gray-400">Monthly Rent</p>

                    <p className="mt-1 text-2xl font-bold text-blue-600">
                      ${formatNumber(price)}
                    </p>

                    <p className="text-xs text-gray-400">per month</p>
                  </div>
                </div>

                {room && (
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <RoomFeature
                      icon={<BedDouble size={18} />}
                      label="Bedrooms"
                      value={room.bedrooms || 1}
                    />

                    <RoomFeature
                      icon={<Home size={18} />}
                      label="Bathrooms"
                      value={room.bathrooms || 1}
                    />

                    <RoomFeature
                      icon={<BedDouble size={18} />}
                      label="Type"
                      value={room.type || "Room"}
                    />

                    <RoomFeature
                      icon={<MapPin size={18} />}
                      label="Area"
                      value={room.area ? `${room.area}` : "N/A"}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <CalendarDays size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Rental Period
                  </h2>

                  <p className="text-sm text-gray-500">Your booking schedule</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <DateCard
                  icon={<CalendarDays size={18} />}
                  label="Move-in Date"
                  value={
                    formatDate(booking.startDate || booking.moveIn) ||
                    "Not specified"
                  }
                />

                <DateCard
                  icon={<CalendarDays size={18} />}
                  label="End Date"
                  value={formatDate(booking.endDate) || "Not specified"}
                />

                <DateCard
                  icon={<Clock size={18} />}
                  label="Rental Period"
                  value={`${rentalMonths} ${
                    rentalMonths === 1 ? "month" : "months"
                  }`}
                />
              </div>
            </div>

            {room?.description && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <FileText size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Room Description
                    </h2>

                    <p className="text-sm text-gray-500">About this room</p>
                  </div>
                </div>

                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {room.description}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Wallet size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Payment Summary
                  </h2>

                  <p className="text-sm text-gray-500">Booking cost</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <PriceRow
                  label="Monthly Rent"
                  value={`$${formatNumber(price)}`}
                />

                <PriceRow label="Rental Months" value={rentalMonths} />

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      Total Rent
                    </span>

                    <span className="text-xl font-bold text-blue-600">
                      ${formatNumber(totalRent)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">
                Booking Information
              </h2>

              <div className="mt-5 space-y-4">
                <InfoRow
                  icon={<FileText size={18} />}
                  label="Booking ID"
                  value={booking.id.slice(0, 12).toUpperCase()}
                />

                <InfoRow
                  icon={<CalendarDays size={18} />}
                  label="Requested On"
                  value={
                    formatDate(booking.createdAt || booking.bookedAt) ||
                    "Not available"
                  }
                />

                <InfoRow
                  icon={<User size={18} />}
                  label="Landlord"
                  value={
                    booking.landlordId
                      ? booking.landlordId.slice(0, 10)
                      : "Not available"
                  }
                />

                <InfoRow
                  icon={<Home size={18} />}
                  label="Room ID"
                  value={
                    booking.roomId
                      ? booking.roomId.slice(0, 10)
                      : "Not available"
                  }
                />
              </div>
            </div>

            <Link
              to="/rooms"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:text-blue-600"
            >
              Find Another Room
              <ChevronRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomFeature({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <div className="text-blue-600">{icon}</div>

      <p className="mt-2 text-xs text-gray-400">{label}</p>

      <p className="mt-0.5 truncate text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

function DateCard({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="text-blue-600">{icon}</div>

      <p className="mt-3 text-xs text-gray-400">{label}</p>

      <p className="mt-1 text-sm font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function PriceRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>

      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-400">{label}</p>

        <p className="truncate text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "pending").toLowerCase();

  const configs = {
    pending: {
      label: "Pending",
      icon: <AlertCircle size={16} />,
      className: "bg-yellow-50 text-yellow-600 border-yellow-100",
    },

    requested: {
      label: "Requested",
      icon: <Clock size={16} />,
      className: "bg-yellow-50 text-yellow-600 border-yellow-100",
    },

    confirmed: {
      label: "Confirmed",
      icon: <CheckCircle size={16} />,
      className: "bg-green-50 text-green-600 border-green-100",
    },

    active: {
      label: "Active",
      icon: <CheckCircle size={16} />,
      className: "bg-green-50 text-green-600 border-green-100",
    },

    completed: {
      label: "Completed",
      icon: <CheckCircle size={16} />,
      className: "bg-blue-50 text-blue-600 border-blue-100",
    },

    cancelled: {
      label: "Cancelled",
      icon: <XCircle size={16} />,
      className: "bg-red-50 text-red-500 border-red-100",
    },

    rejected: {
      label: "Rejected",
      icon: <XCircle size={16} />,
      className: "bg-red-50 text-red-500 border-red-100",
    },
  };

  const config = configs[normalized] || configs.pending;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
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

function formatNumber(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0";
  }

  return number.toLocaleString("en-US");
}

function getErrorMessage(error) {
  if (error?.code === "permission-denied") {
    return "You do not have permission to view this booking.";
  }

  if (error?.code === "unauthenticated") {
    return "Please login to view this booking.";
  }

  return error?.message || "Unable to load the booking.";
}
