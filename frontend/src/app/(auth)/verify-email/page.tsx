"use client";

import Link from "next/link";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Loader2, AlertCircle, CheckCircle, ShieldCheck } from "lucide-react";
import { apiRequest } from "@/services/api";

function maskEmail(email: string): string {
  const parts = email.split("@");
  if (parts.length !== 2) return "s••••.b•••••@gmail.com";
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length <= 2 ? name + "•••" : name[0] + "••••" + name[name.length - 1];
  return `${maskedName}@${domain}`;
}

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "selam.bekele@gmail.com";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [countdown, setCountdown] = useState(45);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle pasting a 6-digit code
      const pasted = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pasted.length, 5)]?.focus();
      return;
    }

    const cleanChar = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleanChar;
    setOtp(newOtp);

    // Auto-focus next input
    if (cleanChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const code = codeToVerify || otp.join("");
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

    setVerifiedSuccess(true);
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-9 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-2xl border border-[#EAE3D6] text-center">
      {/* Brand Header */}
      <Link href="/" className="inline-block mb-4">
        <span className="font-serif font-bold text-2xl text-[#2B2B2B]">KinKeep</span>
      </Link>

      {/* STATE 2: SUCCESS STATE (Figma Page 17) */}
      {verifiedSuccess ? (
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
            <CheckCircle className="w-7 h-7" />
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
              Email Verified
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 max-w-sm mx-auto font-light leading-relaxed">
              One more connection, safely kept. Your email is verified and your family’s story can begin.
            </p>
          </div>

          <div className="inline-block py-1.5 px-4 rounded-full bg-[#F6F1E9] border border-[#EAE3D6] text-xs font-mono text-[#5A5A5A]">
            {maskEmail(emailParam)}
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href="/workspaces"
              className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white font-medium text-sm transition-colors text-center inline-block shadow-sm"
            >
              Continue to KinKeep
            </Link>
            <div>
              <Link
                href="/login"
                className="text-xs font-medium text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors"
              >
                Return to Login
              </Link>
            </div>
          </div>

          {/* Security Note */}
          <div className="pt-6 border-t border-[#EAE3D6] text-left">
            <p className="text-[10px] uppercase tracking-wider text-[#7A7A7A] font-semibold mb-1">
              A LITTLE SECURITY FOR WHAT MATTERS MOST
            </p>
            <p className="text-xs text-[#5A5A5A] font-light">
              Never share your password or credentials with anyone. KinKeep will never ask for them.
            </p>
          </div>
        </div>
      ) : (
        /* STATE 1: ACTIVE OTP VERIFICATION (Figma Page 13) */
        <div className="space-y-6">
          {/* Envelope Icon */}
          <div className="w-14 h-14 rounded-full bg-[#F6F1E9] text-[#C18B58] flex items-center justify-center mx-auto mb-4 border border-[#EAE3D6] shadow-sm">
            <Mail className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
              Verify Your Email
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 max-w-sm mx-auto font-light leading-relaxed">
              We sent a verification link and a six-digit code to
            </p>
            <div className="inline-block mt-2 py-1 px-3.5 rounded-full bg-[#F6F1E9] border border-[#EAE3D6] text-xs font-mono text-[#2B2B2B]">
              {maskEmail(emailParam)}
            </div>
            <p className="text-xs text-[#7A7A7A] mt-2 font-light">
              Open the link in your email, or enter the code below.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center space-x-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-[#2B2B2B] mb-3">
                Verification code
              </label>

              {/* 6 OTP Boxes */}
              <div className="flex justify-center space-x-2 sm:space-x-2.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-11 h-13 sm:w-12 sm:h-14 text-center font-bold text-xl rounded-md border border-[#D5C9B8] bg-white text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#C18B58] focus:border-transparent shadow-xs transition-all"
                  />
                ))}
              </div>

              <p className="text-[11px] text-[#7A7A7A] mt-2 font-light">
                Codes are valid for 10 minutes.
              </p>
            </div>

            {/* Dev Mode Instant Verify Tool */}
            <div className="p-3 bg-[#F6F1E9] border border-[#EAE3D6] rounded-md text-xs text-[#5A5A5A] flex items-center justify-between">
              <span className="text-[11px] font-light">Development Bypass:</span>
              <button
                type="button"
                onClick={() => handleVerify("123456")}
                className="px-2.5 py-1 bg-[#C18B58] hover:bg-[#b07d4b] text-white font-medium rounded text-[11px] shadow-xs transition-colors"
              >
                Instant Verify &rarr;
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Verify Email</span>
            </button>
          </form>

          {/* Resend & Change Email Actions */}
          <div className="pt-2 text-xs text-[#5A5A5A] space-y-2">
            <p>
              Didn’t get the email?{" "}
              {countdown > 0 ? (
                <span className="text-[#7A7A7A] font-mono">
                  Resend Code · 00:{countdown < 10 ? `0${countdown}` : countdown}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCountdown(45);
                    alert("A fresh verification code has been dispatched to your email.");
                  }}
                  className="text-[#C18B58] hover:underline font-medium"
                >
                  Resend Code
                </button>
              )}
            </p>
            <div>
              <Link
                href="/register"
                className="text-xs text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors"
              >
                Change Email
              </Link>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="pt-6 border-t border-[#EAE3D6] text-left">
            <p className="text-[10px] uppercase tracking-wider text-[#7A7A7A] font-semibold mb-1">
              A LITTLE SECURITY FOR WHAT MATTERS MOST
            </p>
            <p className="text-xs text-[#5A5A5A] font-light">
              Never share this code. KinKeep will never ask for it.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-[#5A5A5A]">Loading verification...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
