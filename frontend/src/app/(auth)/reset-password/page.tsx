"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Loader2, AlertCircle, CheckCircle, Check, AlertTriangle } from "lucide-react";
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
  const [resetSuccess, setResetSuccess] = useState(false);
  const [linkExpired, setLinkExpired] = useState(!token);

  // Live Criteria Checklist (Figma Page 25)
  const hasMinLen = newPassword.length >= 12;
  const hasUpperLower = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(newPassword);

  const strengthCount = [hasMinLen, hasUpperLower, hasNumber, hasSymbol].filter(Boolean).length;
  const strengthLabel = 
    newPassword.length === 0 ? "Not entered" :
    strengthCount <= 2 ? "Weak" :
    strengthCount === 3 ? "Good" : "Strong";

  const strengthColor =
    newPassword.length === 0 ? "bg-[#EAE3D6]" :
    strengthCount <= 2 ? "bg-amber-500" :
    strengthCount === 3 ? "bg-blue-500" : "bg-emerald-600";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (strengthCount < 3) {
      setErrorMsg("Please choose a stronger password meeting the requirements.");
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
      if (res.error?.code === "TOKEN_INVALID" || res.error?.code === "INVALID_RESET_TOKEN") {
        setLinkExpired(true);
        return;
      }
      setErrorMsg(res.error?.message || "Password reset failed. Please request a fresh link.");
      return;
    }

    setResetSuccess(true);
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-9 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-2xl border border-[#EAE3D6] text-center">
      {/* Brand Header */}
      <Link href="/" className="inline-block mb-4">
        <span className="font-serif font-bold text-2xl text-[#2B2B2B]">KinKeep</span>
      </Link>

      {/* STATE 3: SUCCESS STATE (Figma Page 30) */}
      {resetSuccess ? (
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
            <CheckCircle className="w-7 h-7" />
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
              Password Reset
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 max-w-sm mx-auto font-light leading-relaxed">
              Your KinKeep password has been reset successfully. Sign in with your new password to return to your family’s story.
            </p>
          </div>

          <div className="p-3 bg-[#F6F1E9] rounded-md border border-[#EAE3D6] text-xs font-medium text-[#2B2B2B]">
            Your new password is ready.
          </div>

          <Link
            href="/login"
            className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white font-medium text-sm transition-colors text-center inline-block shadow-sm"
          >
            Go to Login
          </Link>

          <div className="pt-6 border-t border-[#EAE3D6] text-left">
            <p className="text-xs text-[#7A7A7A] font-light">
              Your previous reset link can no longer be used.
            </p>
          </div>
        </div>
      ) : linkExpired ? (
        /* STATE 2: LINK EXPIRED / INVALID (Figma Page 28) */
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200 shadow-sm">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
              Reset Link Unavailable
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 max-w-sm mx-auto font-light leading-relaxed">
              This reset link is invalid, expired, or has already been used. Request a fresh link to create your new password.
            </p>
          </div>

          <div className="p-3.5 bg-[#F6F1E9]/70 rounded-md border border-[#EAE3D6] text-left">
            <p className="text-xs text-[#5A5A5A]">
              Your current password has not been changed.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/forgot-password"
              className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white font-medium text-sm transition-colors text-center inline-block shadow-sm"
            >
              Request a New Reset Link
            </Link>
            <div>
              <Link
                href="/login"
                className="text-xs text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EAE3D6] text-left">
            <p className="text-[10px] uppercase tracking-wider text-[#7A7A7A] font-semibold mb-1">
              HELPFUL TIP
            </p>
            <p className="text-xs text-[#5A5A5A] font-light">
              Use the reset link in your most recent KinKeep email.
            </p>
          </div>
        </div>
      ) : (
        /* STATE 1: ACTIVE FORM (Figma Page 25) */
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#F6F1E9] text-[#C18B58] flex items-center justify-center mx-auto mb-4 border border-[#EAE3D6] shadow-sm">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
              Create a New Password
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 max-w-sm mx-auto font-light leading-relaxed">
              Choose a strong password you haven’t used before. This will replace your current KinKeep password.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center space-x-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {/* New Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-[#2B2B2B]">
                  New Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] font-medium"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter a new password"
                className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] focus:border-transparent bg-white transition-all"
              />

              {/* Password Strength Checklist */}
              {newPassword.length > 0 && (
                <div className="mt-3 p-3 bg-[#F6F1E9]/80 rounded-md border border-[#EAE3D6] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#5A5A5A]">Password strength:</span>
                    <span className="font-medium text-[#2B2B2B]">{strengthLabel}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#EAE3D6] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strengthColor} transition-all duration-300`}
                      style={{ width: `${(strengthCount / 4) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider text-[#7A7A7A] font-semibold pt-1">
                    YOUR PASSWORD MUST INCLUDE
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#5A5A5A]">
                    <div className="flex items-center space-x-1.5">
                      {hasMinLen ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#9A9A9A] ml-1 mr-1" />}
                      <span>At least 12 characters</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {hasUpperLower ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#9A9A9A] ml-1 mr-1" />}
                      <span>Upper & lowercase</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#9A9A9A] ml-1 mr-1" />}
                      <span>At least one number</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {hasSymbol ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#9A9A9A] ml-1 mr-1" />}
                      <span>At least one symbol</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-[#2B2B2B]">
                  Confirm Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] font-medium"
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] focus:border-transparent bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Reset Password</span>
            </button>
          </form>

          {/* Bottom Security Note */}
          <div className="pt-6 border-t border-[#EAE3D6] text-left">
            <p className="text-xs text-[#7A7A7A] font-light">
              For your security, each reset link can only be used once.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#5A5A5A]">Loading reset form...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
