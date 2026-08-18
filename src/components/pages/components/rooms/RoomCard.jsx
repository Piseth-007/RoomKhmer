import { useEffect, useState } from "react";

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
  CookingPot,
  Armchair,
} from "lucide-react";

import { Link } from "react-router-dom";

const FAVORITES_KEY = "roomkhmer_favorites";

const RoomCard = ({ room, onFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

      setIsFavorite(saved.includes(room.id));
    } catch (error) {
      console.error("Failed to load favorite:", error);
    }
  }, [room.id]);

  const handleFavorite = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

      let updatedFavorites;

      if (saved.includes(room.id)) {
        updatedFavorites = saved.filter((id) => id !== room.id);

        setIsFavorite(false);
      } else {
        updatedFavorites = [...saved, room.id];

        setIsFavorite(true);
      }

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

      if (onFavorite) {
        onFavorite(room.id, updatedFavorites);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "wifi":
        return Wifi;

      case "airConditioning":
        return Wind;

      case "parking":
        return Car;

      case "privateBathroom":
        return Bath;

      case "kitchen":
        return CookingPot;

      case "furnished":
        return Armchair;

      default:
        return null;
    }
  };

  const getAmenityLabel = (amenity) => {
    const labels = {
      wifi: "WiFi",
      airConditioning: "Air Conditioning",
      parking: "Parking",
      privateBathroom: "Private Bathroom",
      kitchen: "Kitchen",
      furnished: "Furnished",
    };

    return labels[amenity] || amenity;
  };

  const enabledAmenities = Object.entries(room.amenities || {})
    .filter(([, enabled]) => enabled === true)
    .map(([name]) => name);

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
      <div className="relative h-57.5 shrink-0 overflow-hidden sm:h-60">
        <Link to={`/rooms/${room.id}`} className="block h-full">
          {room.images?.[0] ? (
            <img
              src={room.images[0]}
              alt={room.name || "Room"}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-105
              "
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
              No image available
            </div>
          )}
        </Link>

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-linear-to-t
            from-black/20
            via-transparent
            to-transparent
          "
        />

        {room.featured && (
          <span
            className="
              absolute
              left-4
              top-4
              rounded-full
              bg-blue-600
              px-3
              py-1.5
              text-[11px]
              font-semibold
              text-white
              shadow-sm
            "
          >
            Featured
          </span>
        )}

        {room.status === "approved" && (
          <div
            className="
              absolute
              bottom-4
              left-4
              rounded-full
              bg-white/95
              px-3
              py-1.5
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

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className={`
            absolute
            right-4
            top-4
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-white/95
            shadow-md
            backdrop-blur
            transition-all
            duration-200
            hover:scale-105
            focus:outline-none
            focus:ring-4
            focus:ring-blue-500/20

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

      <div className="flex flex-1 flex-col p-5">
        <div
          className="
            flex
            min-h-13.75
            items-start
            justify-between
            gap-3
          "
        >
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
              {room.name}
            </h3>

            {room.type && (
              <p
                className="
                  mt-0.5
                  line-clamp-1
                  text-xs
                  capitalize
                  text-gray-400
                "
              >
                {room.type} room
              </p>
            )}
          </div>

          {room.rating && (
            <div
              className="
                flex
                shrink-0
                items-center
                gap-1
                pt-1
              "
            >
              <Star
                size={16}
                strokeWidth={1.8}
                className="fill-yellow-500 text-yellow-500"
              />

              <span className="text-sm font-semibold text-gray-700">
                {room.rating}
              </span>
            </div>
          )}
        </div>

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

        <div className="mt-4 flex min-h-9 flex-wrap gap-2">
          {room.type && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-gray-100
                bg-gray-50
                px-3
                py-2
                text-[11px]
                font-medium
                capitalize
                text-gray-500
              "
            >
              <BedDouble size={14} strokeWidth={1.8} />

              {room.type}
            </span>
          )}

          {room.bathrooms !== undefined && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-gray-100
                bg-gray-50
                px-3
                py-2
                text-[11px]
                font-medium
                text-gray-500
              "
            >
              <Bath size={14} strokeWidth={1.8} />
              {room.bathrooms} {room.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
            </span>
          )}

          {room.bedrooms !== undefined && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-gray-100
                bg-gray-50
                px-3
                py-2
                text-[11px]
                font-medium
                text-gray-500
              "
            >
              <BedDouble size={14} strokeWidth={1.8} />
              {room.bedrooms} {room.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
            </span>
          )}
        </div>

        <div className="mt-3 min-h-18">
          <div className="flex flex-wrap gap-2">
            {enabledAmenities.slice(0, 4).map((amenity) => {
              const Icon = getAmenityIcon(amenity);

              return (
                <span
                  key={amenity}
                  className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      border
                      border-gray-100
                      bg-white
                      px-3
                      py-2
                      text-[11px]
                      font-medium
                      text-gray-500
                    "
                >
                  {Icon && <Icon size={14} strokeWidth={1.8} />}

                  {getAmenityLabel(amenity)}
                </span>
              );
            })}
          </div>
        </div>

        <div
          className="
            mt-auto
            border-t
            border-gray-100
            pt-5
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div className="flex items-baseline">
              <span
                className="
                  text-[22px]
                  font-bold
                  tracking-tight
                  text-gray-900
                "
              >
                ${room.price}
              </span>

              <span
                className="
                  ml-1.5
                  text-xs
                  font-medium
                  text-gray-400
                "
              >
                / month
              </span>
            </div>

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
