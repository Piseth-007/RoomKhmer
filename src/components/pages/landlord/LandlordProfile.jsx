import { useEffect, useRef, useState } from "react";

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
  AlertCircle,
} from "lucide-react";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { onAuthStateChanged, updateProfile } from "firebase/auth";

import { auth, db } from "../../../firebase/config";

const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration is missing.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "Cloudinary upload failed.");
  }

  if (!data.secure_url) {
    throw new Error("Cloudinary did not return an image URL.");
  }

  return data.secure_url;
};

export default function LandlordProfile() {
  const fileInputRef = useRef(null);

  const previewUrlRef = useRef(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [saved, setSaved] = useState(false);

  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    rooms: 0,
    bookings: 0,
    earnings: 0,
  });

  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    let unsubscribe;

    const loadProfile = async (user) => {
      try {
        setLoading(true);
        setError("");

        if (!user) {
          setError("Please login first.");
          return;
        }

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        let firestoreData = {};

        if (userSnap.exists()) {
          firestoreData = userSnap.data();
        }

        const role = firestoreData.role || "";

        setUserRole(role);

        setProfile({
          name: firestoreData.name || user.displayName || "",

          email: firestoreData.email || user.email || "",

          phone: firestoreData.phone || "",

          gender: firestoreData.gender || "",

          dateOfBirth: firestoreData.dateOfBirth || "",

          address: firestoreData.address || "",

          bio: firestoreData.bio || "",
        });

        const savedPhoto = firestoreData.photoURL || user.photoURL || "";

        setProfileImage(savedPhoto);

        await loadStatistics(user.uid);
      } catch (err) {
        console.error("Load profile error:", err);

        setError(getFirebaseError(err, "Failed to load profile."));
      } finally {
        setLoading(false);
      }
    };

    unsubscribe = onAuthStateChanged(auth, (user) => {
      loadProfile(user);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const loadStatistics = async (uid) => {
    try {
      const roomsQuery = query(
        collection(db, "rooms"),
        where("landlordId", "==", uid),
      );

      const bookingsQuery = query(
        collection(db, "bookings"),
        where("landlordId", "==", uid),
      );

      const paymentsQuery = query(
        collection(db, "payments"),
        where("landlordId", "==", uid),
      );

      const [roomsSnapshot, bookingsSnapshot, paymentsSnapshot] =
        await Promise.all([
          getDocs(roomsQuery),
          getDocs(bookingsQuery),
          getDocs(paymentsQuery),
        ]);

      const earnings = paymentsSnapshot.docs
        .map((item) => item.data())
        .filter((payment) => payment.status === "paid")
        .reduce((total, payment) => total + Number(payment.amount || 0), 0);

      setStats({
        rooms: roomsSnapshot.size,

        bookings: bookingsSnapshot.size,

        earnings,
      });
    } catch (err) {
      console.error("Load statistics error:", err);

      setStats({
        rooms: 0,
        bookings: 0,
        earnings: 0,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");

      e.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5MB.");

      e.target.value = "";

      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const preview = URL.createObjectURL(file);

    previewUrlRef.current = preview;

    setSelectedImage(file);

    setProfileImage(preview);

    setSaved(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setSaved(false);
      setError("");

      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please login first.");
      }

      const userRef = doc(db, "users", user.uid);

      const existingSnap = await getDoc(userRef);

      const existingData = existingSnap.exists() ? existingSnap.data() : {};

      const existingRole = existingData.role || userRole || "";

      let photoURL = existingData.photoURL || user.photoURL || "";

      if (selectedImage) {
        photoURL = await uploadToCloudinary(selectedImage);
      }

      await updateProfile(user, {
        displayName: profile.name.trim(),

        photoURL,
      });

      const profileData = {
        uid: user.uid,

        name: profile.name.trim(),

        email: user.email || profile.email || "",

        phone: profile.phone.trim(),

        gender: profile.gender,

        dateOfBirth: profile.dateOfBirth,

        address: profile.address.trim(),

        bio: profile.bio.trim(),

        photoURL,

        updatedAt: serverTimestamp(),
      };

      if (existingRole) {
        profileData.role = existingRole;
      }

      if (!existingSnap.exists()) {
        profileData.createdAt = serverTimestamp();
      }

      await setDoc(userRef, profileData, {
        merge: true,
      });

      setProfileImage(photoURL);

      setSelectedImage(null);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);

        previewUrlRef.current = null;
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setSaved(true);

      setError("");

      setProfile((current) => ({
        ...current,
        name: profile.name.trim(),
      }));

      await loadStatistics(user.uid);
    } catch (err) {
      console.error("Save profile error:", err);

      setError(getFirebaseError(err, "Failed to save profile."));
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

          <p className="mt-4 text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ប្រវត្តិរូប</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your landlord profile and personal information
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-500" />

          <div>
            <p className="text-sm font-semibold text-red-700">Error</p>

            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="h-32 bg-linear-to-r from-blue-600 to-blue-400 sm:h-40" />

        <div className="px-5 pb-5 sm:px-6">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
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
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {profile.name || "Landlord"}
                </h2>

                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-600">
                  <CheckCircle size={12} />
                  Verified
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-400">
                {userRole === "owner" ? "Owner" : "Landlord"} · RoomKhmer
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ProfileStat
          icon={<House size={20} />}
          value={stats.rooms}
          label="Total Rooms"
          className="bg-blue-50 text-blue-600"
        />

        <ProfileStat
          icon={<CalendarCheck size={20} />}
          value={stats.bookings}
          label="Bookings"
          className="bg-green-50 text-green-600"
        />

        <ProfileStat
          icon={<Wallet size={20} />}
          value={`$${stats.earnings.toLocaleString()}`}
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
                required
              />
            </div>
          </FormField>

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
                className={inputClass("bg-gray-50 pl-9")}
                readOnly
              />
            </div>
          </FormField>

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
          </div>
        </div>
      </div>
    </div>
  );
}

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

function inputClass(extra = "") {
  return `h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 ${extra}`;
}

function getFirebaseError(error, fallback) {
  if (!error) {
    return fallback;
  }

  if (error.code === "permission-denied") {
    return "You do not have permission to update this profile.";
  }

  if (error.code === "auth/requires-recent-login") {
    return "Please login again before updating your profile photo.";
  }

  if (error.code === "auth/network-request-failed") {
    return "Network error. Please check your internet connection.";
  }

  return error.message || fallback;
}
