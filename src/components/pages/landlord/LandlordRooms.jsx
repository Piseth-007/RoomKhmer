import { useEffect, useState, useMemo } from "react";
import { auth } from "../../../firebase/config";
import { getLandlordRooms } from "../../../services/roomService";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import {
  Search,
  Plus,
  House,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  Users,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function LandlordRooms() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);

  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          console.error("You are not logged in.");
          return;
        }

        const data = await getLandlordRooms(user.uid);

        setRooms(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadRooms();
  }, []);


  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.name.toLowerCase().includes(search.toLowerCase()) ||
        room.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || room.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [rooms, search, statusFilter]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this room?",
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, "rooms", id));

      setRooms((currentRooms) => currentRooms.filter((room) => room.id !== id));

      setOpenMenu(null);

      alert("Room deleted successfully.");
    } catch (error) {
      console.error("Delete room error:", error);

      alert(error.message || "Failed to delete room.");
    }
  };


  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "available",
  ).length;

  const rentedRooms = rooms.filter((room) => room.status === "rented").length;

  const pendingRooms = rooms.filter((room) => room.status === "pending").length;

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">បន្ទប់របស់ខ្ញុំ</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your rooms and rental listings
          </p>
        </div>

        <Link
          to="/landlord/rooms/create"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          បន្ថែមបន្ទប់
        </Link>
      </div>


      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <RoomStat
          icon={<House size={20} />}
          label="All Rooms"
          value={totalRooms}
          className="bg-blue-50 text-blue-600"
        />

        <RoomStat
          icon={<CheckCircle size={20} />}
          label="Available"
          value={availableRooms}
          className="bg-green-50 text-green-600"
        />

        <RoomStat
          icon={<Users size={20} />}
          label="Rented"
          value={rentedRooms}
          className="bg-purple-50 text-purple-600"
        />

        <RoomStat
          icon={<Clock size={20} />}
          label="Pending"
          value={pendingRooms}
          className="bg-yellow-50 text-yellow-600"
        />
      </div>


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
              placeholder="Search room name or location..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white"
            />
          </div>


          <div className="relative">
            <Filter
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 w-full min-w-45 appearance-none rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-8 text-sm text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>

              <option value="available">Available</option>

              <option value="rented">Rented</option>

              <option value="pending">Pending</option>

              <option value="approved">Approved</option>

              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>


      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyRooms />
      )}
    </div>
  );
}

function RoomStat({ icon, label, value, className }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-xs text-gray-500">{label}</p>

      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function RoomCard({ room, openMenu, setOpenMenu, onDelete }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex flex-col sm:flex-row">

        <div className="relative h-52 w-full shrink-0 sm:h-auto sm:w-48">
          <img
            src={room.images?.[0]}
            alt={room.name}
            className="h-full w-full object-cover"
          />


          <div className="absolute left-3 top-3">
            <RoomStatus status={room.status} />
          </div>
        </div>


        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-gray-900">
                {room.name}
              </h2>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                <MapPin size={14} className="shrink-0 text-blue-600" />

                <span className="truncate">{room.location}</span>
              </div>
            </div>


            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setOpenMenu(openMenu === room.id ? null : room.id)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-700"
              >
                <MoreVertical size={18} />
              </button>

              {openMenu === room.id && (
                <div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-lg">
                  <Link
                    to={`/rooms/${room.id}`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                    onClick={() => setOpenMenu(null)}
                  >
                    <Eye size={16} />
                    View
                  </Link>

                  <Link
                    to={`/landlord/rooms/${room.id}/edit`}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setOpenMenu(null)}
                  >
                    <Pencil size={16} />
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => onDelete(room.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>


          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-500">
              {room.type}
            </span>

            <p className="text-lg font-bold text-gray-900">
              ${room.price}
              <span className="text-xs font-normal text-gray-400">/month</span>
            </p>
          </div>


          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Users size={14} />

              {room.tenants > 0 ? `${room.tenants} tenant` : "No tenant"}
            </div>

            <Link
              to={`/landlord/rooms/${room.id}/edit`}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Manage
              <Pencil size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


function RoomStatus({ status }) {
  const config = {
    available: {
      label: "Available",
      icon: CheckCircle,
      className: "bg-green-50 text-green-600",
    },

    rented: {
      label: "Rented",
      icon: Users,
      className: "bg-purple-50 text-purple-600",
    },

    pending: {
      label: "Pending",
      icon: Clock,
      className: "bg-yellow-50 text-yellow-600",
    },

    approved: {
      label: "Approved",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-semibold backdrop-blur-sm ${current.className}`}
    >
      <Icon size={12} />
      {current.label}
    </span>
  );
}


function EmptyRooms() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <House size={30} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900">No rooms found</h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
        We couldn't find any rooms matching your search. Try changing your
        search or add a new room.
      </p>

      <Link
        to="/landlord/rooms/create"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        <Plus size={18} />
        Add New Room
      </Link>
    </div>
  );
}
