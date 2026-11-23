"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Archive,
  BookOpen,
  HardDrive,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  Loader2,
  FileText
} from "lucide-react";

interface ExportHistoryItem {
  id: string;
  generatedDate: string;
  size: string;
  downloadExpires: string;
  status: "ready" | "processing";
  downloadUrl: string;
}

const MOCK_EXPORTS: ExportHistoryItem[] = [
  {
    id: "exp-2026-01",
    generatedDate: "January 20, 2026",
    size: "4.8 GB (ZIP)",
    downloadExpires: "Valid indefinitely on Plus",
    status: "ready",
    downloadUrl: "#"
  },
  {
    id: "exp-2025-10",
    generatedDate: "October 14, 2025",
    size: "3.2 GB (ZIP)",
    downloadExpires: "Archived",
    status: "ready",
    downloadUrl: "#"
  }
];

export default function HeritageExportPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [exportsList, setExportsList] = useState<ExportHistoryItem[]>(MOCK_EXPORTS);

  const handleStartExport = () => {
    setIsGenerating(true);
    setGenerateProgress(10);

    const interval = setInterval(() => {
      setGenerateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          const newExp: ExportHistoryItem = {
            id: `exp-${Date.now()}`,
            generatedDate: "Just now",
            size: "4.9 GB (ZIP)",
            downloadExpires: "Valid indefinitely on Plus",
            status: "ready",
            downloadUrl: "#"
          };
          setExportsList([newExp, ...exportsList]);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

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
                <span>Archive Sovereignty</span>
                <span>/</span>
                <span>Export</span>
              </div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Heritage Export & Offline Archive
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 md:px-10">
        {/* Heritage Guarantee Banner */}
        <div className="rounded-3xl border border-[#C18B58]/30 bg-gradient-to-r from-white via-[#FAF5EE] to-white p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
            <ShieldCheck className="h-4 w-4" />
            <span>The KinKeep Digital Sovereignty Guarantee</span>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-bold text-[#2B2B2B] md:text-3xl">
            Your Family History Is Forever Yours
          </h2>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#736B5E]">
            We believe no family should ever have their roots locked into a proprietary platform. Download a complete, standalone, self-contained offline archive that you can view on any computer or USB drive without internet access.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleStartExport}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544] disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Packaging Vault ({generateProgress}%)...</span>
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4" />
                  <span>Generate Complete Archive (ZIP)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* What's Included Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FAF5EE] text-[#C18B58]">
              <HardDrive className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-serif text-base font-bold text-[#2B2B2B]">
              Standalone Offline Tree
            </h4>
            <p className="mt-1 text-xs text-[#736B5E] leading-relaxed">
              Interactive HTML/JS app that runs in any browser completely offline. Navigate relationships and patronymic lineages.
            </p>
          </div>

          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF3EC] text-[#4A7C59]">
              <BookOpen className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-serif text-base font-bold text-[#2B2B2B]">
              Printable Heirloom Book
            </h4>
            <p className="mt-1 text-xs text-[#736B5E] leading-relaxed">
              Beautifully typeset multi-chapter PDF containing elder memoirs, recipes, and family tree diagrams ready for physical printing.
            </p>
          </div>

          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#2B2B2B]">
              <Archive className="h-5 w-5" />
            </div>
            <h4 className="mt-3 font-serif text-base font-bold text-[#2B2B2B]">
              Original Media & Audio
            </h4>
            <p className="mt-1 text-xs text-[#736B5E] leading-relaxed">
              Raw, untouched high-res photograph files, MP3 voice recordings, and structured JSON metadata for long-term digital preservation.
            </p>
          </div>
        </div>

        {/* Export History Table */}
        <div className="mt-10 rounded-3xl border border-[#EAE3D6] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-[#EAE3D6] px-6 py-4">
            <h3 className="font-serif text-base font-bold text-[#2B2B2B]">
              Generated Export Packages
            </h3>
            <p className="text-xs text-[#736B5E]">
              Download previous archive snapshots or generate an updated package
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#EAE3D6] bg-[#FAF8F5] font-medium text-[#736B5E]">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Package ID</th>
                  <th className="px-3 py-3.5">Generated Date</th>
                  <th className="px-3 py-3.5">Archive File Size</th>
                  <th className="px-3 py-3.5">Retention Status</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D6] text-[#2B2B2B]">
                {exportsList.map((exp) => (
                  <tr key={exp.id} className="transition hover:bg-[#FAF8F5]">
                    <td className="py-4 pl-6 pr-3 font-mono font-semibold">
                      {exp.id}
                    </td>
                    <td className="px-3 py-4 text-[#736B5E]">{exp.generatedDate}</td>
                    <td className="px-3 py-4 font-bold text-[#2B2B2B]">{exp.size}</td>
                    <td className="px-3 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EC] px-2.5 py-0.5 text-[11px] font-semibold text-[#4A7C59]">
                        <CheckCircle2 className="h-3 w-3" />
                        {exp.downloadExpires}
                      </span>
                    </td>
                    <td className="py-4 pl-3 pr-6 text-right">
                      <a
                        href={exp.downloadUrl}
                        download={`kinkeep-bekele-archive-${exp.id}.zip`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#C18B58] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download ZIP</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
