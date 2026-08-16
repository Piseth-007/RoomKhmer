import { useEffect, useMemo, useState } from "react";

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
  Filter,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Bath,
  AlertCircle,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase/config";

const PAGE_SIZE = 10;

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("all");

  const [location, setLocation] = useState("all");

  const [openMenu, setOpenMenu] = useState(null);

  const [page, setPage] = useState(1);

  // ============================================================
  // LOAD ROOMS + LANDLORD USERS
  // ============================================================

  const loadRooms = async () => {
    try {
      setLoading(true);
      setError("");

      // --------------------------------------------------------
      // LOAD ROOMS
      // --------------------------------------------------------

      const roomsSnapshot = await getDocs(collection(db, "rooms"));

      // --------------------------------------------------------
      // LOAD USERS
      // Admin can read all users according to your rules.
      // --------------------------------------------------------

      const usersSnapshot = await getDocs(collection(db, "users"));

      // --------------------------------------------------------
      // CREATE USER MAP
      // --------------------------------------------------------

      const usersMap = new Map();

      usersSnapshot.docs.forEach((userDoc) => {
        const data = userDoc.data();

        usersMap.set(userDoc.id, {
          id: userDoc.id,
          ...data,
        });
      });

      // --------------------------------------------------------
      // CREATE ROOM DATA
      // --------------------------------------------------------

      const roomData = roomsSnapshot.docs
        .map((roomDoc) => {
          const data = roomDoc.data();

          const landlordId =
            data.landlordId || data.ownerId || data.userId || "";

          const landlordUser = usersMap.get(landlordId);

          // --------------------------------------------------
          // FIND LANDLORD NAME
          //
          // Priority:
          // 1. users/{landlordId}.name
          // 2. users/{landlordId}.displayName
          // 3. room.landlordName
          // 4. room.ownerName
          // 5. room.landlord
          // --------------------------------------------------

          const landlordName =
            landlordUser?.name ||
            landlordUser?.displayName ||
            data.landlordName ||
            data.ownerName ||
            data.landlord ||
            "Unknown Landlord";

          const landlordEmail =
            landlordUser?.email || data.landlordEmail || data.ownerEmail || "";

          const landlordPhoto =
            landlordUser?.photoURL ||
            landlordUser?.photo ||
            data.landlordPhotoURL ||
            "";

          return {
            id: roomDoc.id,

            ...data,

            name:
              data.name || data.englishTitle || data.title || "Untitled Room",

            landlord: landlordName,

            landlordId: landlordId,

            landlordEmail: landlordEmail,

            landlordPhoto: landlordPhoto,

            location: data.location || data.address || "Unknown Location",

            address: data.address || data.location || "",

            price: Number(data.price ?? data.monthlyRent ?? 0),

            type: data.type || data.roomType || "Room",

            bedrooms: Number(data.bedrooms ?? 0),

            bathrooms: Number(data.bathrooms ?? data.bathroom ?? 0),

            area: data.area || "",

            description: data.description || "",

            images: normalizeImages(data.images, data.image, data.photoURL),

            amenities: data.amenities || {},

            status: normalizeRoomStatus(data.status),

            createdAt: data.createdAt || null,

            updatedAt: data.updatedAt || null,
          };
        })
        .sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt));

      setRooms(roomData);
    } catch (err) {
      console.error("Error loading admin rooms:", err);

      setError(getFirebaseError(err, "Failed to load rooms."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // ============================================================
  // RESET PAGE
  // ============================================================

  useEffect(() => {
    setPage(1);
  }, [search, status, location]);

  // ============================================================
  // FILTER ROOMS
  // ============================================================

  const filteredRooms = useMemo(() => {
    const queryText = search.toLowerCase().trim();

    return rooms.filter((room) => {
      const roomId = String(room.id || "").toLowerCase();

      const roomName = String(room.name || "").toLowerCase();

      const landlord = String(room.landlord || "").toLowerCase();

      const landlordEmail = String(room.landlordEmail || "").toLowerCase();

      const roomLocation = String(room.location || "").toLowerCase();

      const roomType = String(room.type || "").toLowerCase();

      const matchesSearch =
        !queryText ||
        roomId.includes(queryText) ||
        roomName.includes(queryText) ||
        landlord.includes(queryText) ||
        landlordEmail.includes(queryText) ||
        roomLocation.includes(queryText) ||
        roomType.includes(queryText);

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

  const occupiedCount = rooms.filter(
    (room) => room.status === "occupied",
  ).length;

  const availableCount = rooms.filter(
    (room) => room.status === "available",
  ).length;

  const rejectedCount = rooms.filter(
    (room) => room.status === "rejected",
  ).length;

  // ============================================================
  // LOCATIONS
  // ============================================================

  const locations = useMemo(() => {
    return [
      ...new Set(rooms.map((room) => room.location).filter(Boolean)),
    ].sort();
  }, [rooms]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / PAGE_SIZE));

  const safePage = Math.min(page, totalPages);

  const paginatedRooms = filteredRooms.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // ============================================================
  // UPDATE ROOM STATUS
  // ============================================================

  const updateStatus = async (id, newStatus) => {
    try {
      setActionLoading(id);
      setError("");
      setOpenMenu(null);

      const room = rooms.find((item) => item.id === id);

      if (!room) {
        throw new Error("Room not found.");
      }

      // Admin only approves or rejects
      // from this page.

      if (!["approved", "rejected"].includes(newStatus)) {
        throw new Error("Invalid room status.");
      }

      if (room.status !== "pending") {
        throw new Error("Only pending rooms can be approved or rejected.");
      }

      await updateDoc(doc(db, "rooms", id), {
        status: newStatus,

        updatedAt: serverTimestamp(),
      });

      setRooms((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: newStatus,
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Update room error:", err);

      setError(getFirebaseError(err, "Failed to update room."));
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // DELETE ROOM
  // ============================================================

  const deleteRoom = async (id) => {
    const room = rooms.find((item) => item.id === id);

    const confirmed = window.confirm(
      `Are you sure you want to permanently delete "${room?.name || "this room"}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(id);
      setError("");
      setOpenMenu(null);

      await deleteDoc(doc(db, "rooms", id));

      setRooms((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete room error:", err);

      setError(getFirebaseError(err, "Failed to delete room."));
    } finally {
      setActionLoading(null);
    }
  };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setLocation("all");
    setPage(1);
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500">Loading rooms...</p>
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}

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

      {/* ERROR */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-semibold text-red-700">Error</p>

            <p className="mt-1 wrap-break-word text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* STATUS FILTER */}

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
            onClick={() => setStatus("approved")}
            success
          />

          <StatusTab
            label="Occupied"
            count={occupiedCount}
            active={status === "occupied"}
            onClick={() => setStatus("occupied")}
            purple
          />

          <StatusTab
            label="Available"
            count={availableCount}
            active={status === "available"}
            onClick={() => setStatus("available")}
            blue
          />

          <StatusTab
            label="Rejected"
            count={rejectedCount}
            active={status === "rejected"}
            onClick={() => setStatus("rejected")}
            danger
          />
        </div>
      </div>

      {/* SEARCH */}

      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
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
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="relative">
            <MapPin
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-11 min-w-45 rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-600 outline-none focus:border-blue-500"
            >
              <option value="all">All Locations</option>

              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            <Filter size={16} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* DESKTOP TABLE */}

      <div className="hidden overflow-visible rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <TableHead>Room</TableHead>

                <TableHead>Landlord</TableHead>

                <TableHead>Location</TableHead>

                <TableHead>Details</TableHead>

                <TableHead>Price</TableHead>

                <TableHead>Status</TableHead>

                <TableHead>Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {paginatedRooms.map((room) => (
                <RoomTableRow
                  key={room.id}
                  room={room}
                  openMenu={openMenu}
                  setOpenMenu={setOpenMenu}
                  actionLoading={actionLoading}
                  updateStatus={updateStatus}
                  deleteRoom={deleteRoom}
                />
              ))}
            </tbody>
          </table>
        </div>

        <TableFooter
          page={safePage}
          totalPages={totalPages}
          count={paginatedRooms.length}
          total={filteredRooms.length}
          onPrevious={() => setPage((current) => Math.max(1, current - 1))}
          onNext={() => setPage((current) => Math.min(totalPages, current + 1))}
        />
      </div>

      {/* MOBILE */}

      <div className="space-y-4 lg:hidden">
        {paginatedRooms.map((room) => (
          <RoomMobileCard
            key={room.id}
            room={room}
            openMenu={openMenu}
            setOpenMenu={setOpenMenu}
            actionLoading={actionLoading}
            updateStatus={updateStatus}
            deleteRoom={deleteRoom}
          />
        ))}
      </div>

      {/* MOBILE PAGINATION */}

      {paginatedRooms.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 lg:hidden">
          <p className="text-xs text-gray-400">
            Page <span className="font-semibold text-gray-700">{safePage}</span>{" "}
            of <span className="font-semibold text-gray-700">{totalPages}</span>
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* EMPTY */}

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

// ============================================================
// ROOM TABLE ROW
// ============================================================

function RoomTableRow({
  room,
  openMenu,
  setOpenMenu,
  actionLoading,
  updateStatus,
  deleteRoom,
}) {
  const image = room.images?.[0] || "https://placehold.co/800x600?text=Room";

  const busy = actionLoading === room.id;

  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
      {/* ROOM */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={room.name}
            className="h-14 w-16 rounded-xl object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/800x600?text=Room";
            }}
          />

          <div className="min-w-0">
            <p className="max-w-45 truncate text-sm font-semibold text-gray-800">
              {room.name}
            </p>

            <p className="mt-1 text-[10px] text-gray-400">{room.id}</p>
          </div>
        </div>
      </td>

      {/* LANDLORD */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          {room.landlordPhoto ? (
            <img
              src={room.landlordPhoto}
              alt={room.landlord}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <User size={15} />
            </div>
          )}

          <div className="min-w-0">
            <p className="max-w-37.5 truncate text-xs font-medium text-gray-700">
              {room.landlord}
            </p>

            <p className="max-w-37.5 truncate text-[9px] text-gray-400">
              {room.landlordEmail || room.landlordId}
            </p>
          </div>
        </div>
      </td>

      {/* LOCATION */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <MapPin size={13} className="text-gray-400" />

          {room.location}
        </div>
      </td>

      {/* DETAILS */}

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

      {/* PRICE */}

      <td className="px-5 py-4">
        <p className="text-sm font-bold text-gray-800">
          ${room.price.toLocaleString()}
        </p>

        <p className="text-[9px] text-gray-400">/ month</p>
      </td>

      {/* STATUS */}

      <td className="px-5 py-4">
        <RoomStatus status={room.status} />
      </td>

      {/* ACTION */}

      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/rooms/${room.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
            title="View Room"
          >
            <Eye size={16} />
          </Link>

          <div className="relative">
            <button
              type="button"
              disabled={busy}
              onClick={() => setOpenMenu(openMenu === room.id ? null : room.id)}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-50 text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              {busy ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              ) : (
                <span className="text-lg font-bold">...</span>
              )}
            </button>

            {openMenu === room.id && (
              <RoomActionMenu
                room={room}
                busy={busy}
                updateStatus={updateStatus}
                deleteRoom={deleteRoom}
                closeMenu={() => setOpenMenu(null)}
              />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

// ============================================================
// MOBILE ROOM CARD
// ============================================================

function RoomMobileCard({
  room,
  openMenu,
  setOpenMenu,
  actionLoading,
  updateStatus,
  deleteRoom,
}) {
  const image = room.images?.[0] || "https://placehold.co/800x600?text=Room";

  const busy = actionLoading === room.id;

  return (
    <div className="overflow-visible rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="relative">
        <img
          src={image}
          alt={room.name}
          className="h-44 w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/800x600?text=Room";
          }}
        />

        <div className="absolute left-3 top-3">
          <RoomStatus status={room.status} />
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
            ${room.price.toLocaleString()}
            <span className="text-[9px] font-normal text-gray-400">/mo</span>
          </p>
        </div>

        {/* LANDLORD */}

        <div className="mt-4 flex items-center gap-2">
          {room.landlordPhoto ? (
            <img
              src={room.landlordPhoto}
              alt={room.landlord}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <User size={15} />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-gray-700">
              {room.landlord}
            </p>

            <p className="truncate text-[9px] text-gray-400">
              {room.landlordEmail || room.landlordId}
            </p>
          </div>
        </div>

        {/* DETAILS */}

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

        {/* ACTIONS */}

        <div className="mt-4 flex gap-2">
          <Link
            to={`/admin/rooms/${room.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Eye size={15} />
            View
          </Link>

          <div className="relative">
            <button
              type="button"
              disabled={busy}
              onClick={() => setOpenMenu(openMenu === room.id ? null : room.id)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 disabled:opacity-50"
            >
              {busy ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
              ) : (
                <span className="text-lg font-bold">...</span>
              )}
            </button>

            {openMenu === room.id && (
              <RoomActionMenu
                room={room}
                busy={busy}
                updateStatus={updateStatus}
                deleteRoom={deleteRoom}
                closeMenu={() => setOpenMenu(null)}
                mobile
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ACTION MENU
// ============================================================

function RoomActionMenu({ room, busy, updateStatus, deleteRoom, closeMenu }) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl">
      {room.status === "pending" && (
        <>
          <button
            type="button"
            disabled={busy}
            onClick={() => updateStatus(room.id, "approved")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-green-600 hover:bg-green-50 disabled:opacity-50"
          >
            <CheckCircle size={15} />
            Approve Room
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={() => updateStatus(room.id, "rejected")}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle size={15} />
            Reject Room
          </button>
        </>
      )}

      <div className="my-1 border-t border-gray-100" />

      <button
        type="button"
        disabled={busy}
        onClick={() => deleteRoom(room.id)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={15} />
        Delete Room
      </button>
    </div>
  );
}

// ============================================================
// STATUS TAB
// ============================================================

function StatusTab({
  label,
  count,
  active,
  onClick,
  warning,
  success,
  danger,
  purple,
  blue,
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

  if (purple) {
    activeClass = "bg-purple-600 text-white";
  }

  if (blue) {
    activeClass = "bg-blue-500 text-white";
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

// ============================================================
// ROOM STATUS
// ============================================================

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

    occupied: {
      label: "Occupied",
      icon: User,
      className: "bg-purple-50 text-purple-600",
    },

    available: {
      label: "Available",
      icon: CheckCircle,
      className: "bg-blue-50 text-blue-600",
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
// TABLE HEAD
// ============================================================

function TableHead({ children }) {
  return (
    <th className="px-5 py-4 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </th>
  );
}

// ============================================================
// TABLE FOOTER
// ============================================================

function TableFooter({ page, totalPages, count, total, onPrevious, onNext }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
      <p className="text-xs text-gray-400">
        Showing <span className="font-semibold text-gray-700">{count}</span> of{" "}
        <span className="font-semibold text-gray-700">{total}</span> rooms
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page === 1}
          onClick={onPrevious}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft size={15} />
        </button>

        <span className="min-w-8 text-center text-xs font-semibold text-gray-700">
          {page}
        </span>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// NORMALIZE IMAGES
// ============================================================

function normalizeImages(images, image, photoURL) {
  if (Array.isArray(images)) {
    return images.filter(Boolean);
  }

  if (typeof images === "string" && images.trim()) {
    return [images];
  }

  if (typeof image === "string" && image.trim()) {
    return [image];
  }

  if (typeof photoURL === "string" && photoURL.trim()) {
    return [photoURL];
  }

  return [];
}

// ============================================================
// NORMALIZE ROOM STATUS
// ============================================================

function normalizeRoomStatus(status) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (value === "pending") {
    return "pending";
  }

  if (value === "approved" || value === "approve") {
    return "approved";
  }

  if (value === "occupied") {
    return "occupied";
  }

  if (value === "available") {
    return "available";
  }

  if (value === "rejected") {
    return "rejected";
  }

  // Legacy status
  if (value === "active") {
    return "approved";
  }

  return "pending";
}

// ============================================================
// FIRESTORE TIMESTAMP
// ============================================================

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

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const timestamp = new Date(value).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  return 0;
}

// ============================================================
// FIREBASE ERROR
// ============================================================

function getFirebaseError(error, fallback) {
  if (!error) {
    return fallback;
  }

  if (error.code === "permission-denied") {
    return "Permission denied. Make sure you are logged in as an admin and your Firestore rules allow admin access to rooms and users.";
  }

  if (error.code === "not-found") {
    return "The room or user record could not be found.";
  }

  if (error.code === "unavailable") {
    return "Firebase is temporarily unavailable. Please try again.";
  }

  return error.message || fallback;
}
