import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";

const RoomSearch = ({ search, setSearch, onSearch, onOpenFilter }) => {
  const handleSubmit = (e) => {
    e.preventDefault();

    onSearch?.();
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 lg:flex-row">
        {/* ================= SEARCH ================= */}

        <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl bg-gray-50 px-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
            <Search size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <label className="block text-[11px] font-medium text-gray-400">
              ស្វែងរក
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ទីតាំង់,សកលវិទ្យាល័យ,បន្ទប់"
              className="mt-0.5 w-full border-none bg-transparent p-0 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>


          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-400 transition hover:text-gray-600"
              aria-label="Clear search"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {/* ================= LOCATION ================= */}

        <button
          type="button"
          className="flex min-h-12 items-center gap-3 rounded-xl border border-gray-100 px-4 text-left transition hover:border-blue-200 hover:bg-blue-50/50 lg:w-52"
        >
          <MapPin size={18} className="shrink-0 text-blue-600" />

          <div className="min-w-0">
            <span className="block text-[11px] font-medium text-gray-400">
              ទីតាំង
            </span>

            <span className="block truncate text-sm font-medium text-gray-700">
              Phnom Penh
            </span>
          </div>
        </button>

        {/* ================= FILTER MOBILE ================= */}

        <button
          type="button"
          onClick={onOpenFilter}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 lg:hidden"
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>

        {/* ================= SEARCH BUTTON ================= */}

        <button
          type="submit"
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Search size={18} />
          ស្វែងរក
        </button>
      </form>
    </div>
  );
};

export default RoomSearch;
