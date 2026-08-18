import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
} from "lucide-react";

import { auth } from "../../../firebase/config";


const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode");

  const [status, setStatus] = useState("verifying");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    if (!oobCode) {
      setStatus("invalid");
      return;
    }

    verifyPasswordResetCode(auth, oobCode)
      .then((verifiedEmail) => {
        setEmail(verifiedEmail);
        setStatus("form");
      })
      .catch((err) => {
        console.error("Reset link verification failed:", err);
        setStatus("invalid");
      });
  }, [oobCode]);


  const friendlyError = (code) => {
    if (code === "auth/weak-password") {
      return "Password should be at least 6 characters.";
    }

    if (code === "auth/expired-action-code") {
      return "This reset link has expired. Please request a new one.";
    }

    if (code === "auth/invalid-action-code") {
      return "This reset link is invalid or has already been used.";
    }

    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);

      setStatus("success");
    } catch (err) {
      console.error("Password reset failed:", err);

      setError(friendlyError(err.code));

      if (
        err.code === "auth/expired-action-code" ||
        err.code === "auth/invalid-action-code"
      ) {
        setStatus("invalid");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

          {status === "verifying" && (
            <div className="py-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>

              <h1 className="mt-6 text-xl font-bold text-gray-900">
                Verifying your link…
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Please wait a moment.
              </p>
            </div>
          )}


          {status === "invalid" && (
            <div className="py-3 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <AlertTriangle size={30} strokeWidth={1.8} />
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
                Link expired or invalid
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                This password reset link is no longer valid. Reset links only
                work once and expire after a while — please request a new one.
              </p>

              <Link
                to="/auth/forgot-password"
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Request a new link
              </Link>

              <Link
                to="/auth/login"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          )}


          {status === "form" && (
            <>
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <KeyRound size={28} strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-6 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Set a new password
                </h1>

                <p className="mt-2 text-sm font-medium text-blue-600">
                  កំណត់ពាក្យសម្ងាត់ថ្មី
                </p>

                {email && (
                  <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-gray-500">
                    for{" "}
                    <span className="font-medium text-gray-700">{email}</span>
                  </p>
                )}
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-7 space-y-5">

                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-gray-700"
                  >
                    New password
                  </label>

                  <div className="relative mt-2">
                    <Lock
                      size={18}
                      strokeWidth={1.8}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      minLength={6}
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


                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Confirm new password
                  </label>

                  <div className="relative mt-2">
                    <Lock
                      size={18}
                      strokeWidth={1.8}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-11 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </>
          )}


          {status === "success" && (
            <div className="py-3 text-center">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={32} strokeWidth={1.8} />
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
                Password updated
              </h1>

              <p className="mt-2 text-sm font-medium text-blue-600">
                ពាក្យសម្ងាត់ត្រូវបានប្តូរដោយជោគជ័យ
              </p>

              <p className="mt-4 text-sm leading-6 text-gray-500">
                Your password has been changed. You can now log in with your new
                password.
              </p>

              <button
                type="button"
                onClick={() => navigate("/auth/login")}
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
