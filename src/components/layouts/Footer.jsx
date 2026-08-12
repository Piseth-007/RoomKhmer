import {
  ArrowRight,
  Heart,
  Mail,
  MapPin,
  Phone,
  Send,
  House,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-gray-950 text-white">
      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.3fr]">
          {/* =================================================
              BRAND
          ================================================== */}

          <div className="max-w-sm">
            {/* Logo */}

            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <House size={21} strokeWidth={2.2} />
              </div>

              <div className="leading-tight">
                <h2 className="text-lg font-bold tracking-tight">
                  Room<span className="text-blue-400">Khmer</span>
                </h2>

                <p className="text-[10px] text-gray-500">
                  Find your room in Phnom Penh
                </p>
              </div>
            </Link>

            {/* Description */}

            <p className="mt-5 text-sm leading-6 text-gray-400">
              RoomKhmer ជួយនិស្សិត និងអ្នកធ្វើការ
              ស្វែងរកបន្ទប់ជួលដែលមានតម្លៃសមរម្យ និងទីតាំងងាយស្រួលនៅភ្នំពេញ។
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Find affordable and comfortable rooms in Phnom Penh, Cambodia.
            </p>

            {/* Social */}

            <div className="mt-6 flex items-center gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-gray-400 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4.25 w-4.25 fill-current">
                  <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9c0-.7.3-1 1-1Z" />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-gray-400 transition hover:border-pink-500 hover:bg-pink-500 hover:text-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4.25 w-4.25 fill-none stroke-current"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />

                  <circle cx="12" cy="12" r="4" />

                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    className="fill-current stroke-none"
                  />
                </svg>
              </a>

              <a
                href="#"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-800 text-gray-400 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* =================================================
              QUICK LINKS
          ================================================== */}

          <div>
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>

            <p className="mt-1 text-xs text-gray-600">តំណភ្ជាប់រហ័ស</p>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  ទំព័រដើម
                </Link>
              </li>

              <li>
                <Link
                  to="/rooms"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  ស្វែងរកបន្ទប់
                </Link>
              </li>

              <li>
                <Link
                  to="/locations"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  តំបន់
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  អំពីយើង
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  ទំនាក់ទំនង
                </Link>
              </li>
            </ul>
          </div>

          {/* =================================================
              STUDENTS
          ================================================== */}

          <div>
            <h3 className="text-sm font-semibold text-white">For Students</h3>

            <p className="mt-1 text-xs text-gray-600">សម្រាប់និស្សិត</p>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/rooms"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Find a Room
                </Link>
              </li>

              <li>
                <Link
                  to="/favorites"
                  className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
                >
                  <Heart size={14} />
                  My Favorites
                </Link>
              </li>

              <li>
                <Link
                  to="/auth/register"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Create Account
                </Link>
              </li>

              <li>
                <Link
                  to="/auth/login"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/help"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* =================================================
              LANDLORDS
          ================================================== */}

          <div>
            <h3 className="text-sm font-semibold text-white">For Landlords</h3>

            <p className="mt-1 text-xs text-gray-600">សម្រាប់ម្ចាស់ផ្ទះ</p>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/auth/register"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  List Your Room
                </Link>
              </li>

              <li>
                <Link
                  to="/landlord"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Landlord Dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/landlord/rooms"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Manage Rooms
                </Link>
              </li>

              <li>
                <Link
                  to="/landlord/bookings"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Booking Requests
                </Link>
              </li>

              <li>
                <Link
                  to="/help/landlords"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Landlord Help
                </Link>
              </li>
            </ul>
          </div>

          {/* =================================================
              CONTACT
          ================================================== */}

          <div>
            <h3 className="text-sm font-semibold text-white">Get in Touch</h3>

            <p className="mt-1 text-xs text-gray-600">ទំនាក់ទំនង</p>

            <div className="mt-5 space-y-4">
              {/* Location */}

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-blue-400">
                  <MapPin size={16} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-300">Location</p>

                  <p className="mt-0.5 text-sm text-gray-500">
                    Phnom Penh, Cambodia
                  </p>
                </div>
              </div>

              {/* Phone */}

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-blue-400">
                  <Phone size={16} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-300">Phone</p>

                  <a
                    href="tel:+85512345678"
                    className="mt-0.5 block text-sm text-gray-500 transition hover:text-white"
                  >
                    +855 12 345 678
                  </a>
                </div>
              </div>

              {/* Email */}

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-blue-400">
                  <Mail size={16} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-300">Email</p>

                  <a
                    href="mailto:hello@roomkhmer.com"
                    className="mt-0.5 block text-sm text-gray-500 transition hover:text-white"
                  >
                    hello@roomkhmer.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            NEWSLETTER
        ================================================== */}

        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-900/60 p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Get room updates
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                ទទួលព័ត៌មានថ្មីៗអំពីបន្ទប់ជួល និងការផ្តល់ជូនពិសេស។
              </p>
            </div>

            <form className="flex w-full max-w-md gap-2">
              <div className="relative flex-1">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="email"
                  placeholder="Your email address"
                  className="h-11 w-full rounded-xl border border-gray-800 bg-gray-950 pl-9 pr-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Send size={16} />

                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM FOOTER
      ====================================================== */}

      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          {/* Copyright */}

          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} RoomKhmer. All rights reserved.
          </p>

          {/* Links */}

          <div className="flex flex-wrap items-center gap-5">
            <Link
              to="/privacy"
              className="text-xs text-gray-500 transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-gray-500 transition hover:text-white"
            >
              Terms of Service
            </Link>

            <Link
              to="/contact"
              className="text-xs text-gray-500 transition hover:text-white"
            >
              Contact
            </Link>
          </div>

          {/* Made with */}

          <p className="flex items-center gap-1 text-xs text-gray-600">
            Made for students in Cambodia
            <Heart size={12} className="text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
