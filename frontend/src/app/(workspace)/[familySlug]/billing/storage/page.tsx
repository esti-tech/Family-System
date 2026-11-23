"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  HardDrive,
  Camera,
  Volume2,
  FileText,
  Film,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function StorageAllocationPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [purchasedAddon, setPurchasedAddon] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/billing`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
                <span>Billing & Vault</span>
                <span>/</span>
                <span>Quotas</span>
              </div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Vault Storage Allocation
              </h1>
            </div>
          </div>

          <Link
            href={`/${slug}/memories/upload`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#C18B58] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Memory</span>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 md:px-10">
        {/* Main Storage Gauge Card */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-semibold text-[#736B5E]">
                Total Vault Utilization
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-[#2B2B2B]">
                38.4 GB <span className="text-base font-normal text-[#736B5E]">used of 100 GB</span>
              </h2>
            </div>
            <span className="w-fit rounded-full bg-[#EAF3EC] px-3.5 py-1 text-xs font-bold text-[#4A7C59]">
              61.6 GB Remaining Free
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="mt-6">
            <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-[#EAE3D6]">
              <div className="bg-[#C18B58]" style={{ width: "24.2%" }} title="Photos: 24.2 GB" />
              <div className="bg-[#4A7C59]" style={{ width: "8.1%" }} title="Audio: 8.1 GB" />
              <div className="bg-[#7B5E7B]" style={{ width: "4.6%" }} title="Documents: 4.6 GB" />
              <div className="bg-[#B8860B]" style={{ width: "1.5%" }} title="Video: 1.5 GB" />
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-[#736B5E]">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#C18B58]" />
                <span>Photographs (24.2 GB)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#4A7C59]" />
                <span>Audio Memoirs (8.1 GB)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#7B5E7B]" />
                <span>Church Registries (4.6 GB)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#B8860B]" />
                <span>Videos & Streams (1.5 GB)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Media Breakdown Cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FAF5EE] text-[#C18B58]">
              <Camera className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-serif text-base font-bold text-[#2B2B2B]">
              Photographs
            </h4>
            <p className="mt-1 text-xs text-[#736B5E]">
              142 high-resolution scans and portraits
            </p>
            <p className="mt-3 font-serif text-lg font-bold text-[#C18B58]">
              24.2 GB
            </p>
          </div>

          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF3EC] text-[#4A7C59]">
              <Volume2 className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-serif text-base font-bold text-[#2B2B2B]">
              Audio Memoirs
            </h4>
            <p className="mt-1 text-xs text-[#736B5E]">
              28 oral voice recordings & elder interviews
            </p>
            <p className="mt-3 font-serif text-lg font-bold text-[#4A7C59]">
              8.1 GB
            </p>
          </div>

          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F6EEF6] text-[#7B5E7B]">
              <FileText className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-serif text-base font-bold text-[#2B2B2B]">
              Certificates & Deeds
            </h4>
            <p className="mt-1 text-xs text-[#736B5E]">
              19 parish registries & baptism deeds
            </p>
            <p className="mt-3 font-serif text-lg font-bold text-[#7B5E7B]">
              4.6 GB
            </p>
          </div>

          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FAF5EE] text-[#B8860B]">
              <Film className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-serif text-base font-bold text-[#2B2B2B]">
              Celebration Videos
            </h4>
            <p className="mt-1 text-xs text-[#736B5E]">
              6 wedding and reunion video clips
            </p>
            <p className="mt-3 font-serif text-lg font-bold text-[#B8860B]">
              1.5 GB
            </p>
          </div>
        </div>

        {/* Storage Add-on Expansions */}
        <div className="mt-10 rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
          <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
            Need More Storage Space?
          </h3>
          <p className="text-xs text-[#736B5E]">
            Add extra permanent storage to your existing family plan without changing tier
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-5">
              <div>
                <h4 className="font-serif text-base font-bold text-[#2B2B2B]">
                  +50 GB Storage Boost
                </h4>
                <p className="text-xs text-[#736B5E]">
                  $2.99 / mo or 350 ETB / mo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPurchasedAddon(true)}
                className="rounded-xl bg-[#C18B58] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A97544]"
              >
                Add 50 GB
              </button>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-5">
              <div>
                <h4 className="font-serif text-base font-bold text-[#2B2B2B]">
                  +200 GB Archival Boost
                </h4>
                <p className="text-xs text-[#736B5E]">
                  $7.99 / mo or 950 ETB / mo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPurchasedAddon(true)}
                className="rounded-xl bg-[#C18B58] px-4 py-2 text-xs font-semibold text-white hover:bg-[#A97544]"
              >
                Add 200 GB
              </button>
            </div>
          </div>

          {purchasedAddon && (
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#EAF3EC] p-3 text-xs font-semibold text-[#4A7C59]">
              <CheckCircle2 className="h-4 w-4" />
              <span>Storage expansion added! Your quota has been updated.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
