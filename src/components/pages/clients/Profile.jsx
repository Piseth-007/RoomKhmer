import { useEffect, useState } from "react";
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
  X,
  Save,
  Loader2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";

import { useNavigate } from "react-router-dom";

import { auth, db } from "../../../firebase/config";

const FAVORITES_KEY = "roomkhmer_favorites";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    role: "",
    photoURL: "",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [bookingCount, setBookingCount] = useState(0);

  const [favoriteCount, setFavoriteCount] = useState(0);

  const [editOpen, setEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    location: "",
  });


  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        if (mounted) {
          setLoading(false);
          navigate("/login", {
            replace: true,
          });
        }

        return;
      }

      try {
        setLoading(true);
        setError("");


        const userRef = doc(db, "users", firebaseUser.uid);

        const userSnapshot = await getDoc(userRef);

        const firestoreUser = userSnapshot.exists() ? userSnapshot.data() : {};


        const profileData = {
          name: firestoreUser.name || firebaseUser.displayName || "User",

          email: firestoreUser.email || firebaseUser.email || "",

          phone: firestoreUser.phone || "",

          location: firestoreUser.location || "",

          role: firestoreUser.role || "",

          photoURL: firestoreUser.photoURL || firebaseUser.photoURL || "",
        };

        if (mounted) {
          setUser(profileData);

          setEditForm({
            name: profileData.name,
            phone: profileData.phone,
            location: profileData.location,
          });
        }


        try {
          const savedFavorites = JSON.parse(
            localStorage.getItem(FAVORITES_KEY) || "[]",
          );

          if (mounted) {
            setFavoriteCount(
              Array.isArray(savedFavorites) ? savedFavorites.length : 0,
            );
          }
        } catch {
          if (mounted) {
            setFavoriteCount(0);
          }
        }


        const bookingsQuery = query(
          collection(db, "bookings"),
          where("tenantId", "==", firebaseUser.uid),
        );

        const bookingsSnapshot = await getDocs(bookingsQuery);

        if (mounted) {
          setBookingCount(bookingsSnapshot.size);
        }
      } catch {
        if (mounted) {
          setError("Unable to load your profile.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [navigate]);


  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSaveProfile = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!editForm.name.trim()) {
      setError("Please enter your name.");

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");


      await updateProfile(currentUser, {
        displayName: editForm.name.trim(),
      });


      const userRef = doc(db, "users", currentUser.uid);

      await setDoc(
        userRef,
        {
          name: editForm.name.trim(),

          email: currentUser.email || "",

          phone: editForm.phone.trim(),

          location: editForm.location.trim(),

          updatedAt: new Date(),
        },
        {
          merge: true,
        },
      );


      setUser((previous) => ({
        ...previous,

        name: editForm.name.trim(),

        phone: editForm.phone.trim(),

        location: editForm.location.trim(),
      }));

      setEditOpen(false);

      setSuccess("Profile updated successfully.");
    } catch {
      setError("Unable to update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };


  const handleLogout = async () => {
    try {
      await signOut(auth);

      navigate("/login", {
        replace: true,
      });
    } catch {
      setError("Unable to sign out. Please try again.");
    }
  };


  const openEditProfile = () => {
    setEditForm({
      name: user.name,
      phone: user.phone,
      location: user.location,
    });

    setError("");
    setSuccess("");
    setEditOpen(true);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <div className="animate-pulse">
            <div className="h-9 w-48 rounded-lg bg-gray-200" />

            <div className="mt-3 h-4 w-80 rounded bg-gray-200" />

            <div className="mt-8 h-40 rounded-2xl bg-white" />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="h-28 rounded-2xl bg-white" />

              <div className="h-28 rounded-2xl bg-white" />
            </div>

            <div className="mt-6 h-56 rounded-2xl bg-white" />

            <div className="mt-6 h-64 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <User size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your account and rental activities
              </p>
            </div>
          </div>
        </div>


        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}


        {success && (
          <div className="mb-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600">
            {success}
          </div>
        )}


        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">

              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-50"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 ring-4 ring-blue-50">
                  <User size={42} />
                </div>
              )}


              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h2>

                  {user.role && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold capitalize text-blue-600">
                      <ShieldCheck size={12} />

                      {user.role}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-gray-500">{user.email}</p>

                {user.location && (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin size={16} />

                    {user.location}
                  </div>
                )}
              </div>
            </div>


            <button
              type="button"
              onClick={openEditProfile}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Pencil size={17} />
              Edit Profile
            </button>
          </div>
        </div>


        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

          <button
            type="button"
            onClick={() => navigate("/bookings")}
            className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <CalendarDays />
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-500">My Bookings</p>

              <h3 className="text-2xl font-bold text-gray-900">
                {bookingCount}
              </h3>
            </div>

            <ChevronRight
              size={18}
              className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-500"
            />
          </button>


          <button
            type="button"
            onClick={() => navigate("/favorites")}
            className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-500">
              <Heart />
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-500">Favorite Rooms</p>

              <h3 className="text-2xl font-bold text-gray-900">
                {favoriteCount}
              </h3>
            </div>

            <ChevronRight
              size={18}
              className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-red-500"
            />
          </button>
        </div>


        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Your account information
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoItem
              icon={<User size={20} />}
              label="Full Name"
              value={user.name || "Not provided"}
            />

            <InfoItem
              icon={<Mail size={20} />}
              label="Email"
              value={user.email || "Not provided"}
            />

            <InfoItem
              icon={<Phone size={20} />}
              label="Phone"
              value={user.phone || "Not provided"}
            />

            <InfoItem
              icon={<MapPin size={20} />}
              label="Location"
              value={user.location || "Not provided"}
            />
          </div>
        </div>


        <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>

          <p className="mt-1 text-sm text-gray-400">
            Manage your account preferences
          </p>

          <div className="mt-4 divide-y divide-gray-100">

            <SettingItem
              icon={<Bell size={21} />}
              title="Notifications"
              description="Manage your notification preferences"
              onClick={() => navigate("/settings")}
            />


            <SettingItem
              icon={<Lock size={21} />}
              title="Change Password"
              description="Update your account password"
              onClick={() => navigate("/settings")}
            />


            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-4 rounded-xl px-3 py-5 text-left text-red-500 transition hover:bg-red-50"
            >
              <LogOut size={21} />

              <div className="flex-1">
                <p className="font-semibold">Logout</p>

                <p className="text-sm text-gray-500">
                  Sign out of your account
                </p>
              </div>

              <ChevronRight size={18} className="text-red-300" />
            </button>
          </div>
        </div>
      </div>


      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Edit Profile
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Update your personal information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>


            <div className="mt-6 space-y-5">

              <FormField
                icon={<User size={18} />}
                label="Full Name"
                name="name"
                value={editForm.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />


              <FormField
                icon={<Phone size={18} />}
                label="Phone"
                name="phone"
                value={editForm.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />


              <FormField
                icon={<MapPin size={18} />}
                label="Location"
                name="location"
                value={editForm.location}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </div>


            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                disabled={saving}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
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
          </div>
        </div>
      )}
    </div>
  );
}


function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>

        <p className="truncate font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}


function SettingItem({ icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-xl px-3 py-5 text-left transition hover:bg-gray-50"
    >
      <div className="text-gray-600">{icon}</div>

      <div className="flex-1">
        <p className="font-semibold text-gray-900">{title}</p>

        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <ChevronRight
        size={18}
        className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-blue-500"
      />
    </button>
  );
}


function FormField({ icon, label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
        <div className="shrink-0 text-gray-400">{icon}</div>

        <input
          id={name}
          name={name}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="h-12 min-w-0 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}
