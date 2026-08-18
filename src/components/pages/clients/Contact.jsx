import { useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase/config";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Submitting form...");
  console.log("Form data:", form);
  console.log("Firestore db:", db);

  try {
    const docRef = await addDoc(collection(db, "contactMessages"), {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      status: "unread",
      createdAt: serverTimestamp(),
    });

    console.log("SUCCESS! Document ID:", docRef.id);

    setSubmitted(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error("🔥 FIREBASE ERROR");
    console.error("Code:", error.code);
    console.error("Message:", error.message);
    console.error("Full error:", error);

    alert(`Firebase Error:\n${error.code}\n${error.message}`);
  }
};

  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Location",
      khmer: "ទីតាំង",
      value: "Phnom Penh, Cambodia",
      description: "Serving students across Phnom Penh",
    },
    {
      icon: Phone,
      title: "Phone",
      khmer: "លេខទូរស័ព្ទ",
      value: "+855 12 345 678",
      description: "Monday - Saturday",
    },
    {
      icon: Mail,
      title: "Email",
      khmer: "អ៊ីមែល",
      value: "hello@roomkhmer.com",
      description: "We'll reply within 24 hours",
    },
    {
      icon: Clock3,
      title: "Working Hours",
      khmer: "ម៉ោងធ្វើការ",
      value: "8:00 AM - 6:00 PM",
      description: "Monday - Saturday",
    },
  ];

  const faqs = [
    {
      question: "How can I find a room?",
      answer:
        "Go to the Rooms page and search by location, price, room type, and facilities.",
    },
    {
      question: "Can I contact a landlord directly?",
      answer:
        "Yes. Open a room detail page and use the Contact Landlord button to contact the landlord.",
    },
    {
      question: "Is RoomKhmer only for students?",
      answer:
        "RoomKhmer is designed especially for students, but anyone looking for a room in Phnom Penh can use the platform.",
    },
    {
      question: "Can landlords list their rooms?",
      answer:
        "Yes. Landlords will be able to create an account and publish available rooms through the landlord dashboard.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      <section className="relative overflow-hidden bg-white">

        <div className="pointer-events-none absolute -right-40 -top-40 h-105 w-105 rounded-full bg-blue-50 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-40 -left-40 h-95 w-95 rounded-full bg-indigo-50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pb-16 lg:px-8">

          <div className="mb-10 flex items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="transition hover:text-blue-600">
              Home
            </Link>

            <span>/</span>

            <span className="font-medium text-gray-600">Contact</span>
          </div>


          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MessageCircle size={27} strokeWidth={1.8} />
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              We're here to help
            </h1>

            <p className="mt-3 text-lg font-medium text-blue-600">
              យើងរង់ចាំជួយអ្នក
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
              Have a question about finding a room, contacting a landlord, or
              using RoomKhmer? Send us a message and our team will be happy to
              help.
            </p>
          </div>
        </div>
      </section>


      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="
                    rounded-2xl
                    border border-gray-100
                    bg-white
                    p-5
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <h2 className="mt-5 text-sm font-bold text-gray-900">
                    {item.title}
                  </h2>

                  <p className="mt-1 text-xs font-medium text-blue-600">
                    {item.khmer}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    {item.value}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">

          <div className="rounded-3xl bg-gray-900 p-7 sm:p-9">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Get in touch
            </span>

            <h2 className="mt-3 text-3xl font-bold leading-tight text-white">
              Have something to ask?
            </h2>

            <p className="mt-2 text-sm font-medium text-blue-400">
              មានសំណួរ? ទាក់ទងមកយើង
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-400">
              Whether you need help finding a room or have feedback about
              RoomKhmer, we'd love to hear from you.
            </p>


            <div className="mt-8 space-y-5">
              <a
                href="mailto:hello@roomkhmer.com"
                className="group flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Mail size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email us</p>

                  <p className="mt-1 text-sm font-medium text-gray-200">
                    hello@roomkhmer.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+85512345678"
                className="group flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Phone size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">Call us</p>

                  <p className="mt-1 text-sm font-medium text-gray-200">
                    +855 12 345 678
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-400">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs text-gray-500">Location</p>

                  <p className="mt-1 text-sm font-medium text-gray-200">
                    Phnom Penh, Cambodia
                  </p>
                </div>
              </div>
            </div>


            <div className="my-8 h-px bg-white/10" />


            <div className="flex gap-3">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <div>
                <p className="text-sm font-semibold text-gray-200">
                  Your privacy matters
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  We keep your information private and only use it to respond to
                  your request.
                </p>
              </div>
            </div>
          </div>


          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-9">
            {!submitted ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Send us a message
                  </h2>

                  <p className="mt-1 text-sm text-gray-400">
                    Fill out the form and we'll get back to you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Your name
                      </label>

                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        className="
                          mt-2 h-12 w-full
                          rounded-xl
                          border border-gray-200
                          bg-gray-50
                          px-4
                          text-sm text-gray-800
                          outline-none
                          transition
                          placeholder:text-gray-400
                          hover:border-gray-300
                          focus:border-blue-500
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-500/10
                        "
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Email address
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="
                          mt-2 h-12 w-full
                          rounded-xl
                          border border-gray-200
                          bg-gray-50
                          px-4
                          text-sm text-gray-800
                          outline-none
                          transition
                          placeholder:text-gray-400
                          hover:border-gray-300
                          focus:border-blue-500
                          focus:bg-white
                          focus:ring-4
                          focus:ring-blue-500/10
                        "
                      />
                    </div>
                  </div>


                  <div>
                    <label
                      htmlFor="subject"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      required
                      className="
                        mt-2 h-12 w-full
                        rounded-xl
                        border border-gray-200
                        bg-gray-50
                        px-4
                        text-sm text-gray-800
                        outline-none
                        transition
                        placeholder:text-gray-400
                        hover:border-gray-300
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    />
                  </div>


                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="message"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Message
                      </label>

                      <span className="text-[11px] text-gray-400">
                        {form.message.length}/500
                      </span>
                    </div>

                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      maxLength={500}
                      rows={6}
                      required
                      className="
                        mt-2 w-full
                        resize-none
                        rounded-xl
                        border border-gray-200
                        bg-gray-50
                        px-4 py-3
                        text-sm text-gray-800
                        outline-none
                        transition
                        placeholder:text-gray-400
                        hover:border-gray-300
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-4
                        focus:ring-blue-500/10
                      "
                    />
                  </div>


                  <button
                    type="submit"
                    className="
                      flex h-12 w-full
                      items-center justify-center
                      gap-2
                      rounded-xl
                      bg-blue-600
                      text-sm font-semibold
                      text-white
                      shadow-sm
                      transition
                      hover:bg-blue-700
                      focus:outline-none
                      focus:ring-4
                      focus:ring-blue-500/20
                    "
                  >
                    <Send size={17} />
                    Send Message
                  </button>
                </form>
              </>
            ) : (

              <div className="flex min-h-125 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={32} strokeWidth={1.8} />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                  Message sent successfully
                </h2>

                <p className="mt-2 text-sm font-medium text-blue-600">
                  សាររបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ
                </p>

                <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
                  Thank you for contacting RoomKhmer. Our team will review your
                  message and get back to you as soon as possible.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="
                    mt-7
                    inline-flex
                    h-11
                    items-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-5
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-blue-700
                  "
                >
                  Send another message
                </button>
              </div>
            )}
          </div>
        </div>
      </main>


      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              FAQ
            </span>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Frequently asked questions
            </h2>

            <p className="mt-2 text-sm font-medium text-gray-400">
              សំណួរដែលគេសួរញឹកញាប់
            </p>
          </div>

          <div className="mt-10 grid gap-4">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-gray-100 bg-slate-50 p-5"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-sm font-semibold text-gray-800">
                      {faq.question}
                    </span>
                  </div>

                  <ArrowRight
                    size={17}
                    className="shrink-0 rotate-90 text-gray-400 transition-transform group-open:-rotate-90"
                  />
                </summary>

                <div className="ml-11 mt-4 border-t border-gray-200 pt-4">
                  <p className="text-sm leading-6 text-gray-500">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>


      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-blue-600 px-6 py-12 text-center sm:px-10">
            <div className="mx-auto max-w-2xl">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
                <HomeIcon />
              </div>

              <h2 className="mt-5 text-3xl font-bold text-white">
                Still looking for a room?
              </h2>

              <p className="mt-3 text-sm leading-6 text-blue-100">
                Browse available rooms and find a place that fits your budget
                and lifestyle.
              </p>

              <Link
                to="/rooms"
                className="
                  mt-7
                  inline-flex
                  h-11
                  items-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-6
                  text-sm
                  font-semibold
                  text-blue-600
                  transition
                  hover:bg-blue-50
                "
              >
                Browse Rooms
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


const HomeIcon = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path d="m3 10 9-7 9 7" />
      <path d="M5 9v11h14V9" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
};

export default Contact;
