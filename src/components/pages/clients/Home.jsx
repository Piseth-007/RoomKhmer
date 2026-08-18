import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Wallet,
  Wifi,
  Wind,
  Car,
  GraduationCap,
  Home as HomeIcon,
  Droplets,
  BedDouble,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../../../firebase/config";


const locations = [
  {
    name: "ទួលគោក",
    english: "Tuol Kork",
    rooms: "120+ rooms",
    image:
      "https://s9.kh1.co/__image/w=1200,h=630,q=100/71/7149d59d2fd8493d3ddcf32f95c04445619f0796.webp",
  },
  {
    name: "សែនសុខ",
    english: "Sen Sok",
    rooms: "95+ rooms",
    image: "https://s3.ams.com.kh/economy/2025/01/153020394.png",
  },
  {
    name: "បឹងកេងកង",
    english: "BKK",
    rooms: "80+ rooms",
    image: "https://s3.ams.com.kh/economy/2023/02/LandpriceBKKa.jpg",
  },
  {
    name: "ចំការមន",
    english: "Chamkarmon",
    rooms: "70+ rooms",
    image: "https://img.harbor-property.com/bkarticle/2021/09/21/094942193.jpg",
  },
];


const benefits = [
  {
    icon: Search,
    title: "ស្វែងរកបានងាយ",
    english: "Easy to Search",
    description:
      "ស្វែងរកបន្ទប់តាមតំបន់ តម្លៃ សាកលវិទ្យាល័យ និងតម្រូវការរបស់អ្នក។",
  },
  {
    icon: ShieldCheck,
    title: "ព័ត៌មានច្បាស់លាស់",
    english: "Trusted Listings",
    description: "មើលព័ត៌មានបន្ទប់ រូបភាព តម្លៃ និងសម្ភារៈបានយ៉ាងច្បាស់លាស់។",
  },
  {
    icon: Wallet,
    title: "តម្លៃសមរម្យ",
    english: "Affordable",
    description: "ស្វែងរកបន្ទប់ដែលសមនឹងថវិការបស់និស្សិត និងអ្នកធ្វើការ។",
  },
  {
    icon: MapPin,
    title: "ទីតាំងងាយស្រួល",
    english: "Great Locations",
    description:
      "ស្វែងរកបន្ទប់នៅជិតសាកលវិទ្យាល័យ កន្លែងធ្វើការ និងតំបន់សំខាន់ៗ។",
  },
];


const steps = [
  {
    number: "01",
    icon: Search,
    title: "ស្វែងរកបន្ទប់",
    english: "Search",
    description: "បញ្ចូលតំបន់ តម្លៃ ឬសាកលវិទ្យាល័យដែលអ្នកចង់រស់នៅ។",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "ជ្រើសរើស",
    english: "Choose",
    description:
      "ប្រើ Filter ដើម្បីរកបន្ទប់ដែលសមនឹងតម្រូវការ និងថវិការបស់អ្នក។",
  },
  {
    number: "03",
    icon: HomeIcon,
    title: "មើលព័ត៌មាន",
    english: "View Details",
    description: "ពិនិត្យរូបភាព តម្លៃ បរិក្ខារ ទីតាំង និងព័ត៌មានម្ចាស់ផ្ទះ។",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "ទាក់ទងម្ចាស់ផ្ទះ",
    english: "Contact",
    description: "ទាក់ទងម្ចាស់ផ្ទះដើម្បីសួរព័ត៌មាន និងរៀបចំការជួល។",
  },
];


const FALLBACK_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80";


const getRoomImage = (room) => {
  if (Array.isArray(room.images) && room.images.length > 0) {
    return room.images[0];
  }

  if (Array.isArray(room.gallery) && room.gallery.length > 0) {
    return room.gallery[0];
  }

  if (room.image) {
    return room.image;
  }

  if (room.imageUrl) {
    return room.imageUrl;
  }

  return FALLBACK_ROOM_IMAGE;
};


const getFacilityIcon = (facility) => {
  const value = String(facility).toLowerCase();

  if (value.includes("wifi")) {
    return Wifi;
  }

  if (
    value.includes("air") ||
    value.includes("ac") ||
    value.includes("aircon")
  ) {
    return Wind;
  }

  if (value.includes("parking") || value.includes("car")) {
    return Car;
  }

  if (value.includes("water") || value.includes("ទឹក")) {
    return Droplets;
  }

  if (value.includes("bed") || value.includes("bedroom")) {
    return BedDouble;
  }

  return CheckCircle2;
};


