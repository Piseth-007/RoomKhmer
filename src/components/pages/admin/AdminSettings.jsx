import { useState } from "react";
import {
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Percent,
  Users,
  ShieldCheck,
  Bell,
  Lock,
  Wrench,
  Save,
  RotateCcw,
  Check,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("general");

  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    // General
    platformName: "RoomKhmer",
    supportEmail: "support@roomkhmer.com",
    phone: "012 345 678",
    location: "Phnom Penh, Cambodia",
    currency: "USD",

    // Booking
    commission: "5",
    minimumBookingDays: "1",
    maximumBookingDays: "365",
    autoConfirmBookings: false,

    // Users
    allowRegistration: true,
    requireLandlordApproval: true,
    requireEmailVerification: true,

    // Notifications
    emailNotifications: true,
    bookingNotifications: true,
    newUserNotifications: true,
    landlordNotifications: true,

    // Security
    twoFactorRequired: false,
    sessionTimeout: "60",

    // System
    maintenanceMode: false,
    allowNewBookings: true,
  });

  const originalSettings = {
    ...settings,
  };

  // ============================================================
  // UPDATE SETTING
  // ============================================================

  const updateSetting = (name, value) => {
    setSettings((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = () => {
    // Later:
    // Save settings to Firebase / Firestore

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  // ============================================================
  // RESET
  // ============================================================

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset all settings to the current saved values?",
    );

    if (!confirmed) return;

    setSettings(originalSettings);
    setSaved(false);
  };

  const sections = [
    {
      id: "general",
      label: "General",
      description: "Platform information",
      icon: Globe,
    },
    {
      id: "booking",
      label: "Bookings",
      description: "Booking configuration",
      icon: CalendarDays,
    },
    {
      id: "users",
      label: "Users",
      description: "User management",
      icon: Users,
    },
    {
      id: "notifications",
      label: "Notifications",
      description: "Notification preferences",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      description: "Security settings",
      icon: Lock,
    },
    {
      id: "system",
      label: "System",
      description: "System controls",
      icon: Wrench,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div>
        <div className="flex items-center gap-2">
          <Settings size={19} className="text-blue-600" />

          <span className="text-xs font-semibold text-blue-600">
            ADMIN SETTINGS
          </span>
        </div>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">Settings</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your RoomKhmer platform configuration
        </p>
      </div>

      {/* ======================================================
          SAVE BAR
      ======================================================= */}

      {saved && (
        <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100">
            <Check size={15} />
          </div>

          <div>
            <p className="font-semibold">Settings saved successfully</p>

            <p className="text-[10px] text-green-600">
              Your changes have been saved.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          SETTINGS LAYOUT
      ======================================================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        {/* ====================================================
            SIDEBAR
        ===================================================== */}

        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          <div className="mb-2 px-3 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Configuration
            </p>
          </div>

          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;

              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      active ? "bg-blue-100" : "bg-gray-50"
                    }`}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">{section.label}</p>

                    <p
                      className={`mt-0.5 text-[9px] ${
                        active ? "text-blue-400" : "text-gray-400"
                      }`}
                    >
                      {section.description}
                    </p>
                  </div>

                  <ChevronRight
                    size={14}
                    className={active ? "text-blue-400" : "text-gray-300"}
                  />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ====================================================
            CONTENT
        ===================================================== */}

        <main className="min-w-0">
          {/* ==================================================
              GENERAL
          =================================================== */}

          {activeSection === "general" && (
            <SettingsCard
              title="General Settings"
              description="Basic information about your RoomKhmer platform"
              icon={<Globe size={19} />}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <SettingsInput
                  label="Platform Name"
                  name="platformName"
                  value={settings.platformName}
                  onChange={(e) =>
                    updateSetting("platformName", e.target.value)
                  }
                  icon={<Globe size={16} />}
                />

                <SettingsInput
                  label="Support Email"
                  name="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) =>
                    updateSetting("supportEmail", e.target.value)
                  }
                  icon={<Mail size={16} />}
                />

                <SettingsInput
                  label="Support Phone"
                  name="phone"
                  value={settings.phone}
                  onChange={(e) => updateSetting("phone", e.target.value)}
                  icon={<Phone size={16} />}
                />

                <SettingsInput
                  label="Location"
                  name="location"
                  value={settings.location}
                  onChange={(e) => updateSetting("location", e.target.value)}
                  icon={<MapPin size={16} />}
                />

                <SettingsSelect
                  label="Currency"
                  value={settings.currency}
                  onChange={(e) => updateSetting("currency", e.target.value)}
                >
                  <option value="USD">USD - US Dollar</option>

                  <option value="KHR">KHR - Cambodian Riel</option>
                </SettingsSelect>
              </div>
            </SettingsCard>
          )}

          {/* ==================================================
              BOOKING
          =================================================== */}

          {activeSection === "booking" && (
            <SettingsCard
              title="Booking Settings"
              description="Configure how room bookings work"
              icon={<CalendarDays size={19} />}
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <SettingsInput
                  label="Platform Commission (%)"
                  type="number"
                  value={settings.commission}
                  onChange={(e) => updateSetting("commission", e.target.value)}
                  icon={<Percent size={16} />}
                />

                <SettingsInput
                  label="Minimum Booking Days"
                  type="number"
                  value={settings.minimumBookingDays}
                  onChange={(e) =>
                    updateSetting("minimumBookingDays", e.target.value)
                  }
                  icon={<CalendarDays size={16} />}
                />

                <SettingsInput
                  label="Maximum Booking Days"
                  type="number"
                  value={settings.maximumBookingDays}
                  onChange={(e) =>
                    updateSetting("maximumBookingDays", e.target.value)
                  }
                  icon={<CalendarDays size={16} />}
                />
              </div>

              <div className="mt-6 border-t border-gray-100 pt-5">
                <ToggleSetting
                  label="Auto-confirm bookings"
                  description="Automatically confirm bookings when payment is completed."
                  checked={settings.autoConfirmBookings}
                  onChange={(value) =>
                    updateSetting("autoConfirmBookings", value)
                  }
                />
              </div>
            </SettingsCard>
          )}

          {/* ==================================================
              USERS
          =================================================== */}

          {activeSection === "users" && (
            <SettingsCard
              title="User Settings"
              description="Control tenant and landlord account registration"
              icon={<Users size={19} />}
            >
              <div className="space-y-1">
                <ToggleSetting
                  label="Allow user registration"
                  description="Allow new tenants to create accounts."
                  checked={settings.allowRegistration}
                  onChange={(value) =>
                    updateSetting("allowRegistration", value)
                  }
                />

                <ToggleSetting
                  label="Require landlord approval"
                  description="New landlord accounts must be reviewed by an administrator."
                  checked={settings.requireLandlordApproval}
                  onChange={(value) =>
                    updateSetting("requireLandlordApproval", value)
                  }
                />

                <ToggleSetting
                  label="Require email verification"
                  description="Users must verify their email before accessing their account."
                  checked={settings.requireEmailVerification}
                  onChange={(value) =>
                    updateSetting("requireEmailVerification", value)
                  }
                />
              </div>
            </SettingsCard>
          )}

          {/* ==================================================
              NOTIFICATIONS
          =================================================== */}

          {activeSection === "notifications" && (
            <SettingsCard
              title="Notification Settings"
              description="Choose which platform events should send notifications"
              icon={<Bell size={19} />}
            >
              <div className="space-y-1">
                <ToggleSetting
                  label="Email notifications"
                  description="Enable email notifications across the platform."
                  checked={settings.emailNotifications}
                  onChange={(value) =>
                    updateSetting("emailNotifications", value)
                  }
                />

                <ToggleSetting
                  label="Booking notifications"
                  description="Notify administrators when a new booking is created."
                  checked={settings.bookingNotifications}
                  onChange={(value) =>
                    updateSetting("bookingNotifications", value)
                  }
                />

                <ToggleSetting
                  label="New user notifications"
                  description="Notify administrators when a new user registers."
                  checked={settings.newUserNotifications}
                  onChange={(value) =>
                    updateSetting("newUserNotifications", value)
                  }
                />

                <ToggleSetting
                  label="Landlord notifications"
                  description="Notify administrators when landlords submit new rooms."
                  checked={settings.landlordNotifications}
                  onChange={(value) =>
                    updateSetting("landlordNotifications", value)
                  }
                />
              </div>
            </SettingsCard>
          )}

          {/* ==================================================
              SECURITY
          =================================================== */}

          {activeSection === "security" && (
            <SettingsCard
              title="Security Settings"
              description="Configure platform security and authentication"
              icon={<Lock size={19} />}
            >
              <div className="space-y-1">
                <ToggleSetting
                  label="Require two-factor authentication"
                  description="Require administrators to use an additional authentication method."
                  checked={settings.twoFactorRequired}
                  onChange={(value) =>
                    updateSetting("twoFactorRequired", value)
                  }
                />
              </div>

              <div className="mt-6 max-w-md">
                <SettingsSelect
                  label="Session Timeout"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    updateSetting("sessionTimeout", e.target.value)
                  }
                >
                  <option value="30">30 minutes</option>

                  <option value="60">1 hour</option>

                  <option value="120">2 hours</option>

                  <option value="240">4 hours</option>
                </SettingsSelect>
              </div>

              <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck size={19} className="shrink-0 text-blue-600" />

                  <div>
                    <p className="text-xs font-semibold text-blue-800">
                      Security recommendation
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-blue-600">
                      Enable two-factor authentication for administrator
                      accounts to improve account security.
                    </p>
                  </div>
                </div>
              </div>
            </SettingsCard>
          )}

          {/* ==================================================
              SYSTEM
          =================================================== */}

          {activeSection === "system" && (
            <SettingsCard
              title="System Settings"
              description="Control important platform operations"
              icon={<Wrench size={19} />}
            >
              <div className="space-y-1">
                <ToggleSetting
                  label="Allow new bookings"
                  description="When disabled, tenants cannot create new bookings."
                  checked={settings.allowNewBookings}
                  onChange={(value) => updateSetting("allowNewBookings", value)}
                />

                <ToggleSetting
                  label="Maintenance mode"
                  description="Temporarily disable public platform access."
                  checked={settings.maintenanceMode}
                  danger
                  onChange={(value) => updateSetting("maintenanceMode", value)}
                />
              </div>

              {settings.maintenanceMode && (
                <div className="mt-5 flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                  <AlertTriangle size={19} className="shrink-0 text-red-500" />

                  <div>
                    <p className="text-xs font-bold text-red-700">
                      Maintenance mode is enabled
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-red-500">
                      The public RoomKhmer platform should be unavailable while
                      maintenance mode is active.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-700">
                  System Information
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <SystemInfo label="Version" value="1.0.0" />

                  <SystemInfo label="Environment" value="Production" />

                  <SystemInfo label="Database" value="Firestore" />

                  <SystemInfo label="Status" value="Online" />
                </div>
              </div>
            </SettingsCard>
          )}
        </main>
      </div>

      {/* ======================================================
          ACTION BAR
      ======================================================= */}

      <div className="sticky bottom-4 z-20 rounded-2xl border border-gray-100 bg-white/95 p-3 shadow-lg backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="hidden text-xs text-gray-400 sm:block">
            Remember to save your changes.
          </p>

          <div className="flex gap-2 sm:ml-auto">
            <button
              type="button"
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 sm:flex-none"
            >
              <RotateCcw size={15} />
              Reset
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:flex-none"
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS CARD
============================================================ */

function SettingsCard({ title, description, icon, children }) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>

          <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

/* ============================================================
   SETTINGS INPUT
============================================================ */

function SettingsInput({ label, name, type = "text", value, onChange, icon }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>

        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white"
        />
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS SELECT
============================================================ */

function SettingsSelect({ label, value, onChange, children }) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-gray-600">
        {label}
      </label>

      <select
        value={value}
        onChange={onChange}
        className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white"
      >
        {children}
      </select>
    </div>
  );
}

/* ============================================================
   TOGGLE
============================================================ */

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
  danger = false,
}) {
  return (
    <div className="flex items-center justify-between gap-5 border-b border-gray-100 py-5 last:border-0">
      <div className="min-w-0">
        <p
          className={`text-sm font-semibold ${
            danger ? "text-red-600" : "text-gray-700"
          }`}
        >
          {label}
        </p>

        <p className="mt-1 max-w-2xl text-[10px] leading-5 text-gray-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? (danger ? "bg-red-500" : "bg-blue-600") : "bg-gray-200"
        }`}
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
   SYSTEM INFO
============================================================ */

function SystemInfo({ label, value }) {
  return (
    <div>
      <p className="text-[9px] text-gray-400">{label}</p>

      <p className="mt-1 text-xs font-semibold text-gray-700">{value}</p>
    </div>
  );
}
