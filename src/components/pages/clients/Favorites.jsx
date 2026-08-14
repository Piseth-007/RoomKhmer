import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Home,
  MapPin,
  Search,
  Star,
  Trash2,
} from "lucide-react";

import { rooms } from "../../../data/rooms";

const FAVORITES_KEY = "roomkhmer_favorites";

const Favorites = () => {
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    try {
      const savedFavorites =
        JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

      setFavoriteIds(savedFavorites);
    } catch (error) {
      console.error("Failed to load favorites:", error);

      setFavoriteIds([]);
    }
  }, []);

  const favoriteRooms = useMemo(() => {
    return rooms.filter((room) => favoriteIds.includes(room.id));
  }, [favoriteIds]);

  const removeFavorite = (roomId) => {
    const updatedFavorites = favoriteIds.filter((id) => id !== roomId);

    setFavoriteIds(updatedFavorites);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  };

  const clearAllFavorites = () => {
    setFavoriteIds([]);

    localStorage.removeItem(FAVORITES_KEY);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-indigo-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 sm:pb-14 lg:px-8">
          <div className="mb-8 flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="transition hover:text-blue-600">
              Home
            </Link>

            <span>/</span>

            <span className="font-medium text-gray-600">Favorites</span>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <Heart size={23} strokeWidth={1.8} />
                </div>

                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    បន្ទប់ដែលអ្នកចូលចិត្ត
                  </h1>

                  <p className="mt-1 text-sm font-medium text-blue-600">
                    Favorite Rooms
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500">
                Keep track of the rooms you like and come back to them whenever
                you're ready to make a decision.
              </p>
            </div>

            {/* Count */}

            {favoriteRooms.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
                <p className="text-xs text-gray-400">Saved rooms</p>

                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {favoriteRooms.length}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {favoriteRooms.length > 0 ? (
          <>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Your saved rooms
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {favoriteRooms.length}{" "}
                  {favoriteRooms.length === 1 ? "room" : "rooms"} saved
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/rooms"
                  className="
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    text-xs
                    font-semibold
                    text-gray-700
                    transition
                    hover:bg-gray-50
                  "
                >
                  <Search size={15} />
                  Find More Rooms
                </Link>

                <button
                  type="button"
                  onClick={clearAllFavorites}
                  className="
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-red-100
                    bg-red-50
                    px-4
                    text-xs
                    font-semibold
                    text-red-500
                    transition
                    hover:bg-red-100
                  "
                >
                  <Trash2 size={15} />
                  Clear All
                </button>
              </div>
            </div>

            {/* =================================================
                ROOM GRID
            ================================================== */}

            <div className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {favoriteRooms.map((room) => (
                <FavoriteRoomCard
                  key={room.id}
                  room={room}
                  onRemove={removeFavorite}
                />
              ))}
            </div>

            {/* =================================================
                BOTTOM CTA
            ================================================== */}

            <section className="mt-14 overflow-hidden rounded-3xl bg-gray-900">
              <div className="flex flex-col gap-7 px-6 py-10 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-blue-400">
                      <Home size={19} />
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      Keep exploring
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-white">
                    Still looking for the perfect room?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                    Explore more rooms and save the ones that match your budget
                    and preferred location.
                  </p>
                </div>

                <Link
                  to="/rooms"
                  className="
                    inline-flex
                    h-11
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-white
                    px-5
                    text-sm
                    font-semibold
                    text-gray-900
                    transition
                    hover:bg-gray-100
                  "
                >
                  Browse Rooms
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          </>
        ) : (
          /* =====================================================
             EMPTY STATE
          ====================================================== */

          <div className="flex min-h-130 flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white px-6 text-center shadow-sm">
            {/* Icon */}

            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 text-red-400">
                <Heart size={34} strokeWidth={1.5} />
              </div>

              <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white">
                <Search size={12} />
              </div>
            </div>

            {/* Text */}

            <h2 className="mt-7 text-2xl font-bold text-gray-900">
              មិនទាន់មានបន្ទប់ដែលអ្នកចូលចិត្តទេ
            </h2>

            <p className="mt-2 text-sm font-medium text-blue-600">
              No favorite rooms yet
            </p>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400">
              When you find a room you like, click the heart button to save it
              here. You can compare your favorite rooms later.
            </p>

            {/* Button */}

            <Link
              to="/rooms"
              className="
                mt-7
                inline-flex
                h-11
                items-center
                gap-2
                rounded-xl
                bg-blue-600
                px-6
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-blue-700
              "
            >
              <Search size={17} />
              ស្វែងរកបន្ទប់
            </Link>

            {/* Small info */}

            <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
              <Heart size={14} className="text-red-400" />
              Save rooms to compare them later.
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const FavoriteRoomCard = ({ room, onRemove }) => {
  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      <div className="relative h-57.5 shrink-0 overflow-hidden">
        <Link to={`/rooms/${room.id}`} className="block h-full">
          <img
            src={room.images?.[0] || room.image}
            alt={room.title}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />

        {room.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm">
            Featured
          </span>
        )}

        <button
          type="button"
          onClick={() => onRemove(room.id)}
          aria-label={`Remove ${room.title} from favorites`}
          className="
            absolute
            right-4
            top-4
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-red-500
            shadow-md
            backdrop-blur
            transition
            hover:scale-105
            hover:bg-red-50
          "
        >
          <Heart size={19} className="fill-current" />
        </button>

        {room.verified && (
          <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 shadow-sm">
            Verified
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* Title + Rating */}

        <div className="flex min-h-13.75 items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              to={`/rooms/${room.id}`}
              className="
                line-clamp-2
                text-base
                font-semibold
                leading-[1.45]
                text-gray-900
                transition
                hover:text-blue-600
              "
            >
              {room.title}
            </Link>

            <p className="mt-1 truncate text-xs text-gray-400">
              {room.englishTitle}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1 pt-1">
            <Star size={15} className="fill-yellow-500 text-yellow-500" />

            <span className="text-xs font-semibold text-gray-700">
              {room.rating}
            </span>
          </div>
        </div>

        {/* Location */}

        <div className="mt-3 flex items-center gap-2">
          <MapPin size={16} className="shrink-0 text-blue-500" />

          <span className="truncate text-xs text-gray-500">
            {room.location}, {room.city}
          </span>
        </div>

        {/* Room information */}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-[10px] text-gray-400">Room Type</p>

            <p className="mt-0.5 truncate text-xs font-semibold text-gray-700">
              {room.roomType}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-[10px] text-gray-400">Bathroom</p>

            <p className="mt-0.5 truncate text-xs font-semibold text-gray-700">
              {room.bathroom}
            </p>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-auto border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                ${room.price}
              </span>

              <span className="ml-1 text-[11px] text-gray-400">/ month</span>
            </div>

            <Link
              to={`/rooms/${room.id}`}
              className="
                inline-flex
                h-10
                items-center
                gap-1.5
                rounded-xl
                bg-blue-50
                px-4
                text-xs
                font-semibold
                text-blue-600
                transition
                hover:bg-blue-600
                hover:text-white
              "
            >
              View Room
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Favorites;
