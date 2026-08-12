import {
  Bath,
  BedDouble,
  Car,
  Heart,
  MapPin,
  Star,
  Wifi,
  Wind,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const RoomCard = ({ room, isFavorite = false, onFavorite }) => {
  return (
    <article
      className="
        group flex h-full flex-col
        overflow-hidden rounded-2xl
        border border-gray-100
        bg-white
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* =====================================================
          IMAGE
      ====================================================== */}

      <div className="relative h-57.5 shrink-0 overflow-hidden sm:h-60">
        <img
          src={room.image}
          alt={room.title}
          className="
            h-full w-full
            object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
        />

        {/* Image overlay */}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

        {/* ================= FEATURED ================= */}

        {room.featured && (
          <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm">
            Featured
          </span>
        )}

        {/* ================= VERIFIED ================= */}

        {room.verified && (
          <div
            className="
              absolute bottom-4 left-4
              rounded-full
              bg-white/95
              px-3 py-1.5
              text-[11px]
              font-semibold
              text-emerald-600
              shadow-sm
              backdrop-blur
            "
          >
            Verified
          </div>
        )}

        {/* ================= FAVORITE ================= */}

        <button
          type="button"
          onClick={() => onFavorite?.(room.id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`
            absolute right-4 top-4
            flex h-11 w-11
            items-center justify-center
            rounded-full
            bg-white/95
            shadow-md
            backdrop-blur
            transition-all duration-200
            hover:scale-105
            ${isFavorite ? "text-red-500" : "text-gray-500 hover:text-red-500"}
          `}
        >
          <Heart
            size={20}
            strokeWidth={1.8}
            className={isFavorite ? "fill-current" : ""}
          />
        </button>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="flex flex-1 flex-col p-5">
        {/* =================================================
            TITLE + RATING
        ================================================== */}

        <div className="flex min-h-13.75 items-start justify-between gap-3">
          {/* Title */}

          <div className="min-w-0">
            <h3
              className="
                line-clamp-2
                min-h-11
                text-[16px]
                font-semibold
                leading-[1.45]
                text-gray-900
              "
            >
              {room.title}
            </h3>

            <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
              {room.englishTitle}
            </p>
          </div>

          {/* Rating */}

          <div className="flex shrink-0 items-center gap-1 pt-1">
            <Star
              size={16}
              strokeWidth={1.8}
              className="fill-yellow-500 text-yellow-500"
            />

            <span className="text-sm font-semibold text-gray-700">
              {room.rating}
            </span>
          </div>
        </div>

        {/* =================================================
            LOCATION
        ================================================== */}

        <div className="mt-3 flex items-center gap-2">
          <MapPin
            size={17}
            strokeWidth={1.8}
            className="shrink-0 text-blue-500"
          />

          <span className="truncate text-sm text-gray-500">
            {room.location}
          </span>
        </div>

        {/* =================================================
            ROOM TYPE + BATHROOM
        ================================================== */}

        <div className="mt-4 flex min-h-9 flex-wrap gap-2">
          {room.roomType && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                border border-gray-100
                bg-gray-50
                px-3 py-2
                text-[11px]
                font-medium
                text-gray-500
              "
            >
              <BedDouble size={14} />

              {room.roomType}
            </span>
          )}

          {room.bathroom && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                border border-gray-100
                bg-gray-50
                px-3 py-2
                text-[11px]
                font-medium
                text-gray-500
              "
            >
              <Bath size={14} />

              {room.bathroom}
            </span>
          )}
        </div>

        {/* =================================================
            FACILITIES
        ================================================== */}

        <div className="mt-3 min-h-18">
          <div className="flex flex-wrap gap-2">
            {room.facilities?.slice(0, 4).map((facility) => {
              const value = facility.toLowerCase();

              let Icon = null;

              if (value.includes("wifi")) {
                Icon = Wifi;
              }

              if (value.includes("air") || value.includes("ac")) {
                Icon = Wind;
              }

              if (value.includes("parking")) {
                Icon = Car;
              }

              if (value.includes("bathroom")) {
                Icon = Bath;
              }

              return (
                <span
                  key={facility}
                  className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-gray-100
                      bg-white
                      px-3 py-2
                      text-[11px]
                      font-medium
                      text-gray-500
                    "
                >
                  {Icon && <Icon size={14} />}

                  {facility}
                </span>
              );
            })}
          </div>
        </div>

        {/* =================================================
            BOTTOM
        ================================================== */}

        <div className="mt-auto border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between gap-3">
            {/* Price */}

            <div className="flex items-baseline">
              <span className="text-[22px] font-bold tracking-tight text-gray-900">
                ${room.price}
              </span>

              <span className="ml-1.5 text-xs font-medium text-gray-400">
                / month
              </span>
            </div>

            {/* View Room */}

            <Link
              to={`/rooms/${room.id}`}
              className="
                inline-flex
                h-10
                shrink-0
                items-center
                gap-1.5
                rounded-xl
                bg-blue-50
                px-4
                text-xs
                font-semibold
                text-blue-600
                transition-all
                hover:bg-blue-600
                hover:text-white
              "
            >
              View Room
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
