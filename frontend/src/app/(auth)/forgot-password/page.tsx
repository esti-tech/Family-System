"use client";

import Link from "next/link";
import { useState } from "react";
import { KeyRound, Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
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
      setErrorMsg(res.error?.message || "Failed to process request.");
      return;
    }

    setSubmitted(true);
    if (res.data?.demo_reset_token) {
      setDemoToken(res.data.demo_reset_token);
    }
  };

  return (
    <div className="bg-white py-10 px-6 sm:px-8 shadow-card rounded-2xl border border-border text-center">
      {/* Icon */}
      <div className="w-14 h-14 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
        <KeyRound className="w-7 h-7" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
        Forgot Your Password?
      </h2>
      <p className="text-xs sm:text-sm text-charcoal-700 mt-2 max-w-sm mx-auto">
        No worries. Enter your registered email address and we&apos;ll send you instructions to reset your password.
      </p>

      {errorMsg && (
        <div className="mt-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {submitted ? (
        <div className="mt-8 space-y-6 text-left">
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs space-y-2">
            <div className="flex items-center space-x-2 font-semibold">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Reset Instructions Dispatched</span>
            </div>
            <p className="leading-relaxed">
              If an account with <span className="font-semibold">{email}</span> exists, you will receive an email shortly with a secure reset link valid for 1 hour.
            </p>
          </div>

          {demoToken && (
            <div className="p-3 bg-gold-50 border border-gold-200 rounded-lg text-xs text-gold-900">
              <span className="font-bold">Development Sandbox Link:</span>
              <div className="mt-1">
                <Link
                  href={`/reset-password?token=${demoToken}`}
                  className="text-gold-700 font-semibold underline break-all"
                >
                  Click here to simulate resetting password &rarr;
                </Link>
              </div>
            </div>
          )}

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-xs font-semibold text-gold-600 hover:text-gold-700"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Return to Login
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center space-x-2 mt-4 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Send Reset Link</span>
          </button>

          <div className="pt-4 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-xs text-charcoal-700 hover:text-charcoal-900 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
