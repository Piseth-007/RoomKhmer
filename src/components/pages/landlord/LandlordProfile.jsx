import { useRef, useState } from "react";
import {
  User,
  Camera,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  House,
  CalendarCheck,
  Wallet,
  Save,
  CheckCircle,
} from "lucide-react";

export default function LandlordProfile() {
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "Leang Piseth",
    email: "piseth@example.com",
    phone: "012 345 678",
    gender: "Male",
    dateOfBirth: "2005-08-15",
    address: "Toul Kork, Phnom Penh",
    bio: "I provide clean, comfortable and affordable rooms for students and young professionals in Phnom Penh.",
  });

  const [profileImage, setProfileImage] = useState(null);

  const [isSaving, setIsSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  // ============================================================
  // HANDLE INPUT
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  };

  // ============================================================
  // PROFILE IMAGE
  // ============================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    setProfileImage(preview);
    setSaved(false);
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSaving(true);
    setSaved(false);

    // Temporary
    // Later replace with Firebase updateDoc()

    console.log("Updated landlord profile:", profile);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">ប្រវត្តិរូប</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your landlord profile and personal information
        </p>
      </div>

      {/* ======================================================
          PROFILE HEADER
      ======================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Cover */}

        <div className="h-32 bg-linear-to-r from-blue-600 to-blue-400 sm:h-40" />

        <div className="px-5 pb-5 sm:px-6">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            {/* Profile Image */}

            <div className="relative w-fit">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-100 text-blue-600 shadow-md sm:h-28 sm:w-28">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={45} />
                )}
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm transition hover:bg-blue-700"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Name */}

            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.name}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                  <CheckCircle size={12} />
                  Verified
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-400">Landlord · RoomKhmer</p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          ACCOUNT STATUS
      ======================================================= */}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ProfileStat
          icon={<House size={20} />}
          value="12"
          label="Total Rooms"
          className="bg-blue-50 text-blue-600"
        />

        <ProfileStat
          icon={<CalendarCheck size={20} />}
          value="28"
          label="Bookings"
          className="bg-green-50 text-green-600"
        />

        <ProfileStat
          icon={<Wallet size={20} />}
          value="$8.4K"
          label="Total Earnings"
          className="bg-purple-50 text-purple-600"
        />

        <ProfileStat
          icon={<ShieldCheck size={20} />}
          value="Verified"
          label="Account Status"
          className="bg-yellow-50 text-yellow-600"
        />
      </div>

      {/* ======================================================
          PROFILE FORM
      ======================================================= */}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <User size={19} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Personal Information</h2>

            <p className="mt-0.5 text-xs text-gray-400">
              Update your personal information
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Name */}

          <FormField label="Full Name">
            <div className="relative">
              <User
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className={inputClass("pl-9")}
              />
            </div>
          </FormField>

          {/* Email */}

          <FormField label="Email Address">
            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className={inputClass("pl-9")}
              />
            </div>
          </FormField>

          {/* Phone */}

          <FormField label="Phone Number">
            <div className="relative">
              <Phone
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className={inputClass("pl-9")}
              />
            </div>
          </FormField>

          {/* Gender */}

          <FormField label="Gender">
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className={inputClass()}
            >
              <option value="">Select gender</option>

              <option value="Male">Male</option>

              <option value="Female">Female</option>

              <option value="Other">Other</option>
            </select>
          </FormField>

          {/* Date of Birth */}

          <FormField label="Date of Birth">
            <div className="relative">
              <CalendarDays
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleChange}
                className={inputClass("pl-9")}
              />
            </div>
          </FormField>

          {/* Address */}

          <FormField label="Address">
            <div className="relative">
              <MapPin
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleChange}
                className={inputClass("pl-9")}
              />
            </div>
          </FormField>

          {/* Bio */}

          <FormField label="About Me" className="md:col-span-2">
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows={5}
              placeholder="Tell tenants about yourself..."
              className={`${inputClass()} resize-none`}
            />
          </FormField>
        </div>

        {/* ====================================================
            SAVE
        ===================================================== */}

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
          {saved && (
            <span className="flex items-center justify-center gap-1.5 text-sm font-medium text-green-600">
              <CheckCircle size={16} />
              Changes saved
            </span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* ======================================================
          VERIFICATION
      ======================================================= */}

      <div className="rounded-2xl border border-green-100 bg-green-50 p-5 sm:p-6">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h2 className="font-bold text-green-800">
              Your account is verified
            </h2>

            <p className="mt-1 text-xs leading-5 text-green-600">
              Your landlord account has been verified. Verified landlords can
              publish rooms and receive booking requests from tenants.
            </p>

            <button
              type="button"
              className="mt-3 text-xs font-semibold text-green-700 underline underline-offset-2"
            >
              View verification details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FORM FIELD
============================================================ */

function FormField({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      {children}
    </div>
  );
}

/* ============================================================
   PROFILE STAT
============================================================ */

function ProfileStat({ icon, value, label, className }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${className}`}
      >
        {icon}
      </div>

      <p className="mt-4 text-lg font-bold text-gray-900">{value}</p>

      <p className="mt-1 text-[11px] text-gray-400">{label}</p>
    </div>
  );
}

/* ============================================================
   INPUT CLASS
============================================================ */

function inputClass(extra = "") {
  return `h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 ${extra}`;
}
