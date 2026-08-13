import {
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  CalendarDays,
  Bell,
  Lock,
  LogOut,
  Pencil,
} from "lucide-react";

export default function Profile() {
  const user = {
    name: "Leang Piseth",
    email: "leangpiseth@gmail.com",
    phone: "+855 12 345 678",
    location: "Phnom Penh, Cambodia",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

          <p className="text-gray-500 mt-2">
            Manage your account and rental activities
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div
                className="w-24 h-24 rounded-full bg-blue-100
                              flex items-center justify-center
                              text-blue-600"
              >
                <User size={42} />
              </div>

              {/* User */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h2>

                <p className="text-gray-500">{user.email}</p>

                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                  <MapPin size={16} />
                  {user.location}
                </div>
              </div>
            </div>

            {/* Edit */}
            <button
              className="flex items-center justify-center gap-2
                         px-5 py-3 rounded-xl
                         bg-blue-600 text-white
                         hover:bg-blue-700 transition"
            >
              <Pencil size={18} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
          <div
            className="bg-white border border-gray-100
                          rounded-2xl p-6 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl bg-blue-100
                            flex items-center justify-center
                            text-blue-600"
            >
              <CalendarDays />
            </div>

            <div>
              <p className="text-gray-500 text-sm">My Bookings</p>

              <h3 className="text-2xl font-bold">3</h3>
            </div>
          </div>

          <div
            className="bg-white border border-gray-100
                          rounded-2xl p-6 flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-xl bg-red-100
                            flex items-center justify-center
                            text-red-500"
            >
              <Heart />
            </div>

            <div>
              <p className="text-gray-500 text-sm">Favorite Rooms</p>

              <h3 className="text-2xl font-bold">8</h3>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div
          className="bg-white border border-gray-100
                        rounded-2xl p-6 mt-6"
        >
          <h2 className="text-xl font-bold mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              icon={<User size={20} />}
              label="Full Name"
              value={user.name}
            />

            <InfoItem
              icon={<Mail size={20} />}
              label="Email"
              value={user.email}
            />

            <InfoItem
              icon={<Phone size={20} />}
              label="Phone"
              value={user.phone}
            />

            <InfoItem
              icon={<MapPin size={20} />}
              label="Location"
              value={user.location}
            />
          </div>
        </div>

        {/* Account Settings */}
        <div
          className="bg-white border border-gray-100
                        rounded-2xl p-6 mt-6"
        >
          <h2 className="text-xl font-bold mb-4">Account Settings</h2>

          <div className="divide-y">
            <SettingItem
              icon={<Bell />}
              title="Notifications"
              description="Manage your notification preferences"
            />

            <SettingItem
              icon={<Lock />}
              title="Change Password"
              description="Update your account password"
            />

            <button
              className="w-full flex items-center gap-4
                         py-5 text-left text-red-500
                         hover:bg-red-50 rounded-xl px-3 transition"
            >
              <LogOut size={21} />

              <div>
                <p className="font-semibold">Logout</p>

                <p className="text-sm text-gray-500">
                  Sign out of your account
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="w-11 h-11 rounded-xl bg-gray-100
                      flex items-center justify-center
                      text-gray-600"
      >
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{label}</p>

        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function SettingItem({ icon, title, description }) {
  return (
    <button
      className="w-full flex items-center gap-4
                 py-5 text-left
                 hover:bg-gray-50 rounded-xl px-3 transition"
    >
      <div className="text-gray-600">{icon}</div>

      <div>
        <p className="font-semibold text-gray-900">{title}</p>

        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  );
}
