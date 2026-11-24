"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Users,
  GitFork,
  BookOpen,
  Image as ImageIcon,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  Mic,
  QrCode,
  Clock,
  Heart,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/services/api";

interface DashboardSummary {
  family_id: string;
  family_name: string;
  family_slug: string;
  origin_city?: string;
  origin_country?: string;
  member_count: number;
  generations_count: number;
  memories_count: number;
  events_count: number;
  storage_used_bytes: number;
  storage_limit_bytes: number;
}

export default function FamilyDashboardPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  // Derive default title from slug as initial fallback
  const fallbackFamilyName = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      const res = await apiRequest<DashboardSummary>(
        `/api/v1/families/by-slug/${slug}/dashboard-summary`
      );
      if (res.success && res.data) {
        setSummary(res.data);
      }
      setLoading(false);
    }
    fetchDashboard();
  }, [slug]);

  const familyName = summary?.family_name || fallbackFamilyName;
  const originCity = summary?.origin_city || "Gondar";
  const originCountry = summary?.origin_country || "Ethiopia";
  const memberCount = summary?.member_count ?? 1;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. WELCOME HERO BANNER (Figma Page 56) */}
      <div className="relative rounded-2xl overflow-hidden bg-[#2B2B2B] text-white p-8 sm:p-10 shadow-sm border border-[#EAE3D6]">
        {/* Subtle decorative background */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-0" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay z-0"
          style={{ backgroundImage: "url('/assets/images/hero-family.jpeg')" }}
        />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-white/10 text-[#EAE3D6] font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-[#C18B58]" />
            <span>ROOTED IN {originCity.toUpperCase()}, {originCountry.toUpperCase()}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
            {familyName} Archive
          </h1>

          <p className="text-sm text-[#EAE3D6] font-light leading-relaxed">
            One shared home for stories, photographs, wedding memories, and the living branches of our family tree.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href={`/${slug}/tree`}
              className="inline-flex items-center px-4 py-2 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors space-x-1.5"
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Explore Family Tree</span>
            </Link>
            <Link
              href={`/${slug}/members/invite`}
              className="inline-flex items-center px-4 py-2 rounded-md bg-white/15 hover:bg-white/25 text-white text-xs font-medium border border-white/20 transition-colors space-x-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Invite Relative</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. FOUR KEY METRIC TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-lg bg-[#F6F1E9] text-[#C18B58] flex items-center justify-center mb-3">
            <GitFork className="w-5 h-5" />
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#7A7A7A] font-semibold">
            Generations
          </span>
          <p className="font-serif text-2xl font-bold text-[#2B2B2B] mt-1">
            {summary ? `${summary.generations_count} Mapped` : "4 Mapped"}
          </p>
          <span className="text-[11px] text-[#5A5A5A]">Root: Ancestral lineage</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-lg bg-[#F6F1E9] text-[#C18B58] flex items-center justify-center mb-3">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#7A7A7A] font-semibold">
            Family Members
          </span>
          <p className="font-serif text-2xl font-bold text-[#2B2B2B] mt-1">
            {memberCount} Active
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Verified members</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-lg bg-[#F6F1E9] text-[#C18B58] flex items-center justify-center mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#7A7A7A] font-semibold">
            Oral Stories & Audio
          </span>
          <p className="font-serif text-2xl font-bold text-[#2B2B2B] mt-1">16 Recorded</p>
          <span className="text-[11px] text-[#5A5A5A]">4 coffee ceremonies</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="w-9 h-9 rounded-lg bg-[#F6F1E9] text-[#C18B58] flex items-center justify-center mb-3">
            <ImageIcon className="w-5 h-5" />
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#7A7A7A] font-semibold">
            Memory Vault
          </span>
          <p className="font-serif text-2xl font-bold text-[#2B2B2B] mt-1">142 Photos</p>
          <span className="text-[11px] text-[#5A5A5A]">7 vintage albums</span>
        </div>
      </div>

      {/* 3. TWO-COLUMN MAIN WORKSPACE DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Recent Stories & Oral Histories */}
        <div className="lg:col-span-8 space-y-6">
          {/* Recent Oral Stories Card */}
          <div className="bg-white rounded-xl border border-[#EAE3D6] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F6F1E9]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2B2B2B]">
                  Recent Stories & Elder Voices
                </h3>
                <p className="text-xs text-[#5A5A5A] font-light mt-0.5">
                  Wisdom and recollections captured directly from our family elders.
                </p>
              </div>
              <Link
                href={`/${slug}/stories`}
                className="text-xs font-semibold text-[#C18B58] hover:underline flex items-center"
              >
                View all stories <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {/* Story 1 */}
              <div className="p-4 rounded-lg bg-[#F6F1E9]/50 border border-[#EAE3D6] flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#C18B58] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
                    A
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2B2B2B]">
                      The Sunday Morning Coffee Ceremony in Gondar
                    </h4>
                    <p className="text-xs text-[#5A5A5A] mt-1 line-clamp-2 font-light">
                      Grandmother Almaz recounts how her mother roasted fresh green beans over charcoal, the three rounds of Abol, Tona, and Baraka, and how neighbors joined.
                    </p>
                    <div className="flex items-center space-x-4 mt-2.5 text-[11px] text-[#7A7A7A]">
                      <span className="flex items-center text-[#C18B58] font-medium">
                        <Mic className="w-3.5 h-3.5 mr-1" /> 14 min audio
                      </span>
                      <span>Recorded by Dawit Bekele</span>
                      <span>Nov 18, 2026</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story 2 */}
              <div className="p-4 rounded-lg bg-[#F6F1E9]/50 border border-[#EAE3D6] flex items-start justify-between">
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#343434] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
                    B
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-[#2B2B2B]">
                      How Our Grandparents Met at the Meskel Celebration (1964)
                    </h4>
                    <p className="text-xs text-[#5A5A5A] mt-1 line-clamp-2 font-light">
                      The story of Bekele Wolde and Almaz Tesfaye meeting by the Demera fire in Meskel Square, recorded on their 50th anniversary.
                    </p>
                    <div className="flex items-center space-x-4 mt-2.5 text-[11px] text-[#7A7A7A]">
                      <span>Written story & 3 photos</span>
                      <span>Curated by Selam Bekele</span>
                      <span>Nov 12, 2026</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Family Celebrations */}
          <div className="bg-white rounded-xl border border-[#EAE3D6] p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F6F1E9]">
              <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
                Upcoming Milestones & Celebrations
              </h3>
              <Link
                href={`/${slug}/events`}
                className="text-xs font-semibold text-[#C18B58] hover:underline"
              >
                Add Event +
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg border border-[#EAE3D6] flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#F6F1E9] text-[#C18B58] flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase">DEC</span>
                  <span className="text-sm font-serif font-bold leading-none">14</span>
                </div>
                <div>
                  <h5 className="font-serif font-bold text-xs text-[#2B2B2B]">
                    Grandmother Almaz’s 82nd Birthday
                  </h5>
                  <p className="text-[11px] text-[#7A7A7A] mt-0.5">Family gathering in Addis Ababa & Zoom</p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg border border-[#EAE3D6] flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#F6F1E9] text-[#C18B58] flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold uppercase">JAN</span>
                  <span className="text-sm font-serif font-bold leading-none">07</span>
                </div>
                <div>
                  <h5 className="font-serif font-bold text-xs text-[#2B2B2B]">
                    Ethiopian Christmas (Genna) Celebration
                  </h5>
                  <p className="text-[11px] text-[#7A7A7A] mt-0.5">Communal dinner and storytelling</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Actions & Activity Feed */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#EAE3D6] p-6 shadow-xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#2B2B2B] mb-2 uppercase tracking-wider">
              Quick Actions
            </h3>
            <Link
              href={`/${slug}/tree`}
              className="w-full py-2.5 px-3 rounded-lg border border-[#D5C9B8] text-xs font-medium text-[#2B2B2B] hover:bg-[#F6F1E9] transition-colors flex items-center justify-between"
            >
              <span className="flex items-center">
                <Plus className="w-3.5 h-3.5 mr-2 text-[#C18B58]" />
                Add Person to Tree
              </span>
              <span className="text-xs">&rarr;</span>
            </Link>
            <Link
              href={`/${slug}/stories`}
              className="w-full py-2.5 px-3 rounded-lg border border-[#D5C9B8] text-xs font-medium text-[#2B2B2B] hover:bg-[#F6F1E9] transition-colors flex items-center justify-between"
            >
              <span className="flex items-center">
                <Mic className="w-3.5 h-3.5 mr-2 text-[#C18B58]" />
                Record Elder Audio
              </span>
              <span className="text-xs">&rarr;</span>
            </Link>
            <Link
              href={`/${slug}/events`}
              className="w-full py-2.5 px-3 rounded-lg border border-[#D5C9B8] text-xs font-medium text-[#2B2B2B] hover:bg-[#F6F1E9] transition-colors flex items-center justify-between"
            >
              <span className="flex items-center">
                <QrCode className="w-3.5 h-3.5 mr-2 text-[#C18B58]" />
                Create Event QR Upload
              </span>
              <span className="text-xs">&rarr;</span>
            </Link>
          </div>

          {/* Recent Activity Log */}
          <div className="bg-white rounded-xl border border-[#EAE3D6] p-6 shadow-xs">
            <h3 className="font-serif text-sm font-bold text-[#2B2B2B] mb-4 uppercase tracking-wider">
              Recent Workspace Activity
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3 pb-3 border-b border-[#F6F1E9]">
                <div className="w-2 h-2 rounded-full bg-[#C18B58] mt-1.5 shrink-0" />
                <div>
                  <p className="text-[#2B2B2B]">
                    <span className="font-semibold">Hana Mekonnen</span> uploaded 4 photographs to <span className="italic">Wedding Memories 1998</span>.
                  </p>
                  <span className="text-[10px] text-[#7A7A7A]">3 hours ago</span>
                </div>
              </div>

              <div className="flex items-start space-x-3 pb-3 border-b border-[#F6F1E9]">
                <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div>
                  <p className="text-[#2B2B2B]">
                    <span className="font-semibold">Dawit Bekele</span> added kinship connection for <span className="font-semibold">Kalkidan Bekele</span>.
                  </p>
                  <span className="text-[10px] text-[#7A7A7A]">Yesterday</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-[#2B2B2B]">
                    <span className="font-semibold">Selam Bekele</span> created the family workspace.
                  </p>
                  <span className="text-[10px] text-[#7A7A7A]">Nov 15, 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
