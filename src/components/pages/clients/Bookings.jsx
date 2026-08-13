import {
  CalendarDays,
  MapPin,
  BedDouble,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Bookings() {
  const bookings = [
    {
      id: 1,
      roomName: "Modern Private Room",
      location: "Toul Kork, Phnom Penh",
      image:
        "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=800&q=80",
      price: 180,
      period: "month",
      moveIn: "September 1, 2026",
      bookedAt: "August 10, 2026",
      status: "confirmed",
    },
    {
      id: 2,
      roomName: "Cozy Student Room",
      location: "Sen Sok, Phnom Penh",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      price: 150,
      period: "month",
      moveIn: "October 1, 2026",
      bookedAt: "August 12, 2026",
      status: "pending",
    },
    {
      id: 3,
      roomName: "Budget Single Room",
      location: "Mean Chey, Phnom Penh",
      image:
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
      price: 120,
      period: "month",
      moveIn: "August 20, 2026",
      bookedAt: "August 5, 2026",
      status: "cancelled",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>

          <p className="mt-2 text-gray-500">
            Manage your room requests and bookings
          </p>
        </div>

        {/* =====================================================
            SUMMARY
        ====================================================== */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <SummaryCard
            icon={<CalendarDays size={21} />}
            label="Total"
            value={bookings.length}
          />

          <SummaryCard
            icon={<CheckCircle size={21} />}
            label="Confirmed"
            value={
              bookings.filter((booking) => booking.status === "confirmed")
                .length
            }
          />

          <SummaryCard
            icon={<Clock size={21} />}
            label="Pending"
            value={
              bookings.filter((booking) => booking.status === "pending").length
            }
          />

          <SummaryCard
            icon={<XCircle size={21} />}
            label="Cancelled"
            value={
              bookings.filter((booking) => booking.status === "cancelled")
                .length
            }
          />
        </div>

        {/* =====================================================
            BOOKINGS
        ====================================================== */}

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

/* ============================================================
   SUMMARY CARD
============================================================ */

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

/* ============================================================
   BOOKING CARD
============================================================ */

function BookingCard({ booking }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col md:flex-row">
        {/* =================================================
            IMAGE
        ================================================== */}

        <div className="h-56 w-full shrink-0 md:h-auto md:w-64">
          <img
            src={booking.image}
            alt={booking.roomName}
            className="h-full w-full object-cover"
          />
        </div>

        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* Top */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {booking.roomName}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                <MapPin size={16} className="text-blue-600" />
                {booking.location}
              </div>
            </div>

            <StatusBadge status={booking.status} />
          </div>

          {/* Details */}

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Detail
              icon={<BedDouble size={17} />}
              label="Monthly Rent"
              value={`$${booking.price}/${booking.period}`}
            />

            <Detail
              icon={<CalendarDays size={17} />}
              label="Move-in Date"
              value={booking.moveIn}
            />

            <Detail
              icon={<Clock size={17} />}
              label="Requested On"
              value={booking.bookedAt}
            />
          </div>

          {/* Bottom */}

          <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-400">
              Booking ID: #{String(booking.id).padStart(5, "0")}
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

/* ============================================================
   DETAIL
============================================================ */

function Detail({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
      <div className="text-blue-600">{icon}</div>

      <div>
        <p className="text-xs text-gray-400">{label}</p>

        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({ status }) {
  const statusConfig = {
    confirmed: {
      label: "Confirmed",
      icon: <CheckCircle size={15} />,
      className: "bg-green-50 text-green-600",
    },

    pending: {
      label: "Pending",
      icon: <AlertCircle size={15} />,
      className: "bg-yellow-50 text-yellow-600",
    },

    cancelled: {
      label: "Cancelled",
      icon: <XCircle size={15} />,
      className: "bg-red-50 text-red-500",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

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
        className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Find a Room
      </Link>
    </div>
  );
}