const getCreatedDate = (createdAt) => {
  if (!createdAt) {
    return null;
  }

  if (createdAt && typeof createdAt.toDate === "function") {
    return createdAt.toDate();
  }

  if (createdAt instanceof Date) {
    return createdAt;
  }

  if (typeof createdAt === "object" && typeof createdAt.seconds === "number") {
    return new Date(createdAt.seconds * 1000);
  }

  if (typeof createdAt === "string") {
    const date = new Date(createdAt);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  if (typeof createdAt === "number") {
    const date = new Date(createdAt);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
};


const getCreatedTime = (createdAt) => {
  const date = getCreatedDate(createdAt);

  if (!date) {
    return 0;
  }

  return date.getTime();
};


const formatPrice = (price) => {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "0";
  }

  return numericPrice.toLocaleString();
};


export default function Home() {
  const navigate = useNavigate();

  const [searchLocation, setSearchLocation] = useState("");

  const [featuredRooms, setFeaturedRooms] = useState([]);

  const [roomsLoading, setRoomsLoading] = useState(true);

  const [roomsError, setRoomsError] = useState("");


  const handleSearch = (event) => {
    event.preventDefault();

    const value = searchLocation.trim();

    if (!value) {
      navigate("/rooms");
      return;
    }

    navigate(`/rooms?location=${encodeURIComponent(value)}`);
  };


  useEffect(() => {
    let mounted = true;

    const fetchFeaturedRooms = async () => {
      try {
        setRoomsLoading(true);
        setRoomsError("");

        const roomsRef = collection(db, "rooms");

        const roomsQuery = query(roomsRef, where("status", "==", "available"));

        const snapshot = await getDocs(roomsQuery);

        if (!mounted) {
          return;
        }

        const rooms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedRooms = rooms.sort(
          (a, b) => getCreatedTime(b.createdAt) - getCreatedTime(a.createdAt),
        );

        const latestRooms = sortedRooms.slice(0, 3);

        setFeaturedRooms(latestRooms);
      } catch (error) {
        console.error("Failed to load featured rooms:", error);

        if (mounted) {
          setRoomsError("Unable to load available rooms.");
        }
      } finally {
        if (mounted) {
          setRoomsLoading(false);
        }
      }
    };

    fetchFeaturedRooms();

    return () => {
      mounted = false;
    };
  }, []);


  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">

      <section className="relative overflow-hidden bg-slate-50">
        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-sky-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50">
                  <MapPin size={12} />
                </span>
                ភ្នំពេញ, កម្ពុជា
              </div>

              <h1 className="max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                ស្វែងរកបន្ទប់
                <span className="block text-blue-600">ដែលសមនឹងអ្នក</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
                ស្វែងរកបន្ទប់ជួលដែលមានតម្លៃសមរម្យ នៅជិតសាកលវិទ្យាល័យ
                ឬកន្លែងធ្វើការរបស់អ្នក។
              </p>


              <form
                onSubmit={handleSearch}
                className="mt-8 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-gray-200/50"
              >
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <div className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Search size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <label
                        htmlFor="home-location-search"
                        className="block text-xs font-medium text-gray-400"
                      >
                        ស្វែងរកទីតាំង
                      </label>

                      <input
                        id="home-location-search"
                        type="text"
                        value={searchLocation}
                        onChange={(event) =>
                          setSearchLocation(event.target.value)
                        }
                        placeholder="Tuol Kork, Sen Sok..."
                        className="mt-0.5 w-full border-none bg-transparent p-0 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Search size={18} />
                    ស្វែងរក
                  </button>
                </div>


                <div className="mt-2 flex flex-wrap gap-2 border-t border-gray-100 px-3 pt-3">
                  <Link
                    to="/rooms?price=under-150"
                    className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    Under $150
                  </Link>

                  <Link
                    to="/rooms?type=student"
                    className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    Student Rooms
                  </Link>

                  <Link
                    to="/rooms?facility=wifi"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Wifi size={13} />
                    WiFi
                  </Link>

                  <Link
                    to="/rooms?facility=aircon"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Wind size={13} />
                    Air Conditioning
                  </Link>
                </div>
              </form>


              <div className="mt-8 flex flex-wrap gap-6 sm:gap-7">
                <div>
                  <p className="text-2xl font-bold text-gray-900">500+</p>

                  <p className="text-xs text-gray-400">Rooms Available</p>
                </div>

                <div className="hidden h-10 w-px bg-gray-200 sm:block" />

                <div>
                  <p className="text-2xl font-bold text-gray-900">20+</p>

                  <p className="text-xs text-gray-400">Locations</p>
                </div>

                <div className="hidden h-10 w-px bg-gray-200 sm:block" />

                <div>
                  <p className="text-2xl font-bold text-gray-900">1,000+</p>

                  <p className="text-xs text-gray-400">Students</p>
                </div>
              </div>
            </div>


            <div className="relative hidden lg:block">
              <div className="relative mx-auto max-w-lg">
                <div className="overflow-hidden rounded-4xl shadow-2xl shadow-gray-300/50">
                  <img
                    src="https://media.istockphoto.com/id/521138299/photo/central-phnom-penh-in-cambodia.jpg?s=612x612&w=0&k=20&c=pW-7c3rS-79zwd_-7xQHsZ5v5KsUB36kWA3SZWHvUWE="
                    alt="Phnom Penh"
                    className="h-135 w-full object-cover"
                  />

                  <div className="absolute inset-0 rounded-4xl bg-linear-to-t from-black/30 via-transparent to-transparent" />
                </div>

                <div className="absolute -bottom-6 -left-8 w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                      <img
                        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=200&q=80"
                        alt="Modern room"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        Modern Room
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <MapPin size={12} />
                        Tuol Kork
                      </div>

                      <p className="mt-1 text-sm font-bold text-blue-600">
                        $150 / month
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-5 top-10 hidden rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl xl:block">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-50 text-yellow-500">
                      <Star size={18} className="fill-current" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-gray-900">4.9</p>

                      <p className="text-[10px] text-gray-400">User Rating</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                POPULAR LOCATIONS
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                តំបន់ពេញនិយម
              </h2>

              <p className="mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
                ស្វែងរកបន្ទប់នៅតំបន់ដែលមានភាពងាយស្រួល សម្រាប់ការរស់នៅ
                និងការសិក្សា។
              </p>
            </div>

            <Link
              to="/locations"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
            >
              មើលទីតាំងទាំងអស់
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((location) => (
              <Link
                key={location.english}
                to={`/rooms?location=${encodeURIComponent(location.english)}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.english}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-lg font-semibold">{location.name}</p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-white/70">
                      {location.english}
                    </span>

                    <span className="h-1 w-1 rounded-full bg-white/50" />

                    <span className="text-xs text-white/70">
                      {location.rooms}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                FEATURED ROOMS
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                បន្ទប់ដែលបានបន្ថែមថ្មី
              </h2>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                បន្ទប់ដែលម្ចាស់ផ្ទះបានបន្ថែមថ្មីៗ និងកំពុងមានស្ថានភាពទំនេរ។
              </p>
            </div>

            <Link
              to="/rooms"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
            >
              មើលបន្ទប់ទាំងអស់
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>


          {roomsLoading && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                >
                  <div className="aspect-4/3 animate-pulse bg-gray-200" />

                  <div className="space-y-4 p-5">
                    <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-full animate-pulse rounded bg-gray-200" />

                    <div className="flex gap-2">
                      <div className="h-7 w-16 animate-pulse rounded bg-gray-200" />

                      <div className="h-7 w-16 animate-pulse rounded bg-gray-200" />

                      <div className="h-7 w-16 animate-pulse rounded bg-gray-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}


          {!roomsLoading && roomsError && (
            <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500">
                <ShieldCheck size={22} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900">
                Unable to load rooms
              </h3>

              <p className="mt-2 text-sm text-gray-500">{roomsError}</p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                <ArrowRight size={17} />
                Try Again
              </button>
            </div>
          )}


          {!roomsLoading && !roomsError && featuredRooms.length === 0 && (
            <div className="mt-8 rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BedDouble size={26} />
              </div>

              <h3 className="mt-4 text-base font-semibold text-gray-900">
                មិនទាន់មានបន្ទប់ទំនេរ
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                New available rooms will appear here.
              </p>

              <Link
                to="/rooms"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Search size={17} />
                ស្វែងរកបន្ទប់
              </Link>
            </div>
          )}


          {!roomsLoading && !roomsError && featuredRooms.length > 0 && (
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredRooms.map((room) => {
                const roomImage = getRoomImage(room);

                const facilities = Array.isArray(room.amenities)
                  ? room.amenities
                  : Array.isArray(room.facilities)
                    ? room.facilities
                    : [];

                const createdDate = getCreatedDate(room.createdAt);

                return (
                  <article
                    key={room.id}
                    className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >

                    <div className="relative aspect-4/3 overflow-hidden">
                      <img
                        src={roomImage}
                        alt={room.name || "Room"}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />


                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm">
                        <CheckCircle2 size={12} />
                        New
                      </span>


                      <button
                        type="button"
                        aria-label={`Add ${room.name || "room"} to favorites`}
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-red-500"
                      >
                        <Heart size={18} />
                      </button>
                    </div>


                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-gray-900">
                            {room.name || "Room"}
                          </h3>

                          {room.type && (
                            <p className="mt-0.5 truncate text-xs text-gray-400">
                              {room.type}
                            </p>
                          )}
                        </div>

                        {room.rating && (
                          <div className="flex shrink-0 items-center gap-1 rounded-lg bg-yellow-50 px-2 py-1 text-sm font-semibold text-gray-700">
                            <Star
                              size={14}
                              className="fill-current text-yellow-500"
                            />

                            {room.rating}
                          </div>
                        )}
                      </div>


                      <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin size={15} className="shrink-0 text-blue-500" />

                        <span className="truncate">
                          {room.location || room.address || "Phnom Penh"}
                        </span>
                      </div>


                      <div className="mt-4 flex flex-wrap gap-2">
                        {room.bedrooms && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-500">
                            <BedDouble size={13} />
                            {room.bedrooms} Bedroom
                          </span>
                        )}

                        {room.bathrooms && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-500">
                            <Droplets size={13} />
                            {room.bathrooms} Bathroom
                          </span>
                        )}

                        {room.area && (
                          <span className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-500">
                            {room.area} m²
                          </span>
                        )}
                      </div>


                      {facilities.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {facilities.slice(0, 4).map((facility, index) => {
                            const facilityName =
                              typeof facility === "string"
                                ? facility
                                : facility?.name ||
                                  facility?.label ||
                                  "Facility";

                            const Icon = getFacilityIcon(facilityName);

                            return (
                              <span
                                key={`${facilityName}-${index}`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[11px] text-blue-600"
                              >
                                <Icon size={13} />

                                {facilityName}
                              </span>
                            );
                          })}
                        </div>
                      )}


                      <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
                        <div>
                          <span className="text-xl font-bold text-gray-900">
                            ${formatPrice(room.price)}
                          </span>

                          <span className="ml-1 text-xs text-gray-400">
                            / month
                          </span>

                          {createdDate && (
                            <p className="mt-1 text-[10px] text-gray-400">
                              Added{" "}
                              {createdDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          )}
                        </div>

                        <Link
                          to={`/rooms/${room.id}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-50 px-3 text-xs font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                        >
                          View Room
                          <ChevronRight size={15} />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>


      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                WHY ROOMKHMER
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                រកបន្ទប់បានងាយ
                <span className="block text-blue-600">រស់នៅបានស្រួល</span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-6 text-gray-500 sm:text-base">
                RoomKhmer ត្រូវបានបង្កើតឡើងដើម្បីជួយនិស្សិត និងអ្នកដែលមកពីខេត្ត
                ឱ្យអាចស្វែងរកបន្ទប់ជួលនៅភ្នំពេញ បានយ៉ាងងាយស្រួល
                និងមានទំនុកចិត្ត។
              </p>

              <Link
                to="/about"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                ស្វែងយល់បន្ថែម
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.english}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-100 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-gray-900">
                      {benefit.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold text-blue-600">HOW IT WORKS</p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              រកបន្ទប់របស់អ្នកក្នុង 4 ជំហាន
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              ពីការស្វែងរករហូតដល់ទាក់ទងម្ចាស់ផ្ទះ
              យើងធ្វើឱ្យដំណើរការរបស់អ្នកកាន់តែងាយស្រួល។
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-gray-100 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={21} />
                    </div>

                    <span className="text-3xl font-bold text-gray-100">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-gray-900">
                    {step.title}
                  </h3>

                  <p className="mt-0.5 text-xs font-medium text-blue-500">
                    {step.english}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {step.description}
                  </p>

                  {index < steps.length - 1 && (
                    <div className="absolute -right-4 top-12 z-10 hidden lg:block">
                      <ChevronRight size={18} className="text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 sm:px-10 lg:px-14">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

            <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-white/5" />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
                  <Building2 size={22} />
                </div>

                <h2 className="max-w-xl text-2xl font-bold text-white sm:text-3xl">
                  មានបន្ទប់ទំនេរ?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                  ដាក់បន្ទប់របស់អ្នកនៅលើ RoomKhmer
                  ហើយជួយនិស្សិតរកកន្លែងស្នាក់នៅដែលសមរម្យ។
                </p>

                <p className="mt-2 text-sm text-blue-200">
                  Have a room to rent? List it on RoomKhmer.
                </p>
              </div>

              <Link
                to="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-600 shadow-sm transition hover:bg-blue-50"
              >
                ចុះឈ្មោះជាម្ចាស់ផ្ទះ
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>


      <section className="border-t border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <GraduationCap size={27} />
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            ត្រៀមរកបន្ទប់ថ្មីរបស់អ្នកហើយឬនៅ?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            ចាប់ផ្តើមស្វែងរកបន្ទប់ដែលសមនឹងថវិកា ទីតាំង
            និងជីវិតប្រចាំថ្ងៃរបស់អ្នក។
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/rooms"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Search size={18} />
              ស្វែងរកបន្ទប់
            </Link>

            <Link
              to="/auth/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              ចាប់ផ្តើមប្រើប្រាស់
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
