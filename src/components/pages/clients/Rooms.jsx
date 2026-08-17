import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { collection, getDocs } from "firebase/firestore";

import { db } from "../../../firebase/config";

import RoomCard from "../../pages/components/rooms/RoomCard";
import RoomFilter from "../../pages/components/rooms/RoomFilter";
import RoomSearch from "../../pages/components/rooms/RoomSearch";

const defaultFilters = {
  location: "All Locations",
  maxPrice: 500,
  roomType: "All Types",
  facilities: [],
};

/*
 * ============================================================
 * NORMALIZE TEXT
 * ============================================================
 *
 * Makes:
 *
 * Tuol Kork
 * Toul Kork
 * tuol kork
 * TOUL KORK
 *
 * match each other.
 */

const normalizeText = (value) => {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^tuol\b/, "toul");
};

/*
 * ============================================================
 * TIMESTAMP
 * ============================================================
 */

const getTimestampValue = (value) => {
  if (!value) {
    return 0;
  }

  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }

  if (typeof value?.seconds === "number") {
    return value.seconds * 1000;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  const parsed = new Date(value).getTime();

  return Number.isNaN(parsed) ? 0 : parsed;
};

/*
 * ============================================================
 * AMENITIES
 * ============================================================
 */

const getAmenities = (room) => {
  if (Array.isArray(room.amenities)) {
    return room.amenities;
  }

  if (room.amenities && typeof room.amenities === "object") {
    return Object.keys(room.amenities).filter(
      (key) => room.amenities[key] === true,
    );
  }

  return [];
};

