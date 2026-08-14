import { useMemo, useState } from "react";
import {
  Search,
  House,
  MapPin,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Eye,
  MoreVertical,
  Filter,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Bath,
  Wifi,
  Wind,
  Car,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminRooms() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [location, setLocation] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);

  const [rooms, setRooms] = useState([
    {
      id: "RM-00428",
      name: "Modern Private Room",
      landlord: "Sokha Property",
      landlordId: "LL-001",
      location: "Toul Kork",
      price: 180,
      type: "Private Room",
      bedrooms: 1,
      bathrooms: 1,
      image:
        "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi", "AC", "Parking"],
      status: "pending",
      submitted: "Aug 14, 2026",
    },

    {
      id: "RM-00427",
      name: "Student Friendly Room",
      landlord: "Dara Home",
      landlordId: "LL-002",
      location: "Sen Sok",
      price: 150,
      type: "Single Room",
      bedrooms: 1,
      bathrooms: 1,
      image:
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi", "AC"],
      status: "pending",
      submitted: "Aug 14, 2026",
    },

    {
      id: "RM-00426",
      name: "Luxury Studio",
      landlord: "BKK Residence",
      landlordId: "LL-003",
      location: "BKK1",
      price: 280,
      type: "Studio",
      bedrooms: 1,
      bathrooms: 1,
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi", "AC", "Parking"],
      status: "approved",
      submitted: "Aug 13, 2026",
    },

    {
      id: "RM-00425",
      name: "Cozy Student Room",
      landlord: "Happy Home",
      landlordId: "LL-004",
      location: "Chamkarmon",
      price: 130,
      type: "Private Room",
      bedrooms: 1,
      bathrooms: 1,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi", "Parking"],
      status: "approved",
      submitted: "Aug 12, 2026",
    },

    {
      id: "RM-00424",
      name: "Affordable Room Near University",
      landlord: "Phnom Penh Housing",
      landlordId: "LL-005",
      location: "Daun Penh",
      price: 120,
      type: "Single Room",
      bedrooms: 1,
      bathrooms: 1,
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi"],
      status: "rejected",
      submitted: "Aug 11, 2026",
    },

    {
      id: "RM-00423",
      name: "Modern Apartment",
      landlord: "City Living",
      landlordId: "LL-006",
      location: "7 Makara",
      price: 320,
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
      amenities: ["WiFi", "AC", "Parking"],
      status: "approved",
      submitted: "Aug 10, 2026",
    },
  ]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const query = search.toLowerCase();

      const matchesSearch =
        room.id.toLowerCase().includes(query) ||
        room.name.toLowerCase().includes(query) ||
        room.landlord.toLowerCase().includes(query) ||
        room.location.toLowerCase().includes(query);

      const matchesStatus = status === "all" || room.status === status;

      const matchesLocation = location === "all" || room.location === location;

      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [rooms, search, status, location]);

  // ============================================================
  // COUNTS
  // ============================================================

  const allCount = rooms.length;

  const pendingCount = rooms.filter((room) => room.status === "pending").length;

  const approvedCount = rooms.filter(
    (room) => room.status === "approved",
  ).length;

  const rejectedCount = rooms.filter(
    (room) => room.status === "rejected",
  ).length;

  // ============================================================
  // UPDATE ROOM STATUS
  // ============================================================

  const updateStatus = (id, newStatus) => {
    setRooms((current) =>
      current.map((room) =>
        room.id === id
          ? {
              ...room,
              status: newStatus,
            }
          : room,
      ),
    );

    setOpenMenu(null);
  };

  // ============================================================
  // DELETE ROOM
  // ============================================================

  const deleteRoom = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?",
    );

    if (!confirmed) return;

    setRooms((current) => current.filter((room) => room.id !== id));

    setOpenMenu(null);
  };

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <House size={19} className="text-blue-600" />

            <span className="text-xs font-semibold text-blue-600">
              ROOM MANAGEMENT
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">បន្ទប់</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage, review and approve room listings
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-2.5 text-xs font-semibold text-yellow-700">
            <AlertCircle size={16} />
            {pendingCount} rooms waiting for approval
          </div>
        )}
      </div>

      {/* ======================================================
          STATUS TABS
      ======================================================= */}

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-2 rounded-xl border border-gray-100 bg-white p-1.5 shadow-sm">
          <StatusTab
            label="All Rooms"
            count={allCount}
            active={status === "all"}
            onClick={() => setStatus("all")}
          />

          <StatusTab
            label="Pending"
            count={pendingCount}
            active={status === "pending"}
            onClick={() => setStatus("pending")}
            warning
          />

          <StatusTab
            label="Approved"
            count={approvedCount}
            active={status === "approved"}
            success
          />

          <StatusTab
            label="Rejected"
            count={rejectedCount}
            active={status === "rejected"}
            danger
          />
        </div>
      </div>

      {/* ======================================================
          SEARCH / FILTER
      ======================================================= */}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room, landlord, location..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Location */}

          <div className="relative">
            <MapPin
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-11 w-full min-w-[180px] rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-600 outline-none focus:border-blue-500"
            >
              <option value="all">All Locations</option>

              <option value="Toul Kork">Toul Kork</option>

              <option value="Sen Sok">Sen Sok</option>

              <option value="BKK1">BKK1</option>

              <option value="Chamkarmon">Chamkarmon</option>

              <option value="Daun Penh">Daun Penh</option>

              <option value="7 Makara">7 Makara</option>
            </select>
          </div>

          {/* Filter button */}

          <button
            type="button"
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      {/* ======================================================
          DESKTOP TABLE
      ======================================================= */}

      <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Room
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Landlord
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Location
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Details
                </th>

                <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Price
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
              {filteredRooms.map((room) => (
                <tr
                  key={room.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
                >
                  {/* Room */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="h-14 w-16 rounded-xl object-cover"
                      />

                      <div className="min-w-0">
                        <p className="max-w-[190px] truncate text-sm font-semibold text-gray-800">
                          {room.name}
                        </p>

                        <p className="mt-1 text-[10px] text-gray-400">
                          {room.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Landlord */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                        <User size={15} />
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-700">
                          {room.landlord}
                        </p>

                        <p className="text-[9px] text-gray-400">
                          {room.landlordId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <MapPin size={13} className="text-gray-400" />
                      {room.location}
                    </div>
                  </td>

                  {/* Details */}

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <BedDouble size={13} />
                        {room.bedrooms}
                      </span>

                      <span className="flex items-center gap-1">
                        <Bath size={13} />
                        {room.bathrooms}
                      </span>
                    </div>

                    <p className="mt-1 text-[9px] text-gray-400">{room.type}</p>
                  </td>

                  {/* Price */}

                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-gray-800">
                      ${room.price}
                    </p>

                    <p className="text-[9px] text-gray-400">/ month</p>
                  </td>

                  {/* Status */}

                  <td className="px-5 py-4">
                    <RoomStatus status={room.status} />
                  </td>

                  {/* Action */}

                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(openMenu === room.id ? null : room.id)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <MoreVertical size={17} />
                      </button>

                      {openMenu === room.id && (
                        <RoomMenu
                          room={room}
                          onUpdateStatus={updateStatus}
                          onDelete={deleteRoom}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table footer */}

        <TableFooter count={filteredRooms.length} total={rooms.length} />
      </div>

      {/* ======================================================
          MOBILE CARDS
      ======================================================= */}

      <div className="space-y-4 lg:hidden">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="relative">
              <img
                src={room.image}
                alt={room.name}
                className="h-44 w-full object-cover"
              />

              <div className="absolute left-3 top-3">
                <RoomStatus status={room.status} />
              </div>

              <div className="absolute right-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-[9px] font-medium text-white">
                {room.id}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-bold text-gray-900">
                    {room.name}
                  </h2>

                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                    <MapPin size={12} />
                    {room.location}
                  </p>
                </div>

                <p className="shrink-0 text-base font-bold text-gray-900">
                  ${room.price}
                  <span className="text-[9px] font-normal text-gray-400">
                    /mo
                  </span>
                </p>
              </div>

              {/* Landlord */}

              <div className="mt-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <User size={14} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-700">
                    {room.landlord}
                  </p>

                  <p className="text-[9px] text-gray-400">Landlord</p>
                </div>
              </div>

              {/* Details */}

              <div className="mt-4 flex items-center gap-4 border-y border-gray-100 py-3 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <BedDouble size={14} />
                  {room.bedrooms} Bedroom
                </span>

                <span className="flex items-center gap-1.5">
                  <Bath size={14} />
                  {room.bathrooms} Bathroom
                </span>
              </div>

              {/* Actions */}

              <div className="mt-4 flex gap-2">
                <Link
                  to={`/admin/rooms/${room.id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  <Eye size={15} />
                  View
                </Link>

                {room.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateStatus(room.id, "approved")}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-50 py-2.5 text-xs font-semibold text-green-600 transition hover:bg-green-100"
                    >
                      <CheckCircle size={15} />
                      Approve
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(room.id, "rejected")}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                    >
                      <XCircle size={16} />
                    </button>
                  </>
                )}

                {room.status !== "pending" && (
                  <button
                    type="button"
                    onClick={() => deleteRoom(room.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ======================================================
          EMPTY
      ======================================================= */}

      {filteredRooms.length === 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
            <House size={24} />
          </div>

          <h2 className="mt-4 text-sm font-bold text-gray-900">
            No rooms found
          </h2>

          <p className="mt-1 text-xs text-gray-400">
            Try changing your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   STATUS TAB
============================================================ */

function StatusTab({
  label,
  count,
  active,
  onClick,
  warning,
  success,
  danger,
}) {
  let activeClass = "bg-blue-600 text-white";

  if (warning) {
    activeClass = "bg-yellow-500 text-white";
  }

  if (success) {
    activeClass = "bg-green-600 text-white";
  }

  if (danger) {
    activeClass = "bg-red-500 text-white";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
        active ? activeClass : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      {label}

      <span
        className={`rounded-full px-1.5 py-0.5 text-[9px] ${
          active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

/* ============================================================
   ROOM STATUS
============================================================ */

function RoomStatus({ status }) {
  const config = {
    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-yellow-50 text-yellow-600",
    },

    approved: {
      label: "Approved",
      icon: CheckCircle,
      className: "bg-green-50 text-green-600",
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

/* ============================================================
   ROOM MENU
============================================================ */

function RoomMenu({ room, onUpdateStatus, onDelete }) {
  return (
    <div className="absolute right-0 top-10 z-30 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
      <Link
        to={`/admin/rooms/${room.id}`}
        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-gray-600 hover:bg-gray-50"
      >
        <Eye size={15} />
        View Details
      </Link>

      {room.status === "pending" && (
        <>
          <button
            type="button"
            onClick={() => onUpdateStatus(room.id, "approved")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50"
          >
            <CheckCircle size={15} />
            Approve Room
          </button>

          <button
            type="button"
            onClick={() => onUpdateStatus(room.id, "rejected")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50"
          >
            <XCircle size={15} />
            Reject Room
          </button>
        </>
      )}

      {room.status === "rejected" && (
        <button
          type="button"
          onClick={() => onUpdateStatus(room.id, "approved")}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50"
        >
          <CheckCircle size={15} />
          Approve Room
        </button>
      )}

      <div className="my-1 border-t border-gray-100" />

      <button
        type="button"
        onClick={() => onDelete(room.id)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50"
      >
        <Trash2 size={15} />
        Delete Room
      </button>
    </div>
  );
}

/* ============================================================
   TABLE FOOTER
============================================================ */

function TableFooter({ count, total }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-700">{count}</span> of{" "}
        <span className="font-semibold text-gray-700">{total}</span> rooms
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"
        >
          <ChevronLeft size={15} />
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white"
        >
          1
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
        >
          2
        </button>

        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
