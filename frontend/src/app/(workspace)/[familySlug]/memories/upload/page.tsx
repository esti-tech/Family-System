"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Camera,
  FileText,
  Volume2,
  Film,
  CheckCircle2,
  X,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  Layers,
  Lock,
  Globe
} from "lucide-react";

interface StagedFile {
  id: string;
  name: string;
  size: string;
  previewUrl: string;
}

const TREE_PEOPLE = [
  "Elias Bekele (Patriarch)",
  "Aster Wolde (Matriarch)",
  "Dawit Bekele (Father)",
  "Hana Mekonnen (Mother)",
  "Selam Bekele (Daughter)",
  "Yonas Bekele (Son)",
  "Meron Bekele (Granddaughter)",
  "Tadesse Wolde (Uncle)"
];

const EXISTING_ALBUMS = [
  "Gondar Ancestral Heritage",
  "Buna Rituals & Elders",
  "Historical Deeds & Lineage",
  "Timkat Celebrations",
  "Weddings & Melse"
];

export default function UploadMemoryPage() {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [files, setFiles] = useState<StagedFile[]>([
    {
      id: "st-1",
      name: "elias-aster-vintage-wedding.jpg",
      size: "4.2 MB",
      previewUrl: "/assets/images/heritage-wedding.jpeg"
    }
  ]);

  // Form Metadata
  const [title, setTitle] = useState("");
  const [titleAmharic, setTitleAmharic] = useState("");
  const [mediaType, setMediaType] = useState<"photo" | "document" | "audio" | "video">("photo");
  const [dateGregorian, setDateGregorian] = useState("1968-09-12");
  const [dateEthiopian, setDateEthiopian] = useState("መስከረም 2, 1961 ዓ.ም");
  const [isApproximateDate, setIsApproximateDate] = useState(false);
  const [location, setLocation] = useState("Gondar, Fasil Ghebbi Cathedral");
  const [selectedPeople, setSelectedPeople] = useState<string[]>(["Elias Bekele (Patriarch)", "Aster Wolde (Matriarch)"]);
  const [selectedAlbum, setSelectedAlbum] = useState(EXISTING_ALBUMS[0]);
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"family" | "branch">("family");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSimulateAddPhoto = () => {
    const newFile: StagedFile = {
      id: `st-${Date.now()}`,
      name: `vintage-document-${files.length + 1}.jpg`,
      size: "3.5 MB",
      previewUrl: "/assets/images/feature-memory-archive.jpeg"
    };
    setFiles([...files, newFile]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const togglePerson = (person: string) => {
    if (selectedPeople.includes(person)) {
      setSelectedPeople(selectedPeople.filter((p) => p !== person));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/memories`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Upload to Memory Vault
              </h1>
              <p className="text-xs text-[#736B5E]">
                Add photographs, vintage church documents, and oral recordings to your archive
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
              Memory Preserved in Vault!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-[#736B5E]">
              &ldquo;{title || "Elias & Aster Wedding Portrait"}&rdquo; has been saved to your living family archive and linked to the tagged relatives in your family tree.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/${slug}/memories/mem-1`}
                className="rounded-xl bg-[#C18B58] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
              >
                View Memory Lightbox
              </Link>
              <Link
                href={`/${slug}/memories`}
                className="rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-5 py-2.5 text-xs font-semibold text-[#2B2B2B] hover:bg-[#EAE3D6]"
              >
                Return to Vault
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. File Upload Dropzone */}
            <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-serif text-lg font-bold text-[#2B2B2B]">
                1. Select Files to Preserve
              </h2>
              <p className="text-xs text-[#736B5E]">
                High-resolution scans of vintage photographs, certificates, or audio recordings
              </p>

              <div
                onClick={handleSimulateAddPhoto}
                className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#C18B58]/50 bg-[#FAF5EE] p-8 text-center transition hover:border-[#C18B58] hover:bg-[#F3EAD9]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#C18B58] shadow-sm">
                  <Upload className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#2B2B2B]">
                  Drag and drop files here, or click to browse
                </p>
                <p className="mt-1 text-xs text-[#736B5E]">
                  Supports PNG, JPG, TIFF, PDF, MP3, WAV up to 100MB per file
                </p>
              </div>

              {/* Uploaded Files Grid */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-[#EAE3D6]">
                          <Image
                            src={file.previewUrl}
                            alt={file.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-[#2B2B2B]">
                            {file.name}
                          </p>
                          <p className="text-[11px] text-[#736B5E]">{file.size} • Ready</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="rounded-full p-1 text-[#736B5E] hover:bg-white hover:text-[#9A3B3B]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Metadata & Historical Timeline Context */}
            <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-serif text-lg font-bold text-[#2B2B2B]">
                2. Memory Details & Timeline Context
              </h2>
              <p className="text-xs text-[#736B5E]">
                Anchor this moment in your family history with dates, locations, and descriptions
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B]">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elias & Aster Wedding in Gondar"
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
                    placeholder="ለምሳሌ: የኤልያስ እና አስቴር የሰርግ ፎቶ በጎንደር"
                    value={titleAmharic}
                    onChange={(e) => setTitleAmharic(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B]">
                    Memory Type
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                  >
                    <option value="photo">Photograph (የፎቶ ማስታወሻ)</option>
                    <option value="document">Historical Document / Church Deed (የሰነድ ማስታወሻ)</option>
                    <option value="audio">Voice Recording / Oral Memo (የድምፅ ቅጂ)</option>
                    <option value="video">Video Clip (የቪዲዮ ማስታወሻ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B2B2B]">
                    Location / Place Taken
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gondar, Fasil Ghebbi Cathedral"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
                    Ethiopian Calendar Equivalent
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. መስከረም 2, 1961 ዓ.ም"
                    value={dateEthiopian}
                    onChange={(e) => setDateEthiopian(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-[#2B2B2B]">
                    Story Behind This Memory
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe what occurred, who was present, and what makes this moment precious..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Tag People & Assign Album */}
            <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
              <h2 className="font-serif text-lg font-bold text-[#2B2B2B]">
                3. Tag Relatives & Curate Album
              </h2>
              <p className="text-xs text-[#736B5E]">
                Connecting relatives to this memory will automatically showcase it on their individual Family Tree profiles
              </p>

              {/* People Tagging */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Tag Family Members in Photo ({selectedPeople.length} tagged)
                </label>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {TREE_PEOPLE.map((person) => {
                    const isSelected = selectedPeople.includes(person);
                    return (
                      <button
                        key={person}
                        type="button"
                        onClick={() => togglePerson(person)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                          isSelected
                            ? "bg-[#C18B58] text-white"
                            : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#2B2B2B] hover:border-[#C18B58]"
                        }`}
                      >
                        {isSelected && "✓ "}
                        {person}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Album Selection */}
              <div className="mt-6 border-t border-[#EAE3D6] pt-5">
                <label className="block text-xs font-semibold text-[#2B2B2B]">
                  Assign to Curated Album
                </label>
                <select
                  value={selectedAlbum}
                  onChange={(e) => setSelectedAlbum(e.target.value)}
                  className="mt-1.5 w-full max-w-md rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
                >
                  {EXISTING_ALBUMS.map((alb) => (
                    <option key={alb} value={alb}>
                      {alb}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between">
              <Link
                href={`/${slug}/memories`}
                className="rounded-xl border border-[#EAE3D6] bg-white px-5 py-2.5 text-xs font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting || files.length === 0}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Saving to Living Archive...</span>
                ) : (
                  <span>Preserve in Memory Vault</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
