import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      return;
    }
    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSubmitted(true);
    } catch (err) {
      console.error("Password reset error", err);
      if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setSubmitted(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          {!submitted ? (
            <>
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Mail size={28} strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  ភ្លេចពាក្យសម្ងាត់?
                </h1>

                <p className="mt-2 text-sm font-medium text-blue-600">
                  Forgot your password?
                </p>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-500">
                  No problem. Enter the email address associated with your
                  account and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>

                <div className="relative mt-2">
                  <Mail
                    size={18}
                    strokeWidth={1.8}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6 flex gap-3 rounded-xl bg-emerald-50 p-4">
                <ShieldCheck
                  size={18}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <p className="text-xs leading-5 text-emerald-700">
                  Your account information is protected. We will never ask you
                  for your password through email.
                </p>
              </div>
            </>
          ) : (
            <div className="py-3 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={32} strokeWidth={1.8} />
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
                Check your email
              </h1>

              <p className="mt-2 text-sm font-medium text-blue-600">
                សូមពិនិត្យអ៊ីមែលរបស់អ្នក
              </p>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                If an account exists for this email, we've sent you a password
                reset link.
              </p>

              <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} className="text-blue-600" />

                  <span className="max-w-60 truncate text-sm font-medium text-gray-700">
                    {email}
                  </span>
                </div>
              </div>

              <Link
                to="/auth/login"
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <ArrowLeft size={17} />
                Back to Login
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="mt-4 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}
        </div>

        {!submitted && (
          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
