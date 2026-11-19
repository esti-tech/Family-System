"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState("en");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Simple password strength calculator
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setErrorMsg("Please accept the Terms of Service and Privacy Policy.");
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
        preferred_language: language,
      }),
    });

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error?.message || "Registration failed. Please check your information.");
      return;
    }

    setSuccessMsg("Account created! Redirecting to email verification...");
    setTimeout(() => {
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    }, 1500);
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-8 shadow-card rounded-2xl border border-border">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center space-x-2 lg:hidden mb-4">
          <div className="w-8 h-8 rounded-full bg-gold-500 flex items-center justify-center text-white font-serif font-bold text-base">
            K
          </div>
          <span className="font-serif font-bold text-xl text-charcoal-900">KinKeep</span>
        </Link>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
          Create Your Account
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
          Begin preserving your multi-generational family heritage.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Dawit Haile"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="dawit.haile@example.com"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
          />
        </div>

        {/* Preferred Language */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
            Preferred Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
          >
            <option value="en">English</option>
            <option value="am">Amharic (አማርኛ)</option>
            <option value="om">Oromo (Afaan Oromoo)</option>
            <option value="ti">Tigrinya (ትግርኛ)</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strength <= 1 ? "w-1/4 bg-red-500" : strength === 2 ? "w-2/4 bg-yellow-500" : strength === 3 ? "w-3/4 bg-blue-500" : "w-full bg-green-500"
                  }`}
                />
              </div>
              <p className="text-[10px] text-charcoal-700">
                {strength <= 1 && "Weak password"}
                {strength === 2 && "Fair password"}
                {strength === 3 && "Good password"}
                {strength === 4 && "Strong password"}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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

        {/* Terms Checkbox */}
        <div className="flex items-start space-x-2 pt-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-gold-600 focus:ring-gold-500"
          />
          <label htmlFor="terms" className="text-xs text-charcoal-700 leading-tight">
            I agree to the <Link href="/terms" className="text-gold-600 underline">Terms of Service</Link> and{" "}
            <Link href="/privacy" className="text-gold-600 underline">Privacy Policy</Link>.
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-70"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Create Account</span>
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center justify-between">
        <span className="w-1/5 border-b border-border" />
        <span className="text-[11px] uppercase tracking-wider text-charcoal-700">or continue with</span>
        <span className="w-1/5 border-b border-border" />
      </div>

      {/* Google Sign-in Mock Option */}
      <button
        type="button"
        className="w-full py-2.5 px-4 rounded-lg border border-border bg-white hover:bg-ivory-50 text-charcoal-800 text-xs font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
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
        <span>Sign up with Google</span>
      </button>

      {/* Switch to Login */}
      <p className="text-center text-xs text-charcoal-700 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-gold-600 hover:text-gold-700 underline">
          Login
        </Link>
      </p>
    </div>
  );
}
