import { Bath, Car, ChevronDown, RotateCcw, Wifi, Wind } from "lucide-react";

const RoomFilter = ({ filters, setFilters, onClear }) => {
  const handleLocationChange = (location) => {
    setFilters((prev) => ({
      ...prev,
      location,
    }));
  };

  const handleRoomTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      roomType: type,
    }));
  };

  const handleFacilityChange = (facility) => {
    setFilters((prev) => {
      const exists = prev.facilities.includes(facility);

      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((item) => item !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  const handlePriceChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      maxPrice: Number(value),
    }));
  };

  return (
    <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            ចម្រាញ់បន្ទប់
          </h2>

          <p className="mt-0.5 text-xs text-gray-400">Filters</p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 transition hover:text-blue-700"
        >
          <RotateCcw size={13} />
          Clear
        </button>
      </div>
      {/* ================= LOCATION ================= */}
      <div className="mt-6">
        <label className="text-sm font-semibold text-gray-800">ទីតាំង</label>

        <p className="mt-0.5 text-xs text-gray-400">Location</p>

        <div className="mt-3 space-y-2.5">
          {[
            "All Locations",
            "Tuol Kork",
            "Sen Sok",
            "Chamkarmon",
            "BKK",
            "Meanchey",
          ].map((location) => (
            <label
              key={location}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="radio"
                name="location"
                value={location}
                checked={filters.location === location}
                onChange={() => handleLocationChange(location)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <span className="text-sm text-gray-600">{location}</span>
            </label>
          ))}
        </div>
      </div>
      {/* ================= PRICE ================= */}
      <div className="mt-7 border-t border-gray-100 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold text-gray-800">
              Maximum Price
            </label>

            <p className="mt-0.5 text-xs text-gray-400">តម្លៃអតិបរមា</p>
          </div>

          <span className="text-sm font-semibold text-blue-600">
            ${filters.maxPrice}
          </span>
        </div>

        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => handlePriceChange(e.target.value)}
          className="mt-4 w-full accent-blue-600"
        />

        <div className="flex justify-between text-[11px] text-gray-400">
          <span>$50</span>
          <span>$500+</span>
        </div>
      </div>
      {/* ================= ROOM TYPE ================= */}
      <div className="mt-7 border-t border-gray-100 pt-6">
        <label className="text-sm font-semibold text-gray-800">
          ប្រភេទបន្ទប់
        </label>

        <p className="mt-0.5 text-xs text-gray-400">Room Type</p>

        <div className="mt-3 space-y-2.5">
          {["All Types", "Single Room", "Studio", "Shared Room"].map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="radio"
                name="roomType"
                value={type}
                checked={filters.roomType === type}
                onChange={() => handleRoomTypeChange(type)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <span className="text-sm text-gray-600">{type}</span>
            </label>
          ))}
        </div>
      </div>
      {/* ================= FACILITIES ================= */}
      <div className="mt-7 border-t border-gray-100 pt-6">
        <label className="text-sm font-semibold text-gray-800">
          សម្ភារៈបរិក្ខារ
        </label>

        <p className="mt-0.5 text-xs text-gray-400">Facilities</p>

        <div className="mt-3 space-y-3">
          {[
            {
              name: "WiFi",
              icon: Wifi,
            },
            {
              name: "Air Conditioning",
              icon: Wind,
            },
            {
              name: "Parking",
              icon: Car,
            },
            {
              name: "Private Bathroom",
              icon: Bath,
            },
          ].map((facility) => {
            const Icon = facility.icon;

            return (
              <label
                key={facility.name}
                className="flex cursor-pointer items-center gap-3"
              >
                <input
                  type="checkbox"
                  checked={filters.facilities.includes(facility.name)}
                  onChange={() => handleFacilityChange(facility.name)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <Icon size={16} className="text-gray-400" />

                <span className="text-sm text-gray-600">{facility.name}</span>
              </label>
            );
          })}
        </div>
      </div>
      {/* ================= APPLY ================= */}
      <button
        type="button"
        className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </aside>
  );
};

export default RoomFilter;
