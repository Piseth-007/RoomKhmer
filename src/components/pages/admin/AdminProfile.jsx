import { useEffect, useState } from "react";
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
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "../../../firebase/config";

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "Administrator",
    status: "Active",
    joined: "",
    photoURL: "",
    lastLogin: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "Administrator",
    status: "Active",
    joined: "",
    photoURL: "",
    lastLogin: "",
  });

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setError("No authenticated user found.");
        setLoading(false);
        return;
      }

      setUser(currentUser);
      await loadProfile(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const loadProfile = async (currentUser) => {
    try {
      setLoading(true);
      setError("");

      const userRef = doc(db, "users", currentUser.uid);

      const snapshot = await getDoc(userRef);

      const data = snapshot.exists() ? snapshot.data() : {};

      const role = String(data.role || "").toLowerCase();

      const profileData = {
        name: data.name || currentUser.displayName || "Admin",

        email: data.email || currentUser.email || "",

        phone: data.phone || "",

        location: data.location || "Phnom Penh, Cambodia",

        role: role === "admin" ? "Administrator" : data.role || "Administrator",

        status: data.status || "Active",

        joined:
          formatDate(data.createdAt) ||
          formatDate(currentUser.metadata?.creationTime),

        photoURL: data.photoURL || currentUser.photoURL || "",

        lastLogin:
          formatDateTime(data.lastLoginAt) ||
          formatDateTime(currentUser.metadata?.lastSignInTime),
      };

      setProfile(profileData);
      setForm(profileData);

      if (!snapshot.exists()) {
        await setDoc(
          userRef,
          {
            name: profileData.name,
            email: profileData.email,
            phone: profileData.phone,
            location: profileData.location,
            role: "admin",
            status: "Active",
            photoURL: profileData.photoURL,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          },
          {
            merge: true,
          },
        );
      } else {
        await updateDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Load admin profile error:", err);

      setError(getFirebaseError(err, "Failed to load profile."));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setForm(profile);
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setForm(profile);
    setMessage("");
    setError("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user) {
      setError("No authenticated user found.");
      return;
    }

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        updatedAt: serverTimestamp(),
      });

      if (user.displayName !== form.name.trim()) {
        await updateProfile(user, {
          displayName: form.name.trim(),
        });
      }

      const updatedProfile = {
        ...profile,
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
      };

      setProfile(updatedProfile);
      setForm(updatedProfile);
      setIsEditing(false);

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Save admin profile error:", err);

      setError(getFirebaseError(err, "Failed to save profile."));
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !user) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName) {
        throw new Error("Cloudinary cloud name is missing.");
      }

      if (!uploadPreset) {
        throw new Error("Cloudinary upload preset is missing.");
      }

      const uploadData = new FormData();

      uploadData.append("file", file);

      uploadData.append("upload_preset", uploadPreset);

      uploadData.append("folder", "roomkhmer/admin-profiles");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: uploadData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || "Cloudinary upload failed.");
      }

      const photoURL = result.secure_url;

      await updateDoc(doc(db, "users", user.uid), {
        photoURL,
        updatedAt: serverTimestamp(),
      });

      await updateProfile(user, {
        photoURL,
      });

      setProfile((current) => ({
        ...current,
        photoURL,
      }));

      setForm((current) => ({
        ...current,
        photoURL,
      }));

      setMessage("Profile photo updated successfully.");
    } catch (err) {
      console.error("Cloudinary profile upload error:", err);

      setError(err.message || "Failed to upload profile photo.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

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

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("No authenticated user found.");
      return;
    }

    if (!passwords.current || !passwords.newPassword || !passwords.confirm) {
      setError("Please fill in all password fields.");
      return;
    }

    if (passwords.newPassword !== passwords.confirm) {
      setError("New passwords do not match.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("New password must contain at least 6 characters.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (!user.email) {
        throw new Error("This account does not have an email address.");
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        passwords.current,
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, passwords.newPassword);

      setPasswords({
        current: "",
        newPassword: "",
        confirm: "",
      });

      setShowPasswordForm(false);

      setMessage("Password updated successfully.");
    } catch (err) {
      console.error("Change password error:", err);

      if (err.code === "auth/wrong-password") {
        setError("Current password is incorrect.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Current password is incorrect.");
      } else if (err.code === "auth/requires-recent-login") {
        setError("Please log in again before changing your password.");
      } else {
        setError(getFirebaseError(err, "Failed to update password."));
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 size={34} className="mx-auto animate-spin text-blue-600" />

          <p className="mt-4 text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {message && (
        <div className="flex items-center gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-700">
          <Check size={18} />
          {message}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="h-28 bg-linear-to-r from-blue-600 via-blue-500 to-indigo-500 sm:h-36" />

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-blue-50 text-blue-600 shadow-md sm:h-28 sm:w-28">
                {profile.photoURL ? (
                  <img
                    src={profile.photoURL}
                    alt="Admin profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ShieldCheck size={48} strokeWidth={1.7} />
                )}
              </div>

              <label className="absolute bottom-1 right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-sm transition hover:bg-blue-700">
                {uploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1 sm:ml-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.name}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[9px] font-semibold text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {profile.status}
                </span>
              </div>

              <p className="mt-1 text-xs text-gray-500">{profile.role}</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-gray-100 pt-5 sm:grid-cols-3">
            <QuickInfo
              icon={<Mail size={15} />}
              label="Email"
              value={profile.email}
            />

            <QuickInfo
              icon={<Phone size={15} />}
              label="Phone"
              value={profile.phone || "Not provided"}
            />

            <QuickInfo
              icon={<MapPin size={15} />}
              label="Location"
              value={profile.location || "Not provided"}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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

              <div>
                <label className="mb-2 block text-xs font-semibold text-gray-600">
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="h-11 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 pl-10 pr-4 text-sm text-gray-500 outline-none"
                  />
                </div>

                <p className="mt-1.5 text-[10px] text-gray-400">
                  Email is managed by Firebase Authentication.
                </p>
              </div>

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
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  <X size={15} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Save size={15} />
                  )}

                  {saving ? "Saving..." : "Save Changes"}
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
                value={profile.phone || "Not provided"}
                icon={<Phone size={16} />}
              />

              <InfoItem
                label="Location"
                value={profile.location || "Not provided"}
                icon={<MapPin size={16} />}
              />

              <InfoItem
                label="Role"
                value={profile.role}
                icon={<ShieldCheck size={16} />}
              />

              <InfoItem
                label="Joined Date"
                value={profile.joined || "Not available"}
                icon={<CalendarDays size={16} />}
              />
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">Account Status</h2>

          <p className="mt-1 text-xs text-gray-400">
            Administrator account information
          </p>

          <div className="mt-6 space-y-4">
            <AccountRow
              label="Account"
              value={profile.status}
              icon={<Check size={15} />}
              className="bg-green-50 text-green-600"
            />

            <AccountRow
              label="Role"
              value={profile.role}
              icon={<ShieldCheck size={15} />}
              className="bg-blue-50 text-blue-600"
            />

            <AccountRow
              label="Joined"
              value={profile.joined || "Not available"}
              icon={<CalendarDays size={15} />}
              className="bg-purple-50 text-purple-600"
            />

            <AccountRow
              label="Last Login"
              value={profile.lastLogin || "Not available"}
              icon={<Clock size={15} />}
              className="bg-yellow-50 text-yellow-600"
            />
          </div>
        </section>
      </div>

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
              onClick={() => {
                setError("");
                setMessage("");
                setShowPasswordForm(true);
              }}
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
                disabled={saving}
                onClick={() => {
                  setShowPasswordForm(false);

                  setPasswords({
                    current: "",
                    newPassword: "",
                    confirm: "",
                  });

                  setError("");
                }}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Lock size={15} />
                )}

                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 md:grid-cols-3">
            <SecurityCard
              icon={<Lock size={18} />}
              title="Password"
              description="Firebase Authentication"
              status="Protected"
            />

            <SecurityCard
              icon={<ShieldCheck size={18} />}
              title="Account"
              description="Administrator account"
              status="Verified"
            />

            <SecurityCard
              icon={<Clock size={18} />}
              title="Login Activity"
              description={profile.lastLogin || "No login data"}
              status="Secure"
            />
          </div>
        )}
      </section>
    </div>
  );
}

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

function ProfileInput({ label, name, value, onChange, icon }) {
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
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:bg-white"
        />
      </div>
    </div>
  );
}

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

function formatDate(value) {
  if (!value) {
    return "";
  }

  let date;

  if (typeof value.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  let date;

  if (typeof value.toDate === "function") {
    date = value.toDate();
  } else if (value instanceof Date) {
    date = value;
  } else {
    date = new Date(value);
  }

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getFirebaseError(error, fallback) {
  if (error?.code === "permission-denied") {
    return "You do not have permission to access this profile.";
  }

  if (error?.code === "auth/requires-recent-login") {
    return "Please log in again before performing this action.";
  }

  if (error?.code === "auth/invalid-credential") {
    return "The current password is incorrect.";
  }

  if (error?.code === "auth/weak-password") {
    return "The new password is too weak.";
  }

  return error?.message || fallback;
}
