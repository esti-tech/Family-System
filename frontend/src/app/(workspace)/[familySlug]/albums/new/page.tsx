"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Layers,
  Sparkles,
  CheckCircle2,
  Plus,
  X
} from "lucide-react";

const PHOTO_OPTIONS = [
  { id: "opt-1", title: "Elias & Aster Wedding", url: "/assets/images/heritage-wedding.jpeg" },
  { id: "opt-2", title: "Traditional Buna Ceremony", url: "/assets/images/heritage-coffee.jpeg" },
  { id: "opt-3", title: "Four Generations Living Room", url: "/assets/images/hero-family.jpeg" },
  { id: "opt-4", title: "Church Registry Document", url: "/assets/images/feature-memory-archive.jpeg" },
  { id: "opt-5", title: "Timkat Street Procession", url: "/assets/images/feature-events-qr.jpeg" },
  { id: "opt-6", title: "Elders Reminiscing", url: "/assets/images/heritage-elders.jpeg" }
];

export default function CreateAlbumPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [title, setTitle] = useState("");
  const [titleAmharic, setTitleAmharic] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCover, setSelectedCover] = useState(PHOTO_OPTIONS[0].url);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([PHOTO_OPTIONS[0].id, PHOTO_OPTIONS[1].id]);
  const [allowContributions, setAllowContributions] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleSelectPhoto = (id: string) => {
    if (selectedPhotoIds.includes(id)) {
      setSelectedPhotoIds(selectedPhotoIds.filter((p) => p !== id));
    } else {
      setSelectedPhotoIds([...selectedPhotoIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push(`/${slug}/albums/gondar-ancestral-heritage`);
      }, 1000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/albums`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Create Family Album
              </h1>
              <p className="text-xs text-[#736B5E]">
                Organize memories into a curated thematic chapter of your family story
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 md:px-10">
        {isSuccess ? (
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-10 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EC] text-[#4A7C59]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold text-[#2B2B2B]">
              Album Created Successfully!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-[#736B5E]">
              &ldquo;{title}&rdquo; is now live. Redirecting to your curated album...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Album Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gondar Ancestral Homestead"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Amharic Title (የአልበሙ ስም)
                </label>
                <input
                  type="text"
                  placeholder="ለምሳሌ: የጎንደር የቀደምት አያቶች ትውስታ"
                  value={titleAmharic}
                  onChange={(e) => setTitleAmharic(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Album Description & Thematic Context
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the historical era, purpose, and significance of this collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Select Album Cover */}
            <div className="border-t border-[#EAE3D6] pt-6">
              <label className="block text-xs font-semibold text-[#2B2B2B]">
                Choose Cover Photo
              </label>
              <p className="text-[11px] text-[#736B5E]">
                Select the primary photograph representing this album
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {PHOTO_OPTIONS.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedCover(photo.url)}
                    className={`relative cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                      selectedCover === photo.url
                        ? "border-[#C18B58] shadow-md ring-2 ring-[#C18B58]/30"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="relative h-24 w-full">
                      <Image
                        src={photo.url}
                        alt={photo.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Initial Photo Selection */}
            <div className="border-t border-[#EAE3D6] pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B]">
                    Select Initial Memories ({selectedPhotoIds.length} selected)
                  </label>
                  <p className="text-[11px] text-[#736B5E]">
                    Choose photos from your vault to populate this album immediately
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {PHOTO_OPTIONS.map((photo) => {
                  const isSelected = selectedPhotoIds.includes(photo.id);
                  return (
                    <div
                      key={photo.id}
                      onClick={() => toggleSelectPhoto(photo.id)}
                      className={`group relative flex cursor-pointer items-center gap-3 rounded-2xl border p-2.5 transition ${
                        isSelected
                          ? "border-[#C18B58] bg-[#FAF5EE]"
                          : "border-[#EAE3D6] bg-white hover:bg-[#FAF8F5]"
                      }`}
                    >
                      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-[#EAE3D6]">
                        <Image
                          src={photo.url}
                          alt={photo.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-semibold text-[#2B2B2B]">
                          {photo.title}
                        </p>
                        <p className="text-[10px] text-[#C18B58]">
                          {isSelected ? "✓ Included" : "+ Tap to Add"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Permissions */}
            <div className="border-t border-[#EAE3D6] pt-6">
              <div className="flex items-start justify-between rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-4">
                <div>
                  <h4 className="text-xs font-bold text-[#2B2B2B]">
                    Allow Family Contributions
                  </h4>
                  <p className="text-[11px] text-[#736B5E]">
                    Permit other verified family members to add photos to this album
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={allowContributions}
                  onChange={(e) => setAllowContributions(e.target.checked)}
                  className="h-4 w-4 rounded text-[#C18B58] focus:ring-[#C18B58]"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between border-t border-[#EAE3D6] pt-5">
              <Link
                href={`/${slug}/albums`}
                className="rounded-xl border border-[#EAE3D6] bg-white px-4 py-2 text-xs font-semibold text-[#736B5E] hover:bg-[#FAF8F5]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Creating Album...</span>
                ) : (
                  <span>Create Album & Add Photos</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
