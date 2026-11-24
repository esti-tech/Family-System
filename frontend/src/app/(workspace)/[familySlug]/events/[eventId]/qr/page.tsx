"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  QrCode,
  Download,
  Copy,
  Check,
  Printer,
  Tv,
  Share2,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { apiRequest } from "@/services/api";

export default function EventQrManagementPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";
  const eventId = (params?.eventId as string) || "timkat-gathering-2026";

  const [cardMode, setCardMode] = useState<"tent" | "slideshow">("tent");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateSuccess, setRegenerateSuccess] = useState(false);
  const [guestToken, setGuestToken] = useState("bkl-timkat-2026-x9q8");

  useEffect(() => {
    async function loadTokens() {
      const res = await apiRequest(`/api/v1/families/by-slug/${slug}/events/${eventId}/qr-tokens/`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const active = res.data.find((t: any) => t.is_active && !t.is_expired);
        if (active?.raw_token) {
          setGuestToken(active.raw_token);
        }
      }
    }
    loadTokens();
  }, [slug, eventId]);

  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const publicUploadUrl = `${origin}/events/upload/${guestToken}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUploadUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRegenerate = async () => {
    if (confirm("Regenerating the QR code will invalidate previously printed cards. Are you sure?")) {
      setIsRegenerating(true);
      const res = await apiRequest(`/api/v1/families/by-slug/${slug}/events/${eventId}/qr-tokens/`, {
        method: "POST",
        body: JSON.stringify({
          label: "Table Tent QR",
          expires_in_days: 7,
          max_uploads: 150
        })
      });
      setIsRegenerating(false);
      if (res.success && res.data?.raw_token) {
        setGuestToken(res.data.raw_token);
      }
      setRegenerateSuccess(true);
      setTimeout(() => setRegenerateSuccess(false), 3000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10 print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/events/${eventId}`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Guest QR Code & Printable Cards
              </h1>
              <p className="text-xs text-[#736B5E]">
                Allow wedding and reunion guests to upload photos without creating an account
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-semibold text-[#2B2B2B] hover:bg-[#EAE3D6]"
            >
              <Printer className="h-4 w-4 text-[#C18B58]" />
              <span>Print Card</span>
            </button>
            <Link
              href={`/events/upload/${guestToken}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#C18B58] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[#A97544]"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Preview Portal</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 md:px-10">
        {/* Format Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE3D6] pb-6 print:hidden">
          <div className="flex items-center gap-2 rounded-xl bg-[#EFE9DF] p-1">
            <button
              onClick={() => setCardMode("tent")}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                cardMode === "tent"
                  ? "bg-white text-[#2B2B2B] shadow-sm"
                  : "text-[#736B5E] hover:text-[#2B2B2B]"
              }`}
            >
              <QrCode className="h-3.5 w-3.5 text-[#C18B58]" />
              <span>Table Tent Card (Printable)</span>
            </button>
            <button
              onClick={() => setCardMode("slideshow")}
              className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition ${
                cardMode === "slideshow"
                  ? "bg-white text-[#2B2B2B] shadow-sm"
                  : "text-[#736B5E] hover:text-[#2B2B2B]"
              }`}
            >
              <Tv className="h-3.5 w-3.5 text-[#C18B58]" />
              <span>Live TV / Projector Display</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3D6] bg-white px-3 py-1.5 text-xs font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-[#4A7C59]" /> : <Copy className="h-3.5 w-3.5 text-[#C18B58]" />}
              <span>{copiedLink ? "Link Copied" : "Copy Guest Link"}</span>
            </button>

            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3D6] bg-white px-3 py-1.5 text-xs font-semibold text-[#736B5E] hover:text-[#9A3B3B] disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`} />
              <span>Reset Token</span>
            </button>
          </div>
        </div>

        {regenerateSuccess && (
          <div className="mt-4 rounded-xl bg-[#EAF3EC] p-3 text-center text-xs font-semibold text-[#4A7C59] print:hidden">
            ✓ New QR token generated successfully!
          </div>
        )}

        {/* Printable Card Area */}
        <div className="mt-8 flex justify-center">
          {cardMode === "tent" ? (
            /* Table Tent Card Preview */
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-[#C18B58]/40 bg-white p-8 text-center shadow-xl print:border-none print:shadow-none">
              {/* KinKeep Branding Badge */}
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-[#FAF5EE] px-4 py-1 text-xs font-semibold text-[#C18B58]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>KinKeep Family Archive</span>
              </div>

              {/* Title & Ethiopian Context */}
              <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-[#2B2B2B]">
                Bekele Family Timkat Gathering
              </h2>
              <p className="mt-0.5 text-xs font-medium text-[#C18B58]">
                የጥምቀት በዓል የቤተሰብ መሰብሰቢያ
              </p>
              <p className="mt-1 text-[11px] text-[#736B5E]">
                ጥር 11, 2018 ዓ.ም • Debre Tabor Heritage Grounds
              </p>

              {/* Decorative line */}
              <div className="mx-auto my-5 h-px w-24 bg-[#EAE3D6]" />

              {/* QR Code Container */}
              <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-2xl border-2 border-dashed border-[#C18B58]/50 bg-[#FAF8F5] p-4 shadow-inner">
                {/* Simulated High-Res QR SVG */}
                <svg
                  className="h-full w-full"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top-Left Corner Position Marker */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#343434" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="#FAF8F5" />
                  <rect x="13" y="13" width="10" height="10" rx="1" fill="#C18B58" />

                  {/* Top-Right Corner Position Marker */}
                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#343434" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="#FAF8F5" />
                  <rect x="77" y="13" width="10" height="10" rx="1" fill="#C18B58" />

                  {/* Bottom-Left Corner Position Marker */}
                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#343434" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="#FAF8F5" />
                  <rect x="13" y="77" width="10" height="10" rx="1" fill="#C18B58" />

                  {/* Dynamic QR Pixels */}
                  <rect x="36" y="8" width="6" height="6" fill="#343434" />
                  <rect x="46" y="8" width="6" height="6" fill="#343434" />
                  <rect x="56" y="8" width="6" height="6" fill="#343434" />
                  <rect x="36" y="18" width="6" height="6" fill="#343434" />
                  <rect x="56" y="18" width="6" height="6" fill="#C18B58" />
                  <rect x="36" y="28" width="6" height="6" fill="#343434" />
                  <rect x="46" y="28" width="6" height="6" fill="#343434" />

                  <rect x="8" y="36" width="6" height="6" fill="#343434" />
                  <rect x="18" y="36" width="6" height="6" fill="#C18B58" />
                  <rect x="28" y="36" width="6" height="6" fill="#343434" />
                  <rect x="36" y="36" width="6" height="6" fill="#343434" />
                  <rect x="46" y="36" width="8" height="8" rx="2" fill="#C18B58" />
                  <rect x="58" y="36" width="6" height="6" fill="#343434" />
                  <rect x="68" y="36" width="6" height="6" fill="#343434" />
                  <rect x="78" y="36" width="6" height="6" fill="#343434" />
                  <rect x="86" y="36" width="6" height="6" fill="#343434" />

                  <rect x="8" y="46" width="6" height="6" fill="#343434" />
                  <rect x="24" y="46" width="6" height="6" fill="#343434" />
                  <rect x="36" y="46" width="6" height="6" fill="#343434" />
                  <rect x="58" y="46" width="6" height="6" fill="#343434" />
                  <rect x="70" y="46" width="6" height="6" fill="#343434" />
                  <rect x="86" y="46" width="6" height="6" fill="#343434" />

                  <rect x="8" y="58" width="6" height="6" fill="#343434" />
                  <rect x="18" y="58" width="6" height="6" fill="#343434" />
                  <rect x="36" y="58" width="6" height="6" fill="#343434" />
                  <rect x="48" y="58" width="6" height="6" fill="#C18B58" />
                  <rect x="64" y="58" width="6" height="6" fill="#343434" />
                  <rect x="78" y="58" width="6" height="6" fill="#343434" />

                  <rect x="36" y="68" width="6" height="6" fill="#343434" />
                  <rect x="46" y="68" width="6" height="6" fill="#343434" />
                  <rect x="56" y="68" width="6" height="6" fill="#343434" />
                  <rect x="68" y="68" width="6" height="6" fill="#343434" />
                  <rect x="80" y="68" width="6" height="6" fill="#C18B58" />

                  <rect x="36" y="80" width="6" height="6" fill="#343434" />
                  <rect x="48" y="80" width="6" height="6" fill="#343434" />
                  <rect x="60" y="80" width="6" height="6" fill="#343434" />
                  <rect x="72" y="80" width="6" height="6" fill="#343434" />
                  <rect x="86" y="80" width="6" height="6" fill="#343434" />

                  {/* KinKeep Central Emblem */}
                  <circle cx="50" cy="50" r="10" fill="#FAF8F5" stroke="#C18B58" strokeWidth="2" />
                  <text
                    x="50"
                    y="54"
                    fontFamily="serif"
                    fontSize="11"
                    fontWeight="bold"
                    fill="#C18B58"
                    textAnchor="middle"
                  >
                    K
                  </text>
                </svg>
              </div>

              {/* Instructions in dual languages */}
              <div className="mt-5 space-y-1">
                <p className="font-serif text-sm font-bold text-[#2B2B2B]">
                  Point Your Phone Camera to Scan
                </p>
                <p className="text-xs font-medium text-[#C18B58]">
                  የስልክዎን ካሜራ ወደዚህ በማነጣጠር ፎቶዎችን ያጋሩ
                </p>
                <p className="text-[11px] text-[#736B5E]">
                  No app download needed. Upload celebration photos & video clips directly to our living family memory stream.
                </p>
              </div>

              {/* Footer URL for manual entry */}
              <div className="mt-5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-2 text-[10px] text-[#736B5E]">
                <span>Or visit in browser: </span>
                <span className="font-mono font-semibold text-[#2B2B2B]">
                  kinkeep.com/events/upload/{guestToken}
                </span>
              </div>
            </div>
          ) : (
            /* Slideshow / Full Screen Projector Banner */
            <div className="flex w-full flex-col items-center justify-center rounded-3xl border border-[#EAE3D6] bg-[#2B2B2B] p-12 text-center text-white shadow-2xl">
              <span className="rounded-full bg-[#C18B58] px-4 py-1 text-xs font-semibold text-white">
                Live Event Memory Stream
              </span>
              <h2 className="mt-4 font-serif text-3xl font-bold md:text-4xl">
                Bekele Family Timkat Reunion 2026
              </h2>
              <p className="mt-1 text-sm text-[#F6F1E9]/80">
                Scan now to see your photos appear live on this screen!
              </p>

              <div className="mt-8 flex h-72 w-72 items-center justify-center rounded-2xl bg-white p-6 shadow-2xl">
                <QrCode className="h-full w-full text-[#2B2B2B]" />
              </div>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  href={`/${slug}/events/${eventId}/stream`}
                  className="rounded-xl bg-[#C18B58] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#A97544]"
                >
                  Launch Fullscreen Projector Stream
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
