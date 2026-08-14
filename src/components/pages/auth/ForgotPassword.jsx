import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/config";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const friendlyError = (code) => {
    if (code === "auth/invalid-email") {
      return "Please enter a valid email address.";
    }

    if (code === "auth/too-many-requests") {
      return "Too many attempts. Please wait a bit and try again.";
    }

    if (code === "auth/network-request-failed") {
      return "Network error. Check your connection and try again.";
    }

    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // handleCodeInApp + url makes Firebase send a link that opens our own
      // /auth/reset-password page (with the action code in the query
      // string) instead of a generic Firebase-hosted page.
      await sendPasswordResetEmail(auth, email.trim(), {
        url: `${window.location.origin}/auth/reset-password`,
        handleCodeInApp: true,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Password reset request failed:", err);

      // Deliberately do NOT reveal whether the email exists — treat
      // "no account" the same as success so this can't be used to check
      // which emails are registered.
      if (err.code === "auth/user-not-found") {
        setSubmitted(true);
      } else {
        setError(friendlyError(err.code));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-md">
        {/* =====================================================
            CARD
        ====================================================== */}

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          {!submitted ? (
            <>
              {/* =================================================
                  ICON
              ================================================== */}

              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Mail size={28} strokeWidth={1.8} />
                </div>
              </div>

              {/* =================================================
                  TITLE
              ================================================== */}

              <div className="mt-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Forgot your password?
                </h1>

                <p className="mt-2 text-sm font-medium text-blue-600">
                  ភ្លេចពាក្យសម្ងាត់?
                </p>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-500">
                  No problem. Enter the email address associated with your
                  account and we'll send you a link to reset your password.
                </p>
              </div>

              {/* =================================================
                  ERROR
              ================================================== */}

              {error && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* =================================================
                  FORM
              ================================================== */}

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
                    className="
                      absolute
                      left-3.5
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                    "
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
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      pl-11
                      pr-4
                      text-sm
                      text-gray-800
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

                {/* =================================================
                    SUBMIT BUTTON
                ================================================== */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="
                    mt-5
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-600
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition

                    hover:bg-blue-700

                    focus:outline-none
                    focus:ring-4
                    focus:ring-blue-500/20

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>

              {/* =================================================
                  SECURITY MESSAGE
              ================================================== */}

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
            /* =====================================================
               SUCCESS STATE
            ====================================================== */

            <div className="py-3 text-center">
              {/* Success icon */}

              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={32} strokeWidth={1.8} />
                </div>
              </div>

              {/* Title */}

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

              {/* Email */}

              <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <Mail size={16} className="text-blue-600" />

                  <span className="max-w-60 truncate text-sm font-medium text-gray-700">
                    {email}
                  </span>
                </div>
              </div>

              {/* Back to login */}

              <Link
                to="/auth/login"
                className="
                  mt-6
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  text-sm
                  font-semibold
                  text-white
                  transition

                  hover:bg-blue-700
                "
              >
                <ArrowLeft size={17} />
                Back to Login
              </Link>

              {/* Try again */}

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-700
                "
              >
                Didn't receive the email? Try again
              </button>
            </div>
          )}
        </div>

        {/* =====================================================
            BACK TO LOGIN
        ====================================================== */}

        {!submitted && (
          <div className="mt-6 text-center">
            <Link
              to="/auth/login"
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-gray-500
                transition
                hover:text-blue-600
              "
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
