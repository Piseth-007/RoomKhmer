import { useMemo, useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  Heart,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import RoomCard from "../../pages/components/rooms/RoomCard";
import RoomFilter from "../../pages/components/rooms/RoomFilter";
import RoomSearch from "../../pages/components/rooms/RoomSearch";

import { rooms } from "../../../data/rooms";

const defaultFilters = {
  location: "All Locations",
  maxPrice: 500,
  roomType: "All Types",
  facilities: [],
};

const Rooms = () => {

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState(defaultFilters);

  const [sortBy, setSortBy] = useState("recommended");

  const [favorites, setFavorites] = useState([]);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleFavorite = (roomId) => {
    setFavorites((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      }

      return [...prev, roomId];
    });
  };


  const handleClearFilters = () => {
    setFilters({
      ...defaultFilters,
      facilities: [],
    });

    setSearch("");
  };


  const filteredRooms = useMemo(() => {
    let result = [...rooms];

    /* ---------------- SEARCH ---------------- */

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((room) => {
        const searchableText = [
          room.title,
          room.englishTitle,
          room.location,
          room.city,
          room.roomType,
          ...(room.facilities || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchValue);
      });
    }

    /* ---------------- LOCATION ---------------- */

    if (filters.location !== "All Locations") {
      result = result.filter((room) => room.location === filters.location);
    }

    /* ---------------- PRICE ---------------- */

    result = result.filter(
      (room) => Number(room.price) <= Number(filters.maxPrice),
    );

    /* ---------------- ROOM TYPE ---------------- */

    if (filters.roomType !== "All Types") {
      result = result.filter((room) => room.roomType === filters.roomType);
    }

    /* ---------------- FACILITIES ---------------- */

    if (filters.facilities.length > 0) {
      result = result.filter((room) => {
        return filters.facilities.every((requiredFacility) =>
          room.facilities?.includes(requiredFacility),
        );
      });
    }

    /* ---------------- SORT ---------------- */

    if (sortBy === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === "rating") {
      result.sort((a, b) => Number(b.rating) - Number(a.rating));
    }

    if (sortBy === "newest") {
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    if (sortBy === "recommended") {
      result.sort((a, b) => {
        if (a.featured && !b.featured) {
          return -1;
        }

        if (!a.featured && b.featured) {
          return 1;
        }

        return Number(b.rating) - Number(a.rating);
      });
    }

    return result;
  }, [search, filters, sortBy]);

  /* =========================================================
     ACTIVE FILTER COUNT
  ========================================================= */

  const activeFilterCount =
    (filters.location !== "All Locations" ? 1 : 0) +
    (filters.maxPrice < 500 ? 1 : 0) +
    (filters.roomType !== "All Types" ? 1 : 0) +
    filters.facilities.length;

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:px-8">
          {/* Breadcrumb */}

          <div className="mb-5 flex items-center gap-2 text-xs text-gray-400">
            <span>Home</span>

            <span>/</span>

            <span className="font-medium text-gray-600">Rooms</span>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              ស្វែងរកបន្ទប់ដែលសមនឹងអ្នក
            </h1>

            <p className="mt-2 text-sm font-medium text-gray-500 sm:text-base">
              Find your perfect room in Phnom Penh
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-400">
              ស្វែងរកបន្ទប់ជួលតាមទីតាំង តម្លៃ ប្រភេទបន្ទប់
              និងសម្ភារៈដែលអ្នកត្រូវការ។
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

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[270px_1fr]">

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <RoomFilter
                filters={filters}
                setFilters={setFilters}
                onClear={handleClearFilters}
              />
            </div>
          </aside>


          <section>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredRooms.length}{" "}
                  {filteredRooms.length === 1 ? "Room" : "Rooms"}
                </h2>

                <p className="mt-0.5 text-xs text-gray-400">
                  បន្ទប់ដែលត្រូវនឹងការស្វែងរករបស់អ្នក
                </p>
              </div>

              {/* Right controls */}

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
                    onChange={(e) => setSortBy(e.target.value)}
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

            {/* =================================================
                ACTIVE FILTERS
            ================================================== */}

            {(search || activeFilterCount > 0) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-medium text-gray-400">
                  Active:
                </span>

                {/* Search */}

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

                {/* Location */}

                {filters.location !== "All Locations" && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        location: "All Locations",
                      }))
                    }
                    className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                  >
                    {filters.location}

                    <X size={13} />
                  </button>
                )}

                {/* Room type */}

                {filters.roomType !== "All Types" && (
                  <button
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        roomType: "All Types",
                      }))
                    }
                    className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600"
                  >
                    {filters.roomType}

                    <X size={13} />
                  </button>
                )}

                {/* Facilities */}

                {filters.facilities.map((facility) => (
                  <button
                    key={facility}
                    type="button"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        facilities: prev.facilities.filter(
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

                {/* Clear all */}

                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="ml-1 text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-800"
                >
                  Clear all
                </button>
              </div>
            )}

            {filteredRooms.length > 0 ? (
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
            ) : (

              <div className="flex min-h-105 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                  <Search size={28} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  រកមិនឃើញបន្ទប់
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-gray-400">
                  We couldn't find any rooms matching your search. Try changing
                  your filters or search for another location.
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


      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}

          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}

          <div className="absolute bottom-0 left-0 right-0 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-slate-50 p-4 shadow-2xl">
            {/* Drawer header */}

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

            {/* Apply */}

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
