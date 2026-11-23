"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Tv,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Heart,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Filter,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface StreamMemory {
  id: string;
  imageUrl: string;
  uploaderName: string;
  uploaderKinship: string;
  timeAgo: string;
  caption?: string;
  likesCount: number;
  isLiked?: boolean;
  status: "approved" | "pending";
}

const MOCK_STREAM_MEMORIES: StreamMemory[] = [
  {
    id: "m-1",
    imageUrl: "/assets/images/feature-events-qr.jpeg",
    uploaderName: "Dawit Bekele",
    uploaderKinship: "Father / Host",
    timeAgo: "10 mins ago",
    caption: "Patriarch Elias and Matriarch Aster welcoming relatives to Debre Tabor.",
    likesCount: 24,
    isLiked: true,
    status: "approved"
  },
  {
    id: "m-2",
    imageUrl: "/assets/images/heritage-wedding.jpeg",
    uploaderName: "Selam Bekele",
    uploaderKinship: "Daughter",
    timeAgo: "22 mins ago",
    caption: "Communal Eskista celebration in radiant white Habesha Kemis!",
    likesCount: 38,
    isLiked: false,
    status: "approved"
  },
  {
    id: "m-3",
    imageUrl: "/assets/images/heritage-coffee.jpeg",
    uploaderName: "Hana Mekonnen",
    uploaderKinship: "Mother / Host",
    timeAgo: "45 mins ago",
    caption: "The first Abol round of coffee, frankincense aroma filling the room.",
    likesCount: 19,
    isLiked: true,
    status: "approved"
  },
  {
    id: "m-4",
    imageUrl: "/assets/images/hero-family.jpeg",
    uploaderName: "Yonas Bekele",
    uploaderKinship: "Son",
    timeAgo: "1 hour ago",
    caption: "Four generations seated side by side on the living room sofa.",
    likesCount: 42,
    isLiked: false,
    status: "approved"
  },
  {
    id: "m-5",
    imageUrl: "/assets/images/heritage-elders.jpeg",
    uploaderName: "Tadesse Wolde",
    uploaderKinship: "Uncle (አጎት)",
    timeAgo: "2 hours ago",
    caption: "Grandmother Aster sharing stories of childhood in Gondar.",
    likesCount: 31,
    isLiked: false,
    status: "approved"
  },
  {
    id: "m-6",
    imageUrl: "/assets/images/final-cta-family.jpeg",
    uploaderName: "Abebe Tadesse",
    uploaderKinship: "In-Law",
    timeAgo: "Just now",
    caption: "Arrival of guests from the diaspora wearing matching Netela robes.",
    likesCount: 5,
    isLiked: false,
    status: "pending"
  }
];

