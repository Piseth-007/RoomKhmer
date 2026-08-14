import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const friendlyError = (code) => {
    if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
      return "Incorrect email or password.";
    }

    if (code === "auth/user-not-found") {
      return "No account found with that email.";
    }

    if (code === "auth/too-many-requests") {
      return "Too many attempts. Please try again later.";
    }

    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);

      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);

      setError(friendlyError(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      await loginWithGoogle();

      navigate("/");
    } catch (err) {
      console.error("Google login failed:", err);

      setError(friendlyError(err.code));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md items-center justify-center">
      <div className="w-full">
        {/* ================= LOGIN CARD ================= */}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          {/* ================= HEADER ================= */}

          <div className="mb-8 text-center">
            {/* Icon */}

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <LogIn size={27} strokeWidth={2} />
            </div>

            {/* Title */}

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              សូមស្វាគមន៍មកវិញ
            </h1>

            <p className="mt-1 text-sm font-medium text-gray-500">
              Welcome back
            </p>

            <p className="mt-2 text-sm text-gray-400">
              ចូលគណនីរបស់អ្នក ដើម្បីស្វែងរកបន្ទប់
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

            {/* ================= PASSWORD ================= */}

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  ពាក្យសម្ងាត់
                  <span className="ml-1 font-normal text-gray-400">
                    Password
                  </span>
                </label>

                <Link
                  to="/auth/forgot-password"
                  className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
                >
                  ភ្លេចពាក្យសម្ងាត់?
                </Link>
              </div>

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
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ================= REMEMBER ME ================= */}

            <div className="flex items-center">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />

                <span className="text-sm text-gray-500">
                  ចងចាំខ្ញុំ
                  <span className="ml-1 text-gray-400">Remember me</span>
                </span>
              </label>
            </div>

            {/* ================= LOGIN BUTTON ================= */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>ចូលគណនី</span>

                  <span className="text-blue-200">Login</span>

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

          {/* ================= GOOGLE LOGIN ================= */}

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* Google SVG */}
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
                d="M6.54 13.59a5.86 5.86 0 0 1 0-3.18V7.88H3.29a9.75 9.75 0 0 0 0 8.24l3.25-2.53Z"
              />

              <path
                fill="#EA4335"
                d="M12 6.38c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.47 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.71 5.38l3.25 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
              />
            </svg>
            Continue with Google
          </button>

          {/* ================= REGISTER ================= */}

          <p className="mt-7 text-center text-sm text-gray-500">
            មិនទាន់មានគណនី?
            <Link
              to="/auth/register"
              className="ml-1 font-semibold text-blue-600 transition hover:text-blue-700"
            >
              ចុះឈ្មោះ
            </Link>
          </p>
        </div>

        {/* ================= TERMS ================= */}

        <p className="mt-5 text-center text-xs leading-5 text-gray-400">
          By continuing, you agree to our{" "}
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

export default Login;
