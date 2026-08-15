import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
  Wallet,
  Wifi,
  Wind,
  X,
} from "lucide-react";

import { rooms } from "../../../data/rooms";
import RequestRoomModal from "../../common/RequestRoomModal";
const RoomDetail = () => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const { id } = useParams();

  const room = rooms.find((item) => String(item.id) === String(id));

  const [activeImage, setActiveImage] = useState(0);

  const [isFavorite, setIsFavorite] = useState(false);

  const [showAllImages, setShowAllImages] = useState(false);

  /* =========================================================
     ROOM NOT FOUND
  ========================================================= */

  if (!room) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
            <Building2 size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            Room not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            បន្ទប់នេះមិនមាន ឬត្រូវបានលុបចេញហើយ។
          </p>

          <Link
            to="/rooms"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setActiveImage((current) =>
      current === room.images.length - 1 ? 0 : current + 1,
    );
  };

  const previousImage = () => {
    setActiveImage((current) =>
      current === 0 ? room.images.length - 1 : current - 1,
    );
  };

  const getFacilityIcon = (facility) => {
    const value = facility.toLowerCase();

    if (value.includes("wifi")) {
      return Wifi;
    }

    if (value.includes("air") || value.includes("conditioning")) {
      return Wind;
    }

    if (value.includes("parking")) {
      return Car;
    }

    if (value.includes("bathroom")) {
      return Bath;
    }

    if (value.includes("security")) {
      return ShieldCheck;
    }

    return Check;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>

            <span>/</span>

            <Link to="/rooms" className="hover:text-blue-600">
              Rooms
            </Link>

            <span>/</span>

            <span className="max-w-45 truncate font-medium text-gray-600">
              {room.englishTitle}
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          to="/rooms"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to rooms
        </Link>

        {/* =================================================
            GALLERY + SUMMARY
        ================================================== */}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          {/* =================================================
              GALLERY
          ================================================== */}

          <div>
            {/* Main image */}

            <div className="group relative overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={room.images[activeImage]}
                alt={room.title}
                className="h-90 w-full object-cover sm:h-120 lg:h-135"
              />

              {/* Gradient */}

              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

              {/* Verified */}

              {room.verified && (
                <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-emerald-600 shadow-sm">
                  <ShieldCheck size={15} />
                  Verified
                </div>
              )}

              {/* Favorite */}

              <button
                type="button"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`
                  absolute right-5 top-5
                  flex h-11 w-11
                  items-center justify-center
                  rounded-full
                  bg-white/95
                  shadow-md
                  transition
                  ${
                    isFavorite
                      ? "text-red-500"
                      : "text-gray-600 hover:text-red-500"
                  }
                `}
              >
                <Heart size={20} className={isFavorite ? "fill-current" : ""} />
              </button>

              {/* Previous */}

              {room.images.length > 1 && (
                <button
                  type="button"
                  onClick={previousImage}
                  className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              {/* Next */}

              {room.images.length > 1 && (
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-md transition hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              )}

              {/* Image count */}

              <button
                type="button"
                onClick={() => setShowAllImages(true)}
                className="absolute bottom-5 right-5 rounded-xl bg-black/60 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-black/75"
              >
                View all {room.images.length} photos
              </button>
            </div>

            {/* Thumbnail row */}

            <div className="mt-3 grid grid-cols-4 gap-3">
              {room.images.slice(0, 4).map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`
                      relative
                      overflow-hidden
                      rounded-xl
                      border-2
                      ${
                        activeImage === index
                          ? "border-blue-600"
                          : "border-transparent"
                      }
                    `}
                >
                  <img
                    src={image}
                    alt={`Room ${index + 1}`}
                    className="h-20 w-full object-cover sm:h-24"
                  />
                </button>
              ))}
            </div>
          </div>

          <aside>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:sticky lg:top-24">
              {/* Badge */}

              {room.featured && (
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-semibold text-blue-600">
                  Featured Room
                </span>
              )}

              {/* Title */}

              <h1 className="mt-4 text-2xl font-bold leading-tight text-gray-900">
                {room.title}
              </h1>

              <p className="mt-1 text-sm text-gray-400">{room.englishTitle}</p>

              {/* Rating */}

              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star size={17} className="fill-yellow-500 text-yellow-500" />

                  <span className="text-sm font-semibold text-gray-800">
                    {room.rating}
                  </span>
                </div>

                <span className="text-sm text-gray-400">
                  ({room.reviews} reviews)
                </span>
              </div>

              {/* Location */}

              <div className="mt-5 flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                <MapPin size={19} className="mt-0.5 shrink-0 text-blue-600" />

                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {room.location}, {room.city}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">{room.address}</p>
                </div>
              </div>

              {/* Price */}

              <div className="mt-6 border-y border-gray-100 py-5">
                <span className="text-3xl font-bold tracking-tight text-gray-900">
                  ${room.price}
                </span>

                <span className="ml-1 text-sm text-gray-400">/ month</span>
              </div>

              {/* Basic information */}

              <div className="grid grid-cols-2 gap-3 py-5">
                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <BedDouble size={17} />

                    <span className="text-xs">Room Type</span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {room.roomType}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Bath size={17} />

                    <span className="text-xs">Bathroom</span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-gray-800">
                    {room.bathroom}
                  </p>
                </div>
              </div>

              {/* Buttons */}

              <div className="space-y-3">
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  type="button"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <MessageCircle size={18} />
                  Contact Landlord
                </button>
              </div>

              {/* Safety */}

              <div className="mt-5 flex gap-3 rounded-xl bg-emerald-50 p-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <p className="text-xs leading-5 text-emerald-700">
                  Never send money before viewing the room and confirming the
                  landlord information.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">

          <div className="space-y-8">

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">អំពីបន្ទប់នេះ</h2>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                {room.description}
              </p>
            </section>


            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                សម្ភារៈ និងបរិក្ខារ
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {room.facilities.map((facility) => {
                  const Icon = getFacilityIcon(facility);

                  return (
                    <div
                      key={facility}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 p-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <Icon size={17} />
                      </div>

                      <span className="text-sm font-medium text-gray-700">
                        {facility}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* RULES */}

            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                ច្បាប់សម្រាប់ការស្នាក់នៅ
              </h2>

            

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {room.rules.map((rule) => (
                  <div key={rule} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <Check size={15} />
                    </div>

                    <span className="text-sm text-gray-600">{rule}</span>
                  </div>
                ))}
              </div>
            </section>


            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">ទីតាំង</h2>

              <div className="mt-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MapPin size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {room.location}, {room.city}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">{room.address}</p>
                </div>
              </div>

              {/* Map placeholder */}

              <div className="relative mt-5 flex h-75 items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
                <div className="absolute inset-0 opacity-40">
                  <div className="h-full w-full bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%),linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%)] bg-size-[40px_40px] bg-position-[0_0,20px_20px]" />
                </div>

                <div className="relative flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                    <MapPin size={23} />
                  </div>

                  <div className="mt-3 rounded-xl bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-md">
                    {room.location}
                  </div>
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-400">
                Map integration can be connected later using Google Maps or
                OpenStreetMap.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* =====================================================
          IMAGE LIGHTBOX
      ====================================================== */}

      {showAllImages && (
        <div className="fixed inset-0 z-100 bg-black/90 p-4">
          {/* Close */}

          <button
            type="button"
            onClick={() => setShowAllImages(false)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
          >
            <X size={22} />
          </button>

          {/* Image */}

          <div className="flex h-full items-center justify-center">
            <img
              src={room.images[activeImage]}
              alt={room.title}
              className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
            />
          </div>

          {/* Previous */}

          <button
            type="button"
            onClick={previousImage}
            className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next */}

          <button
            type="button"
            onClick={nextImage}
            className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
          >
            <ChevronRight size={24} />
          </button>

          {/* Counter */}

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-xs text-white backdrop-blur">
            {activeImage + 1} / {room.images.length}
          </div>
        </div>
      )}
      <RequestRoomModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        room={room}
      />
    </div>
  );
};

export default RoomDetail;
