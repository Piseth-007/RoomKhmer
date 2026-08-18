import { Link } from "react-router-dom";

import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Heart,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";

const About = () => {
  const stats = [
    {
      value: "500+",
      label: "Rooms Listed",
      khmer: "បន្ទប់ដែលបានចុះបញ្ជី",
      icon: Home,
    },
    {
      value: "1,000+",
      label: "Students Helped",
      khmer: "និស្សិតដែលបានជួយ",
      icon: Users,
    },
    {
      value: "8+",
      label: "Locations",
      khmer: "តំបន់នៅភ្នំពេញ",
      icon: MapPin,
    },
    {
      value: "95%",
      label: "Happy Users",
      khmer: "អ្នកប្រើប្រាស់ពេញចិត្ត",
      icon: Heart,
    },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Safety First",
      khmer: "សុវត្ថិភាពជាចម្បង",
      description:
        "We help students discover verified rooms and trustworthy landlords so they can search with greater confidence.",
    },
    {
      icon: BadgeCheck,
      title: "Verified Information",
      khmer: "ព័ត៌មានដែលអាចទុកចិត្តបាន",
      description:
        "We aim to provide clear information about rooms, prices, locations, and facilities.",
    },
    {
      icon: Heart,
      title: "Student Focused",
      khmer: "ផ្តោតលើនិស្សិត",
      description:
        "Our platform is designed around the real needs of students moving to Phnom Penh for study and work.",
    },
    {
      icon: Users,
      title: "Better Connections",
      khmer: "ភ្ជាប់អ្នកជួល និងម្ចាស់ផ្ទះ",
      description:
        "We make it easier for students and landlords to connect directly and communicate about available rooms.",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Search",
      khmer: "ស្វែងរក",
      description:
        "ស្វែងរកបន្ទប់ដោយផ្អែកលើទីតាំង តម្លៃ ប្រភេទបន្ទប់ និងគ្រឿងបរិក្ខារដែលអ្នកពេញចិត្ត។",
    },
    {
      number: "02",
      icon: Home,
      title: "Explore",
      khmer: "ស្វែងយល់",
      description:
        "មើលរូបថតបន្ទប់ តម្លៃ គ្រឿងបរិក្ខារ ទីតាំង និងព័ត៌មានម្ចាស់ផ្ទះ។",
    },
    {
      number: "03",
      icon: MessageCircleIcon,
      title: "Connect",
      khmer: "ទាក់ទង",
      description:
        "ទាក់ទងម្ចាស់ផ្ទះ ហើយសួរសំណួរមុនពេលសម្រេចចិត្តជួលបន្ទប់។",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute -right-40 -top-40 h-125 w-125 rounded-full bg-blue-50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-100 w-100 rounded-full bg-indigo-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 lg:px-8">
          <div className="mb-10 flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="transition hover:text-blue-600">
              Home
            </Link>

            <span>/</span>

            <span className="font-medium text-gray-600">About</span>
          </div>

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                <Heart size={13} className="fill-current" />
                About RoomKhmer
              </span>

              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                ការស្វែងរកបន្ទប់
                <span className="block text-blue-600">មិនគួរពិបាកទេ</span>
              </h1>

              <p className="mt-5 text-lg font-medium text-gray-500">
                ស្វែងរកកន្លែងរស់នៅដែលសមនឹងអ្នក។
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                RoomKhmer is a room rental platform designed to help students
                and young professionals find affordable and suitable rooms in
                Phnom Penh.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/rooms"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  ស្វែងរកបន្ទប់
                  <ArrowRight size={17} />
                </Link>

                <Link
                  to="/locations"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  បង្ហាញទីតាំង
                  <MapPin size={17} />
                </Link>
              </div>
            </div>


            <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <img
                  src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85"
                  alt="Comfortable student room"
                  className="h-100 w-full object-cover sm:h-125"
                />
              </div>

              

              <div className="absolute -bottom-5 left-5 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl sm:-left-5 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      សាកសមបំផុត​ សម្រាប់និស្សិត
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      Built for better renting
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-gray-100 sm:grid-cols-4 px-4 sm:px-6 lg:px-8">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="px-4 py-7 text-center sm:py-9">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Icon size={19} />
                </div>

                <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs font-semibold text-gray-600">
                  {stat.khmer}
                </p>

                <p className="mt-0.5 text-[10px] text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">

          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-3xl">
              <img
                src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85"
                alt="Students working together"
                className="h-100 w-full object-cover sm:h-120"
              />
            </div>


            <div className="absolute -bottom-6 -right-4 hidden w-52 rounded-2xl bg-white p-5 shadow-xl sm:block">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Users size={19} />
              </div>

              <p className="mt-3 text-sm font-bold text-gray-900">
                បង្កើតសម្រាប់និស្សិត​
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-400">
                Helping students feel at home in Phnom Penh.
              </p>
            </div>
          </div>


          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              គោលបំណងរបស់ពួកយើង
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              ជួយឱ្យនិស្សិតរកកន្លែងរស់នៅបានងាយស្រួល
            </h2>

            <p className="mt-3 text-sm font-medium text-gray-400">
              Making it easier to feel at home in Phnom Penh.
            </p>

            <div className="mt-6 space-y-4">
              <p className="text-sm leading-7 text-gray-500">
                ការផ្លាស់ប្តូរពីខេត្តមួយទៅភ្នំពេញសម្រាប់ការសិក្សានៅសាកលវិទ្យាល័យ
                ឬការងារអាចជារឿងគួរឱ្យរំភើប
                ប៉ុន្តែការស្វែងរកបន្ទប់ល្អក្នុងតម្លៃសមរម្យអាចជាបញ្ហាប្រឈមមួយ។
              </p>

              <p className="text-sm leading-7 text-gray-500">
                RoomKhmer ត្រូវបានបង្កើតឡើងដើម្បីធ្វើឱ្យដំណើរការនោះកាន់តែសាមញ្ញ។
                ជំនួសឱ្យការស្វែងរកតាមរយៈប្រភពផ្សេងៗគ្នាជាច្រើន
                សិស្សអាចស្វែងរកបន្ទប់ ប្រៀបធៀបតម្លៃ ស្វែងយល់ពីទីតាំង
                និងទាក់ទងម្ចាស់ផ្ទះនៅកន្លែងតែមួយ។
              </p>
            </div>


            <div className="mt-7 space-y-3">
              {[
                "បន្ទប់មានតម្លៃសមរម្យសម្រាប់ថវិកាផ្សេងៗគ្នា",
                "ការស្វែងរកបន្ទប់ និងទីតាំងងាយស្រួល",
                "ព័ត៌មានច្បាស់លាស់អំពីបន្ទប់នីមួយៗ",
                "ទាក់ទងផ្ទាល់ជាមួយម្ចាស់ផ្ទះ",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-emerald-500"
                  />

                  <span className="text-sm font-medium text-gray-600">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              ស្វែងរកបន្ទប់បានងាយស្រួលក្នុង ៣ ជំហាន
            </h2>

            <p className="mt-3 text-sm font-medium text-gray-400">
              Find your room in three steps
            </p>
          </div>

          <div className="relative mt-12 grid gap-8 md:grid-cols-3">

            <div className="absolute left-[20%] right-[20%] top-12 hidden h-px bg-gray-200 md:block" />

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative text-center">
                  <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl border-8 border-white bg-blue-600 text-white shadow-lg shadow-blue-100">
                    <Icon size={27} />

                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-[10px] font-bold text-white">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-gray-900">
                    {step.khmer}
                  </h3>



                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-400">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                What We Believe
              </span>

              <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                Built around the people who use it.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                RoomKhmer ត្រូវបានរចនាឡើងដើម្បីធ្វើឱ្យការជួលកាន់តែសាមញ្ញ
                ច្បាស់លាស់ និងមានផាសុកភាពសម្រាប់ទាំងសិស្ស និងម្ចាស់ផ្ទះ។
              </p>

              <Link
                to="/rooms"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Start exploring rooms
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-5 text-base font-bold text-gray-900">
                      {value.khmer}
                    </h3>
                  
                    <p className="mt-3 text-sm leading-6 text-gray-400">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>


      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-center sm:px-10 sm:py-16">

            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/10" />

            <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-white/10" />

            <div className="relative mx-auto max-w-2xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Home size={23} />
              </div>

              <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
                Ready to find your next room?
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                ស្វែងរកបន្ទប់ដែលសមនឹងអ្នកនៅភ្នំពេញ។
              </p>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-blue-100">
                Explore available rooms and find a place where you can study,
                work, and feel at home.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/rooms"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  ស្វែងរកបន្ទប់
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/locations"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  បង្ហាញទីតាំង
                  <MapPin size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


const MessageCircleIcon = (props) => {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.6 9.6 0 0 1-4.1-.9L3 20l1.1-4.2A8.3 8.3 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
    </svg>
  );
};

export default About;
