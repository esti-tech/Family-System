"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Check,
  Eye,
  AlertCircle
} from "lucide-react";
import { apiRequest } from "@/services/api";

interface PendingSubmission {
  id: string;
  imageUrl: string;
  uploaderName: string;
  uploaderKinship: string;
  eventTitle: string;
  submittedAt: string;
  note?: string;
  status: "pending" | "approved" | "rejected";
}

const MOCK_PENDING: PendingSubmission[] = [
  {
    id: "sub-1",
    imageUrl: "/assets/images/final-cta-family.jpeg",
    uploaderName: "Abebe Tadesse",
    uploaderKinship: "In-Law (አማች)",
    eventTitle: "Bekele Family Timkat Gathering 2026",
    submittedAt: "15 minutes ago",
    note: "Relatives traveling from North America arriving in matching Netela garments.",
    status: "pending"
  },
  {
    id: "sub-2",
    imageUrl: "/assets/images/hero-family.jpeg",
    uploaderName: "Marta Hailu",
    uploaderKinship: "Lifelong Family Friend",
    eventTitle: "Bekele Family Timkat Gathering 2026",
    submittedAt: "1 hour ago",
    note: "Beautiful candid shot of the grandmothers laughing together.",
    status: "pending"
  }
];

export default function GuestPhotoModerationPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [submissions, setSubmissions] = useState<PendingSubmission[]>(MOCK_PENDING);
  const [activePreview, setActivePreview] = useState<PendingSubmission | null>(null);

  useEffect(() => {
    async function loadModerationQueue() {
      const res = await apiRequest(`/api/v1/families/by-slug/${slug}/memories/moderation/`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const live: PendingSubmission[] = res.data.map((m: any) => ({
          id: m.id,
          imageUrl: m.thumbnail_url || m.media_url || "/assets/images/final-cta-family.jpeg",
          uploaderName: m.uploader_name || "Guest Contributor",
          uploaderKinship: "Event Guest",
          eventTitle: "Event Memory Archive",
          submittedAt: new Date(m.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          note: m.description || "Captured during event celebration.",
          status: "pending"
        }));
        setSubmissions(live);
      }
    }
    loadModerationQueue();
  }, [slug]);

  const handleApprove = async (id: string) => {
    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, status: "approved" } : s))
    );
    await apiRequest(`/api/v1/families/by-slug/${slug}/memories/moderation/${id}/`, {
      method: "POST",
      body: JSON.stringify({
        action: "APPROVE",
        notes: "Approved by family moderator"
      })
    });
  };

  const handleReject = async (id: string) => {
    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, status: "rejected" } : s))
    );
    await apiRequest(`/api/v1/families/by-slug/${slug}/memories/moderation/${id}/`, {
      method: "POST",
      body: JSON.stringify({
        action: "REJECT",
        notes: "Declined by family moderator"
      })
    });
  };

  const handleApproveAll = async () => {
    setSubmissions(submissions.map((s) => ({ ...s, status: "approved" })));
    for (const sub of submissions) {
      if (sub.status === "pending") {
        await apiRequest(`/api/v1/families/by-slug/${slug}/memories/moderation/${sub.id}/`, {
          method: "POST",
          body: JSON.stringify({
            action: "APPROVE"
          })
        });
      }
    }
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/memories`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Memory Quality Safeguards</span>
              </div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Guest Upload Moderation Queue
              </h1>
            </div>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={handleApproveAll}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#4A7C59] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#3D6649]"
            >
              <Check className="h-4 w-4" />
              <span>Approve All ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
        {/* Intro Banner */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <h2 className="font-serif text-lg font-bold text-[#2B2B2B]">
            Review Submissions from QR Portals
          </h2>
          <p className="mt-1 text-xs text-[#736B5E]">
            Before guest photos appear on your living family timeline or live projector stream, workspace hosts review and verify them here.
          </p>
        </div>

        {/* Submissions List */}
        {pendingCount === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-[#D5CBB9] bg-white/70 p-12 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-[#4A7C59]" />
            <h3 className="mt-3 font-serif text-lg font-bold text-[#2B2B2B]">
              Inbox Zero! All Submissions Reviewed
            </h3>
            <p className="mt-1 text-xs text-[#736B5E]">
              Every guest photo has been moderated and added to the permanent memory vault.
            </p>
            <Link
              href={`/${slug}/memories`}
              className="mt-5 inline-block rounded-xl bg-[#C18B58] px-5 py-2 text-xs font-semibold text-white hover:bg-[#A97544]"
            >
              Return to Memory Vault
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="flex flex-col gap-5 rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div
                    onClick={() => setActivePreview(sub)}
                    className="relative h-24 w-28 flex-shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-[#EAE3D6] group"
                  >
                    <Image
                      src={sub.imageUrl}
                      alt="Pending upload"
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#2B2B2B]">
                        {sub.uploaderName}
                      </span>
                      <span className="rounded-full bg-[#FAF5EE] px-2.5 py-0.5 text-[10px] font-semibold text-[#C18B58]">
                        {sub.uploaderKinship}
                      </span>
                      <span className="text-[11px] text-[#A89F91]">
                        {sub.submittedAt}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-[#C18B58]">
                      Event: {sub.eventTitle}
                    </p>

                    {sub.note && (
                      <p className="mt-2 text-xs text-[#736B5E]">
                        &ldquo;{sub.note}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Status / Buttons */}
                <div className="flex items-center gap-3">
                  {sub.status === "approved" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4A7C59]">
                      <CheckCircle2 className="h-4 w-4" />
                      Approved & Live
                    </span>
                  ) : sub.status === "rejected" ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#9A3B3B]">
                      <XCircle className="h-4 w-4" />
                      Discarded
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleReject(sub.id)}
                        className="rounded-xl border border-[#9A3B3B]/30 bg-[#FDF2F2] px-4 py-2 text-xs font-semibold text-[#9A3B3B] hover:bg-[#F9E2E2]"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(sub.id)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#4A7C59] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#3D6649]"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve to Vault</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Preview Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] max-w-3xl overflow-hidden rounded-3xl bg-white p-4 shadow-2xl">
            <div className="relative h-96 w-full sm:h-[500px]">
              <Image
                src={activePreview.imageUrl}
                alt="Enlarged preview"
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#EAE3D6] pt-3">
              <div>
                <p className="text-xs font-bold text-[#2B2B2B]">
                  {activePreview.uploaderName} ({activePreview.uploaderKinship})
                </p>
                <p className="text-[11px] text-[#736B5E]">{activePreview.note}</p>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="rounded-xl bg-[#C18B58] px-4 py-1.5 text-xs font-semibold text-white"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
