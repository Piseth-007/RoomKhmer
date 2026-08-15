import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Upload,
  X,
  ImagePlus,
  MapPin,
  DollarSign,
  House,
  Wifi,
  Wind,
  Car,
  Bath,
  BedDouble,
  CookingPot,
  Check,
  Save,
} from "lucide-react";

import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../../firebase/config";
export default function EditRoom() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    location: "",
    address: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    availableFrom: "",
    rules: "",
  });

  const [amenities, setAmenities] = useState({
    wifi: true,
    airConditioning: true,
    parking: true,
    privateBathroom: true,
    kitchen: false,
    furnished: true,
  });

  const [images, setImages] = useState([]);

  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roomStatus, setRoomStatus] = useState("pending");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };
  const handleAmenity = (name) => {
    setAmenities((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const newImages = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      existing: false,
    }));

    setImages((current) => [...current, ...newImages]);

    e.target.value = "";
  };

  const removeImage = (imageId) => {
    setImages((current) => {
      const image = current.find((item) => item.id === imageId);

      if (image && !image.existing && image.preview) {
        URL.revokeObjectURL(image.preview);
      }

      return current.filter((item) => item.id !== imageId);
    });
  };
  const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing.");
    }

    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data,
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Cloudinary error:", result);

      throw new Error(result?.error?.message || "Failed to upload image.");
    }

    return result.secure_url;
  };
  const getFinalImageUrls = async () => {
    const imageUrls = [];

    for (const image of images) {
      if (image.existing && image.url) {
        imageUrls.push(image.url);
        continue;
      }

      if (image.file) {
        console.log("📤 Uploading new image:", image.file.name);

        const url = await uploadImageToCloudinary(image.file);

        console.log("✅ New image uploaded:", url);

        imageUrls.push(url);
      }
    }

    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    if (!id) {
      alert("Room ID is missing.");
      return;
    }

    setIsSaving(true);

    try {
      console.log("========== EDIT ROOM START ==========");

      // Get current room
      const roomRef = doc(db, "rooms", id);

      const roomSnap = await getDoc(roomRef);

      if (!roomSnap.exists()) {
        throw new Error("Room not found.");
      }

      const existingRoom = roomSnap.data();

      // Security check
      if (existingRoom.landlordId !== user.uid) {
        throw new Error("You don't have permission to edit this room.");
      }

      // Upload new images and keep existing images
      console.log("📸 Processing images...");

      const imageUrls = await getFinalImageUrls();

      console.log("✅ Final images:", imageUrls);

      const updatedData = {
        name: formData.name.trim(),
        type: formData.type,
        price: Number(formData.price),
        location: formData.location,
        address: formData.address.trim(),
        description: formData.description.trim(),

        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area) || 0,

        availableFrom: formData.availableFrom || null,

        rules: formData.rules
          .split("\n")
          .map((rule) => rule.trim())
          .filter(Boolean),

        amenities,

        images: imageUrls,

        updatedAt: serverTimestamp(),
      };

      console.log("📦 Updating Firestore:", updatedData);

      await updateDoc(roomRef, updatedData);

      console.log("✅ Room updated successfully");

      alert("Room updated successfully!");

      navigate("/landlord/rooms");
    } catch (error) {
      console.error("❌ EDIT ROOM ERROR");
      console.error("Code:", error.code);
      console.error("Message:", error.message);
      console.error(error);

      alert(error.message || "Failed to update room.");
    } finally {
      setIsSaving(false);
    }
  };
  useEffect(() => {
    const loadRoom = async () => {
      try {
        setLoading(true);
        setError("");

        const user = auth.currentUser;

        if (!user) {
          setError("You are not logged in.");
          return;
        }

        if (!id) {
          setError("Room ID is missing.");
          return;
        }

        const roomRef = doc(db, "rooms", id);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
          setError("Room not found.");
          return;
        }

        const room = roomSnap.data();
        console.log(room);
        setRoomStatus(room.status || "pending");

        // Security check on frontend
        if (room.landlordId !== user.uid) {
          setError("You don't have permission to edit this room.");
          return;
        }

        setFormData({
          name: room.name || "",
          type: room.type || "",
          price: room.price ?? "",
          location: room.location || "",
          address: room.address || "",
          description: room.description || "",
          bedrooms: room.bedrooms ?? "",
          bathrooms: room.bathrooms ?? "",
          area: room.area ?? "",
          availableFrom: room.availableFrom || "",
          rules: Array.isArray(room.rules)
            ? room.rules.join("\n")
            : room.rules || "",
        });

        setAmenities({
          wifi: room.amenities?.wifi || false,
          airConditioning: room.amenities?.airConditioning || false,
          parking: room.amenities?.parking || false,
          privateBathroom: room.amenities?.privateBathroom || false,
          kitchen: room.amenities?.kitchen || false,
          furnished: room.amenities?.furnished || false,
        });
        setImages(
          (room.images || []).map((url, index) => ({
            id: `existing-${index}-${Date.now()}`,
            preview: url,
            url,
            existing: true,
          })),
        );
      } catch (err) {
        console.error("Error loading room:", err);
        setError(err.message || "Failed to load room.");
      } finally {
        setLoading(false);
      }
    };

    loadRoom();
  }, [id]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <Link
          to="/landlord/rooms"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to My Rooms
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">កែប្រែបន្ទប់</h1>

            <p className="mt-1 text-sm text-gray-500">
              Edit your room information and listing details
            </p>
          </div>

          <span
            className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
              roomStatus === "approved"
                ? "bg-green-50 text-green-600"
                : roomStatus === "rejected"
                  ? "bg-red-50 text-red-600"
                  : "bg-yellow-50 text-yellow-600"
            }`}
          >
            {roomStatus}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<ImagePlus size={19} />}
            title="Room Images"
            subtitle="Manage your room photos"
          />

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {/* Existing Images */}

            {images.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100"
              >
                <img
                  src={image.preview}
                  alt={`Room ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-[9px] font-semibold text-white">
                    Main Photo
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <X size={15} />
                </button>
              </div>
            ))}

            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-400 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImages}
                className="hidden"
              />

              <Upload size={22} />

              <span className="mt-2 text-xs font-medium">Add Photos</span>
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<House size={19} />}
            title="Basic Information"
            subtitle="Update your room information"
          />

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Room Name */}

            <FormField label="Room Name" required className="md:col-span-2">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClass()}
              />
            </FormField>

            {/* Room Type */}

            <FormField label="Room Type" required>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputClass()}
              >
                <option value="">Select room type</option>

                <option value="single">Single Room</option>

                <option value="private">Private Room</option>

                <option value="studio">Studio</option>

                <option value="apartment">Apartment</option>

                <option value="shared">Shared Room</option>
              </select>
            </FormField>

            {/* Price */}

            <FormField label="Monthly Rent" required>
              <div className="relative">
                <DollarSign
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  className={`pl-9 ${inputClass()}`}
                />
              </div>
            </FormField>

            {/* Location */}

            <FormField label="Location" required>
              <div className="relative">
                <MapPin
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`pl-9 ${inputClass()}`}
                >
                  <option value="">Select location</option>

                  <option value="BKK1">BKK1</option>

                  <option value="Toul Kork">Toul Kork</option>

                  <option value="Sen Sok">Sen Sok</option>

                  <option value="Chamkarmon">Chamkarmon</option>

                  <option value="Mean Chey">Mean Chey</option>

                  <option value="7 Makara">7 Makara</option>

                  <option value="Daun Penh">Daun Penh</option>
                </select>
              </div>
            </FormField>

            {/* Address */}

            <FormField label="Full Address" className="md:col-span-2">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass()}
              />
            </FormField>

            {/* Description */}

            <FormField label="Description" required className="md:col-span-2">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className={`${inputClass()} resize-none`}
              />
            </FormField>
          </div>
        </section>

        {/* ====================================================
            ROOM DETAILS
        ===================================================== */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<BedDouble size={19} />}
            title="Room Details"
            subtitle="Update room specifications"
          />

          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            <FormField label="Bedrooms">
              <input
                type="number"
                name="bedrooms"
                min="0"
                value={formData.bedrooms}
                onChange={handleChange}
                className={inputClass()}
              />
            </FormField>

            <FormField label="Bathrooms">
              <input
                type="number"
                name="bathrooms"
                min="0"
                value={formData.bathrooms}
                onChange={handleChange}
                className={inputClass()}
              />
            </FormField>

            <FormField label="Area (m²)">
              <input
                type="number"
                name="area"
                min="0"
                value={formData.area}
                onChange={handleChange}
                className={inputClass()}
              />
            </FormField>

            <FormField label="Available From">
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                className={inputClass()}
              />
            </FormField>
          </div>
        </section>

        {/* ====================================================
            AMENITIES
        ===================================================== */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<Check size={19} />}
            title="Amenities"
            subtitle="Update the facilities available in this room"
          />

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Amenity
              name="wifi"
              label="Wi-Fi"
              icon={<Wifi size={19} />}
              checked={amenities.wifi}
              onChange={handleAmenity}
            />

            <Amenity
              name="airConditioning"
              label="Air Conditioning"
              icon={<Wind size={19} />}
              checked={amenities.airConditioning}
              onChange={handleAmenity}
            />

            <Amenity
              name="parking"
              label="Parking"
              icon={<Car size={19} />}
              checked={amenities.parking}
              onChange={handleAmenity}
            />

            <Amenity
              name="privateBathroom"
              label="Private Bathroom"
              icon={<Bath size={19} />}
              checked={amenities.privateBathroom}
              onChange={handleAmenity}
            />

            <Amenity
              name="kitchen"
              label="Kitchen"
              icon={<CookingPot size={19} />}
              checked={amenities.kitchen}
              onChange={handleAmenity}
            />

            <Amenity
              name="furnished"
              label="Fully Furnished"
              icon={<House size={19} />}
              checked={amenities.furnished}
              onChange={handleAmenity}
            />
          </div>
        </section>

        {/* ====================================================
            RULES
        ===================================================== */}

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<House size={19} />}
            title="Room Rules"
            subtitle="Update your rental rules"
          />

          <textarea
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            rows={5}
            className={`${inputClass()} mt-6 resize-none`}
          />
        </section>

        {/* ====================================================
            ACTIONS
        ===================================================== */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/landlord/rooms"
            className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>

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
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>

        <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

/* ============================================================
   FORM FIELD
============================================================ */

function FormField({ label, required = false, children, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}
    </div>
  );
}

/* ============================================================
   AMENITY
============================================================ */

function Amenity({ name, label, icon, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(name)}
      className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
        checked
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-gray-200 bg-white text-gray-600 hover:border-blue-100 hover:bg-gray-50"
      }`}
    >
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          checked ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        {icon}
      </div>

      <span className="flex-1 text-sm font-medium">{label}</span>

      {checked && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
          <Check size={12} />
        </div>
      )}
    </button>
  );
}

/* ============================================================
   INPUT CLASS
============================================================ */

function inputClass() {
  return "h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-50";
}
