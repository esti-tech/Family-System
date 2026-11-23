"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Sparkles,
  Heart,
  Plus,
  Download,
  Share2,
  CheckCircle2,
  X,
  Send
} from "lucide-react";

interface GuestbookEntry {
  id: string;
  authorName: string;
  authorNameAmharic?: string;
  kinship: string;
  date: string;
  message: string;
  messageAmharic?: string;
  avatarUrl?: string;
  photoAttachment?: string;
  likesCount: number;
  isLiked?: boolean;
}

const MOCK_GUESTBOOK_ENTRIES: GuestbookEntry[] = [
  {
    id: "gb-1",
    authorName: "Abebe Tadesse",
    authorNameAmharic: "አበበ ታደሰ",
    kinship: "Son-in-Law (የልጅ ባል)",
    date: "January 19, 2026",
    message: "May this sacred Timkat gathering shower our entire household with health, unity, and divine blessing. Seeing four generations united under one roof in Debre Tabor is a miracle.",
    messageAmharic: "እንኳን ለጥምቀት በዓል በሰላም አደረሳችሁ! እግዚአብሔር አባታችንን ኤልያስን እና እናታችንን አስቴርን ረጅም ዕድሜና ጤና ይስጥልን።",
    photoAttachment: "/assets/images/heritage-wedding.jpeg",
    likesCount: 18,
    isLiked: true
  },
  {
    id: "gb-2",
    authorName: "Almaz Kebede",
    authorNameAmharic: "አልማዝ ከበደ",
    kinship: "Cousin (የአክስት ልጅ)",
    date: "January 19, 2026",
    message: "Sending love all the way from Washington DC! My heart is with every aunt, uncle, and cousin in Debre Tabor today. Thank God for KinKeep letting us share every second.",
    messageAmharic: "ከሩቅ አገር ሆኜም ልቤ ከእናንተ ጋር ነው፤ መልካም የጥምቀት በዓል ለሁላችሁም!",
    likesCount: 27,
    isLiked: false
  },
  {
    id: "gb-3",
    authorName: "Yonas Bekele",
    authorNameAmharic: "ዮናስ በቀለ",
    kinship: "Grandson",
    date: "January 19, 2026",
    message: "Grandfather's blessing during the Buna ceremony today will stay in my heart forever. We promise to preserve our roots and pass this heritage to our children.",
    likesCount: 34,
    isLiked: true
  },
  {
    id: "gb-4",
    authorName: "Marta Hailu",
    authorNameAmharic: "ማርታ ኃይሉ",
    kinship: "Lifelong Family Friend",
    date: "January 18, 2026",
    message: "The Bekele hospitality has always been unmatched. Thank you for including us in this historic family milestone.",
    photoAttachment: "/assets/images/heritage-coffee.jpeg",
    likesCount: 12,
    isLiked: false
  }
];

export default function EventGuestbookPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";
  const eventId = (params?.eventId as string) || "timkat-gathering-2026";

  const [entries, setEntries] = useState<GuestbookEntry[]>(MOCK_GUESTBOOK_ENTRIES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New entry form state
  const [name, setName] = useState("");
  const [relation, setRelation] = useState("Relative");
  const [message, setMessage] = useState("");
  const [messageAmharic, setMessageAmharic] = useState("");

  const handleToggleLike = (id: string) => {
    setEntries(
      entries.map((e) => {
        if (e.id === id) {
          const nextLiked = !e.isLiked;
          return {
            ...e,
            isLiked: nextLiked,
            likesCount: nextLiked ? e.likesCount + 1 : e.likesCount - 1
          };
        }
        return e;
      })
    );
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      authorName: name,
      kinship: relation,
      date: "Just now",
      message: message,
      messageAmharic: messageAmharic.trim() ? messageAmharic : undefined,
      likesCount: 1,
      isLiked: true
    };

    setEntries([newEntry, ...entries]);
    setName("");
    setMessage("");
    setMessageAmharic("");
    setIsModalOpen(false);
  };

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
                <BookOpen className="h-3.5 w-3.5" />
                <span>Event Guestbook</span>
              </div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Blessings & Digital Keepsake Wishes
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#C18B58] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
            >
              <Plus className="h-4 w-4" />
              <span>Sign Guestbook</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Banner Intro */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-gradient-to-r from-white via-[#FAF5EE] to-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#2B2B2B]">
                Words of Blessing for the Bekele Family
              </h2>
              <p className="mt-1 text-xs text-[#736B5E]">
                Personal messages, prayers, and celebratory notes left by family members and guests during the Timkat reunion.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-xl border border-[#EAE3D6] bg-white px-3.5 py-2 text-xs font-semibold text-[#2B2B2B]">
                {entries.length} Keepsake Entries
              </span>
            </div>
          </div>
        </div>

        {/* Guestbook Cards Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col justify-between rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#2B2B2B]">
                      {entry.authorName}
                    </h3>
                    <p className="text-[11px] font-medium text-[#C18B58]">
                      {entry.kinship}
                    </p>
                  </div>
                  <span className="text-[11px] text-[#A89F91]">{entry.date}</span>
                </div>

                {/* English Message */}
                <p className="mt-4 font-serif text-xs italic leading-relaxed text-[#2B2B2B]">
                  &ldquo;{entry.message}&rdquo;
                </p>

                {/* Amharic Message if present */}
                {entry.messageAmharic && (
                  <div className="mt-3 rounded-xl border border-[#F2ECE1] bg-[#FAF8F5] p-3 text-xs leading-relaxed text-[#736B5E]">
                    <span className="text-[10px] font-bold text-[#C18B58] block mb-1">
                      የምርቃት ቃል (Amharic Blessing):
                    </span>
                    {entry.messageAmharic}
                  </div>
                )}

                {/* Attached Photo */}
                {entry.photoAttachment && (
                  <div className="relative mt-4 h-48 w-full overflow-hidden rounded-xl bg-[#EAE3D6]">
                    <Image
                      src={entry.photoAttachment}
                      alt="Attached keepsake"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#F2ECE1] pt-3">
                <button
                  type="button"
                  onClick={() => handleToggleLike(entry.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold transition ${
                    entry.isLiked ? "text-[#C18B58]" : "text-[#736B5E] hover:text-[#C18B58]"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${entry.isLiked ? "fill-[#C18B58]" : ""}`} />
                  <span>{entry.likesCount} Loved</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] text-[#736B5E]">
                  <Sparkles className="h-3.5 w-3.5 text-[#C18B58]" />
                  <span>Permanent Keepsake</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Guestbook Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
                  Sign the Family Guestbook
                </h3>
                <p className="text-xs text-[#736B5E]">
                  Leave a permanent blessing in the Bekele Family Archive
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-[#736B5E] hover:bg-[#FAF8F5] hover:text-[#2B2B2B]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2B2B2B]">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meron Bekele"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2B2B2B]">
                  Kinship / Relationship
                </label>
                <input
                  type="text"
                  placeholder="e.g. Granddaughter (የልጅ ልጅ) or Cherished Friend"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2B2B2B]">
                  Your Blessing or Message *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share a memory, congratulation, or prayer for the gathering..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2B2B2B]">
                  Amharic Blessing (Optional - የበረከት ቃል)
                </label>
                <textarea
                  rows={2}
                  placeholder="ለምሳሌ: መልካም የጥምቀት በዓል! እግዚአብሔር ቤተሰባችንን ይባርክልን..."
                  value={messageAmharic}
                  onChange={(e) => setMessageAmharic(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[#EAE3D6] px-4 py-2 text-xs font-semibold text-[#736B5E] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#C18B58] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Blessing</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
