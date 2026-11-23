"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  QrCode,
  Plus,
  Search,
  Filter,
  Sparkles,
  ChevronRight,
  Share2,
  Camera,
  CheckCircle2,
  CalendarDays,
  List
} from "lucide-react";

interface FamilyEvent {
  id: string;
  title: string;
  titleAmharic?: string;
  category: "holiday" | "wedding" | "birthday" | "reunion" | "memorial";
  status: "upcoming" | "past" | "happening_today";
  dateFormatted: string;
  ethiopianDate: string;
  time: string;
  location: string;
  city: string;
  attendeesCount: number;
  rsvpdYesCount: number;
  memoryUploadsCount: number;
  qrEnabled: boolean;
  coverImage: string;
  hosts: { name: string; avatar?: string }[];
  description: string;
}

const MOCK_EVENTS: FamilyEvent[] = [
  {
    id: "timkat-gathering-2026",
    title: "Bekele Family Timkat Annual Gathering",
    titleAmharic: "የጥምቀት በዓል የቤተሰብ መሰብሰቢያ",
    category: "holiday",
    status: "upcoming",
    dateFormatted: "January 19, 2026",
    ethiopianDate: "ጥር 11, 2018 ዓ.ም (ጥምቀት)",
    time: "10:00 AM – 8:00 PM EAT",
    location: "Debre Tabor Heritage Pavilion & Family Grounds",
    city: "Debre Tabor, Amhara Region",
    attendeesCount: 48,
    rsvpdYesCount: 36,
    memoryUploadsCount: 142,
    qrEnabled: true,
    coverImage: "/assets/images/feature-events-qr.jpeg",
    hosts: [
      { name: "Dawit Bekele" },
      { name: "Hana Mekonnen" }
    ],
    description: "Our sacred annual Timkat reunion with full traditional Habesha Kemis, elder blessings, coffee ceremony, and communal feasting."
  },
  {
    id: "aster-80th-birthday",
    title: "Grandmother Aster Wolde's 80th Milestone Celebration",
    titleAmharic: "የእማማ አስቴር ወልደ 80ኛ ዓመት ልደት",
    category: "birthday",
    status: "upcoming",
    dateFormatted: "March 15, 2026",
    ethiopianDate: "መጋቢት 6, 2018 ዓ.ም",
    time: "1:00 PM – 7:00 PM EAT",
    location: "Bole Medhanialem Grand Banquet Hall",
    city: "Addis Ababa",
    attendeesCount: 75,
    rsvpdYesCount: 54,
    memoryUploadsCount: 88,
    qrEnabled: true,
    coverImage: "/assets/images/heritage-elders.jpeg",
    hosts: [
      { name: "Elias Bekele" },
      { name: "Dawit Bekele" }
    ],
    description: "Honoring 80 years of grace, resilience, and storytelling with four generations of Aster's direct descendants."
  },
  {
    id: "abebe-selam-wedding",
    title: "Abebe & Selam Traditional Melse & Reception",
    titleAmharic: "የአበበ እና የሰላም የሰርግ መልስ ድግስ",
    category: "wedding",
    status: "upcoming",
    dateFormatted: "April 26, 2026",
    ethiopianDate: "ሚያዝያ 18, 2018 ዓ.ም",
    time: "3:00 PM – Midnight EAT",
    location: "Sheraton Addis / Lalibela Ballroom & Gardens",
    city: "Addis Ababa",
    attendeesCount: 120,
    rsvpdYesCount: 94,
    memoryUploadsCount: 310,
    qrEnabled: true,
    coverImage: "/assets/images/heritage-wedding.jpeg",
    hosts: [
      { name: "Selam Bekele" },
      { name: "Abebe Tadesse" }
    ],
    description: "Traditional Melse wedding banquet, Kaba crowning rites, Eskista dancing, and guest QR memory capture."
  },
  {
    id: "gondar-ancestral-reunion-2025",
    title: "Gondar Ancestral Heritage Pilgrimage",
    titleAmharic: "የጎንደር የቀደምት አያቶች ጉብኝት",
    category: "reunion",
    status: "past",
    dateFormatted: "September 11, 2025",
    ethiopianDate: "መስከረም 1, 2018 ዓ.ም (እንቁጣጣሽ)",
    time: "Full Weekend",
    location: "Fasil Ghebbi & Bekele Homestead",
    city: "Gondar",
    attendeesCount: 35,
    rsvpdYesCount: 35,
    memoryUploadsCount: 420,
    qrEnabled: true,
    coverImage: "/assets/images/hero-family.jpeg",
    hosts: [
      { name: "Elias Bekele" }
    ],
    description: "A multigenerational homecoming journey to trace the childhood footsteps of patriarch Elias Bekele in Gondar."
  }
];

