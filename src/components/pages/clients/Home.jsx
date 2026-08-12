import {
  ArrowRight,
  BedDouble,
  Building2,
  CheckCircle2,
  ChevronRight,
  Heart,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Users,
  Wallet,
  Wifi,
  Wind,
  Car,
  GraduationCap,
  Home as HomeIcon,
} from "lucide-react";

import { Link } from "react-router-dom";

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

const rooms = [
  {
    id: 1,
    title: "បន្ទប់ស្អាតជិតសាកលវិទ្យាល័យ",
    englishTitle: "Modern Student Room",
    location: "Tuol Kork, Phnom Penh",
    price: 150,
    rating: 4.8,
    reviews: 24,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
    facilities: ["WiFi", "Aircon", "Parking"],
  },
  {
    id: 2,
    title: "បន្ទប់ទំនើប និងមានសុវត្ថិភាព",
    englishTitle: "Comfortable Studio Room",
    location: "Sen Sok, Phnom Penh",
    price: 180,
    rating: 4.9,
    reviews: 31,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80",
    facilities: ["WiFi", "Aircon", "Water"],
  },
  {
    id: 3,
    title: "បន្ទប់តម្លៃសមរម្យសម្រាប់និស្សិត",
    englishTitle: "Affordable Student Room",
    location: "Chamkarmon, Phnom Penh",
    price: 120,
    rating: 4.7,
    reviews: 18,
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80",
    facilities: ["WiFi", "Parking", "Water"],
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

export default function Home() {
  return (
    <div className="bg-white">
      {/* =====================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-slate-50">
        {/* Background decoration */}

        <div className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-sky-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* LEFT */}

            <div>
              {/* Badge */}

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-medium text-blue-600 shadow-sm">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50">
                  <MapPin size={12} />
                </span>
                Phnom Penh, Cambodia
              </div>

              {/* Heading */}

              <h1 className="max-w-2xl text-4xl font-bold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                ស្វែងរកបន្ទប់
                <span className="block text-blue-600">ដែលសមនឹងអ្នក</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
                Find a comfortable and affordable room in Phnom Penh.
                ស្វែងរកបន្ទប់ជួលដែលមានតម្លៃសមរម្យ នៅជិតសាកលវិទ្យាល័យ
                ឬកន្លែងធ្វើការរបស់អ្នក។
              </p>

              {/* Search Box */}

              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-gray-200/50">
                <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                  {/* Search */}

                  <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Search size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <label className="block text-xs font-medium text-gray-400">
                        ស្វែងរកទីតាំង
                      </label>

                      <input
                        type="text"
                        placeholder="Tuol Kork, Sen Sok..."
                        className="mt-0.5 w-full border-none bg-transparent p-0 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Search button */}

                  <Link
                    to="/rooms"
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Search size={18} />
                    ស្វែងរក
                    <span className="hidden sm:inline">Rooms</span>
                  </Link>
                </div>

                {/* Quick filters */}

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
                    className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    WiFi
                  </Link>

                  <Link
                    to="/rooms?facility=aircon"
                    className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-blue-50 hover:text-blue-600"
                  >
                    Air Conditioning
                  </Link>
                </div>
              </div>

              {/* Stats */}

              <div className="mt-8 flex flex-wrap gap-7">
                <div>
                  <p className="text-2xl font-bold text-gray-900">500+</p>
                  <p className="text-xs text-gray-400">Rooms Available</p>
                </div>

                <div className="h-10 w-px bg-gray-200" />

                <div>
                  <p className="text-2xl font-bold text-gray-900">20+</p>
                  <p className="text-xs text-gray-400">Locations</p>
                </div>

                <div className="h-10 w-px bg-gray-200" />

                <div>
                  <p className="text-2xl font-bold text-gray-900">1,000+</p>
                  <p className="text-xs text-gray-400">Students</p>
                </div>
              </div>
            </div>

            {/* RIGHT IMAGE */}

            <div className="relative hidden lg:block">
              <div className="relative mx-auto max-w-lg">
                {/* Main image */}

                <div className="overflow-hidden rounded-4xl shadow-2xl shadow-gray-300/50">
                  <img
                    src="https://media.istockphoto.com/id/521138299/photo/central-phnom-penh-in-cambodia.jpg?s=612x612&w=0&k=20&c=pW-7c3rS-79zwd_-7xQHsZ5v5KsUB36kWA3SZWHvUWE="
                    alt="Modern student room"
                    className="h-135 w-full object-cover"
                  />

                  <div className="absolute inset-0 rounded-4xl bg-linear-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Floating room card */}

                <div className="absolute -bottom-6 -left-8 w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 overflow-hidden rounded-xl">
                      <img
                        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=200&q=80"
                        alt="Room"
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          POPULAR LOCATIONS
      ====================================================== */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section heading */}

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                POPULAR LOCATIONS
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                តំបន់ពេញនិយម
              </h2>

              <p className="mt-2 max-w-xl text-sm text-gray-500 sm:text-base">
                ស្វែងរកបន្ទប់នៅតំបន់ដែលមានភាពងាយស្រួលសម្រាប់ការរស់នៅ
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
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Locations */}

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((location) => (
              <Link
                key={location.english}
                to={`/rooms?location=${location.english}`}
                className="group relative overflow-hidden rounded-2xl"
              >
                <div className="aspect-4/3 overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.english}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-lg font-semibold">{location.name}</p>

                  <div className="mt-0.5 flex items-center gap-2">
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

      {/* =====================================================
          FEATURED ROOMS
      ====================================================== */}

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                FEATURED ROOMS
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                បន្ទប់ដែលណែនាំ
              </h2>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                បន្ទប់ដែលមានទីតាំងល្អ តម្លៃសមរម្យ និងសាកសមសម្រាប់និស្សិត។
              </p>
            </div>

            <Link
              to="/rooms"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
            >
              មើល​បន្ទប់ទាំងអស់
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>
          </div>

          {/* Room grid */}

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <article
                key={room.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}

                <div className="relative aspect-4/3 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Favorite */}

                  <button
                    type="button"
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm backdrop-blur transition hover:text-red-500"
                    aria-label="Add to favorites"
                  >
                    <Heart size={18} />
                  </button>

                  {/* Badge */}

                  <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white">
                    Featured
                  </span>
                </div>

                {/* Content */}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-gray-900">
                        {room.title}
                      </h3>

                      <p className="mt-0.5 truncate text-xs text-gray-400">
                        {room.englishTitle}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-gray-700">
                      <Star
                        size={15}
                        className="fill-current text-yellow-500"
                      />

                      {room.rating}
                    </div>
                  </div>

                  {/* Location */}

                  <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin size={15} className="shrink-0 text-blue-500" />

                    <span className="truncate">{room.location}</span>
                  </div>

                  {/* Facilities */}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {room.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-500"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}

                  <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        ${room.price}
                      </span>

                      <span className="ml-1 text-xs text-gray-400">
                        / month
                      </span>
                    </div>

                    <Link
                      to={`/rooms/${room.id}`}
                      className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-50 px-3 text-xs font-semibold text-blue-600 transition hover:bg-blue-600 hover:text-white"
                    >
                      View Room
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY ROOMKHMER
      ====================================================== */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            {/* Left */}

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
                Learn more
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* Benefits */}

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

                    <p className="mt-0.5 text-xs font-medium text-gray-400">
                      {benefit.english}
                    </p>

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

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}

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
                  {/* Number */}

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

                  {/* Connector */}

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

      {/* =====================================================
          LANDLORD CTA
      ====================================================== */}

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 sm:px-10 lg:px-14">
            {/* Decorative shapes */}

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

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white  transition hover:bg-blue-700"
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
