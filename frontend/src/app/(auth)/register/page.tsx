"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Check, X } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Live Password Criteria (Figma Page 2 & 25)
  const hasMinLen = password.length >= 12;
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const strengthCount = [hasMinLen, hasUpperLower, hasNumber, hasSymbol].filter(Boolean).length;
  const strengthLabel = 
    password.length === 0 ? "Not entered" :
    strengthCount <= 2 ? "Weak" :
    strengthCount === 3 ? "Good" : "Strong";

  const strengthColor =
    password.length === 0 ? "bg-[#EAE3D6]" :
    strengthCount <= 2 ? "bg-amber-500" :
    strengthCount === 3 ? "bg-blue-500" : "bg-emerald-600";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please re-enter your password.");
      return;
    }
    if (!agreeTerms) {
      setErrorMsg("Please accept the Terms of Service and Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    const res = await apiRequest("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
      }),
    });

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error?.message || "Registration failed. This email may already be in use.");
      return;
    }

    // Redirect to Email Verification page
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-9 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-2xl border border-[#EAE3D6]">
      {/* Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-block lg:hidden mb-3">
          <span className="font-serif font-bold text-2xl text-[#2B2B2B]">KinKeep</span>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
          Create Your Account
        </h2>
        <p className="text-xs sm:text-sm text-[#5A5A5A] mt-1 font-light">
          A home for your roots. A legacy for the ones you love.
        </p>
      </div>

      <p className="text-[11px] text-[#7A7A7A] mb-4">
        All fields marked <span className="text-[#C18B58]">*</span> are required.
      </p>

      {errorMsg && (
        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
            Full name <span className="text-[#C18B58]">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Selam Bekele"
            className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] focus:border-transparent bg-white transition-all"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
            Email address <span className="text-[#C18B58]">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] focus:border-transparent bg-white transition-all"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-medium text-[#2B2B2B]">
              Password <span className="text-[#C18B58]">*</span>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] focus:border-transparent bg-white transition-all"
          />
          <p className="text-[11px] text-[#7A7A7A] mt-1">
            Use 12+ characters, including a number and symbol.
          </p>

          {/* Password Strength Checklist (Figma Style) */}
          {password.length > 0 && (
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
              Confirm password <span className="text-[#C18B58]">*</span>
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
            placeholder="Re-enter your password"
            className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] focus:border-transparent bg-white transition-all"
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-2 pt-1">
          <input
            id="terms"
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#D5C9B8] text-[#C18B58] focus:ring-[#C18B58]"
          />
          <label htmlFor="terms" className="text-xs text-[#5A5A5A] leading-normal font-light">
            I agree to the{" "}
            <Link href="/terms" className="text-[#2B2B2B] underline hover:text-[#C18B58]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#2B2B2B] underline hover:text-[#C18B58]">
              Privacy Policy
            </Link>.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Create Account</span>
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#EAE3D6]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-[#7A7A7A]">or sign up with</span>
          </div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={() => {
            alert("Google Sign-In will connect to your Google Account.");
          }}
          className="w-full py-2.5 px-4 rounded-md border border-[#D5C9B8] text-[#2B2B2B] text-xs font-medium hover:bg-[#F6F1E9] transition-colors flex items-center justify-center space-x-2.5"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Link */}
        <div className="pt-4 text-center">
          <p className="text-xs text-[#5A5A5A]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#C18B58] hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
