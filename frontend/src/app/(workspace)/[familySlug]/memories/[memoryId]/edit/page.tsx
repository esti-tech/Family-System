"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Save,
  X
} from "lucide-react";

export default function EditMemoryMetadataPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";
  const memoryId = (params?.memoryId as string) || "mem-1";

  // Form states
  const [title, setTitle] = useState("Elias & Aster Wedding Portrait");
  const [titleAmharic, setTitleAmharic] = useState("የኤልያስ እና አስቴር የጋብቻ ፎቶ");
  const [dateGregorian, setDateGregorian] = useState("1968-09-12");
  const [dateEthiopian, setDateEthiopian] = useState("መስከረም 2, 1961 ዓ.ም");
  const [location, setLocation] = useState("Gondar, Fasil Ghebbi Cathedral");
  const [album, setAlbum] = useState("Gondar Ancestral Heritage");
  const [description, setDescription] = useState(
    "Captured following the traditional holy matrimony service in Gondar. Both Elias and Aster wore handwoven royal gold-embroidered silk Kaba capes. This photograph survived the journey to Addis Ababa and was preserved by family elders for over five decades."
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showTrashConfirm, setShowTrashConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        router.push(`/${slug}/memories/${memoryId}`);
      }, 800);
    }, 700);
  };

  const handleTrash = () => {
    router.push(`/${slug}/memories/trash`);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/memories/${memoryId}`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Edit Memory Metadata
              </h1>
              <p className="text-xs text-[#736B5E]">
                Update dates, places, titles, or relocate to another family album
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowTrashConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#9A3B3B]/30 bg-[#FDF2F2] px-3.5 py-1.5 text-xs font-semibold text-[#9A3B3B] hover:bg-[#F9E2E2]"
          >
            <Trash2 className="h-4 w-4" />
            <span>Move to Trash</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 md:px-10">
        {saveSuccess ? (
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3EC] text-[#4A7C59]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h2 className="mt-3 font-serif text-lg font-bold text-[#2B2B2B]">
              Changes Saved!
            </h2>
            <p className="text-xs text-[#736B5E]">
              Redirecting to memory view...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Amharic Title (የማስታወሻው ስም)
                </label>
                <input
                  type="text"
                  value={titleAmharic}
                  onChange={(e) => setTitleAmharic(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Date (Gregorian)
                </label>
                <input
                  type="date"
                  value={dateGregorian}
                  onChange={(e) => setDateGregorian(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Ethiopian Calendar Reference
                </label>
                <input
                  type="text"
                  value={dateEthiopian}
                  onChange={(e) => setDateEthiopian(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Location / Landmark
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Assigned Album
                </label>
                <select
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                >
                  <option value="Gondar Ancestral Heritage">Gondar Ancestral Heritage</option>
                  <option value="Buna Rituals & Elders">Buna Rituals & Elders</option>
                  <option value="Historical Deeds & Lineage">Historical Deeds & Lineage</option>
                  <option value="Timkat Celebrations">Timkat Celebrations</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Historical Narrative & Notes
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-[#EAE3D6] pt-5">
              <Link
                href={`/${slug}/memories/${memoryId}`}
                className="rounded-xl border border-[#EAE3D6] bg-white px-4 py-2 text-xs font-semibold text-[#736B5E] hover:bg-[#FAF8F5]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#C18B58] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save Metadata"}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Trash Confirmation Modal */}
      {showTrashConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F2] text-[#9A3B3B]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-[#2B2B2B]">
              Move Memory to Trash?
            </h3>
            <p className="mt-1 text-xs text-[#736B5E]">
              This memory will be removed from your public family timeline and tree. It can be restored at any time within the next <strong>30 days</strong> from the Archive Trash.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowTrashConfirm(false)}
                className="rounded-xl border border-[#EAE3D6] px-4 py-2 text-xs font-semibold text-[#736B5E] hover:bg-[#FAF8F5]"
              >
                Keep Memory
              </button>
              <button
                type="button"
                onClick={handleTrash}
                className="rounded-xl bg-[#9A3B3B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#802E2E]"
              >
                Confirm Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
