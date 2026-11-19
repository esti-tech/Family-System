"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Check, X } from "lucide-react";
import { apiRequest } from "@/services/api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Requirements check
  const hasMinLen = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNum = /[0-9]/.test(newPassword);
  const matches = newPassword.length > 0 && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!token) {
      setErrorMsg("Reset token is missing or has expired. Please request a new link.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await apiRequest("/api/v1/auth/password-reset/confirm", {
      method: "POST",
      body: JSON.stringify({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error?.message || "Password reset failed. The token may be expired.");
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-8 shadow-card rounded-2xl border border-border text-center">
      <div className="w-14 h-14 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <Lock className="w-7 h-7" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
        Create a New Password
      </h2>
      <p className="text-xs sm:text-sm text-charcoal-700 mt-2 max-w-sm mx-auto">
        Your new password must be secure and different from previously used passwords.
      </p>

      {errorMsg && (
        <div className="mt-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center space-x-2 text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {success ? (
        <div className="mt-8 space-y-4">
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-left">Your password has been reset successfully! Redirecting you to login...</span>
          </div>
          <Link
            href="/login"
            className="block w-full py-3 px-4 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm"
          >
            Go to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-700 hover:text-charcoal-900"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-700 hover:text-charcoal-900"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Requirements Checklist */}
          <div className="p-3 bg-ivory-50 rounded-lg border border-border text-[11px] space-y-1 text-charcoal-700">
            <div className={`flex items-center space-x-1.5 ${hasMinLen ? "text-green-600 font-medium" : ""}`}>
              {hasMinLen ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-red-500" />}
              <span>At least 8 characters long</span>
            </div>
            <div className={`flex items-center space-x-1.5 ${hasUpper ? "text-green-600 font-medium" : ""}`}>
              {hasUpper ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-red-500" />}
              <span>Contains at least one uppercase letter</span>
            </div>
            <div className={`flex items-center space-x-1.5 ${hasNum ? "text-green-600 font-medium" : ""}`}>
              {hasNum ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-red-500" />}
              <span>Contains at least one number</span>
            </div>
            <div className={`flex items-center space-x-1.5 ${matches ? "text-green-600 font-medium" : ""}`}>
              {matches ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5 text-red-500" />}
              <span>Passwords match</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Reset Password</span>
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center p-8 text-charcoal-700">Loading password reset...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
