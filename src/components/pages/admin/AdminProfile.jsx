import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Lock,
  Camera,
  Edit3,
  Check,
  X,
  MapPin,
  CalendarDays,
  Clock,
  KeyRound,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [profile, setProfile] = useState({
    name: "RoomKhmer Admin",
    email: "admin@roomkhmer.com",
    phone: "012 345 678",
    location: "Phnom Penh, Cambodia",
    role: "Administrator",
    status: "Active",
    joined: "January 15, 2026",
  });

  const [form, setForm] = useState(profile);

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  });

  // ============================================================
  // EDIT PROFILE
  // ============================================================

  const handleEdit = () => {
    setForm(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(form);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ============================================================
  // PASSWORD
  // ============================================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswords((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const togglePassword = (field) => {
    setShowPasswords((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!passwords.current || !passwords.newPassword || !passwords.confirm) {
      alert("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      alert("New passwords do not match.");
      return;
    }

    alert("Password updated successfully.");

    setPasswords({
      current: "",
      newPassword: "",
      confirm: "",
    });

    setShowPasswordForm(false);
  };

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <User size={19} className="text-blue-600" />

            <span className="text-xs font-semibold text-blue-600">
              ADMIN ACCOUNT
            </span>
          </div>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">Profile</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your administrator account
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Edit3 size={15} />
            Edit Profile
          </button>
        )}
      </div>

      {/* ======================================================
          PROFILE OVERVIEW
      ======================================================= */}

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Cover */}

        <div className="h-28 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500 sm:h-36" />

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            {/* Avatar */}

            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-50 text-blue-600 shadow-md sm:h-28 sm:w-28">
                <ShieldCheck size={48} strokeWidth={1.7} />
              </div>

              <button
                type="button"
                className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm transition hover:bg-blue-700"
                title="Change profile photo"
              >
                <Camera size={14} />
              </button>
            </div>

            {/* Account name */}

            <div className="flex-1 sm:ml-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.name}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-semibold text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-500">{profile.role}</p>
            </div>
          </div>

          {/* Quick info */}

          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
            <QuickInfo
              icon={<Mail size={15} />}
              label="Email"
              value={profile.email}
            />

            <QuickInfo
              icon={<Phone size={15} />}
              label="Phone"
              value={profile.phone}
            />

            <QuickInfo
              icon={<MapPin size={15} />}
              label="Location"
              value={profile.location}
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          PROFILE INFORMATION + ACCOUNT
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ====================================================
            PERSONAL INFORMATION
        ===================================================== */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Personal Information
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Your administrator account details
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={handleEdit}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-50 hover:text-blue-600"
              >
                <Edit3 size={16} />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="mt-6 space-y-5">
              <ProfileInput
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                icon={<User size={16} />}
              />

              <ProfileInput
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                icon={<Mail size={16} />}
              />

              <ProfileInput
                label="Phone Number"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                icon={<Phone size={16} />}
              />

              <ProfileInput
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                icon={<MapPin size={16} />}
              />

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  <X size={15} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  <Save size={15} />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <InfoItem
                label="Full Name"
                value={profile.name}
                icon={<User size={16} />}
              />

              <InfoItem
                label="Email Address"
                value={profile.email}
                icon={<Mail size={16} />}
              />

              <InfoItem
                label="Phone Number"
                value={profile.phone}
                icon={<Phone size={16} />}
              />

              <InfoItem
                label="Location"
                value={profile.location}
                icon={<MapPin size={16} />}
              />

              <InfoItem
                label="Role"
                value={profile.role}
                icon={<ShieldCheck size={16} />}
              />

              <InfoItem
                label="Joined Date"
                value={profile.joined}
                icon={<CalendarDays size={16} />}
              />
            </div>
          )}
        </section>

        {/* ====================================================
            ACCOUNT STATUS
        ===================================================== */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Account Status</h2>

          <p className="mt-1 text-xs text-gray-400">
            Administrator account information
          </p>

          <div className="mt-6 space-y-4">
            <AccountRow
              label="Account"
              value="Active"
              icon={<Check size={15} />}
              className="bg-green-50 text-green-600"
            />

            <AccountRow
              label="Role"
              value="Administrator"
              icon={<ShieldCheck size={15} />}
              className="bg-blue-50 text-blue-600"
            />

            <AccountRow
              label="Joined"
              value="Jan 15, 2026"
              icon={<CalendarDays size={15} />}
              className="bg-purple-50 text-purple-600"
            />

            <AccountRow
              label="Last Login"
              value="Today, 10:42 AM"
              icon={<Clock size={15} />}
              className="bg-yellow-50 text-yellow-600"
            />
          </div>
        </section>
      </div>

      {/* ======================================================
          SECURITY
      ======================================================= */}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Lock size={20} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">Security</h2>

              <p className="mt-1 text-xs text-gray-400">
                Protect your administrator account
              </p>
            </div>
          </div>

          {!showPasswordForm && (
            <button
              type="button"
              onClick={() => setShowPasswordForm(true)}
              className="flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <KeyRound size={15} />
              Change Password
            </button>
          )}
        </div>

        {showPasswordForm ? (
          <form
            onSubmit={handleChangePassword}
            className="mt-6 max-w-xl space-y-5 border-t border-gray-100 pt-6"
          >
            <PasswordInput
              label="Current Password"
              name="current"
              value={passwords.current}
              visible={showPasswords.current}
              onChange={handlePasswordChange}
              onToggle={() => togglePassword("current")}
            />

            <PasswordInput
              label="New Password"
              name="newPassword"
              value={passwords.newPassword}
              visible={showPasswords.newPassword}
              onChange={handlePasswordChange}
              onToggle={() => togglePassword("newPassword")}
            />

            <PasswordInput
              label="Confirm New Password"
              name="confirm"
              value={passwords.confirm}
              visible={showPasswords.confirm}
              onChange={handlePasswordChange}
              onToggle={() => togglePassword("confirm")}
            />

            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Lock size={15} />
                Update Password
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 md:grid-cols-3">
            <SecurityCard
              icon={<Lock size={18} />}
              title="Password"
              description="Last changed 30 days ago"
              status="Protected"
            />

            <SecurityCard
              icon={<ShieldCheck size={18} />}
              title="Two-Factor Authentication"
              description="Additional account protection"
              status="Enabled"
            />

            <SecurityCard
              icon={<Clock size={18} />}
              title="Login Activity"
              description="Last login today at 10:42 AM"
              status="Secure"
            />
          </div>
        )}
      </section>

      {/* ======================================================
          RECENT LOGIN
      ======================================================= */}

      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Login</h2>

            <p className="mt-1 text-xs text-gray-400">
              Recent administrator login activity
            </p>
          </div>

          <Clock size={20} className="text-gray-400" />
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-gray-100">
          <div className="grid grid-cols-1 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
            <LoginInfo label="Device" value="Windows PC" />

            <LoginInfo label="Browser" value="Chrome" />

            <LoginInfo label="Login Time" value="Today, 10:42 AM" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ============================================================
   QUICK INFO
============================================================ */

function QuickInfo({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[9px] text-gray-400">{label}</p>

        <p className="mt-0.5 truncate text-xs font-medium text-gray-700">
          {value}
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   PROFILE INPUT
============================================================ */

function ProfileInput({ label, name, type = "text", value, onChange, icon }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white"
        />
      </div>
    </div>
  );
}

/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({ label, value, icon }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-gray-400">{label}</p>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>

        <span className="text-sm font-medium text-gray-700">{value}</span>
      </div>
    </div>
  );
}

/* ============================================================
   ACCOUNT ROW
============================================================ */

function AccountRow({ label, value, icon, className }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-gray-500">{label}</span>

      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${className}`}
        >
          {icon}
        </span>

        <span className="text-xs font-semibold text-gray-700">{value}</span>
      </div>
    </div>
  );
}

/* ============================================================
   PASSWORD INPUT
============================================================ */

function PasswordInput({ label, name, value, visible, onChange, onToggle }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <div className="relative">
        <KeyRound
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-10 pr-11 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SECURITY CARD
============================================================ */

function SecurityCard({ icon, title, description, status }) {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold text-gray-700">{title}</p>

          <p className="mt-1 text-[10px] leading-4 text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] font-semibold text-green-600">
        <Check size={12} />

        {status}
      </div>
    </div>
  );
}

/* ============================================================
   LOGIN INFO
============================================================ */

function LoginInfo({ label, value }) {
  return (
    <div className="p-4">
      <p className="text-[10px] text-gray-400">{label}</p>

      <p className="mt-1 text-xs font-semibold text-gray-700">{value}</p>
    </div>
  );
}
