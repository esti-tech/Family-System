"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Trash2,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Info
} from "lucide-react";

interface TrashedItem {
  id: string;
  title: string;
  type: string;
  imageUrl: string;
  deletedAt: string;
  daysRemaining: number;
}

const MOCK_TRASH: TrashedItem[] = [
  {
    id: "tr-1",
    title: "Blurry reception duplicate snapshot",
    type: "photo",
    imageUrl: "/assets/images/heritage-wedding.jpeg",
    deletedAt: "3 days ago",
    daysRemaining: 27
  },
  {
    id: "tr-2",
    title: "Duplicate parish baptism draft",
    type: "document",
    imageUrl: "/assets/images/feature-memory-archive.jpeg",
    deletedAt: "12 days ago",
    daysRemaining: 18
  }
];

export default function ArchiveTrashPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [trashItems, setTrashItems] = useState<TrashedItem[]>(MOCK_TRASH);
  const [showEmptyConfirm, setShowEmptyConfirm] = useState(false);
  const [restoredId, setRestoredId] = useState<string | null>(null);

  const handleRestore = (id: string) => {
    setRestoredId(id);
    setTimeout(() => {
      setTrashItems(trashItems.filter((item) => item.id !== id));
      setRestoredId(null);
    }, 600);
  };

  const handlePermanentDelete = (id: string) => {
    setTrashItems(trashItems.filter((item) => item.id !== id));
  };

  const handleEmptyTrash = () => {
    setTrashItems([]);
    setShowEmptyConfirm(false);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/memories`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9A3B3B]">
                <Trash2 className="h-3.5 w-3.5" />
                <span>Archive Trash & Retention</span>
              </div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Archive Trash ({trashItems.length})
              </h1>
            </div>
          </div>

          {trashItems.length > 0 && (
            <button
              onClick={() => setShowEmptyConfirm(true)}
              className="rounded-xl border border-[#9A3B3B]/30 bg-[#FDF2F2] px-4 py-2 text-xs font-semibold text-[#9A3B3B] hover:bg-[#F9E2E2]"
            >
              Empty Trash Now
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 md:px-10">
        {/* Retention Policy Banner */}
        <div className="flex items-start gap-3 rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <Info className="mt-0.5 h-5 w-5 text-[#C18B58] flex-shrink-0" />
          <div className="text-xs text-[#736B5E] leading-relaxed">
            <p className="font-semibold text-[#2B2B2B]">
              30-Day Recovery Guarantee
            </p>
            <p className="mt-1">
              Items moved to the trash remain recoverable for 30 days before being permanently purged from storage. Restoring an item immediately reconnects it to its previous family tree profiles, events, and albums.
            </p>
          </div>
        </div>

        {/* Trash Content */}
        {trashItems.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-[#D5CBB9] bg-white/70 p-12 text-center">
            <Trash2 className="mx-auto h-12 w-12 text-[#A89F91]" />
            <h3 className="mt-3 font-serif text-lg font-bold text-[#2B2B2B]">
              Trash is Empty
            </h3>
            <p className="mt-1 text-xs text-[#736B5E]">
              No deleted memories or certificates pending retention purge.
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
            {trashItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-[#EAE3D6]">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover opacity-75"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-[#2B2B2B]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#736B5E]">
                      Deleted {item.deletedAt} •{" "}
                      <span className="font-semibold text-[#9A3B3B]">
                        {item.daysRemaining} days left before purge
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRestore(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#4A7C59]/40 bg-[#EAF3EC] px-4 py-2 text-xs font-semibold text-[#4A7C59] hover:bg-[#DCEDE0]"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Restore to Vault</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePermanentDelete(item.id)}
                    className="rounded-xl p-2 text-[#736B5E] hover:bg-[#FDF2F2] hover:text-[#9A3B3B]"
                    title="Delete permanently"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Empty Trash Confirmation Modal */}
      {showEmptyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F2] text-[#9A3B3B]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-[#2B2B2B]">
              Permanently Empty Trash?
            </h3>
            <p className="mt-1 text-xs text-[#736B5E]">
              This will permanently delete all {trashItems.length} items from your family storage. This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEmptyConfirm(false)}
                className="rounded-xl border border-[#EAE3D6] px-4 py-2 text-xs font-semibold text-[#736B5E] hover:bg-[#FAF8F5]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEmptyTrash}
                className="rounded-xl bg-[#9A3B3B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#802E2E]"
              >
                Yes, Empty Trash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
