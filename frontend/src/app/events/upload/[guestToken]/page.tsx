"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  Heart,
  Image as ImageIcon,
  X,
  Send,
  Loader2,
  MessageSquare
} from "lucide-react";

interface UploadFileItem {
  id: string;
  name: string;
  size: string;
  previewUrl: string;
}

export default function PublicGuestUploadPage() {
  const params = useParams();
  const guestToken = (params?.guestToken as string) || "bkl-timkat-2026-x9q8";

  // Form State
  const [uploaderName, setUploaderName] = useState("");
  const [kinshipRelation, setKinshipRelation] = useState("Relative");
  const [blessingMessage, setBlessingMessage] = useState("");
  const [files, setFiles] = useState<UploadFileItem[]>([
    {
      id: "f-1",
      name: "timkat-procession-habesha-dress.jpg",
      size: "2.4 MB",
      previewUrl: "/assets/images/feature-events-qr.jpeg"
    },
    {
      id: "f-2",
      name: "elias-aster-coffee-toast.jpg",
      size: "3.1 MB",
      previewUrl: "/assets/images/heritage-coffee.jpeg"
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSimulateAddPhoto = () => {
    const newFile: UploadFileItem = {
      id: `f-${Date.now()}`,
      name: `celebration-photo-${files.length + 1}.jpg`,
      size: "2.8 MB",
      previewUrl: "/assets/images/heritage-wedding.jpeg"
    };
    setFiles([...files, newFile]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderName.trim() || files.length === 0) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Mobile-First Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-5 py-4 text-center">
        <div className="mx-auto flex max-w-lg items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C18B58] text-xs font-serif font-bold text-white">
            K
          </div>
          <span className="font-serif text-base font-bold tracking-tight text-[#2B2B2B]">
            KinKeep
          </span>
          <span className="rounded-full bg-[#FAF5EE] px-2.5 py-0.5 text-[10px] font-semibold text-[#C18B58]">
            Guest Portal
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 py-6">
        {isSubmitted ? (
          /* Success Screen */
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-8 text-center shadow-lg">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3EC] text-[#4A7C59]">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <p className="mt-4 font-serif text-xs font-semibold text-[#C18B58] uppercase tracking-wider">
              እንኳን አደረሳችሁ!
            </p>
            <h2 className="mt-1 font-serif text-2xl font-bold text-[#2B2B2B]">
              Thank You, {uploaderName}!
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#736B5E]">
              Your {files.length} photos and heartfelt blessing have been added to the <strong>Bekele Family Living Archive</strong>. The family treasures your contribution to our shared history.
            </p>

            <div className="mt-6 rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-4 text-xs text-[#736B5E]">
              <div className="flex items-center justify-center gap-1.5 font-semibold text-[#4A7C59]">
                <Sparkles className="h-4 w-4" />
                <span>Memories live on the celebration screen</span>
              </div>
              <p className="mt-1 text-[11px]">
                Your photos will appear on the venue live stream shortly!
              </p>
            </div>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setFiles([]);
                setBlessingMessage("");
              }}
              className="mt-6 w-full rounded-xl bg-[#C18B58] py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
            >
              Upload More Photos
            </button>
          </div>
        ) : (
          /* Upload Form */
          <div className="space-y-6">
            {/* Event Welcome Hero Card */}
            <div className="relative overflow-hidden rounded-3xl border border-[#EAE3D6] bg-[#343434] p-6 text-white shadow-md">
              <div className="relative z-10">
                <span className="rounded-full bg-[#C18B58] px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                  Event Memory Dropzone
                </span>
                <h1 className="mt-2 font-serif text-xl font-bold leading-tight">
                  Bekele Family Timkat Annual Gathering
                </h1>
                <p className="mt-0.5 text-xs font-medium text-[#C18B58]">
                  የጥምቀት በዓል የቤተሰብ መሰብሰቢያ
                </p>
                <p className="mt-2 text-[11px] text-[#F6F1E9]/80">
                  Debre Tabor Heritage Grounds • ጥር 11, 2018 ዓ.ም
                </p>
              </div>
              <div className="absolute -right-4 -bottom-6 h-28 w-28 rounded-full bg-[#C18B58]/20 blur-2xl" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
              {/* Guest Identity */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abebe Tadesse"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Your Connection to the Family
                </label>
                <select
                  value={kinshipRelation}
                  onChange={(e) => setKinshipRelation(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                >
                  <option value="Relative">Close Relative / Family Member (የቤተሰብ አባል)</option>
                  <option value="In-Law">In-Law (አማች)</option>
                  <option value="Friend">Cherished Family Friend (የቤተሰብ ወዳጅ)</option>
                  <option value="Neighbor">Neighbor & Community (ጎረቤት)</option>
                  <option value="Guest">Celebration Guest (እንግዳ)</option>
                </select>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Select Photos & Videos ({files.length} attached) *
                </label>
                <p className="text-[11px] text-[#736B5E]">
                  Snap a selfie, group portrait, or event video clip to share with everyone.
                </p>

                <div
                  onClick={handleSimulateAddPhoto}
                  className="mt-2.5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C18B58]/50 bg-[#FAF5EE] p-6 text-center transition hover:border-[#C18B58] hover:bg-[#F3EAD9]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#C18B58] shadow-sm">
                    <Camera className="h-6 w-6" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[#2B2B2B]">
                    Tap to Take Photo or Browse Library
                  </p>
                  <p className="mt-0.5 text-[10px] text-[#736B5E]">
                    JPG, PNG, MP4 up to 50MB
                  </p>
                </div>

                {/* File Thumbnails */}
                {files.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-2"
                      >
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#EAE3D6]">
                          <Image
                            src={file.previewUrl}
                            alt={file.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-[11px] font-medium text-[#2B2B2B]">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-[#736B5E]">{file.size}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file.id)}
                          className="rounded-full p-1 text-[#736B5E] hover:bg-white hover:text-[#9A3B3B]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Personal Blessing / Message */}
              <div>
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Add a Warm Blessing or Note for the Family
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. እንኳን ለጥምቀት በዓል በሰላም አደረሳችሁ! Wishing the entire Bekele household endless joy and health..."
                  value={blessingMessage}
                  onChange={(e) => setBlessingMessage(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading || !uploaderName.trim() || files.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C18B58] py-3 text-xs font-semibold text-white shadow-md transition hover:bg-[#A97544] disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading Memories to Family Vault...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Submit {files.length} Photo{files.length === 1 ? "" : "s"} & Wishes</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
