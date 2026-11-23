"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Sparkles,
  MapPin,
  Calendar,
  BookOpen,
  Mic,
  ArrowRight,
  Heart,
  Plus,
  Coffee,
  Users,
  Clock,
  Compass,
} from "lucide-react";

export default function FamilyHeritagePage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const familyName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div className="space-y-12 pb-20">
      {/* 1. HERO COVER & HERITAGE HEADLINE (Figma ui_part2 Page 10) */}
      <div className="relative rounded-2xl overflow-hidden bg-[#2B2B2B] text-white p-8 sm:p-12 border border-[#EAE3D6] shadow-sm">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/hero-family.jpeg"
            alt="Family gathered together"
            fill
            className="object-cover object-center opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-white/10 text-[#EAE3D6] font-semibold border border-white/20">
            <Compass className="w-3.5 h-3.5 text-[#C18B58]" />
            <span>GONDAR, ETHIOPIA · CONNECTED EVERYWHERE</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
            The {familyName}
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#C18B58] italic font-normal">
            Our roots. Our rituals. Our shared story.
          </p>

          <p className="text-xs sm:text-sm text-[#EAE3D6] font-light leading-relaxed max-w-xl">
            A living collection of the people, places, and sacred traditions that make us who we are. From the hills of Gondar to homes across the globe.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href={`/${slug}/stories/new`}
              className="inline-flex items-center px-4 py-2 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Story</span>
            </Link>
            <Link
              href={`/${slug}/timeline`}
              className="inline-flex items-center px-4 py-2 rounded-md bg-white/15 hover:bg-white/25 text-white text-xs font-medium border border-white/20 transition-colors space-x-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>View Full Timeline</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. OUR STORY STATEMENT */}
      <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C18B58]">
          THREE GENERATIONS. MANY CHAPTERS. ONE FAMILY.
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
          More than a name. A story we keep together.
        </h2>
        <p className="text-xs sm:text-sm text-[#5A5A5A] font-light leading-relaxed max-w-3xl">
          From the hills of Gondar to the homes we’ve made around the world, our family’s story lives in the things we carry: a favourite recipe, a familiar saying, a photograph passed from one hand to another. This is our place to remember where we come from—and leave something for those still to come.
        </p>
      </div>

      {/* 3. OUR ORIGINS CARD */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#F6F1E9]/60 rounded-2xl p-8 border border-[#EAE3D6]">
        <div className="md:col-span-4 relative aspect-[4/3] rounded-xl overflow-hidden border border-[#EAE3D6] shadow-sm">
          <Image
            src="/assets/images/heritage-elders.jpeg"
            alt="Elders sharing stories"
            fill
            className="object-cover"
          />
        </div>
        <div className="md:col-span-8 space-y-3">
          <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-bold">
            01 / OUR ORIGINS
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#2B2B2B]">
            A beginning in Gondar.
          </h3>
          <p className="text-xs sm:text-sm text-[#5A5A5A] font-light leading-relaxed">
            Our earliest chapters begin in the northern highlands, where family meant an open door and a place at the table. Elias and Aster carried that spirit with them, and taught the next generation to do the same. As our lives spread to Addis Ababa and beyond, those roots travelled with us—in our language, our food and the way we welcome one another.
          </p>
          <Link
            href={`/${slug}/stories`}
            className="inline-flex items-center text-xs font-semibold text-[#C18B58] hover:underline pt-2"
          >
            Explore our origins &rarr;
          </Link>
        </div>
      </div>

      {/* 4. HISTORICAL MOMENTS (TIMELINE CAROUSEL) */}
      <div className="space-y-6">
        <div className="flex items-end justify-between pb-3 border-b border-[#EAE3D6]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A7A]">
              HISTORICAL MOMENTS
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#2B2B2B] mt-0.5">
              Our heritage, one milestone at a time.
            </h3>
          </div>
          <Link
            href={`/${slug}/timeline`}
            className="text-xs font-semibold text-[#C18B58] hover:underline"
          >
            View full timeline &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] shadow-xs space-y-2">
            <span className="font-serif text-xl font-bold text-[#C18B58]">1943</span>
            <h4 className="font-serif font-bold text-xs text-[#2B2B2B]">A story begins</h4>
            <p className="text-[11px] text-[#5A5A5A] font-light leading-relaxed">
              Elias is born in Gondar, the first chapter in this family archive.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] shadow-xs space-y-2">
            <span className="font-serif text-xl font-bold text-[#C18B58]">1964</span>
            <h4 className="font-serif font-bold text-xs text-[#2B2B2B]">Roots grow deeper</h4>
            <p className="text-[11px] text-[#5A5A5A] font-light leading-relaxed">
              Dawit arrives, and another generation carries the story forward.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] shadow-xs space-y-2">
            <span className="font-serif text-xl font-bold text-[#C18B58]">1988</span>
            <h4 className="font-serif font-bold text-xs text-[#2B2B2B]">A home in Addis Ababa</h4>
            <p className="text-[11px] text-[#5A5A5A] font-light leading-relaxed">
              Dawit and Hana begin a new chapter together in the capital.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] shadow-xs space-y-2">
            <span className="font-serif text-xl font-bold text-[#C18B58]">1994</span>
            <h4 className="font-serif font-bold text-xs text-[#2B2B2B]">The next generation</h4>
            <p className="text-[11px] text-[#5A5A5A] font-light leading-relaxed">
              Selam is born into a family full of stories waiting to be told.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] shadow-xs space-y-2">
            <span className="font-serif text-xl font-bold text-[#C18B58]">2025</span>
            <h4 className="font-serif font-bold text-xs text-[#2B2B2B]">Back around one table</h4>
            <p className="text-[11px] text-[#5A5A5A] font-light leading-relaxed">
              Three generations gather again, making memories of their own.
            </p>
          </div>
        </div>
      </div>

      {/* 5. FAMILY TRADITIONS (BUNA & DINING) */}
      <div className="space-y-6">
        <div className="pb-3 border-b border-[#EAE3D6]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A7A]">
            FAMILY TRADITIONS
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#2B2B2B] mt-0.5">
            The rituals that make us feel at home.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tradition 1: Buna */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="aspect-[16/9] relative w-full bg-[#EAE3D6]">
              <Image
                src="/assets/images/heritage-coffee.jpeg"
                alt="Ethiopian coffee ceremony jebena"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#C18B58] font-bold">
                BUNA · COFFEE CEREMONY
              </span>
              <h4 className="font-serif text-xl font-bold text-[#2B2B2B]">
                There is always time for a third cup
              </h4>
              <p className="text-xs text-[#5A5A5A] font-light leading-relaxed">
                Abol, tona, baraka. A familiar rhythm of roasted beans, conversation, frankincense and being together that transcends distance.
              </p>
            </div>
          </div>

          {/* Tradition 2: Wedding & Dining */}
          <div className="bg-white rounded-2xl overflow-hidden border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="aspect-[16/9] relative w-full bg-[#EAE3D6]">
              <Image
                src="/assets/images/heritage-wedding.jpeg"
                alt="Ethiopian cultural celebration"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#C18B58] font-bold">
                AROUND OUR TABLE
              </span>
              <h4 className="font-serif text-xl font-bold text-[#2B2B2B]">
                A place is always kept for you
              </h4>
              <p className="text-xs text-[#5A5A5A] font-light leading-relaxed">
                Injera at the centre, stories all around. The sacred everyday ritual of breaking bread, sharing laughter, and welcoming guests.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. IMPORTANT PEOPLE: KEEPERS OF OUR STORIES */}
      <div className="space-y-6">
        <div className="flex items-end justify-between pb-3 border-b border-[#EAE3D6]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A7A]">
              IMPORTANT PEOPLE
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#2B2B2B] mt-0.5">
              The keepers of our stories.
            </h3>
          </div>
          <Link
            href={`/${slug}/tree`}
            className="text-xs font-semibold text-[#C18B58] hover:underline"
          >
            Meet the family &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#8B5E3C] text-white flex items-center justify-center font-serif font-bold text-lg">
              E
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2B2B2B]">Elias Bekele</h4>
              <p className="text-[11px] text-[#7A7A7A]">1943 – Present</p>
              <span className="text-[11px] font-semibold text-[#C18B58] block mt-1">
                Family storyteller
              </span>
              <p className="text-[11px] text-[#5A5A5A] mt-1 font-light">
                The folklore and migrations we grew up with.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#A75D5D] text-white flex items-center justify-center font-serif font-bold text-lg">
              A
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2B2B2B]">Aster Gebre</h4>
              <p className="text-[11px] text-[#7A7A7A]">1945 – 2021</p>
              <span className="text-[11px] font-semibold text-[#C18B58] block mt-1">
                Remembered with love
              </span>
              <p className="text-[11px] text-[#5A5A5A] mt-1 font-light">
                Recipes, coffee rituals, and an open door.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#293241] text-white flex items-center justify-center font-serif font-bold text-lg">
              H
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2B2B2B]">Hana Mekonnen</h4>
              <p className="text-[11px] text-[#7A7A7A]">1969 – Present</p>
              <span className="text-[11px] font-semibold text-[#C18B58] block mt-1">
                Tradition keeper
              </span>
              <p className="text-[11px] text-[#5A5A5A] mt-1 font-light">
                The heart of every holiday gathering.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#C18B58] text-white flex items-center justify-center font-serif font-bold text-lg">
              S
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2B2B2B]">Selam Mekonnen</h4>
              <p className="text-[11px] text-[#7A7A7A]">1994 – Present</p>
              <span className="text-[11px] font-semibold text-[#C18B58] block mt-1">
                Keeping stories alive
              </span>
              <p className="text-[11px] text-[#5A5A5A] mt-1 font-light">
                Curating the digital archive for tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. FEATURED STORIES & ORAL MEMOIRS */}
      <div className="space-y-6">
        <div className="flex items-end justify-between pb-3 border-b border-[#EAE3D6]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A7A]">
              FEATURED STORIES
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#2B2B2B] mt-0.5">
              Told in our own words. Kept for the next generation.
            </h3>
          </div>
          <Link
            href={`/${slug}/stories`}
            className="text-xs font-semibold text-[#C18B58] hover:underline"
          >
            Browse all stories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7A7A7A]">
                FROM THE FAMILY ARCHIVE
              </span>
              <h4 className="font-serif text-xl font-bold text-[#2B2B2B] mt-1">
                The photographs Aster kept
              </h4>
              <p className="text-xs text-[#5A5A5A] font-light mt-2 leading-relaxed">
                A shoebox of photographs, a few names on the back, and the afternoons we spent piecing the memories together around the coffee table.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-[#7A7A7A]">Selam Mekonnen · 6 min read</span>
              <Link
                href={`/${slug}/stories/story-aster-photos`}
                className="font-semibold text-[#C18B58] hover:underline"
              >
                Read story &rarr;
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#EAE3D6] shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#7A7A7A]">
                FAMILY, NEAR & FAR
              </span>
              <h4 className="font-serif text-xl font-bold text-[#2B2B2B] mt-1">
                Home is a voice on the other end
              </h4>
              <p className="text-xs text-[#5A5A5A] font-light mt-2 leading-relaxed">
                Across cities and time zones, Sunday calls have become a tradition of their own. Some distances are smaller than they seem when stories are shared.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-[#7A7A7A]">Yonas Mekonnen · 4 min read</span>
              <Link
                href={`/${slug}/stories/story-sunday-calls`}
                className="font-semibold text-[#C18B58] hover:underline"
              >
                Read story &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 8. BOTTOM CALL TO ACTION BANNER */}
      <div className="bg-[#F6F1E9] p-8 sm:p-10 rounded-2xl border border-[#EAE3D6] text-center space-y-3">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A7A]">
          OUR STORY IS STILL BEING WRITTEN
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
          What should the next generation remember?
        </h3>
        <p className="text-xs sm:text-sm text-[#5A5A5A] font-light max-w-md mx-auto">
          Add a memory, record a tradition, or tell a story only you can tell.
        </p>
        <div className="pt-3">
          <Link
            href={`/${slug}/stories/new`}
            className="inline-flex items-center px-6 py-2.5 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Story</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
