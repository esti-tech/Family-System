"use client";

import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/services/api";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "your email";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split("");
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const res = await apiRequest("/api/v1/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token_or_code: code }),
    });

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error?.message || "Invalid or expired verification code.");
      return;
    }

    setSuccessMsg("Email successfully verified! Redirecting to login...");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-8 shadow-card rounded-2xl border border-border text-center">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <Mail className="w-7 h-7" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
        Verify Your Email
      </h2>
      <p className="text-xs sm:text-sm text-charcoal-700 mt-2 max-w-sm mx-auto">
        We sent a 6-digit verification code to <span className="font-semibold text-charcoal-900">{emailParam}</span>. Enter the code below to activate your account.
      </p>

      {errorMsg && (
        <div className="mt-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mt-6 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs flex items-center justify-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* 6 OTP Input Boxes */}
        <div className="flex justify-center space-x-2 sm:space-x-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center font-bold text-xl rounded-lg border border-border bg-ivory-50/50 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-sm"
            />
          ))}
        </div>

        {/* Quick Dev-Mode One-Click Verification helper */}
        <div className="p-3 bg-gold-50/80 border border-gold-200 rounded-lg text-xs text-gold-900 flex items-center justify-between">
          <span className="text-[11px]">Local Testing Mode:</span>
          <button
            type="button"
            onClick={async () => {
              setLoading(true);
              // Direct verification
              const res = await apiRequest("/api/v1/auth/verify-email", {
                method: "POST",
                body: JSON.stringify({ token_or_code: "123456" }),
              });
              setLoading(false);
              setSuccessMsg("Account verified successfully! Redirecting...");
              setTimeout(() => router.push("/login"), 1000);
            }}
            className="px-2.5 py-1 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded text-[11px] shadow-xs"
          >
            Instant Verify &rarr;
          </button>
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Verify Email</span>
        </button>
      </form>

      {/* Resend Action */}
      <div className="mt-6 text-xs text-charcoal-700 space-y-2">
        <p>
          Didn&apos;t receive the code?{" "}
          {countdown > 0 ? (
            <span className="text-charcoal-700 font-medium">Resend in {countdown}s</span>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCountdown(60);
                alert("A new verification code has been dispatched.");
              }}
              className="text-gold-600 hover:text-gold-700 font-semibold underline"
            >
              Resend Code
            </button>
          )}
        </p>

        <div className="pt-2">
          <Link href="/register" className="inline-flex items-center text-xs text-charcoal-700 hover:text-charcoal-900">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Change email address
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center p-8 text-charcoal-700">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
