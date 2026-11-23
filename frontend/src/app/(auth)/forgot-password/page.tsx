"use client";

import Link from "next/link";
import { useState } from "react";
import { KeyRound, Mail, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [demoToken, setDemoToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await apiRequest("/api/v1/auth/password-reset/request", {
      method: "POST",
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (!res.success) {
      setErrorMsg(res.error?.message || "Failed to process request. Please try again.");
      return;
    }

    setSubmitted(true);
    if (res.data?.demo_reset_token) {
      setDemoToken(res.data.demo_reset_token);
    } else {
      // In local dev, generate a mock token if none returned
      setDemoToken("demo-reset-token-12345");
    }
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-9 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-2xl border border-[#EAE3D6] text-center">
      {/* Brand Header */}
      <Link href="/" className="inline-block mb-4">
        <span className="font-serif font-bold text-2xl text-[#2B2B2B]">KinKeep</span>
      </Link>

      {/* STATE 2: CHECK YOUR EMAIL (Figma Page 22) */}
      {submitted ? (
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#F6F1E9] text-[#C18B58] flex items-center justify-center mx-auto mb-4 border border-[#EAE3D6] shadow-sm">
            <Mail className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
              Check Your Email
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 max-w-sm mx-auto font-light leading-relaxed">
              If this email is linked to a KinKeep account, we’ve sent a secure password reset link.
            </p>
          </div>

          {/* Requested Email Box */}
          <div className="p-3.5 bg-[#F6F1E9]/70 rounded-md border border-[#EAE3D6] text-left">
            <p className="text-[10px] uppercase tracking-wider text-[#7A7A7A] font-semibold mb-1">
              RESET LINK REQUESTED FOR
            </p>
            <p className="text-sm font-medium text-[#2B2B2B]">{email}</p>
          </div>

          <p className="text-xs text-[#7A7A7A] font-light">
            Check your inbox and spam folder.
          </p>

          {/* Development Sandbox Link */}
          {demoToken && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-left text-xs text-amber-900 space-y-1">
              <span className="font-bold">Development Sandbox:</span>
              <p className="text-[11px] text-amber-800">
                Email server not configured locally? Test the reset flow directly:
              </p>
              <Link
                href={`/reset-password?token=${demoToken}&email=${encodeURIComponent(email)}`}
                className="text-[#C18B58] font-semibold underline block pt-1 hover:text-[#b07d4b]"
              >
                Open Password Reset Page &rarr;
              </Link>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white font-medium text-sm transition-colors text-center inline-block shadow-sm"
            >
              Back to Login
            </Link>
            <div>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors"
              >
                Use a different email
              </button>
            </div>
          </div>

          {/* Bottom Security Note */}
          <div className="pt-6 border-t border-[#EAE3D6] text-left">
            <p className="text-[10px] uppercase tracking-wider text-[#7A7A7A] font-semibold mb-1">
              Your stories are still here.
            </p>
            <p className="text-xs text-[#5A5A5A] font-light">
              Let’s help you find your way back. For your security, your password hasn’t changed yet.
            </p>
          </div>
        </div>
      ) : (
        /* STATE 1: REQUEST FORM (Figma Page 19) */
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#F6F1E9] text-[#C18B58] flex items-center justify-center mx-auto mb-4 border border-[#EAE3D6] shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
              Forgot Your Password?
            </h2>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 max-w-sm mx-auto font-light leading-relaxed">
              We’ll send you a secure link to reset your password and return to your family’s story.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center space-x-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] focus:border-transparent bg-white transition-all"
              />
              <p className="text-[11px] text-[#7A7A7A] mt-1 font-light">
                Use the email address linked to your account.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white font-medium text-sm shadow-sm transition-all flex items-center justify-center space-x-2 disabled:opacity-70 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Send Reset Link</span>
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="text-xs text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </form>

          {/* Bottom Security Note */}
          <div className="pt-6 border-t border-[#EAE3D6] text-left">
            <p className="text-[10px] uppercase tracking-wider text-[#7A7A7A] font-semibold mb-1">
              Your stories are still here.
            </p>
            <p className="text-xs text-[#5A5A5A] font-light">
              Let’s help you find your way back. Never share your password reset link with anyone.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
