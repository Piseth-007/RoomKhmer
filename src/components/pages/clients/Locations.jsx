import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Building2,
  Bus,
  ChevronRight,
  GraduationCap,
  MapPin,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Utensils,
  X,
} from "lucide-react";

import { locations } from "../../../data/locations";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../../../firebase/config";

const normalizeLocation = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^tuol\b/, "toul");
};

const Locations = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError("");

        const snapshot = await getDocs(collection(db, "rooms"));

        if (!mounted) {
          return;
        }

        const roomData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((room) => {
            const status = String(room.status || "")
              .trim()
              .toLowerCase();

            return status === "approved";
          });

        setRooms(roomData);
      } catch {
        if (mounted) {
          setError("Unable to load room information.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchRooms();

    return () => {
      mounted = false;
    };
  }, []);

  const roomCountByLocation = useMemo(() => {
    const counts = {};

    rooms.forEach((room) => {
      const location = normalizeLocation(room.location);

      if (!location) {
        return;
      }

      counts[location] = (counts[location] || 0) + 1;
    });

    return counts;
  }, [rooms]);

  const getRoomCount = (location) => {
    const englishName = normalizeLocation(location.name);

    const khmerName = normalizeLocation(location.khmerName);

    return (
      roomCountByLocation[englishName] || roomCountByLocation[khmerName] || 0
    );
  };

  const locationsWithRooms = useMemo(() => {
    return locations.map((location) => ({
      ...location,
      roomCount: getRoomCount(location),
    }));
  }, [roomCountByLocation]);

  const filteredLocations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return locationsWithRooms;
    }

    return locationsWithRooms.filter((location) => {
      const englishName = String(location.name || "").toLowerCase();

      const khmerName = String(location.khmerName || "").toLowerCase();

      return englishName.includes(value) || khmerName.includes(value);
    });
  }, [search, locationsWithRooms]);

  const handleLocationClick = (location) => {
    navigate(`/rooms?location=${encodeURIComponent(location.name)}`);
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-32 h-72 w-72 rounded-full bg-indigo-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-8 sm:px-6 sm:pb-16 sm:pt-10 lg:px-8">
          <div className="mb-10 flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="transition hover:text-blue-600">
              Home
            </Link>

            <ChevronRight size={13} />

            <span className="font-medium text-gray-600">Locations</span>
          </div>

          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm">
              <MapPin size={26} />
            </div>

            <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              ស្វែងរកបន្ទប់ជួលនៅតំបន់ដែលអ្នកចង់រស់នៅ
            </h1>

            <p className="mt-3 text-lg font-medium text-gray-500">
              Find a room in the right location
            </p>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400">
              Explore popular neighborhoods in Phnom Penh and find a room close
              to your university, workplace, transportation, restaurants, and
              other places you visit every day.
            </p>

            <div className="mx-auto mt-8 max-w-xl">
              <div className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-lg shadow-gray-200/50 transition focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50">
                <Search size={20} className="shrink-0 text-blue-500" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="ស្វែងរកទីតាំង..."
                  aria-label="Search locations"
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />

                {search && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {!loading && !error && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <SlidersHorizontal size={13} />

                <span>{filteredLocations.length} locations available</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Explore Phnom Penh
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
              ទីតាំងពេញនិយម
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Choose a location that fits your lifestyle.
            </p>
          </div>

          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
          >
            មើលបន្ទប់ទាំងអស់
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-52 animate-pulse bg-gray-200" />

                <div className="space-y-4 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />

                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />

                  <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl bg-white text-center">
            <Building2 size={32} className="text-red-500" />

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              Unable to load room information
            </h3>

            <p className="mt-2 text-sm text-gray-400">{error}</p>
          </div>
        )}

        {!loading && !error && filteredLocations.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLocations.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => handleLocationClick(location)}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.name || "Location"}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                  <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-600 shadow">
                    <MapPin size={17} />
                  </div>

                  <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow">
                    <Building2 size={12} />
                    {location.roomCount}{" "}
                    {location.roomCount === 1 ? "room" : "rooms"}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {location.khmerName || location.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {location.name}
                      </p>
                    </div>

                    <ChevronRight size={18} className="text-gray-300" />
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Building2 size={15} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        {location.roomCount} available{" "}
                        {location.roomCount === 1 ? "room" : "rooms"}
                      </p>

                      <p className="text-[10px] text-gray-400">From Firebase</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Locations;
