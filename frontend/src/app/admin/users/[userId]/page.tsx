"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Clock,
  Lock,
  ExternalLink,
  RotateCcw
} from "lucide-react";

export default function AdminUserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = (params?.userId as string) || "USR-24892";

  // Simulate user data
  const isSuspended = userId === "USR-24802";
  const userName = isSuspended ? "Daniel Brooks" : "Emma Wilson";
  const userEmail = isSuspended ? "daniel.brooks@example.com" : "emma.wilson@example.com";

  return (
    <div className="p-6 md:p-10">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/users"
          className="rounded-lg p-1.5 text-[#736B5E] hover:bg-[#FAF8F5] hover:text-[#2B2B2B]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
            <span>Platform</span>
            <span>/</span>
            <span>Users</span>
            <span>/</span>
            <span>{userId}</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2B2B]">
            {userName}
          </h1>
        </div>
      </div>

      <div className="mt-8 max-w-4xl space-y-8">
        {/* Account Info Card (Matching PDF P.3 & 4) */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-5">
            <div>
              <p className="font-serif text-xl font-bold text-[#2B2B2B]">{userName}</p>
              <p className="font-mono text-xs text-[#736B5E]">{userId} • {userEmail}</p>
            </div>

            <div>
              {isSuspended ? (
                <span className="rounded-full bg-[#FDF2F2] px-3.5 py-1 text-xs font-semibold text-[#9A3B3B]">
                  Suspended
                </span>
              ) : (
                <span className="rounded-full bg-[#EAF3EC] px-3.5 py-1 text-xs font-semibold text-[#4A7C59]">
                  Active
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-xs">
            <div>
              <span className="text-[#736B5E]">Registered:</span>
              <p className="mt-0.5 font-semibold text-[#2B2B2B]">November 17, 2026</p>
            </div>
            <div>
              <span className="text-[#736B5E]">Last Activity:</span>
              <p className="mt-0.5 font-semibold text-[#2B2B2B]">Today at 10:14 AM</p>
            </div>
            <div>
              <span className="text-[#736B5E]">Email Verification:</span>
              <p className="mt-0.5 font-semibold text-[#4A7C59]">✓ Verified via OTP</p>
            </div>
            <div>
              <span className="text-[#736B5E]">Sign-In Method:</span>
              <p className="mt-0.5 font-semibold text-[#2B2B2B]">Email & Password</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#F2ECE1] pt-6">
            <Link
              href={`/admin/users/${userId}/notice`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
            >
              <Mail className="h-4 w-4" />
              <span>Send Account Notice</span>
            </Link>

            <Link
              href={`/admin/users/${userId}/suspend`}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold transition ${
                isSuspended
                  ? "border border-[#4A7C59] bg-[#EAF3EC] text-[#4A7C59] hover:bg-[#D5EAD9]"
                  : "border border-[#9A3B3B]/40 bg-[#FDF2F2] text-[#9A3B3B] hover:bg-[#F9E2E2]"
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              <span>{isSuspended ? "Reactivate Account Access" : "Suspend Account Access"}</span>
            </Link>
          </div>
        </div>

        {/* Associated Family Workspaces */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
            Associated Family Workspaces
          </h3>
          <p className="text-xs text-[#736B5E]">
            Workspaces this user belongs to or administers
          </p>

          <div className="mt-4 divide-y divide-[#EAE3D6] rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5]">
            <div className="flex items-center justify-between p-4 text-xs">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-[#C18B58]" />
                <div>
                  <p className="font-semibold text-[#2B2B2B]">The Bekele Family Archive</p>
                  <p className="text-[11px] text-[#736B5E]">Slug: bekele-family • Role: Workspace Member</p>
                </div>
              </div>
              <span className="rounded-full bg-white px-2.5 py-0.5 font-semibold text-[#C18B58] border border-[#EAE3D6]">
                Family Plus
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
