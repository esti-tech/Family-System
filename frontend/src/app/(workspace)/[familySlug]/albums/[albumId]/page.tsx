"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Layers,
  Plus,
  Play,
  Download,
  Share2,
  Calendar,
  Users,
  Sparkles,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause
} from "lucide-react";

interface AlbumPhoto {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  location: string;
  people: string[];
}

const ALBUM_PHOTOS: AlbumPhoto[] = [
  {
    id: "mem-1",
    title: "Elias & Aster Holy Matrimony",
    imageUrl: "/assets/images/heritage-wedding.jpeg",
    date: "Sep 12, 1968",
    location: "Gondar Cathedral",
    people: ["Elias Bekele", "Aster Wolde"]
  },
  {
    id: "mem-5",
    title: "Elders Reminiscing Under Acacia",
    imageUrl: "/assets/images/heritage-elders.jpeg",
    date: "Nov 24, 2012",
    location: "Lake Tana",
    people: ["Elias Bekele", "Tadesse Wolde"]
  },
  {
    id: "mem-3",
    title: "Church Parish Deed & Registry",
    imageUrl: "/assets/images/feature-memory-archive.jpeg",
    date: "May 14, 1952",
    location: "Debre Tabor",
    people: ["Bekele Wolde-Mariam"]
  },
  {
    id: "mem-4",
    title: "Four Generations Living Room",
    imageUrl: "/assets/images/hero-family.jpeg",
    date: "Sep 11, 2025",
    location: "Addis Ababa",
    people: ["Elias Bekele", "Aster Wolde", "Dawit Bekele", "Selam Bekele"]
  },
  {
    id: "mem-2",
    title: "Buna Ceremony at Dawn",
    imageUrl: "/assets/images/heritage-coffee.jpeg",
    date: "Jan 19, 2024",
    location: "Debre Tabor",
    people: ["Aster Wolde", "Hana Mekonnen"]
  },
  {
    id: "mem-6",
    title: "Communal Timkat Procession",
    imageUrl: "/assets/images/feature-events-qr.jpeg",
    date: "Jan 19, 2026",
    location: "Debre Tabor",
    people: ["Dawit Bekele", "Selam Bekele"]
  }
];

export default function AlbumDetailPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";
  const albumId = (params?.albumId as string) || "gondar-ancestral-heritage";

  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/albums`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
                <span>Family Albums</span>
                <span>/</span>
                <span>Gondar Heritage</span>
              </div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Gondar Ancestral Heritage
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSlideshowOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-semibold text-[#2B2B2B] hover:bg-[#EAE3D6]"
            >
              <Play className="h-3.5 w-3.5 text-[#C18B58]" />
              <span>Slideshow</span>
            </button>
            <Link
              href={`/${slug}/memories/upload`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#C18B58] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
            >
              <Plus className="h-4 w-4" />
              <span>Add Photos</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Album Banner & Overview */}
      <div className="relative h-64 w-full bg-[#343434] md:h-72">
        <Image
          src="/assets/images/heritage-elders.jpeg"
          alt="Gondar Ancestral Heritage"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 mx-auto max-w-7xl md:bottom-8 md:left-10 md:right-10">
          <span className="rounded-full bg-[#C18B58] px-3 py-1 text-xs font-semibold text-white">
            1943 – 1975 Historical Era
          </span>
          <h1 className="mt-2 font-serif text-2xl font-bold text-white md:text-4xl">
            Gondar Ancestral Heritage
          </h1>
          <p className="mt-0.5 text-sm font-medium text-[#F6F1E9]/90">
            የጎንደር የቀደምት አያቶች ታሪክ • Curated by Elias Bekele & Dawit Bekele
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Description & Stats */}
        <div className="flex flex-col gap-4 rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-xs leading-relaxed text-[#736B5E]">
            A cherished collection documenting the early life of patriarch Elias Bekele, his ancestors, childhood homesteads, and marriage to Aster Wolde across Gondar, Lake Tana, and Debre Tabor.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#2B2B2B]">
            <div>
              <p className="text-sm font-bold text-[#C18B58]">18</p>
              <p className="text-[10px] text-[#736B5E]">Total Photos</p>
            </div>
            <div className="h-6 w-px bg-[#EAE3D6]" />
            <div>
              <p className="text-sm font-bold text-[#C18B58]">3</p>
              <p className="text-[10px] text-[#736B5E]">Generations</p>
            </div>
            <div className="h-6 w-px bg-[#EAE3D6]" />
            <div>
              <p className="text-sm font-bold text-[#C18B58]">1943</p>
              <p className="text-[10px] text-[#736B5E]">Earliest Year</p>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {ALBUM_PHOTOS.map((photo) => (
            <Link
              key={photo.id}
              href={`/${slug}/memories/${photo.id}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAE3D6] bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-60 w-full bg-[#EAE3D6]">
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                <span className="absolute bottom-2.5 left-3 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 transition">
                  {photo.date} • {photo.location}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-serif text-sm font-bold text-[#2B2B2B] group-hover:text-[#C18B58] transition">
                  {photo.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {photo.people.map((p, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-[#FAF8F5] border border-[#EAE3D6] px-2 py-0.5 text-[9px] text-[#736B5E]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Fullscreen Slideshow */}
      {isSlideshowOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-white">
          <div className="flex items-center justify-between px-8 py-5">
            <span className="font-serif text-lg font-bold">
              Gondar Ancestral Heritage • Slideshow ({slideIndex + 1}/{ALBUM_PHOTOS.length})
            </span>
            <button
              onClick={() => setIsSlideshowOpen(false)}
              className="rounded-lg bg-white/20 p-2 text-white hover:bg-white/30"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex-1">
            <Image
              src={ALBUM_PHOTOS[slideIndex].imageUrl}
              alt="Album slide"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex items-center justify-between p-6 bg-gradient-to-t from-black/90 to-transparent">
            <div>
              <p className="font-serif text-lg font-bold">{ALBUM_PHOTOS[slideIndex].title}</p>
              <p className="text-xs text-[#C18B58]">{ALBUM_PHOTOS[slideIndex].location} • {ALBUM_PHOTOS[slideIndex].date}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSlideIndex((prev) => (prev > 0 ? prev - 1 : ALBUM_PHOTOS.length - 1))}
                className="rounded-xl border border-white/20 px-4 py-2 text-xs font-semibold hover:bg-white/10"
              >
                Previous
              </button>
              <button
                onClick={() => setSlideIndex((prev) => (prev + 1) % ALBUM_PHOTOS.length)}
                className="rounded-xl bg-[#C18B58] px-5 py-2 text-xs font-semibold hover:bg-[#A97544]"
              >
                Next Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
