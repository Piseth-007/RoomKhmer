import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Mail,
  Smartphone,
  Save,
  CheckCircle,
  AlertTriangle,
  Trash2,
} from "lucide-react";

export default function LandlordSettings() {
  const [notifications, setNotifications] = useState({
    bookingRequests: true,
    bookingUpdates: true,
    messages: true,
    promotions: false,
    email: true,
    sms: false,
  });

  const [privacy, setPrivacy] = useState({
    showPhone: true,
    showEmail: false,
  });

  const [language, setLanguage] = useState("khmer");

  const [password, setPassword] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    newPassword: false,
    confirm: false,
  });

  const [saved, setSaved] = useState(false);

  // ============================================================
  // NOTIFICATIONS
  // ============================================================

  const toggleNotification = (name) => {
    setNotifications((current) => ({
      ...current,
      [name]: !current[name],
    }));

    setSaved(false);
  };

  // ============================================================
  // PRIVACY
  // ============================================================

  const togglePrivacy = (name) => {
    setPrivacy((current) => ({
      ...current,
      [name]: !current[name],
    }));

    setSaved(false);
  };

  // ============================================================
  // PASSWORD
  // ============================================================

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPassword((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  };

  // ============================================================
  // SAVE SETTINGS
  // ============================================================

  const handleSave = (e) => {
    e.preventDefault();

    console.log({
      notifications,
      privacy,
      language,
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // ============================================================
  // CHANGE PASSWORD
  // ============================================================

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!password.current) {
      alert("Please enter your current password.");
      return;
    }

    if (!password.newPassword) {
      alert("Please enter a new password.");
      return;
    }

    if (password.newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }

    if (password.newPassword !== password.confirm) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Change password");

    alert("Password changed successfully.");

    setPassword({
      current: "",
      newPassword: "",
      confirm: "",
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">ការកំណត់</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your account, notifications and privacy
        </p>
      </div>

      {/* ======================================================
          SAVE MESSAGE
      ======================================================= */}

      {saved && (
        <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-green-700">
          <CheckCircle size={19} />

          <div>
            <p className="text-sm font-semibold">Settings saved successfully</p>

            <p className="text-xs text-green-600">
              Your preferences have been updated.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          GENERAL SETTINGS
      ======================================================= */}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Settings size={19} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">General Settings</h2>

            <p className="mt-0.5 text-xs text-gray-400">
              Manage basic application preferences
            </p>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {/* Language */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-500">
                <Globe size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">Language</p>

                <p className="mt-0.5 text-xs text-gray-400">
                  Choose your preferred language
                </p>
              </div>
            </div>

            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setSaved(false);
              }}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-blue-500"
            >
              <option value="khmer">Khmer</option>

              <option value="english">English</option>
            </select>
          </div>
        </div>
      </section>

      {/* ======================================================
          NOTIFICATIONS
      ======================================================= */}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
            <Bell size={19} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Notifications</h2>

            <p className="mt-0.5 text-xs text-gray-400">
              Choose what notifications you receive
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <SettingToggle
            icon={<Bell size={18} />}
            title="New Booking Requests"
            description="Get notified when a tenant books your room"
            checked={notifications.bookingRequests}
            onChange={() => toggleNotification("bookingRequests")}
          />

          <SettingToggle
            icon={<CheckCircle size={18} />}
            title="Booking Updates"
            description="Receive updates when a booking status changes"
            checked={notifications.bookingUpdates}
            onChange={() => toggleNotification("bookingUpdates")}
          />

          <SettingToggle
            icon={<Mail size={18} />}
            title="Messages"
            description="Receive notifications for tenant messages"
            checked={notifications.messages}
            onChange={() => toggleNotification("messages")}
          />

          <SettingToggle
            icon={<Mail size={18} />}
            title="Promotions"
            description="Receive RoomKhmer promotions and offers"
            checked={notifications.promotions}
            onChange={() => toggleNotification("promotions")}
          />

          <SettingToggle
            icon={<Mail size={18} />}
            title="Email Notifications"
            description="Receive important notifications by email"
            checked={notifications.email}
            onChange={() => toggleNotification("email")}
          />

          <SettingToggle
            icon={<Smartphone size={18} />}
            title="SMS Notifications"
            description="Receive important notifications by SMS"
            checked={notifications.sms}
            onChange={() => toggleNotification("sms")}
          />
        </div>
      </section>

      {/* ======================================================
          PRIVACY
      ======================================================= */}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Shield size={19} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Privacy</h2>

            <p className="mt-0.5 text-xs text-gray-400">
              Control what information tenants can see
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <SettingToggle
            icon={<Smartphone size={18} />}
            title="Show Phone Number"
            description="Allow tenants to see your phone number"
            checked={privacy.showPhone}
            onChange={() => togglePrivacy("showPhone")}
          />

          <SettingToggle
            icon={<Mail size={18} />}
            title="Show Email Address"
            description="Allow tenants to see your email address"
            checked={privacy.showEmail}
            onChange={() => togglePrivacy("showEmail")}
          />
        </div>
      </section>

      {/* ======================================================
          PASSWORD
      ======================================================= */}

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <Lock size={19} />
          </div>

          <div>
            <h2 className="font-bold text-gray-900">Change Password</h2>

            <p className="mt-0.5 text-xs text-gray-400">
              Keep your account secure with a strong password
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5 p-5 sm:p-6">
          <PasswordField
            label="Current Password"
            name="current"
            value={password.current}
            onChange={handlePasswordChange}
            visible={showPassword.current}
            onToggle={() =>
              setShowPassword((current) => ({
                ...current,
                current: !current.current,
              }))
            }
          />

          <PasswordField
            label="New Password"
            name="newPassword"
            value={password.newPassword}
            onChange={handlePasswordChange}
            visible={showPassword.newPassword}
            onToggle={() =>
              setShowPassword((current) => ({
                ...current,
                newPassword: !current.newPassword,
              }))
            }
          />

          <PasswordField
            label="Confirm New Password"
            name="confirm"
            value={password.confirm}
            onChange={handlePasswordChange}
            visible={showPassword.confirm}
            onToggle={() =>
              setShowPassword((current) => ({
                ...current,
                confirm: !current.confirm,
              }))
            }
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <Lock size={16} />
            Change Password
          </button>
        </form>
      </section>

      {/* ======================================================
          DANGER ZONE
      ======================================================= */}

      <section className="rounded-2xl border border-red-100 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-red-100 p-5 sm:p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <AlertTriangle size={19} />
          </div>

          <div>
            <h2 className="font-bold text-red-600">Danger Zone</h2>

            <p className="mt-0.5 text-xs text-gray-400">
              These actions can permanently affect your account
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Delete Account
            </p>

            <p className="mt-1 max-w-xl text-xs leading-5 text-gray-400">
              Permanently delete your landlord account, rooms, bookings and
              related information. This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const confirmed = window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone.",
              );

              if (confirmed) {
                console.log("Delete landlord account");
              }
            }}
            className="flex w-fit items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </section>

      {/* ======================================================
          SAVE
      ======================================================= */}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <Save size={17} />
          Save Settings
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SETTING TOGGLE
============================================================ */

function SettingToggle({ icon, title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
          {icon}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">{title}</p>

          <p className="mt-1 text-xs leading-5 text-gray-400">{description}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-gray-200"
        }`}
        aria-label={title}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* ============================================================
   PASSWORD FIELD
============================================================ */

function PasswordField({ label, name, value, onChange, visible, onToggle }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <Lock
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Enter password"
          className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-11 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}