/*
 * ============================================================
 * ROOMS PAGE
 * ============================================================
 */

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /*
   * Get location from URL
   *
   * /rooms?location=Sen%20Sok
   *
   * becomes:
   *
   * Sen Sok
   */

  const urlLocation = searchParams.get("location") || "All Locations";

  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    location: urlLocation,
    facilities: [],
  }));

  const [sortBy, setSortBy] = useState("recommended");

  const [favorites, setFavorites] = useState([]);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  /*
   * ============================================================
   * SYNC URL -> FILTER
   * ============================================================
   *
   * This handles:
   *
   * /rooms?location=Sen%20Sok
   *
   * and selects Sen Sok automatically.
   */

  useEffect(() => {
    const location = searchParams.get("location") || "All Locations";

    setFilters((previous) => {
      if (previous.location === location) {
        return previous;
      }

      return {
        ...previous,
        location,
      };
    });
  }, [searchParams]);

  /*
   * ============================================================
   * SYNC FILTER -> URL
   * ============================================================
   */

  useEffect(() => {
    const currentUrlLocation = searchParams.get("location") || "All Locations";

    if (filters.location === currentUrlLocation) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);

    if (filters.location === "All Locations") {
      nextParams.delete("location");
    } else {
      nextParams.set("location", filters.location);
    }

    setSearchParams(nextParams, {
      replace: true,
    });
  }, [filters.location, searchParams, setSearchParams]);

  /*
   * ============================================================
   * LOAD ROOMS FROM FIRESTORE
   * ============================================================
   *
   * Root collection:
   *
   * rooms
   *
   * No where()
   * No query()
   * No collectionGroup()
   *
   * Approved rooms are filtered in React.
   */

  useEffect(() => {
    let mounted = true;

    const loadRooms = async () => {
      try {
        setLoading(true);
        setError("");

        const snapshot = await getDocs(collection(db, "rooms"));

        if (!mounted) {
          return;
        }

        const firestoreRooms = snapshot.docs
          .map((roomDoc) => ({
            id: roomDoc.id,
            ...roomDoc.data(),
          }))
          .filter((room) => {
            const status = String(room.status || "")
              .trim()
              .toLowerCase();

            return status === "approved";
          });

        setRooms(firestoreRooms);
      } catch {
        if (mounted) {
          setError("Unable to load rooms. Please try again.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadRooms();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * ============================================================
   * FAVORITE
   * ============================================================
   */

  const handleFavorite = (roomId) => {
    setFavorites((previous) => {
      if (previous.includes(roomId)) {
        return previous.filter((id) => id !== roomId);
      }

      return [...previous, roomId];
    });
  };

  /*
   * ============================================================
   * CLEAR FILTERS
   * ============================================================
   */

  const handleClearFilters = () => {
    setFilters({
      ...defaultFilters,
      location: "All Locations",
      facilities: [],
    });

    setSearch("");

    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("location");

    setSearchParams(nextParams, {
      replace: true,
    });
  };

  /*
   * ============================================================
   * FILTER + SEARCH + SORT
   * ============================================================
   */

  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    /*
     * SEARCH
     */

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((room) => {
        const rules = Array.isArray(room.rules) ? room.rules : [];

        const amenities = getAmenities(room);

        const searchableText = [
          room.name,
          room.type,
          room.location,
          room.address,
          room.description,
          room.area,
          room.bedrooms,
          room.bathrooms,
          ...rules,
          ...amenities,
        ]
          .filter((value) => value !== undefined && value !== null)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchValue);
      });
    }

    /*
     * LOCATION
     */

    if (filters.location !== "All Locations") {
      const selectedLocation = normalizeText(filters.location);

      result = result.filter((room) => {
        return normalizeText(room.location) === selectedLocation;
      });
    }

    /*
     * PRICE
     */

    result = result.filter((room) => {
      const price = Number(room.price || 0);

      return price <= Number(filters.maxPrice);
    });

    /*
     * ROOM TYPE
     */

    if (filters.roomType !== "All Types") {
      const selectedType = normalizeText(filters.roomType);

      result = result.filter((room) => {
        return normalizeText(room.type) === selectedType;
      });
    }

    /*
     * FACILITIES
     */

    if (filters.facilities.length > 0) {
      result = result.filter((room) => {
        const amenities = getAmenities(room).map(normalizeText);

        return filters.facilities.every((facility) => {
          const normalizedFacility = normalizeText(facility);

          return amenities.includes(normalizedFacility);
        });
      });
    }

    /*
     * SORT
     */

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) =>
          getTimestampValue(b.createdAt) - getTimestampValue(a.createdAt),
      );
    }

    if (sortBy === "rating") {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return result;
  }, [rooms, search, filters, sortBy]);

  /*
   * ============================================================
   * ACTIVE FILTER COUNT
   * ============================================================
   */

  const activeFilterCount =
    (filters.location !== "All Locations" ? 1 : 0) +
    (filters.maxPrice < 500 ? 1 : 0) +
    (filters.roomType !== "All Types" ? 1 : 0) +
    filters.facilities.length;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}

          <div className="mb-5 flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="transition hover:text-blue-600">
              Home
            </Link>

            <span>/</span>

            <span className="font-medium text-gray-600">Rooms</span>
          </div>

          {/* Heading */}

          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ស្វែងរកបន្ទប់ដែលសមនឹងអ្នក
            </h1>

            <p className="mt-2 text-sm font-medium text-gray-500 sm:text-base">
              ស្វែងរកបន្ទប់ជួលតាមទីតាំង តម្លៃ ប្រភេទបន្ទប់
              និងសម្ភារៈដែលអ្នកត្រូវការ។
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              Find your perfect room in Phnom Penh
            </p>
          </div>

          {/* Search */}

          <div className="mt-7">
            <RoomSearch
              search={search}
              setSearch={setSearch}
              onSearch={() => {}}
              onOpenFilter={() => setIsMobileFilterOpen(true)}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          MAIN
      ======================================================= */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[270px_1fr]">
          {/* ==================================================
              DESKTOP FILTER
          =================================================== */}

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <RoomFilter
                filters={filters}
                setFilters={setFilters}
                onClear={handleClearFilters}
              />
            </div>
          </aside>

          {/* ==================================================
              ROOMS
          =================================================== */}

          <section>
            {/* Top controls */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {loading
                    ? "Loading rooms..."
                    : `${filteredRooms.length} ${
                        filteredRooms.length === 1 ? "Room" : "Rooms"
                      }`}
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  {filters.location !== "All Locations"
                    ? `Rooms in ${filters.location}`
                    : "បន្ទប់ដែលត្រូវនឹងការស្វែងរករបស់អ្នក"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile filter */}

                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="relative flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 lg:hidden"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort */}

                <div className="relative">
                  <ArrowUpDown
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    className="h-10 appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-9 text-sm font-medium text-gray-700 outline-none transition focus:border-blue-500"
                  >
                    <option value="recommended">Recommended</option>

                    <option value="newest">Newest</option>

                    <option value="price-low">Price: Low to High</option>

                    <option value="price-high">Price: High to Low</option>

                    <option value="rating">Highest Rated</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* ==================================================
                ACTIVE FILTERS
            =================================================== */}

            {(search || activeFilterCount > 0) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-medium text-gray-400">
                  Active:
                </span>

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                  >
                    Search: {search}
                    <X size={13} />
                  </button>
                )}

                {filters.location !== "All Locations" && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((previous) => ({
                        ...previous,
                        location: "All Locations",
                      }))
                    }
                    className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                  >
                    {filters.location}

                    <X size={13} />
                  </button>
                )}

                {filters.roomType !== "All Types" && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((previous) => ({
                        ...previous,
                        roomType: "All Types",
                      }))
                    }
                    className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                  >
                    {filters.roomType}

                    <X size={13} />
                  </button>
                )}

                {filters.facilities.map((facility) => (
                  <button
                    key={facility}
                    type="button"
                    onClick={() =>
                      setFilters((previous) => ({
                        ...previous,
                        facilities: previous.facilities.filter(
                          (item) => item !== facility,
                        ),
                      }))
                    }
                    className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                  >
                    {facility}

                    <X size={13} />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="ml-1 text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-800"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* ==================================================
                LOADING
            =================================================== */}

            {loading && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >
                    <div className="h-56 animate-pulse bg-gray-200" />

                    <div className="space-y-4 p-5">
                      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                      <div className="h-4 w-full animate-pulse rounded bg-gray-200" />

                      <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ==================================================
                ERROR
            =================================================== */}

            {!loading && error && (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <Search size={28} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Unable to load rooms
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* ==================================================
                ROOM GRID
            =================================================== */}

            {!loading && !error && filteredRooms.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    isFavorite={favorites.includes(room.id)}
                    onFavorite={handleFavorite}
                  />
                ))}
              </div>
            )}

            {/* ==================================================
                EMPTY
            =================================================== */}

            {!loading && !error && filteredRooms.length === 0 && (
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                  <Search size={28} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  រកមិនឃើញបន្ទប់
                </h3>

                <p className="mt-1 max-w-md text-sm leading-6 text-gray-400">
                  {filters.location !== "All Locations"
                    ? `There are no approved rooms in ${filters.location}.`
                    : "We couldn't find any rooms matching your search."}
                </p>

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ======================================================
          MOBILE FILTER
      ======================================================= */}

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-slate-50 p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Filter Rooms
                </h2>

                <p className="text-xs text-gray-400">ជ្រើសរើសលក្ខខណ្ឌបន្ទប់</p>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm"
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>

            <RoomFilter
              filters={filters}
              setFilters={setFilters}
              onClear={handleClearFilters}
            />

            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(false)}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Filter size={17} />
              Show {filteredRooms.length} Rooms
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
