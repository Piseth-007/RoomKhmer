import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Building2,
  ChevronRight,
  MapPin,
  Search,
  Star,
  X,
} from "lucide-react";

import { locations } from "../../../data/locations";

const Locations = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filteredLocations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return locations;
    }

    return locations.filter((location) => {
      return (
        location.name.toLowerCase().includes(value) ||
        location.khmerName.includes(search)
      );
    });
  }, [search]);

  const handleLocationClick = (location) => {
    navigate(`/rooms?location=${encodeURIComponent(location.name)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-50 blur-3xl" />

        <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-indigo-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 lg:px-8">
          <div className="mb-8 flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="transition hover:text-blue-600">
              Home
            </Link>

            <ChevronRight size={13} />

            <span className="font-medium text-gray-600">Locations</span>
          </div>

          

          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MapPin size={26} />
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              ស្វែងរកបន្ទប់ជួលនៅតំបន់ដែលអ្នកចង់រស់នៅ
            </h1>

            <p className="mt-3 text-lg font-medium text-gray-500">
              Find a room in the right location
            </p>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-400">
              Explore popular neighborhoods in Phnom Penh and find a room close
              to your university, workplace, and everything you need.
            </p>

            {/* Search */}

            <div className="mx-auto mt-8 max-w-xl">
              <div className="flex h-14 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-lg shadow-gray-200/50">
                <Search size={20} className="shrink-0 text-blue-500" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ស្វែងរកទីតាំង..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>

            <h2 className="mt-1 text-2xl font-bold text-gray-900">
              ទីតាំង​ ពេញនិយម
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              {filteredLocations.length} locations available
            </p>
          </div>

          <Link
            to="/rooms"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            មើល​បន្ទប់ទាំងអស់
            <ArrowRight size={16} />
          </Link>
        </div>

      
        {filteredLocations.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLocations.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => handleLocationClick(location)}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />


                  <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-blue-600 shadow-sm">
                    <MapPin size={17} />
                  </div>


                  <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-gray-700 shadow-sm">
                    {location.roomCount} បន្ទប់
                  </div>
                </div>

              

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 transition group-hover:text-blue-600">
                        {location.khmerName}
                      </h3>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {location.name}
                      </p>
                    </div>

                    <ChevronRight
                      size={18}
                      className="mt-1 shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-500"
                    />
                  </div>

                  <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-5 text-gray-400">
                    {location.description}
                  </p>

                

                  <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-[10px] text-gray-400">Average price</p>

                      <p className="mt-0.5 text-sm font-bold text-gray-900">
                        ${location.averagePrice}
                        <span className="ml-1 text-[10px] font-normal text-gray-400">
                          / month
                        </span>
                      </p>
                    </div>

                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (

          <div className="flex min-h-87.5 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
              <Search size={25} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              No locations found
            </h3>

            <p className="mt-1 max-w-sm text-sm leading-6 text-gray-400">
              Try searching for another area in Phnom Penh.
            </p>

            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Show all locations
            </button>
          </div>
        )}

        {/* =================================================
            WHY CHOOSE LOCATION
        ================================================== */}

        <section className="mt-16 overflow-hidden rounded-3xl bg-gray-900">
          <div className="grid lg:grid-cols-2">
            {/* Text */}

            <div className="p-7 sm:p-10 lg:p-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                Find the right place
              </span>

              <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
                Live closer to what matters to you.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-400">
                មិនថាអ្នកជានិស្សិតដែលមកសិក្សានៅសាកលវិទ្យាល័យនៅទីក្រុងភ្នំពេញ
                ឬជាអ្នកជំនាញវ័យក្មេងដែលចាប់ផ្តើមការងារថ្មីនោះទេ
                ការជ្រើសរើសទីតាំងត្រឹមត្រូវអាចធ្វើឱ្យជីវិតប្រចាំថ្ងៃកាន់តែងាយស្រួល។
              </p>

              {/* Benefits */}

              <div className="mt-7 space-y-4">
                {[
                  "ជិតសាកលវីទ្យាល័យ",
                  "ងាយស្រួលទៅដល់ការដឹកជញ្ជូន",
                  "បន្ទប់ស្អាត",
                  "ជិតផ្សារនិងភោជនីយដ្ឋាន",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                      <Star size={14} className="fill-current" />
                    </div>

                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/rooms"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                ស្វែងរកបន្ទប់
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right visual */}

            <div className="relative min-h-80 overflow-hidden lg:min-h-full">
              <img
                src="https://cambodiapropertyreport.com//storage/posts/November2019/244.jpg"
                alt="Phnom Penh"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gray-900/30" />

              {/* Floating card */}

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur sm:left-auto sm:max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Building2 size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      500+ rooms
                    </p>

                    <p className="text-xs text-gray-400">across Phnom Penh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Locations;
