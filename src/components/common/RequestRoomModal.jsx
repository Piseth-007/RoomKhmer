import { useState } from "react";

import {
  CalendarDays,
  CheckCircle2,
  FileText,
  Mail,
  MessageCircle,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../firebase/config";

const RequestRoomModal = ({ isOpen, onClose, room }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    moveInDate: "",
    rentalMonths: "1",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!room?.id) {
      setError("Room information is missing.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const user = auth.currentUser;

      if (!user) {
        setError("Please login before requesting a room.");
        return;
      }

      const landlordId = room.landlordId || room.ownerId;

      if (!landlordId) {
        setError("This room has no landlord assigned.");
        return;
      }

      const monthlyRent = Number(room.price || 0);

      const rentalMonths = Number(form.rentalMonths || 1);

      const totalRent = monthlyRent * rentalMonths;

      const requestData = {

        tenantId: user.uid,

        tenantName: form.name.trim() || user.displayName || "Unknown Student",

        tenantEmail: form.email.trim() || user.email || "",

        tenantPhone: form.phone.trim(),


        landlordId,


        roomId: room.id,

        roomName: room.name || room.englishTitle || "Unknown Room",

        roomPrice: monthlyRent,

        roomLocation: room.location || "",


        moveInDate: form.moveInDate,

        rentalMonths,

        totalRent,


        message: form.message.trim(),

        status: "pending",

        createdAt: serverTimestamp(),
      };

      console.log("📤 Sending room request:", requestData);

      const docRef = await addDoc(collection(db, "roomRequests"), requestData);

      console.log("✅ Request created:", docRef.id);

      setSubmitted(true);

      setForm({
        name: "",
        phone: "",
        email: "",
        moveInDate: "",
        rentalMonths: "1",
        message: "",
      });
    } catch (err) {
      console.error("❌ Request error:", err);

      setError(
        err.code
          ? `${err.code}: ${err.message}`
          : err.message || "Failed to send request.",
      );
    } finally {
      setLoading(false);
    }
  };


  const handleClose = () => {
    if (loading) return;

    setSubmitted(false);
    setError("");

    setForm({
      name: "",
      phone: "",
      email: "",
      moveInDate: "",
      message: "",
    });

    onClose();
  };

  const roomImage =
    room?.images?.[0] || "https://placehold.co/400x300?text=Room";

  const roomName = room?.name || room?.englishTitle || "Room";

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50 p-4
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="
          relative
          max-h-[90vh]
          w-full
          max-w-lg
          overflow-y-auto
          rounded-3xl
          bg-white
          shadow-2xl
        "
      >

        <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-6 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <MessageCircle size={21} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Request this room
                </h2>

                <p className="mt-0.5 text-xs font-medium text-blue-600">
                  ស្នើសុំបន្ទប់នេះ
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-xl
                text-gray-400
                transition
                hover:bg-gray-100
                hover:text-gray-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <X size={19} />
            </button>
          </div>
        </div>


        <div className="p-6 sm:p-7">
          {!submitted ? (
            <>

              {room && (
                <div className="mb-6 flex gap-3 rounded-2xl bg-slate-50 p-3">
                  <img
                    src={roomImage}
                    alt={roomName}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                      {roomName}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {room.location}
                    </p>

                    <p className="mt-2 text-sm font-bold text-blue-600">
                      ${room.price}
                      <span className="ml-1 text-[10px] font-normal text-gray-400">
                        / month
                      </span>
                    </p>
                  </div>
                </div>
              )}


              {error && (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}


              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label
                    htmlFor="request-name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Your name
                  </label>

                  <div className="relative mt-2">
                    <User
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="request-name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      disabled={loading}
                      className="
                        h-11 w-full rounded-xl
                        border border-gray-200
                        bg-gray-50
                        pl-10 pr-4
                        text-sm text-gray-800
                        outline-none
                        transition
                        placeholder:text-gray-400
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                        disabled:opacity-60
                      "
                    />
                  </div>
                </div>


                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="request-phone"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Phone number
                    </label>

                    <div className="relative mt-2">
                      <Phone
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="request-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="012 345 678"
                        required
                        disabled={loading}
                        className="
                          h-11 w-full rounded-xl
                          border border-gray-200
                          bg-gray-50
                          pl-10 pr-3
                          text-sm text-gray-800
                          outline-none
                          transition
                          placeholder:text-gray-400
                          focus:border-blue-500
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-500/10
                          disabled:opacity-60
                        "
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="request-email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email
                    </label>

                    <div className="relative mt-2">
                      <Mail
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />

                      <input
                        id="request-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@email.com"
                        required
                        disabled={loading}
                        className="
                          h-11 w-full rounded-xl
                          border border-gray-200
                          bg-gray-50
                          pl-10 pr-3
                          text-sm text-gray-800
                          outline-none
                          transition
                          placeholder:text-gray-400
                          focus:border-blue-500
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-500/10
                          disabled:opacity-60
                        "
                      />
                    </div>
                  </div>
                </div>


                <div>
                  <label
                    htmlFor="moveInDate"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Preferred move-in date
                  </label>

                  <div className="relative mt-2">
                    <CalendarDays
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="moveInDate"
                      name="moveInDate"
                      type="date"
                      value={form.moveInDate}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      min={new Date().toISOString().split("T")[0]}
                      className="
                        h-11 w-full rounded-xl
                        border border-gray-200
                        bg-gray-50
                        pl-10 pr-4
                        text-sm text-gray-800
                        outline-none
                        transition
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                        disabled:opacity-60
                      "
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="rentalMonths"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Rental period
                  </label>

                  <select
                    id="rentalMonths"
                    name="rentalMonths"
                    value={form.rentalMonths}
                    onChange={handleChange}
                    disabled={loading}
                    className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none focus:border-blue-500 focus:bg-white"
                  >
                    <option value="1">1 month</option>
                    <option value="3">3 months</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                  </select>
                </div>


                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="request-message"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Message
                    </label>

                    <span className="text-[10px] text-gray-400">
                      {form.message.length}/300
                    </span>
                  </div>

                  <div className="relative mt-2">
                    <FileText
                      size={17}
                      className="absolute left-3.5 top-3.5 text-gray-400"
                    />

                    <textarea
                      id="request-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell the landlord when you want to move in or ask any questions..."
                      maxLength={300}
                      rows={4}
                      disabled={loading}
                      className="
                        w-full resize-none
                        rounded-xl
                        border border-gray-200
                        bg-gray-50
                        py-3 pl-10 pr-4
                        text-sm leading-6
                        text-gray-800
                        outline-none
                        transition
                        placeholder:text-gray-400
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                        disabled:opacity-60
                      "
                    />
                  </div>
                </div>


                <div className="rounded-xl bg-blue-50 p-3.5">
                  <div className="flex gap-3">
                    <ShieldIcon />

                    <p className="text-xs leading-5 text-blue-700">
                      Your request will be sent to the landlord. Never send
                      passwords or sensitive financial information.
                    </p>
                  </div>
                </div>


                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="
                      h-11 flex-1
                      rounded-xl
                      border border-gray-200
                      bg-white
                      text-sm font-semibold
                      text-gray-600
                      transition
                      hover:bg-gray-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      flex h-11 flex-1
                      items-center justify-center
                      gap-2
                      rounded-xl
                      bg-blue-600
                      text-sm font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-blue-700
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (

            <div className="flex min-h-105 flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={32} strokeWidth={1.8} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-gray-900">
                Request sent successfully
              </h2>

              <p className="mt-2 text-sm font-medium text-blue-600">
                សំណើរបស់អ្នកត្រូវបានផ្ញើ
              </p>

              <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
                Your room request has been sent. The landlord can now review
                your request and contact you.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="
                  mt-7 h-11
                  rounded-xl
                  bg-blue-600
                  px-6
                  text-sm font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                "
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


const ShieldIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
    >
      <path d="M12 3 4.5 6v5.5c0 4.8 3.2 8.1 7.5 9.5 4.3-1.4 7.5-4.7 7.5-9.5V6L12 3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
};

export default RequestRoomModal;
