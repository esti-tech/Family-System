"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  HardDrive,
  Users,
  CreditCard,
  CheckCircle2,
  Lock,
  Mail,
  ShieldAlert,
  Sparkles,
  Sliders
} from "lucide-react";

export default function AdminWorkspaceDetailPage() {
  const params = useParams();
  const slug = (params?.familyId as string) || "bekele-family";

  const [quota, setQuota] = useState(100);
  const [quotaSaved, setQuotaSaved] = useState(false);

  const handleUpdateQuota = (e: React.FormEvent) => {
    e.preventDefault();
    setQuotaSaved(true);
    setTimeout(() => setQuotaSaved(false), 2500);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/workspaces"
          className="rounded-lg p-1.5 text-[#736B5E] hover:bg-[#FAF8F5] hover:text-[#2B2B2B]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
            <span>Platform</span>
            <span>/</span>
            <span>Workspaces</span>
            <span>/</span>
            <span>{slug}</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2B2B]">
            The Bekele Family Archive
          </h1>
        </div>
      </div>

      <div className="mt-8 max-w-4xl space-y-8">
        {/* Workspace Overview Card */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
          <div className="flex items-center justify-between border-b border-[#F2ECE1] pb-5">
            <div>
              <p className="font-serif text-xl font-bold text-[#2B2B2B]">
                The Bekele Family Archive
              </p>
              <p className="font-mono text-xs text-[#736B5E]">slug: {slug} • Primary Owner: dawit.bekele@example.com</p>
            </div>
            <span className="rounded-full bg-[#EAF3EC] px-3.5 py-1 text-xs font-semibold text-[#4A7C59]">
              Family Plus Active
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3 text-xs">
            <div>
              <span className="text-[#736B5E]">Storage Utilization:</span>
              <p className="mt-0.5 font-serif text-base font-bold text-[#2B2B2B]">38.4 GB / {quota} GB</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-[#EAE3D6]">
                <div className="h-full bg-[#C18B58] rounded-full" style={{ width: `${(38.4 / quota) * 100}%` }} />
              </div>
            </div>

            <div>
              <span className="text-[#736B5E]">Active Relatives:</span>
              <p className="mt-0.5 font-serif text-base font-bold text-[#2B2B2B]">14 Members</p>
              <p className="text-[10px] text-[#4A7C59]">Unlimited tier</p>
            </div>

            <div>
              <span className="text-[#736B5E]">Next Renewal:</span>
              <p className="mt-0.5 font-serif text-base font-bold text-[#2B2B2B]">Jan 15, 2027</p>
              <p className="text-[10px] text-[#736B5E]">Telebirr auto-renew</p>
            </div>
          </div>
        </div>

        {/* Quota Management Controls */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
            Platform Storage Quota Override
          </h3>
          <p className="text-xs text-[#736B5E]">
            Super administrators can manually extend storage allowances for verified cultural or academic projects
          </p>

          <form onSubmit={handleUpdateQuota} className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#2B2B2B]">Storage Ceiling (GB):</span>
              <input
                type="number"
                value={quota}
                onChange={(e) => setQuota(Number(e.target.value))}
                className="w-28 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-[#C18B58] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
            >
              Update Quota
            </button>
          </form>

          {quotaSaved && (
            <p className="mt-3 text-xs font-semibold text-[#4A7C59]">
              ✓ Workspace storage allocation updated to {quota} GB!
            </p>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/users?search=${slug}`}
            className="rounded-xl border border-[#EAE3D6] bg-white px-4 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
          >
            Inspect Members
          </Link>
          <Link
            href={`/${slug}/dashboard`}
            className="rounded-xl bg-[#2B2B2B] px-4 py-2 text-xs font-semibold text-white hover:bg-black"
          >
            Visit Family Workspace &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