export default function FamilyEventsPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  const filteredEvents = MOCK_EVENTS.filter((evt) => {
    if (activeTab === "upcoming" && evt.status === "past") return false;
    if (activeTab === "past" && evt.status !== "past") return false;
    if (selectedCategory !== "all" && evt.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchAmharic = evt.titleAmharic?.toLowerCase().includes(q);
      const matchCity = evt.city.toLowerCase().includes(q);
      if (!matchTitle && !matchAmharic && !matchCity) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-[#FFFFFF] px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#C18B58] uppercase">
              <Sparkles className="h-4 w-4" />
              <span>Family Gatherings & Occasions</span>
            </div>
            <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
              Family Events & Celebrations
            </h1>
            <p className="mt-1 text-sm text-[#736B5E]">
              Plan sacred reunions, track RSVPs, and collect live photos from guests via QR codes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${slug}/events/new`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#A97544]"
            >
              <Plus className="h-4 w-4" />
              <span>Create Event</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Controls Bar: Tabs, Categories, Search */}
        <div className="flex flex-col gap-4 border-b border-[#EAE3D6] pb-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 rounded-xl bg-[#EFE9DF] p-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                activeTab === "all"
                  ? "bg-white text-[#2B2B2B] shadow-sm"
                  : "text-[#736B5E] hover:text-[#2B2B2B]"
              }`}
            >
              All Occasions ({MOCK_EVENTS.length})
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                activeTab === "upcoming"
                  ? "bg-white text-[#2B2B2B] shadow-sm"
                  : "text-[#736B5E] hover:text-[#2B2B2B]"
              }`}
            >
              Upcoming (3)
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                activeTab === "past"
                  ? "bg-white text-[#2B2B2B] shadow-sm"
                  : "text-[#736B5E] hover:text-[#2B2B2B]"
              }`}
            >
              Past Archive (1)
            </button>
          </div>

          {/* Search & View Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A89F91]" />
              <input
                type="text"
                placeholder="Search events, cities, or Amharic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#EAE3D6] bg-white py-2 pl-9 pr-4 text-xs text-[#2B2B2B] placeholder-[#A89F91] transition focus:border-[#C18B58] focus:outline-none"
              />
            </div>

            <div className="flex items-center rounded-xl border border-[#EAE3D6] bg-white p-1">
              <button
                onClick={() => setViewMode("cards")}
                title="Grid Cards"
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "cards" ? "bg-[#F6F1E9] text-[#C18B58]" : "text-[#736B5E]"
                }`}
              >
                <CalendarDays className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="List View"
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "list" ? "bg-[#F6F1E9] text-[#C18B58]" : "text-[#736B5E]"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-[#736B5E]">Filter by:</span>
          {[
            { id: "all", label: "All Types" },
            { id: "holiday", label: "Holidays (በዓላት)" },
            { id: "wedding", label: "Weddings (ሰርግ)" },
            { id: "birthday", label: "Milestone Birthdays (ልደት)" },
            { id: "reunion", label: "Reunions (መገናኛ)" },
            { id: "memorial", label: "Memorials (መታሰቢያ)" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                selectedCategory === cat.id
                  ? "bg-[#C18B58] text-white"
                  : "border border-[#EAE3D6] bg-white text-[#736B5E] hover:border-[#C18B58]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Events Grid / List */}
        {filteredEvents.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-[#D5CBB9] bg-white/70 p-12 text-center">
            <CalendarIcon className="mx-auto h-12 w-12 text-[#C18B58]/60" />
            <h3 className="mt-3 font-serif text-lg font-semibold text-[#2B2B2B]">
              No events found
            </h3>
            <p className="mt-1 text-xs text-[#736B5E]">
              Try adjusting your search query or filter tags.
            </p>
          </div>
        ) : viewMode === "cards" ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#EAE3D6] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Event Cover Image */}
                <div className="relative h-48 w-full bg-[#EAE3D6]">
                  <Image
                    src={evt.coverImage}
                    alt={evt.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2B2B2B] backdrop-blur-sm">
                    <span className="capitalize">{evt.category}</span>
                  </div>

                  {evt.qrEnabled && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#C18B58] px-2.5 py-1 text-[11px] font-medium text-white shadow-sm">
                      <QrCode className="h-3.5 w-3.5" />
                      <span>QR Active</span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] font-medium text-[#F6F1E9]/90">
                      {evt.ethiopianDate}
                    </p>
                    <p className="text-xs font-semibold">{evt.dateFormatted}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-2">
                    <h3 className="font-serif text-lg font-bold text-[#2B2B2B] group-hover:text-[#C18B58] transition">
                      {evt.title}
                    </h3>
                    {evt.titleAmharic && (
                      <p className="text-xs font-medium text-[#C18B58]">
                        {evt.titleAmharic}
                      </p>
                    )}
                  </div>

                  <p className="line-clamp-2 text-xs text-[#736B5E]">
                    {evt.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-[#F2ECE1] pt-3 text-xs text-[#736B5E]">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-[#C18B58]" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-[#C18B58]" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-[#C18B58]" />
                        <span>{evt.rsvpdYesCount} Attending ({evt.attendeesCount} invited)</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-[#736B5E]">
                        <Camera className="h-3.5 w-3.5 text-[#C18B58]" />
                        <span>{evt.memoryUploadsCount} uploads</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 flex items-center justify-between border-t border-[#F2ECE1] pt-4">
                    <Link
                      href={`/${slug}/events/${evt.id}/qr`}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#EAE3D6] bg-[#FAF8F5] px-3 py-1.5 text-xs font-medium text-[#2B2B2B] transition hover:bg-[#EAE3D6]"
                    >
                      <QrCode className="h-3.5 w-3.5 text-[#C18B58]" />
                      <span>Guest QR</span>
                    </Link>

                    <Link
                      href={`/${slug}/events/${evt.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#C18B58] transition hover:text-[#A97544]"
                    >
                      <span>Manage Event</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 divide-y divide-[#EAE3D6] rounded-2xl border border-[#EAE3D6] bg-white">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition hover:bg-[#FAF8F5]"
              >
                <div className="flex items-start gap-4">
                  <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#EAE3D6]">
                    <Image
                      src={evt.coverImage}
                      alt={evt.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#F6F1E9] px-2.5 py-0.5 text-[10px] font-semibold uppercase text-[#C18B58]">
                        {evt.category}
                      </span>
                      <span className="text-xs text-[#736B5E]">
                        {evt.ethiopianDate}
                      </span>
                    </div>
                    <Link
                      href={`/${slug}/events/${evt.id}`}
                      className="mt-0.5 block font-serif text-base font-bold text-[#2B2B2B] hover:text-[#C18B58]"
                    >
                      {evt.title}
                    </Link>
                    <p className="text-xs text-[#736B5E]">
                      {evt.city} • {evt.rsvpdYesCount} attending • {evt.memoryUploadsCount} uploads
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/${slug}/events/${evt.id}/qr`}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#EAE3D6] px-3 py-1.5 text-xs font-medium text-[#2B2B2B] hover:bg-[#EAE3D6]"
                  >
                    <QrCode className="h-3.5 w-3.5 text-[#C18B58]" />
                    <span>QR</span>
                  </Link>
                  <Link
                    href={`/${slug}/events/${evt.id}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#C18B58] px-4 py-2 text-xs font-medium text-white hover:bg-[#A97544]"
                  >
                    <span>View Hub</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
