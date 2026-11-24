"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Sparkles,
  Search,
  Filter,
  Plus,
  Grid,
  List,
  FolderPlus,
  ShieldAlert,
  Trash2,
  Calendar,
  Users,
  MapPin,
  Tag,
  CheckCircle2,
  Download,
  Share2,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  FileText,
  Volume2,
  Film
} from "lucide-react";
import { apiRequest } from "@/services/api";

interface VaultMemory {
  id: string;
  title: string;
  titleAmharic?: string;
  type: "photo" | "document" | "audio" | "video";
  imageUrl: string;
  dateGregorian: string;
  dateEthiopian: string;
  era: "1940s-1960s" | "1970s-1990s" | "2000s-2010s" | "2020s-Present";
  location: string;
  taggedPeople: string[];
  albumName?: string;
  uploader: string;
  likesCount: number;
}

const MOCK_MEMORIES: VaultMemory[] = [
  {
    id: "mem-1",
    title: "Elias & Aster Wedding Portrait",
    titleAmharic: "የኤልያስ እና አስቴር የጋብቻ ፎቶ",
    type: "photo",
    imageUrl: "/assets/images/heritage-wedding.jpeg",
    dateGregorian: "September 12, 1968",
    dateEthiopian: "መስከረም 2, 1961 ዓ.ም",
    era: "1940s-1960s",
    location: "Gondar, Fasil Ghebbi Cathedral",
    taggedPeople: ["Elias Bekele", "Aster Wolde"],
    albumName: "Gondar Ancestral Heritage",
    uploader: "Dawit Bekele",
    likesCount: 54
  },
  {
    id: "mem-2",
    title: "Traditional Buna Ceremony in Debre Tabor",
    titleAmharic: "የቡና ቁርስ በደብረ ታቦር",
    type: "photo",
    imageUrl: "/assets/images/heritage-coffee.jpeg",
    dateGregorian: "January 19, 2024",
    dateEthiopian: "ጥር 11, 2016 ዓ.ም",
    era: "2020s-Present",
    location: "Debre Tabor, Amhara Region",
    taggedPeople: ["Aster Wolde", "Hana Mekonnen", "Selam Bekele"],
    albumName: "Buna Rituals & Elders",
    uploader: "Hana Mekonnen",
    likesCount: 38
  },
  {
    id: "mem-3",
    title: "Handwritten Family Tree & Church Parish Registry",
    titleAmharic: "የቤተሰብ የዘር ሐረግ እና የቤተክርስቲያን መዝገብ",
    type: "document",
    imageUrl: "/assets/images/feature-memory-archive.jpeg",
    dateGregorian: "May 14, 1952",
    dateEthiopian: "ግንቦት 6, 1944 ዓ.ም",
    era: "1940s-1960s",
    location: "Debre Tabor Parish",
    taggedPeople: ["Bekele Wolde-Mariam", "Elias Bekele"],
    albumName: "Historical Deeds & Lineage",
    uploader: "Elias Bekele",
    likesCount: 47
  },
  {
    id: "mem-4",
    title: "Four Generations Living Room Reunion",
    titleAmharic: "አራት ትውልዶች በአንድነት",
    type: "photo",
    imageUrl: "/assets/images/hero-family.jpeg",
    dateGregorian: "September 11, 2025",
    dateEthiopian: "መስከረም 1, 2018 ዓ.ም (እንቁጣጣሽ)",
    era: "2020s-Present",
    location: "Addis Ababa, Bole",
    taggedPeople: ["Elias Bekele", "Aster Wolde", "Dawit Bekele", "Hana Mekonnen", "Selam Bekele", "Yonas Bekele", "Meron Bekele"],
    albumName: "Timkat Celebrations",
    uploader: "Dawit Bekele",
    likesCount: 62
  },
  {
    id: "mem-5",
    title: "Elders Reminiscing Under Acacia Tree",
    titleAmharic: "የአባቶች ትውስታ በዛፍ ጥላ ሥር",
    type: "photo",
    imageUrl: "/assets/images/heritage-elders.jpeg",
    dateGregorian: "November 24, 2012",
    dateEthiopian: "ህዳር 15, 2005 ዓ.ም",
    era: "2000s-2010s",
    location: "Lake Tana, Bahir Dar",
    taggedPeople: ["Elias Bekele", "Tadesse Wolde"],
    albumName: "Gondar Ancestral Heritage",
    uploader: "Dawit Bekele",
    likesCount: 29
  },
  {
    id: "mem-6",
    title: "Arrival of Relatives in Netela Robes",
    titleAmharic: "የዘመዶች መምጣት በባህላዊ ነጠላ",
    type: "photo",
    imageUrl: "/assets/images/final-cta-family.jpeg",
    dateGregorian: "January 19, 2026",
    dateEthiopian: "ጥር 11, 2018 ዓ.ም",
    era: "2020s-Present",
    location: "Debre Tabor Pavilion",
    taggedPeople: ["Dawit Bekele", "Hana Mekonnen", "Selam Bekele"],
    albumName: "Timkat Celebrations",
    uploader: "Selam Bekele",
    likesCount: 33
  }
];

export default function FamilyMemoriesVaultPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [memories, setMemories] = useState<VaultMemory[]>(MOCK_MEMORIES);
  const [activeType, setActiveType] = useState<string>("all");
  const [selectedEra, setSelectedEra] = useState<string>("all");
  const [selectedPerson, setSelectedPerson] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    async function loadMemories() {
      const res = await apiRequest(`/api/v1/families/by-slug/${slug}/memories/`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const typeMap: Record<string, VaultMemory["type"]> = {
          PHOTO: "photo",
          DOCUMENT: "document",
          AUDIO: "audio",
          VIDEO: "video"
        };
        const live: VaultMemory[] = res.data.map((m: any) => ({
          id: m.id,
          title: m.title,
          titleAmharic: "",
          type: typeMap[m.media_type] || "photo",
          imageUrl: m.thumbnail_url || m.media_url || "/assets/images/feature-memory-archive.jpeg",
          dateGregorian: m.taken_at
            ? new Date(m.taken_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : m.taken_year
            ? `${m.taken_year}`
            : "Historic",
          dateEthiopian: "የኢትዮጵያ ዘመን",
          era: "2020s-Present",
          location: m.location_name || "Family Archive",
          taggedPeople: Array.isArray(m.linked_persons)
            ? m.linked_persons.map((p: any) => `${p.first_name} ${p.father_name || ""}`.trim())
            : [],
          uploader: m.uploader_name || "Family Archive",
          likesCount: 12
        }));
        setMemories(live);
      }
    }
    loadMemories();
  }, [slug]);

  const filteredMemories = memories.filter((m) => {
    if (activeType !== "all" && m.type !== activeType) return false;
    if (selectedEra !== "all" && m.era !== selectedEra) return false;
    if (selectedPerson !== "all" && !m.taggedPeople.includes(selectedPerson)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.title.toLowerCase().includes(q);
      const matchAmharic = m.titleAmharic?.toLowerCase().includes(q);
      const matchLoc = m.location.toLowerCase().includes(q);
      const matchPeople = m.taggedPeople.some((p) => p.toLowerCase().includes(q));
      if (!matchTitle && !matchAmharic && !matchLoc && !matchPeople) return false;
    }
    return true;
  });

  const toggleSelectMemory = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
              <Sparkles className="h-4 w-4" />
              <span>Living Family Archive</span>
            </div>
            <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
              Memory & Media Vault
            </h1>
            <p className="mt-1 text-sm text-[#736B5E]">
              Safeguard photographs, church certificates, audio memoirs, and family artifacts across generations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${slug}/albums`}
              className="inline-flex items-center gap-2 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-[#EAE3D6]"
            >
              <Layers className="h-4 w-4 text-[#C18B58]" />
              <span>Albums (4)</span>
            </Link>
            <Link
              href={`/${slug}/memories/moderation`}
              className="inline-flex items-center gap-2 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-[#EAE3D6]"
            >
              <ShieldAlert className="h-4 w-4 text-[#C18B58]" />
              <span>Review Inbox (1)</span>
            </Link>
            <Link
              href={`/${slug}/memories/upload`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
            >
              <Plus className="h-4 w-4" />
              <span>Upload Memory</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Controls Bar: Type Tabs, Eras, People, Search */}
        <div className="flex flex-col gap-4 border-b border-[#EAE3D6] pb-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Media Type Tabs */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl bg-[#EFE9DF] p-1">
            {[
              { id: "all", label: "All Media", count: MOCK_MEMORIES.length },
              { id: "photo", label: "Photos", icon: Grid },
              { id: "document", label: "Documents", icon: FileText },
              { id: "audio", label: "Audio Memos", icon: Volume2 }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                  activeType === t.id
                    ? "bg-white text-[#2B2B2B] shadow-sm"
                    : "text-[#736B5E] hover:text-[#2B2B2B]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search & Person Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A89F91]" />
              <input
                type="text"
                placeholder="Search captions, places, or people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#EAE3D6] bg-white py-2 pl-9 pr-4 text-xs text-[#2B2B2B] placeholder-[#A89F91] focus:border-[#C18B58] focus:outline-none"
              />
            </div>

            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="rounded-xl border border-[#EAE3D6] bg-white px-3 py-2 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:outline-none"
            >
              <option value="all">Tagged: All Relatives</option>
              <option value="Elias Bekele">Elias Bekele</option>
              <option value="Aster Wolde">Aster Wolde</option>
              <option value="Dawit Bekele">Dawit Bekele</option>
              <option value="Hana Mekonnen">Hana Mekonnen</option>
              <option value="Selam Bekele">Selam Bekele</option>
            </select>

            <button
              onClick={() => {
                setIsSelectMode(!isSelectMode);
                setSelectedIds([]);
              }}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                isSelectMode
                  ? "border-[#C18B58] bg-[#FAF5EE] text-[#C18B58]"
                  : "border-[#EAE3D6] bg-white text-[#736B5E] hover:bg-[#FAF8F5]"
              }`}
            >
              {isSelectMode ? "Cancel Select" : "Batch Select"}
            </button>
          </div>
        </div>

        {/* Era Filter Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#736B5E]">Historical Era:</span>
          {[
            { id: "all", label: "All Eras" },
            { id: "1940s-1960s", label: "1940s–1960s (ቀደምት ዘመን)" },
            { id: "1970s-1990s", label: "1970s–1990s" },
            { id: "2000s-2010s", label: "2000s–2010s" },
            { id: "2020s-Present", label: "2020s–Present" }
          ].map((era) => (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedEra === era.id
                  ? "bg-[#C18B58] text-white"
                  : "border border-[#EAE3D6] bg-white text-[#736B5E] hover:border-[#C18B58]"
              }`}
            >
              {era.label}
            </button>
          ))}

          <div className="ml-auto">
            <Link
              href={`/${slug}/memories/trash`}
              className="inline-flex items-center gap-1 text-xs text-[#736B5E] hover:text-[#9A3B3B]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Archive Trash</span>
            </Link>
          </div>
        </div>

        {/* Batch Selection Action Bar */}
        {isSelectMode && selectedIds.length > 0 && (
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#C18B58]/30 bg-[#FAF5EE] p-4 text-xs">
            <span className="font-semibold text-[#C18B58]">
              {selectedIds.length} item{selectedIds.length === 1 ? "" : "s"} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-xl border border-[#EAE3D6] bg-white px-3 py-1.5 font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
              >
                Add to Album...
              </button>
              <button
                type="button"
                className="rounded-xl border border-[#EAE3D6] bg-white px-3 py-1.5 font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
              >
                Download Selected
              </button>
              <button
                type="button"
                className="rounded-xl bg-[#9A3B3B] px-3 py-1.5 font-semibold text-white hover:bg-[#802E2E]"
              >
                Move to Trash
              </button>
            </div>
          </div>
        )}

        {/* Memories Gallery Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {filteredMemories.map((mem) => {
            const isSelected = selectedIds.includes(mem.id);
            return (
              <div
                key={mem.id}
                onClick={() => {
                  if (isSelectMode) toggleSelectMemory(mem.id);
                }}
                className={`group flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md ${
                  isSelected ? "border-[#C18B58] ring-2 ring-[#C18B58]/30" : "border-[#EAE3D6]"
                } ${isSelectMode ? "cursor-pointer" : ""}`}
              >
                {/* Media Image */}
                <div className="relative h-64 w-full bg-[#EAE3D6]">
                  <Image
                    src={mem.imageUrl}
                    alt={mem.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

                  {/* Badge top left */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#2B2B2B] backdrop-blur-sm">
                    {mem.type === "photo" && <span>Photo</span>}
                    {mem.type === "document" && <span>Certificate / Registry</span>}
                    {mem.type === "audio" && <span>Audio Memo</span>}
                  </div>

                  {/* Selection Checkbox */}
                  {isSelectMode && (
                    <div className="absolute right-3 top-3">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                          isSelected
                            ? "border-[#C18B58] bg-[#C18B58] text-white"
                            : "border-white bg-black/40 text-transparent"
                        }`}
                      >
                        ✓
                      </div>
                    </div>
                  )}

                  {/* Date badge bottom */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="text-[11px] font-medium text-[#F6F1E9]/90">
                      {mem.dateEthiopian}
                    </p>
                    <p className="text-xs font-semibold">{mem.dateGregorian}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5">
                  <Link
                    href={`/${slug}/memories/${mem.id}`}
                    className="block font-serif text-base font-bold text-[#2B2B2B] group-hover:text-[#C18B58] transition"
                  >
                    {mem.title}
                  </Link>
                  {mem.titleAmharic && (
                    <p className="mt-0.5 text-xs font-medium text-[#C18B58]">
                      {mem.titleAmharic}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#736B5E]">
                    <MapPin className="h-3.5 w-3.5 text-[#C18B58] flex-shrink-0" />
                    <span className="truncate">{mem.location}</span>
                  </div>

                  {/* Tagged Relatives */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {mem.taggedPeople.map((person, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-[#FAF8F5] border border-[#EAE3D6] px-2.5 py-0.5 text-[10px] font-medium text-[#736B5E]"
                      >
                        {person}
                      </span>
                    ))}
                  </div>

                  {/* Footer Meta */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#F2ECE1] pt-3 text-[11px] text-[#736B5E]">
                    <span>{mem.albumName || "Uncategorized"}</span>
                    <Link
                      href={`/${slug}/memories/${mem.id}`}
                      className="font-semibold text-[#C18B58] hover:text-[#A97544]"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
