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
  ArrowLeft,
  Share2,
  Camera,
  CheckCircle2,
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  MessageSquare
} from "lucide-react";

export default function EventDetailsPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";
  const eventId = (params?.eventId as string) || "timkat-gathering-2026";

  const [rsvpStatus, setRsvpStatus] = useState<"attending" | "declined" | "maybe" | null>("attending");
  const [showRsvpFeedback, setShowRsvpFeedback] = useState(false);

  const handleRsvpChange = (status: "attending" | "declined" | "maybe") => {
    setRsvpStatus(status);
    setShowRsvpFeedback(true);
    setTimeout(() => setShowRsvpFeedback(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Breadcrumb Nav */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#736B5E]">
            <Link href={`/${slug}/events`} className="hover:text-[#C18B58]">
              Events
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#2B2B2B] truncate max-w-[200px] sm:max-w-none">
              Bekele Family Timkat Annual Gathering
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/${slug}/events/${eventId}/qr`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#C18B58] bg-[#FAF5EE] px-3.5 py-1.5 text-xs font-semibold text-[#C18B58] hover:bg-[#F3EAD9]"
            >
              <QrCode className="h-4 w-4" />
              <span>Event QR Card</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-72 w-full bg-[#343434] md:h-84">
        <Image
          src="/assets/images/feature-events-qr.jpeg"
          alt="Bekele Family Timkat Gathering"
          fill
          className="object-cover opacity-85"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 mx-auto max-w-7xl md:bottom-8 md:left-10 md:right-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#C18B58] px-3 py-1 text-xs font-semibold text-white">
              Traditional Feast & Holiday
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              ጥር 11, 2018 ዓ.ም (ጥምቀት)
            </span>
            <span className="rounded-full bg-[#4A7C59] px-2.5 py-1 text-[11px] font-semibold text-white">
              Upcoming
            </span>
          </div>

          <h1 className="mt-2 font-serif text-2xl font-bold text-white md:text-4xl">
            Bekele Family Timkat Annual Gathering
          </h1>
          <p className="mt-0.5 text-sm font-medium text-[#F6F1E9]/90 md:text-base">
            የጥምቀት በዓል የቤተሰብ መሰብሰቢያ — Debre Tabor Heritage Grounds
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="sticky top-0 z-20 border-b border-[#EAE3D6] bg-white/95 px-6 backdrop-blur-sm md:px-10">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto text-xs font-semibold">
          <span className="border-b-2 border-[#C18B58] py-3.5 text-[#C18B58]">
            Overview & Schedule
          </span>
          <Link
            href={`/${slug}/events/${eventId}/attendance`}
            className="py-3.5 text-[#736B5E] hover:text-[#2B2B2B]"
          >
            RSVP Attendance (36)
          </Link>
          <Link
            href={`/${slug}/events/${eventId}/qr`}
            className="py-3.5 text-[#736B5E] hover:text-[#2B2B2B]"
          >
            Guest QR Portal
          </Link>
          <Link
            href={`/${slug}/events/${eventId}/stream`}
            className="py-3.5 text-[#736B5E] hover:text-[#2B2B2B]"
          >
            Live Memory Stream (142)
          </Link>
          <Link
            href={`/${slug}/events/${eventId}/guestbook`}
            className="py-3.5 text-[#736B5E] hover:text-[#2B2B2B]"
          >
            Guestbook & Wishes (28)
          </Link>
        </div>
      </div>

      {/* Content Layout */}
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main 2-Col Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Event Overview & Description */}
            <div className="rounded-2xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
              <h2 className="font-serif text-lg font-bold text-[#2B2B2B]">
                About This Gathering
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-[#736B5E]">
                Our sacred annual Timkat reunion brings four generations together in Debre Tabor. Relatives traveling from Addis Ababa, Gondar, Bahir Dar, and the diaspora will gather to honor our lineage, participate in the Buna ceremony blessing by elder Elias Bekele, feast on traditional Doro Wat and Injera, and pass oral narratives down to the youngest grandchildren.
              </p>

              <div className="mt-5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-4 text-xs text-[#2B2B2B]">
                <p className="font-semibold text-[#C18B58]">Dress Code & Tradition Note:</p>
                <p className="mt-1 text-[#736B5E]">
                  Attendees are warmly encouraged to wear traditional white Ethiopian garments (*Habesha Kemis* / *Netela* / *Gabi*).
                </p>
              </div>
            </div>

            {/* Program Schedule */}
            <div className="rounded-2xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-[#2B2B2B]">
                  Program & Order of Ceremony
                </h2>
                <span className="text-xs text-[#736B5E]">All times East Africa Time (EAT)</span>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  {
                    time: "10:00 AM",
                    title: "Arrival, Welcoming & Mezmur",
                    titleAmharic: "እንግዶችን መቀበል እና መዝሙር",
                    desc: "Relatives arrive at the pavilion. Registration and commemorative badges distributed."
                  },
                  {
                    time: "11:30 AM",
                    title: "Sacred Coffee Ceremony & Elder Blessing",
                    titleAmharic: "የቡና ቁርስ እና የአባቶች ምርቃት",
                    desc: "Three rounds of traditional Buna (Abol, Tona, Bereka) led by Aster Wolde with blessings by Elias Bekele."
                  },
                  {
                    time: "01:00 PM",
                    title: "Communal Banquet & Doro Wat Feast",
                    titleAmharic: "የምሳ ግብዣ እና የዶሮ ወጥ ማዕድ",
                    desc: "Family meal served on traditional Mesob baskets with freshly baked Teff Injera."
                  },
                  {
                    time: "03:30 PM",
                    title: "Oral Lineage Story Circle & Genealogy Recital",
                    titleAmharic: "የዘር ሐረግ እና የቤተሰብ ታሪክ ማስታወስ",
                    desc: "Younger generations recite their 7-generation patronymic names; recording audio memoirs for KinKeep archive."
                  },
                  {
                    time: "05:00 PM",
                    title: "Eskista Dance, Group Portraits & QR Memory Upload",
                    titleAmharic: "እስክስታ፣ የፎቶ ማንሻ እና የQR ማስታወሻ",
                    desc: "Live music and dance celebration. Guests scan QR codes to upload pictures directly to live projector stream."
                  }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 rounded-xl border border-[#F2ECE1] bg-[#FAF8F5] p-4 transition hover:border-[#C18B58]/40"
                  >
                    <div className="flex flex-col items-center">
                      <span className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-[#C18B58] shadow-sm">
                        {item.time}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#2B2B2B]">
                        {item.title}
                      </h4>
                      <p className="text-[11px] font-medium text-[#C18B58]">
                        {item.titleAmharic}
                      </p>
                      <p className="mt-1 text-xs text-[#736B5E]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Memories Live Preview */}
            <div className="rounded-2xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#2B2B2B]">
                    Captured Memories (142 Uploads)
                  </h2>
                  <p className="text-xs text-[#736B5E]">
                    Uploaded by attendees and guest QR scans
                  </p>
                </div>
                <Link
                  href={`/${slug}/events/${eventId}/stream`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#C18B58] hover:text-[#A97544]"
                >
                  <span>Open Full Stream</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { img: "/assets/images/feature-events-qr.jpeg", caption: "Family elders blessing" },
                  { img: "/assets/images/heritage-wedding.jpeg", caption: "Traditional white dress" },
                  { img: "/assets/images/heritage-coffee.jpeg", caption: "Buna roasting ritual" },
                  { img: "/assets/images/hero-family.jpeg", caption: "Descendants reunion" }
                ].map((m, i) => (
                  <div key={i} className="group relative h-28 overflow-hidden rounded-xl bg-[#EAE3D6]">
                    <Image
                      src={m.img}
                      alt={m.caption}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition" />
                    <p className="absolute bottom-1 left-1.5 right-1.5 truncate text-[10px] text-white opacity-0 group-hover:opacity-100 transition">
                      {m.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User RSVP Action Card */}
            <div className="rounded-2xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#2B2B2B]">
                Your RSVP Status
              </h3>
              <p className="mt-1 text-xs text-[#736B5E]">
                Let the family hosts know if you and your household will attend.
              </p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleRsvpChange("attending")}
                  className={`rounded-xl py-2.5 text-center text-xs font-semibold transition ${
                    rsvpStatus === "attending"
                      ? "bg-[#4A7C59] text-white shadow-sm"
                      : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#2B2B2B] hover:bg-white"
                  }`}
                >
                  ✓ Attending
                </button>
                <button
                  type="button"
                  onClick={() => handleRsvpChange("maybe")}
                  className={`rounded-xl py-2.5 text-center text-xs font-semibold transition ${
                    rsvpStatus === "maybe"
                      ? "bg-[#C18B58] text-white shadow-sm"
                      : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#2B2B2B] hover:bg-white"
                  }`}
                >
                  Maybe
                </button>
                <button
                  type="button"
                  onClick={() => handleRsvpChange("declined")}
                  className={`rounded-xl py-2.5 text-center text-xs font-semibold transition ${
                    rsvpStatus === "declined"
                      ? "bg-[#9A3B3B] text-white shadow-sm"
                      : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#2B2B2B] hover:bg-white"
                  }`}
                >
                  Declined
                </button>
              </div>

              {showRsvpFeedback && (
                <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#EAF3EC] p-2.5 text-xs text-[#4A7C59]">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>RSVP updated successfully!</span>
                </div>
              )}

              <div className="mt-5 border-t border-[#F2ECE1] pt-4 text-xs text-[#736B5E]">
                <div className="flex justify-between py-1">
                  <span>Confirmed Attending:</span>
                  <span className="font-bold text-[#2B2B2B]">36 people</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Awaiting Response:</span>
                  <span className="font-bold text-[#2B2B2B]">8 people</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Declined:</span>
                  <span className="font-bold text-[#2B2B2B]">4 people</span>
                </div>
              </div>

              <Link
                href={`/${slug}/events/${eventId}/attendance`}
                className="mt-4 block w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] py-2 text-center text-xs font-semibold text-[#2B2B2B] hover:bg-[#EAE3D6]"
              >
                View Full Attendance List
              </Link>
            </div>

            {/* Quick QR Card */}
            <div className="rounded-2xl border border-[#C18B58]/30 bg-gradient-to-br from-[#FAF5EE] to-[#F6F1E9] p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C18B58] text-white">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#2B2B2B]">
                    Guest QR Table Card
                  </h3>
                  <p className="text-[11px] text-[#736B5E]">
                    Allow instant guest photo uploads
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#736B5E]">
                Display or print the table tent card so wedding and reunion guests can upload memories without downloading an app.
              </p>

              <div className="mt-4 flex gap-2">
                <Link
                  href={`/${slug}/events/${eventId}/qr`}
                  className="flex-1 rounded-xl bg-[#C18B58] py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
                >
                  Open QR Card
                </Link>
                <Link
                  href={`/${slug}/events/${eventId}/stream`}
                  className="rounded-xl border border-[#EAE3D6] bg-white px-3 py-2 text-center text-xs font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
                  title="Live Slideshow"
                >
                  Slideshow
                </Link>
              </div>
            </div>

            {/* Venue & Location Details */}
            <div className="rounded-2xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#2B2B2B]">
                Venue & Location
              </h3>

              <div className="mt-4 space-y-3 text-xs text-[#736B5E]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 text-[#C18B58] flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-[#2B2B2B]">
                      Debre Tabor Heritage Pavilion
                    </p>
                    <p className="mt-0.5">Family Homestead Grounds, Amhara Region</p>
                    <p className="text-[11px] text-[#A89F91]">Debre Tabor, Ethiopia</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-[#C18B58] flex-shrink-0" />
                  <span>10:00 AM – 8:00 PM EAT</span>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-center text-[11px] text-[#736B5E]">
                Directions & landmark signs will be posted from the Debre Tabor main gate.
              </div>
            </div>

            {/* Event Coordinators & Hosts */}
            <div className="rounded-2xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
              <h3 className="font-serif text-base font-bold text-[#2B2B2B]">
                Event Hosts
              </h3>
              <div className="mt-3 space-y-2">
                {[
                  { name: "Dawit Bekele", role: "Primary Organizer" },
                  { name: "Hana Mekonnen", role: "Hospitality & Feast" },
                  { name: "Elias Bekele", role: "Patriarch & Elder Blessing" }
                ].map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#2B2B2B]">{h.name}</span>
                    <span className="text-[11px] text-[#736B5E]">{h.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
