"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Users,
  GitFork,
  Image as ImageIcon,
  Calendar,
  Plus,
  Upload,
  HardDrive,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function FamilyDashboardPage() {
  const params = useParams();
  const familySlug = (params?.familySlug as string) || "family";

  // Nicely format the title
  const familyName = familySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="space-y-8">
      {/* 1. Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-charcoal-900 via-charcoal-800 to-charcoal-900 p-8 sm:p-10 text-white shadow-card">
        <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80')]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold tracking-wider uppercase border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Living Family Archive</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome to {familyName}
            </h1>
            <p className="text-xs sm:text-sm text-ivory-200/90 leading-relaxed">
              Explore your living lineage, listen to elder oral recordings, and collaborate with relatives across generations.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <Link
              href={`/${familySlug}/tree`}
              className="inline-flex items-center px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Person
            </Link>
            <Link
              href={`/${familySlug}/memories`}
              className="inline-flex items-center px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all backdrop-blur-xs"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              Upload Memory
            </Link>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">Members</span>
            <div className="w-8 h-8 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-charcoal-900">14</div>
          <p className="text-[11px] text-charcoal-700">Across 3 countries</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">Generations</span>
            <div className="w-8 h-8 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center">
              <GitFork className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-charcoal-900">4</div>
          <p className="text-[11px] text-charcoal-700">Oldest born 1918</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">Memories</span>
            <div className="w-8 h-8 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-charcoal-900">128</div>
          <p className="text-[11px] text-charcoal-700">Photos, audio & video</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">Upcoming Events</span>
            <div className="w-8 h-8 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-serif text-charcoal-900">2</div>
          <p className="text-[11px] text-charcoal-700">Wedding & Coffee Gathering</p>
        </div>
      </div>

      {/* 3. Middle Grid: Family Tree Preview & Upcoming Gathering */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Family Tree Preview (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-border shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal-900">Lineage & Family Tree</h3>
              <p className="text-xs text-charcoal-700">Direct biological and partner connections</p>
            </div>
            <Link
              href={`/${familySlug}/tree`}
              className="text-xs font-bold text-gold-600 hover:text-gold-700 inline-flex items-center"
            >
              Open Interactive Tree <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          {/* Graphical Miniature Preview */}
          <div className="h-64 rounded-xl bg-ivory-50 border border-border/80 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="ethiopian-pattern-overlay absolute inset-0" />
            <div className="relative z-10 flex flex-col items-center space-y-4">
              {/* Grandparent Node */}
              <div className="px-4 py-2 rounded-xl bg-white border border-gold-300 shadow-xs text-center">
                <span className="text-xs font-bold font-serif text-charcoal-900">Abebe Bekele</span>
                <span className="block text-[10px] text-charcoal-700">1924 - 2008 (Grandfather)</span>
              </div>
              <div className="w-0.5 h-6 bg-gold-400" />
              {/* Parents Node */}
              <div className="flex items-center space-x-6">
                <div className="px-4 py-2 rounded-xl bg-white border border-border shadow-xs text-center">
                  <span className="text-xs font-bold font-serif text-charcoal-900">Solomon Abebe</span>
                  <span className="block text-[10px] text-charcoal-700">Father</span>
                </div>
                <span className="text-xs font-serif text-gold-600 font-bold">&</span>
                <div className="px-4 py-2 rounded-xl bg-white border border-border shadow-xs text-center">
                  <span className="text-xs font-bold font-serif text-charcoal-900">Almaz Tefera</span>
                  <span className="block text-[10px] text-charcoal-700">Mother</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Quota Card (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-charcoal-900">Storage Usage</h3>
              <HardDrive className="w-4 h-4 text-gold-600" />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-charcoal-700">1.2 GB of 2.0 GB used</span>
                  <span className="text-gold-600 font-bold">60%</span>
                </div>
                <div className="w-full bg-ivory-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-gold-500 h-full rounded-full transition-all duration-500 w-[60%]" />
                </div>
              </div>

              <div className="text-xs text-charcoal-700 space-y-2 pt-2 border-t border-border">
                <div className="flex justify-between">
                  <span>Photographs (86 items)</span>
                  <span className="font-medium text-charcoal-900">820 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Oral Audio (12 recordings)</span>
                  <span className="font-medium text-charcoal-900">310 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Family Documents</span>
                  <span className="font-medium text-charcoal-900">70 MB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border mt-4">
            <Link
              href={`/${familySlug}/billing`}
              className="w-full block text-center py-2 rounded-lg border border-gold-500 text-gold-700 hover:bg-gold-50 text-xs font-semibold transition-colors"
            >
              Upgrade Storage Plan
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Recent Memories Preview & Activity Feed */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-charcoal-900">Recent Family Memories</h3>
            <p className="text-xs text-charcoal-700">Preserved heirloom photographs and oral recordings</p>
          </div>
          <Link
            href={`/${familySlug}/memories`}
            className="text-xs font-bold text-gold-600 hover:text-gold-700 inline-flex items-center"
          >
            View All Memories <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="group relative rounded-xl overflow-hidden aspect-square bg-charcoal-900 border border-border shadow-xs">
            <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80')]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
              <span className="text-xs font-bold font-serif truncate">Coffee Ceremony with Grandma</span>
              <span className="text-[10px] text-ivory-200">October 1994</span>
            </div>
          </div>

          <div className="group relative rounded-xl overflow-hidden aspect-square bg-charcoal-900 border border-border shadow-xs">
            <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80')]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
              <span className="text-xs font-bold font-serif truncate">Mulugeta & Selam Wedding</span>
              <span className="text-[10px] text-ivory-200">Gondar, 2012</span>
            </div>
          </div>

          <div className="group relative rounded-xl overflow-hidden aspect-square bg-charcoal-900 border border-border shadow-xs">
            <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80')]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
              <span className="text-xs font-bold font-serif truncate">Oral History: Elder Tale</span>
              <span className="text-[10px] text-gold-300">Audio • 14 mins</span>
            </div>
          </div>

          <div className="group relative rounded-xl overflow-hidden aspect-square bg-charcoal-900 border border-border shadow-xs">
            <div className="absolute inset-0 bg-cover bg-center bg-[url('https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80')]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
              <span className="text-xs font-bold font-serif truncate">Addis Reunion</span>
              <span className="text-[10px] text-ivory-200">January 2024</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
