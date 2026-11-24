"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Layers,
  Plus,
  Search,
  Sparkles,
  Calendar,
  Users,
  ChevronRight,
  ArrowLeft,
  FolderOpen
} from "lucide-react";
import { apiRequest } from "@/services/api";

interface AlbumItem {
  id: string;
  title: string;
  titleAmharic?: string;
  coverImage: string;
  itemCount: number;
  dateRange: string;
  description: string;
  creator: string;
}

const MOCK_ALBUMS: AlbumItem[] = [
  {
    id: "gondar-ancestral-heritage",
    title: "Gondar Ancestral Heritage",
    titleAmharic: "የጎንደር የቀደምት አያቶች ታሪክ",
    coverImage: "/assets/images/heritage-elders.jpeg",
    itemCount: 18,
    dateRange: "1943 – 1975",
    description: "Photographs, homestead memories, and pastoral life in Gondar and Lake Tana.",
    creator: "Elias Bekele"
  },
  {
    id: "buna-rituals-and-elders",
    title: "Buna Rituals & Elders",
    titleAmharic: "የቡና ቁርስ እና የአባቶች ምርቃት",
    coverImage: "/assets/images/heritage-coffee.jpeg",
    itemCount: 14,
    dateRange: "1980 – Present",
    description: "Generational coffee ceremonies, elder wisdom, and frankincense blessings.",
    creator: "Aster Wolde"
  },
  {
    id: "historical-deeds-and-lineage",
    title: "Historical Deeds & Lineage",
    titleAmharic: "የቤተሰብ ሰነዶች እና የዘር ሐረግ",
    coverImage: "/assets/images/feature-memory-archive.jpeg",
    itemCount: 9,
    dateRange: "1952 – 1990",
    description: "Church parish birth registries, baptism certificates, and land heritage deeds.",
    creator: "Dawit Bekele"
  },
  {
    id: "timkat-celebrations",
    title: "Timkat Annual Celebrations",
    titleAmharic: "የጥምቀት በዓል የትውልዶች ትውስታ",
    coverImage: "/assets/images/feature-events-qr.jpeg",
    itemCount: 42,
    dateRange: "2010 – 2026",
    description: "Sacred white Habesha Kemis, family feasts, and joyous street processions in Debre Tabor.",
    creator: "Hana Mekonnen"
  },
  {
    id: "weddings-and-melse",
    title: "Weddings & Melse Celebrations",
    titleAmharic: "የሰርግ እና መልስ ድግሶች",
    coverImage: "/assets/images/heritage-wedding.jpeg",
    itemCount: 28,
    dateRange: "1968 – 2026",
    description: "Holy matrimony portraits, Kaba crowning rites, and joyful Eskista gatherings.",
    creator: "Selam Bekele"
  }
];

export default function FamilyAlbumsPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [albums, setAlbums] = useState<AlbumItem[]>(MOCK_ALBUMS);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadAlbums() {
      const res = await apiRequest(`/api/v1/families/by-slug/${slug}/albums/`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const live: AlbumItem[] = res.data.map((a: any) => ({
          id: a.slug || a.id,
          title: a.title,
          titleAmharic: a.title_amharic || "",
          coverImage: a.cover_image_url || "/assets/images/heritage-elders.jpeg",
          itemCount: a.memory_count || 0,
          dateRange: "Archive Collection",
          description: a.description || "",
          creator: a.created_by_name || "Family Editor"
        }));
        setAlbums(live);
      }
    }
    loadAlbums();
  }, [slug]);

  const filteredAlbums = albums.filter((alb) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      alb.title.toLowerCase().includes(q) ||
      alb.titleAmharic?.toLowerCase().includes(q) ||
      alb.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/memories`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
                <Layers className="h-4 w-4" />
                <span>Curated Collections</span>
              </div>
              <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
                Family Albums
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/albums/new`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Album</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Search Bar */}
        <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-6">
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#A89F91]" />
            <input
              type="text"
              placeholder="Search albums by name, era, or tradition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#EAE3D6] bg-white py-2 pl-10 pr-4 text-xs text-[#2B2B2B] placeholder-[#A89F91] focus:border-[#C18B58] focus:outline-none"
            />
          </div>

          <span className="text-xs font-medium text-[#736B5E]">
            {filteredAlbums.length} Curated Albums
          </span>
        </div>

        {/* Albums Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAlbums.map((album) => (
            <Link
              key={album.id}
              href={`/${slug}/albums/${album.id}`}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[#EAE3D6] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Cover Photo */}
              <div className="relative h-56 w-full bg-[#EAE3D6]">
                <Image
                  src={album.coverImage}
                  alt={album.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badge top right */}
                <div className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#2B2B2B] shadow-sm backdrop-blur-sm">
                  <span>{album.itemCount} items</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <p className="text-[11px] font-medium text-[#F6F1E9]/90">
                    {album.dateRange}
                  </p>
                  <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-[#F6F1E9]">
                    {album.title}
                  </h3>
                </div>
              </div>

              {/* Album Body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  {album.titleAmharic && (
                    <p className="text-xs font-semibold text-[#C18B58]">
                      {album.titleAmharic}
                    </p>
                  )}
                  <p className="mt-2 text-xs leading-relaxed text-[#736B5E] line-clamp-2">
                    {album.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#F2ECE1] pt-3 text-[11px] text-[#736B5E]">
                  <span>Curated by {album.creator}</span>
                  <div className="flex items-center gap-1 font-semibold text-[#C18B58]">
                    <span>Open Album</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
