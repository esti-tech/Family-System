"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Download,
  Share2,
  Heart,
  Edit3,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  Check,
  Volume2,
  Play,
  Pause
} from "lucide-react";

export default function MemoryDetailPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";
  const memoryId = (params?.memoryId as string) || "mem-1";

  const [isLiked, setIsLiked] = useState(true);
  const [likesCount, setLikesCount] = useState(54);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/memories`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
                <span>Memory Vault</span>
                <span>/</span>
                <span>Gondar Ancestral Heritage</span>
              </div>
              <h1 className="font-serif text-lg font-bold text-[#2B2B2B] sm:text-xl">
                Elias & Aster Wedding Portrait
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-semibold text-[#2B2B2B] hover:bg-[#EAE3D6]"
            >
              {copiedShare ? <Check className="h-4 w-4 text-[#4A7C59]" /> : <Share2 className="h-4 w-4 text-[#C18B58]" />}
              <span>{copiedShare ? "Link Copied" : "Share"}</span>
            </button>

            <Link
              href={`/${slug}/memories/${memoryId}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3D6] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
            >
              <Edit3 className="h-4 w-4 text-[#C18B58]" />
              <span>Edit Details</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Visual Frame (2 cols) */}
          <div className="space-y-4 lg:col-span-2">
            <div className="relative flex min-h-[500px] items-center justify-center overflow-hidden rounded-3xl border border-[#EAE3D6] bg-[#222222] p-4 shadow-md md:min-h-[620px]">
              <div className="relative h-full w-full">
                <Image
                  src="/assets/images/heritage-wedding.jpeg"
                  alt="Elias and Aster Wedding Portrait"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Prev / Next controls */}
              <Link
                href={`/${slug}/memories/mem-6`}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white hover:bg-black/80 transition backdrop-blur-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
              <Link
                href={`/${slug}/memories/mem-2`}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2.5 text-white hover:bg-black/80 transition backdrop-blur-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            {/* Bottom Actions under Photo */}
            <div className="flex items-center justify-between rounded-2xl border border-[#EAE3D6] bg-white px-6 py-3.5 shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${
                    isLiked ? "text-[#C18B58]" : "text-[#736B5E] hover:text-[#C18B58]"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isLiked ? "fill-[#C18B58]" : ""}`} />
                  <span>{likesCount} Loved</span>
                </button>

                <span className="text-xs text-[#EAE3D6]">|</span>

                <a
                  href="/assets/images/heritage-wedding.jpeg"
                  download="elias-aster-wedding-1968.jpeg"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#736B5E] hover:text-[#2B2B2B]"
                >
                  <Download className="h-4 w-4 text-[#C18B58]" />
                  <span>Download Original (4.2 MB)</span>
                </a>
              </div>

              <div className="text-[11px] text-[#736B5E]">
                Uploaded by Dawit Bekele on Jan 14, 2026
              </div>
            </div>
          </div>

          {/* Right Sidebar: Context & Connections */}
          <div className="space-y-6">
            {/* Memory Context Card */}
            <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
              <span className="rounded-full bg-[#FAF5EE] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#C18B58]">
                Historic Milestone
              </span>
              <h2 className="mt-3 font-serif text-xl font-bold text-[#2B2B2B]">
                Elias & Aster Wedding Portrait
              </h2>
              <p className="text-xs font-medium text-[#C18B58]">
                የኤልያስ እና አስቴር የጋብቻ ፎቶ
              </p>

              <div className="mt-5 space-y-3 text-xs text-[#736B5E]">
                <div className="flex items-start gap-2.5">
                  <Calendar className="mt-0.5 h-4 w-4 text-[#C18B58] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#2B2B2B]">September 12, 1968</p>
                    <p className="text-[11px] text-[#A89F91]">መስከረም 2, 1961 ዓ.ም (ዘመነ ማቴዎስ)</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 text-[#C18B58] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#2B2B2B]">Gondar, Fasil Ghebbi Cathedral</p>
                    <p className="text-[11px] text-[#A89F91]">Historical Imperial City, Amhara Region</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Layers className="mt-0.5 h-4 w-4 text-[#C18B58] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#2B2B2B]">Album: Gondar Ancestral Heritage</p>
                    <Link
                      href={`/${slug}/albums/gondar-ancestral-heritage`}
                      className="text-[11px] text-[#C18B58] hover:underline"
                    >
                      View all 18 photos in album &rarr;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Narrative description */}
              <div className="mt-5 border-t border-[#F2ECE1] pt-4 text-xs leading-relaxed text-[#736B5E]">
                <p>
                  Captured following the traditional holy matrimony service in Gondar. Both Elias and Aster wore handwoven royal gold-embroidered silk Kaba capes. This photograph survived the journey to Addis Ababa and was preserved by family elders for over five decades.
                </p>
              </div>
            </div>

            {/* Tagged Relatives (Interactive Tree Links) */}
            <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-[#C18B58]" />
                <h3 className="font-serif text-base font-bold text-[#2B2B2B]">
                  Tagged Family Members (2)
                </h3>
              </div>
              <p className="mt-1 text-[11px] text-[#736B5E]">
                Click any relative to view their complete genealogical profile and life story
              </p>

              <div className="mt-4 space-y-3">
                <Link
                  href={`/${slug}/tree/person/person-elias-bekele`}
                  className="flex items-center justify-between rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 transition hover:border-[#C18B58]"
                >
                  <div>
                    <p className="text-xs font-bold text-[#2B2B2B]">Elias Bekele</p>
                    <p className="text-[11px] text-[#C18B58]">Patriarch • Born 1943</p>
                  </div>
                  <span className="text-xs text-[#C18B58] font-semibold">View Profile &rarr;</span>
                </Link>

                <Link
                  href={`/${slug}/tree/person/person-aster-wolde`}
                  className="flex items-center justify-between rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 transition hover:border-[#C18B58]"
                >
                  <div>
                    <p className="text-xs font-bold text-[#2B2B2B]">Aster Wolde</p>
                    <p className="text-[11px] text-[#C18B58]">Matriarch • Born 1948</p>
                  </div>
                  <span className="text-xs text-[#C18B58] font-semibold">View Profile &rarr;</span>
                </Link>
              </div>
            </div>

            {/* Linked Oral Audio Memo */}
            <div className="rounded-3xl border border-[#C18B58]/30 bg-gradient-to-br from-[#FAF5EE] to-[#F6F1E9] p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C18B58] text-white">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#2B2B2B]">
                    Elias Recalling Wedding Day
                  </h3>
                  <p className="text-[11px] text-[#736B5E]">
                    Audio Memo (02:45) • Recorded in Debre Tabor
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C18B58] text-white shadow-sm hover:bg-[#A97544]"
                >
                  {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <div className="flex-1">
                  <div className="h-1.5 w-full rounded-full bg-[#EAE3D6] overflow-hidden">
                    <div
                      className="h-full bg-[#C18B58] transition-all duration-300"
                      style={{ width: isPlayingAudio ? "65%" : "0%" }}
                    />
                  </div>
                  <div className="mt-1 flex justify-between text-[10px] text-[#736B5E]">
                    <span>{isPlayingAudio ? "01:47" : "00:00"}</span>
                    <span>02:45</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