export default function EventMemoryStreamPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";
  const eventId = (params?.eventId as string) || "timkat-gathering-2026";

  const [memories, setMemories] = useState<StreamMemory[]>(MOCK_STREAM_MEMORIES);
  const [filterMode, setFilterMode] = useState<"all" | "approved" | "pending">("all");
  const [isFullscreenSlideshow, setIsFullscreenSlideshow] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Slideshow auto-advance
  useEffect(() => {
    if (!isFullscreenSlideshow || !isPlaying) return;
    const approvedList = memories.filter((m) => m.status === "approved");
    if (approvedList.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % approvedList.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isFullscreenSlideshow, isPlaying, memories]);

  const handleToggleLike = (id: string) => {
    setMemories(
      memories.map((m) => {
        if (m.id === id) {
          const nextLiked = !m.isLiked;
          return {
            ...m,
            isLiked: nextLiked,
            likesCount: nextLiked ? m.likesCount + 1 : m.likesCount - 1
          };
        }
        return m;
      })
    );
  };

  const handleApprove = (id: string) => {
    setMemories(
      memories.map((m) => (m.id === id ? { ...m, status: "approved" } : m))
    );
  };

  const approvedMemories = memories.filter((m) => m.status === "approved");
  const currentSlide = approvedMemories[currentSlideIndex] || approvedMemories[0];

  const displayedMemories = memories.filter((m) => {
    if (filterMode === "approved") return m.status === "approved";
    if (filterMode === "pending") return m.status === "pending";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/events/${eventId}`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Live Event Stream</span>
              </div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Celebration Memory Stream
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreenSlideshow(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#C18B58] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
            >
              <Tv className="h-4 w-4" />
              <span>Projector Slideshow</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Stream Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE3D6] pb-6">
          <div className="flex items-center gap-2 rounded-xl bg-[#EFE9DF] p-1">
            <button
              onClick={() => setFilterMode("all")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                filterMode === "all"
                  ? "bg-white text-[#2B2B2B] shadow-sm"
                  : "text-[#736B5E] hover:text-[#2B2B2B]"
              }`}
            >
              All Uploads ({memories.length})
            </button>
            <button
              onClick={() => setFilterMode("approved")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                filterMode === "approved"
                  ? "bg-white text-[#2B2B2B] shadow-sm"
                  : "text-[#736B5E] hover:text-[#2B2B2B]"
              }`}
            >
              Approved ({approvedMemories.length})
            </button>
            <button
              onClick={() => setFilterMode("pending")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                filterMode === "pending"
                  ? "bg-white text-[#2B2B2B] shadow-sm"
                  : "text-[#736B5E] hover:text-[#2B2B2B]"
              }`}
            >
              Pending Moderation (1)
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#736B5E]">
            <Clock className="h-4 w-4 text-[#C18B58]" />
            <span>Real-time refresh active</span>
          </div>
        </div>

        {/* Memories Masonry/Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedMemories.map((m) => (
            <div
              key={m.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#EAE3D6] bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Image Preview */}
              <div className="relative h-64 w-full bg-[#EAE3D6]">
                <Image
                  src={m.imageUrl}
                  alt={m.caption || "Event upload"}
                  fill
                  className="object-cover"
                />

                {m.status === "pending" && (
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-[#FAF5EE] px-2.5 py-1 text-[11px] font-semibold text-[#C18B58] shadow-sm">
                    <Clock className="h-3 w-3" />
                    <span>Pending Host Review</span>
                  </div>
                )}
              </div>

              {/* Card Meta */}
              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-[#2B2B2B]">{m.uploaderName}</p>
                    <p className="text-[11px] text-[#736B5E]">{m.uploaderKinship}</p>
                  </div>
                  <span className="text-[11px] text-[#A89F91]">{m.timeAgo}</span>
                </div>

                {m.caption && (
                  <p className="mt-2 text-xs text-[#736B5E] leading-relaxed">
                    {m.caption}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-[#F2ECE1] pt-3">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(m.id)}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${
                      m.isLiked ? "text-[#C18B58]" : "text-[#736B5E] hover:text-[#C18B58]"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${m.isLiked ? "fill-[#C18B58]" : ""}`} />
                    <span>{m.likesCount}</span>
                  </button>

                  {m.status === "pending" ? (
                    <button
                      type="button"
                      onClick={() => handleApprove(m.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#4A7C59] px-3 py-1 text-xs font-semibold text-white hover:bg-[#3D6649]"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4A7C59]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Live on Projector</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Projector Slideshow Modal */}
      {isFullscreenSlideshow && currentSlide && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
          {/* Top Projector Bar */}
          <div className="flex items-center justify-between px-8 py-5">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-[#C18B58] animate-ping" />
              <span className="font-serif text-lg font-bold">
                Bekele Family Timkat Gathering 2026 • Live Stream
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-lg bg-white/20 p-2 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setIsFullscreenSlideshow(false)}
                className="rounded-lg bg-white/20 p-2 text-white hover:bg-white/30 backdrop-blur-sm"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main Slide Photo */}
          <div className="relative flex-1">
            <Image
              src={currentSlide.imageUrl}
              alt="Live slideshow slide"
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Bottom Caption Bar */}
          <div className="bg-gradient-to-t from-black/90 to-transparent p-8 text-center">
            <p className="font-serif text-xl font-bold">{currentSlide.caption}</p>
            <p className="mt-1 text-sm text-[#C18B58]">
              Captured by {currentSlide.uploaderName} ({currentSlide.uploaderKinship}) • {currentSlide.timeAgo}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
