"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { apiRequest } from "@/services/api";

export default function AccountSuspensionPage() {
  const router = useRouter();
  const params = useParams();
  const userId = (params?.userId as string) || "USR-24892";

  const isSuspended = userId === "USR-24802";
  const userName = isSuspended ? "Daniel Brooks" : "Emma Wilson";
  const userEmail = isSuspended ? "daniel.brooks@example.com" : "emma.wilson@example.com";

  const [reason, setReason] = useState("Suspected security anomaly or compromise");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const endpoint = isSuspended
      ? `/api/v1/platform-admin/users/${userId}/activate/`
      : `/api/v1/platform-admin/users/${userId}/suspend/`;

    await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify({ reason })
    });
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      router.push(`/admin/users`);
    }, 1000);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/users/${userId}`}
          className="rounded-lg p-1.5 text-[#736B5E] hover:bg-[#FAF8F5] hover:text-[#2B2B2B]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
            <span>Security & Access Controls</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2B2B]">
            {isSuspended ? "Restore Account Access" : "Suspend Account Access"}
          </h1>
        </div>
      </div>

      <div className="mt-8 max-w-xl">
        {success ? (
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3EC] text-[#4A7C59]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="mt-3 font-serif text-xl font-bold text-[#2B2B2B]">
              {isSuspended ? "Account Access Restored!" : "Account Suspended"}
            </h2>
            <p className="mt-1 text-xs text-[#736B5E]">
              Audit trail logged. Redirecting back to user details...
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF5EE] text-[#C18B58]">
              <ShieldAlert className="h-6 w-6" />
            </div>

            <h2 className="mt-4 font-serif text-xl font-bold text-[#2B2B2B]">
              {isSuspended
                ? `Reactivate ${userName}?`
                : `Suspend ${userName}?`}
            </h2>

            <p className="mt-2 text-xs leading-relaxed text-[#736B5E]">
              {isSuspended
                ? `${userName} will be able to sign in and access associated workspaces again. Existing workspace permissions and subscriptions remain unchanged.`
                : `${userName} will be signed out immediately and will not be able to access KinKeep until reactivated. This does not cancel subscriptions or delete account data.`}
            </p>

            <form onSubmit={handleAction} className="mt-6 space-y-4">
              {!isSuspended && (
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B]">
                    Reason for Suspension (Recorded in Audit Logs)
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-2.5 text-xs text-[#2B2B2B] focus:outline-none"
                  >
                    <option value="Suspected security anomaly or compromise">Suspected security anomaly or compromise</option>
                    <option value="Terms of service compliance review">Terms of service compliance review</option>
                    <option value="User initiated temporary hold">User initiated temporary hold</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4">
                <Link
                  href={`/admin/users/${userId}`}
                  className="rounded-xl border border-[#EAE3D6] px-4 py-2 text-xs font-semibold text-[#736B5E] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-xl px-5 py-2 text-xs font-semibold text-white shadow-sm transition disabled:opacity-50 ${
                    isSuspended
                      ? "bg-[#4A7C59] hover:bg-[#3D6649]"
                      : "bg-[#9A3B3B] hover:bg-[#802E2E]"
                  }`}
                >
                  {isSubmitting
                    ? "Updating Access..."
                    : isSuspended
                    ? "Confirm Reactivation"
                    : "Confirm Suspension"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
