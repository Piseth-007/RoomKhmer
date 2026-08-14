import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Home,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [role, setRole] = useState("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const friendlyError = (code) => {
    if (code === "auth/email-already-in-use") {
      return "An account with this email already exists.";
    }

    if (code === "auth/weak-password") {
      return "Password should be at least 6 characters.";
    }

    if (code === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }

    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
      });

      navigate(role === "landlord" ? "/landlord" : "/");
    } catch (err) {
      console.error("Registration failed:", err);

      setError(friendlyError(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await loginWithGoogle();

      navigate("/");
    } catch (err) {
      console.error("Google sign up failed:", err);

      setError(friendlyError(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-lg items-center justify-center">
      <div className="w-full">
        {/* ================= REGISTER CARD ================= */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          {/* ================= HEADER ================= */}

          <div className="mb-7 text-center">
            {/* Icon */}

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <UserPlus size={27} strokeWidth={2} />
            </div>

            {/* Title */}

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              បង្កើតគណនី
            </h1>

            <p className="mt-1 text-sm font-medium text-gray-500">
              Create your account
            </p>

            <p className="mt-2 text-sm text-gray-400">
              ចូលរួមជាមួយ RoomKhmer ដើម្បីស្វែងរកបន្ទប់
            </p>
          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ================= FORM ================= */}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ================= FULL NAME ================= */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                ឈ្មោះពេញ
                <span className="ml-1 font-normal text-gray-400">
                  Full Name
                </span>
              </label>

              <div className="relative">
                <User
                  size={18}
                  strokeWidth={1.8}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                  autoComplete="name"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            {/* ================= EMAIL ================= */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                អ៊ីមែល
                <span className="ml-1 font-normal text-gray-400">Email</span>
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  strokeWidth={1.8}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            {/* ================= PHONE ================= */}

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                លេខទូរស័ព្ទ
                <span className="ml-1 font-normal text-gray-400">Phone</span>
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  strokeWidth={1.8}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="012 345 678"
                  autoComplete="tel"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />
              </div>
            </div>

            {/* ================= ACCOUNT TYPE ================= */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                ប្រភេទគណនី
                <span className="ml-1 font-normal text-gray-400">
                  Account Type
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* ================= STUDENT ================= */}

                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === "student"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      role === "student"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <GraduationCap size={20} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    និស្សិត
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">Student</p>
                </button>

                {/* ================= LANDLORD ================= */}

                <button
                  type="button"
                  onClick={() => setRole("landlord")}
                  className={`rounded-xl border p-4 text-left transition ${
                    role === "landlord"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      role === "landlord"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Home size={20} />
                  </div>

                  <p className="mt-3 text-sm font-semibold text-gray-800">
                    ម្ចាស់ផ្ទះ
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">Landlord</p>
                </button>
              </div>
            </div>

            {/* ================= PASSWORD ================= */}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                ពាក្យសម្ងាត់
                <span className="ml-1 font-normal text-gray-400">Password</span>
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  strokeWidth={1.8}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="យ៉ាងហោចណាស់ 8 តួ"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ================= CONFIRM PASSWORD ================= */}

            <div>
              <label
                htmlFor="password_confirmation"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                បញ្ជាក់ពាក្យសម្ងាត់
                <span className="ml-1 font-normal text-gray-400">
                  Confirm Password
                </span>
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  strokeWidth={1.8}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  placeholder="បញ្ចូលពាក្យសម្ងាត់ម្តងទៀត"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* ================= TERMS ================= */}

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <span className="text-xs leading-5 text-gray-500">
                ខ្ញុំយល់ព្រមជាមួយ{" "}
                <Link
                  to="/terms"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  លក្ខខណ្ឌប្រើប្រាស់
                </Link>{" "}
                និង{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  គោលការណ៍ឯកជនភាព
                </Link>
              </span>
            </label>

            {/* ================= REGISTER BUTTON ================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>បង្កើតគណនី</span>

                  <span className="text-blue-200">Register</span>

                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* ================= DIVIDER ================= */}

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-100" />

            <span className="text-xs text-gray-400">ឬ</span>

            <div className="h-px flex-1 bg-gray-100" />
          </div>

          {/* ================= GOOGLE ================= */}

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M21.35 12.23c0-.79-.07-1.55-.23-2.27H12v4.3h5.22a4.47 4.47 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.93-4.18 2.93-7.42Z"
              />

              <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.5Z"
              />

              <path
                fill="#FBBC05"
                d="M6.54 13.59a5.86 5.86 0 0 1 0-3.18V7.88H3.29a9.75 9.75 0 0 0 0 8.24l3.25 2.53Z"
              />

              <path
                fill="#EA4335"
                d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.47 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.71 5.38l3.25 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
              />
            </svg>
            Continue with Google
          </button>

          {/* ================= LOGIN ================= */}

          <p className="mt-7 text-center text-sm text-gray-500">
            មានគណនីរួចហើយ?
            <Link
              to="/auth/login"
              className="ml-1 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              ចូលគណនី
            </Link>
          </p>
        </div>

        {/* ================= FOOTER ================= */}

        <p className="mt-5 text-center text-xs leading-5 text-gray-400">
          By creating an account, you agree to our{" "}
          <Link to="/terms" className="text-gray-600 hover:text-blue-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-gray-600 hover:text-blue-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
