import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { auth, db } from "../../../firebase/config";
import imageCompression from "browser-image-compression";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function CreateRoom() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    price: "",
    location: "",
    address: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    area: "",
    availableFrom: "",
    rules: "",
  });
  const [amenities, setAmenities] = useState({
    wifi: false,
    airConditioning: false,
    parking: false,
    privateBathroom: false,
    kitchen: false,
    furnished: false,
  });

  const [images, setImages] = useState([]);

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
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
    }));

    setImages((current) => [...current, ...newImages]);
  };

  const removeImage = (id) => {
    setImages((current) => {
      const image = current.find((item) => item.id === id);

      if (image) {
        URL.revokeObjectURL(image.preview);
      }

      return current.filter((item) => item.id !== id);
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required";
    }

    if (!formData.type) {
      newErrors.type = "Please select a room type";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.location) {
      newErrors.location = "Please select a location";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (images.length === 0) {
      newErrors.images = "Please upload at least one room image";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const uploadImageToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing");
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
      throw new Error(result?.error?.message || "Cloudinary upload failed");
    }

    return result.secure_url;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      console.log("❌ Validation failed");

      window.scroll({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    const user = auth.currentUser;

    if (!user) {
      console.log("❌ No logged-in user");
      alert("Please login before creating rooms");
      navigate("/login");
      return;
    }

    console.log("✅ User:", user.uid);

    setIsSubmitting(true);

    try {
      const imageUrls = await uploadImages(images);
      const roomData = {
        landlordId: user.uid,
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

        status: "pending",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      console.log("📦 Room data:", roomData);

      console.log("⏳ addDoc started...");

      const roomRef = await addDoc(collection(db, "rooms"), roomData);

      console.log("✅ Firestore room created:", roomRef.id);

      alert(
        "Room submitted successfully! It is now waiting for admin approval.",
      );

      navigate("/landlord/rooms");
    } catch (error) {
      console.error("❌ CREATE ROOM ERROR");
      console.error("Error:", error);
      console.error("Code:", error.code);
      console.error("Message:", error.message);

      alert(error.message || "Failed to create room. Please try again.");
    } finally {
      console.log("========== CREATE ROOM FINISHED ==========");
      setIsSubmitting(false);
    }
  };
  const uploadImages = async (images) => {
    console.log(`📤 Uploading ${images.length} images...`);

    const uploadPromises = images.map(async (image, index) => {
      console.log(`📸 Processing image ${index + 1}:`, image.file.name);

      const compressedFile = await imageCompression(image.file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1600,
        useWebWorker: true,
      });

      console.log(
        `📦 Image ${index + 1}:`,
        `${(image.file.size / 1024 / 1024).toFixed(2)} MB →`,
        `${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`,
      );

      const url = await uploadImageToCloudinary(compressedFile);

      console.log(`✅ Image ${index + 1} uploaded`);

      return url;
    });

    const urls = await Promise.all(uploadPromises);

    console.log("🎉 All images uploaded:", urls);

    return urls;
  };

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

        <div>
          <h1 className="text-2xl font-bold text-gray-900">បន្ថែមបន្ទប់ថ្មី</h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a new room and submit it for admin approval
          </p>
        </div>
      </div>


      <div className="mb-6 flex gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <Check size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold text-blue-800">
            Admin approval required
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-600">
            After submitting this room, an admin will review your listing. The
            room will remain pending until it is approved.
          </p>
        </div>
      </div>


      <form onSubmit={handleSubmit} className="space-y-6">

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<ImagePlus size={19} />}
            title="Room Images"
            subtitle="Upload clear photos of your room"
          />


          <label
            className={`mt-6 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition ${
              errors.images
                ? "border-red-300 bg-red-50"
                : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImages}
              className="hidden"
            />

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <Upload size={22} />
            </div>

            <p className="mt-3 text-sm font-semibold text-gray-700">
              Click to upload images
            </p>

            <p className="mt-1 text-xs text-gray-400">
              PNG, JPG or WEBP · Multiple images allowed
            </p>
          </label>

          {errors.images && (
            <p className="mt-2 text-xs text-red-500">{errors.images}</p>
          )}


          {images.length > 0 && (
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
            </div>
          )}
        </section>


        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<House size={19} />}
            title="Basic Information"
            subtitle="Tell tenants about your room"
          />

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

            <FormField
              label="Room Name"
              required
              error={errors.name}
              className="md:col-span-2"
            >
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Modern Private Room"
                className={inputClass(errors.name)}
              />
            </FormField>


            <FormField label="Room Type" required error={errors.type}>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputClass(errors.type)}
              >
                <option value="">Select room type</option>

                <option value="single">Single Room</option>

                <option value="private">Private Room</option>

                <option value="studio">Studio</option>

                <option value="apartment">Apartment</option>

                <option value="shared">Shared Room</option>
              </select>
            </FormField>


            <FormField label="Monthly Rent" required error={errors.price}>
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
                  placeholder="150"
                  min="0"
                  className={`pl-9 ${inputClass(errors.price)}`}
                />
              </div>
            </FormField>


            <FormField label="Location" required error={errors.location}>
              <div className="relative">
                <MapPin
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`pl-9 ${inputClass(errors.location)}`}
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


            <FormField label="Full Address" className="md:col-span-2">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, Sangkat, Khan, Phnom Penh"
                className={inputClass()}
              />
            </FormField>


            <FormField
              label="Description"
              required
              error={errors.description}
              className="md:col-span-2"
            >
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe your room, nearby places, environment, and other useful information..."
                className={`${inputClass(errors.description)} resize-none`}
              />
            </FormField>
          </div>
        </section>


        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<BedDouble size={19} />}
            title="Room Details"
            subtitle="Provide basic room specifications"
          />

          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            <NumberField
              label="Bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
            />

            <NumberField
              label="Bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
            />

            <NumberField
              label="Area (m²)"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="25"
            />

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


        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<Check size={19} />}
            title="Amenities"
            subtitle="Select the facilities available in this room"
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


        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <SectionHeader
            icon={<House size={19} />}
            title="Room Rules"
            subtitle="Let tenants know your rental rules"
          />

          <textarea
            name="rules"
            value={formData.rules}
            onChange={handleChange}
            rows={5}
            placeholder={`Example:
- No smoking
- No pets
- Keep common areas clean
- Quiet hours after 10 PM`}
            className={`mt-6 ${inputClass()} resize-none`}
          />
        </section>


        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/landlord/rooms"
            className="flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Check size={18} />
                Submit for Approval
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


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


function FormField({
  label,
  required = false,
  error,
  children,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}


function NumberField({ label, name, value, onChange, placeholder }) {
  return (
    <FormField label={label}>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        min="0"
        placeholder={placeholder}
        className={inputClass()}
      />
    </FormField>
  );
}


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


function inputClass(error = false) {
  return `h-11 w-full rounded-xl border bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 ${
    error
      ? "border-red-300 focus:border-red-500"
      : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
  }`;
}
