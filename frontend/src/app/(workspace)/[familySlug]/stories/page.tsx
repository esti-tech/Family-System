"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  BookOpen,
  Mic,
  Plus,
  Search,
  Filter,
  Play,
  Clock,
  Sparkles,
  ArrowRight,
  Coffee,
  Heart,
} from "lucide-react";

interface StoryItem {
  id: string;
  title: string;
  amharicTitle?: string;
  storyteller: string;
  role: string;
  date: string;
  category: "AUDIO" | "RECIPE" | "MIGRATION" | "MEMOIR";
  durationOrReadTime: string;
  excerpt: string;
  hasAudio: boolean;
  avatarColor: string;
}

export default function FamilyStoriesPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [activeCategory, setActiveCategory] = useState<"ALL" | "AUDIO" | "RECIPE" | "MIGRATION" | "MEMOIR">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const stories: StoryItem[] = [
    {
      id: "story-coffee-ceremony",
      title: "The Sunday Morning Coffee Ceremony in Gondar",
      amharicTitle: "የጎንደር የሰንበት ጠዋት የቡና ቁርስ",
      storyteller: "Almaz Tesfaye",
      role: "Grandmother",
      date: "Recorded Nov 18, 2026",
      category: "AUDIO",
      durationOrReadTime: "14 min audio recording",
      excerpt: "Roasting fresh green beans over charcoal, the aromatic smoke of frankincense, and the three sacred rounds of Abol, Tona, and Baraka that brought neighbors together.",
      hasAudio: true,
      avatarColor: "bg-[#A75D5D]",
    },
    {
      id: "story-aster-photos",
      title: "The Photographs Aster Kept",
      amharicTitle: "አስቴር ያስቀመጠቻቸው የድሮ ፎቶግራፎች",
      storyteller: "Selam Mekonnen",
      role: "You · Granddaughter",
      date: "Written Nov 10, 2026",
      category: "MEMOIR",
      durationOrReadTime: "6 min read · 4 photos",
      excerpt: "A vintage metal tin filled with sepia prints from Axum and Gondar, handwritten notes on the back, and the quiet afternoons spent identifying faces with our grandfather.",
      hasAudio: false,
      avatarColor: "bg-[#C18B58]",
    },
    {
      id: "story-doro-wat",
      title: "Traditional Doro Wat: The Secret 12-Spice Blend",
      amharicTitle: "የእናቴ የዶሮ ወጥ አዘገጃጀት ሚስጥር",
      storyteller: "Hana Mekonnen",
      role: "Mother",
      date: "Documented Oct 24, 2026",
      category: "RECIPE",
      durationOrReadTime: "Family Recipe · 5 min read",
      excerpt: "Slow-caramelizing red onions without oil, the balanced Berbere from Harar, and the exact timing for adding the hard-boiled eggs and niter kibbeh.",
      hasAudio: false,
      avatarColor: "bg-[#293241]",
    },
    {
      id: "story-1982-migration",
      title: "From Axum to Addis Ababa: Our 1982 Journey",
      amharicTitle: "ከአክሱም ወደ አዲስ አበባ የተደረገ ጉዞ",
      storyteller: "Dawit Mekonnen",
      role: "Father",
      date: "Recorded Sep 14, 2026",
      category: "MIGRATION",
      durationOrReadTime: "18 min audio & text",
      excerpt: "The historic relocation across the highlands during the 1980s, setting up our new home in Kazanchis, and finding our relatives through community word of mouth.",
      hasAudio: true,
      avatarColor: "bg-[#3D5A80]",
    },
    {
      id: "story-sunday-calls",
      title: "Home is a Voice on the Other End",
      amharicTitle: "የእሁድ ስልክ ጥሪዎች",
      storyteller: "Yonas Mekonnen",
      role: "Brother",
      date: "Written Aug 02, 2026",
      category: "MEMOIR",
      durationOrReadTime: "4 min read",
      excerpt: "Living abroad in Europe, Sunday calls with home in Addis Ababa became an irreplaceable tradition. Distance shrinks when familiar laughter fills the room.",
      hasAudio: false,
      avatarColor: "bg-[#588157]",
    },
  ];

  const filtered = stories.filter((s) => {
    const matchesCat = activeCategory === "ALL" || s.category === activeCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.storyteller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#EAE3D6] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-semibold">
            HERITAGE ARCHIVE
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2B2B2B] mt-0.5">
            Family Stories & Oral Histories
          </h1>
          <p className="text-xs text-[#5A5A5A] font-light mt-1">
            Preserve elder audio memoirs, traditional recipes, folklore, and family migration stories.
          </p>
        </div>

        <Link
          href={`/${slug}/stories/new`}
          className="inline-flex items-center px-4 py-2 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors space-x-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record or Write Story</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex border-b sm:border-none border-[#EAE3D6] space-x-6 text-xs font-medium w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`transition-colors whitespace-nowrap pb-1 ${
              activeCategory === "ALL"
                ? "text-[#2B2B2B] font-bold border-b-2 border-[#C18B58]"
                : "text-[#7A7A7A] hover:text-[#2B2B2B]"
            }`}
          >
            All Stories ({stories.length})
          </button>
          <button
            onClick={() => setActiveCategory("AUDIO")}
            className={`transition-colors whitespace-nowrap pb-1 flex items-center space-x-1 ${
              activeCategory === "AUDIO"
                ? "text-[#2B2B2B] font-bold border-b-2 border-[#C18B58]"
                : "text-[#7A7A7A] hover:text-[#2B2B2B]"
            }`}
          >
            <Mic className="w-3 h-3 text-[#C18B58]" />
            <span>Voice Memos</span>
          </button>
          <button
            onClick={() => setActiveCategory("RECIPE")}
            className={`transition-colors whitespace-nowrap pb-1 flex items-center space-x-1 ${
              activeCategory === "RECIPE"
                ? "text-[#2B2B2B] font-bold border-b-2 border-[#C18B58]"
                : "text-[#7A7A7A] hover:text-[#2B2B2B]"
            }`}
          >
            <Coffee className="w-3 h-3 text-[#C18B58]" />
            <span>Traditions & Recipes</span>
          </button>
          <button
            onClick={() => setActiveCategory("MIGRATION")}
            className={`transition-colors whitespace-nowrap pb-1 ${
              activeCategory === "MIGRATION"
                ? "text-[#2B2B2B] font-bold border-b-2 border-[#C18B58]"
                : "text-[#7A7A7A] hover:text-[#2B2B2B]"
            }`}
          >
            Migrations
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7A7A7A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories or teller..."
            className="w-full pl-8 pr-3.5 py-1.5 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
          />
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((story) => (
          <div
            key={story.id}
            className="bg-white rounded-2xl p-6 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between space-y-4 group"
          >
            <div>
              {/* Header: Storyteller Info */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#F6F1E9]">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-8 h-8 rounded-full ${story.avatarColor} text-white flex items-center justify-center font-serif font-bold text-xs shadow-xs`}
                  >
                    {story.storyteller.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-[#2B2B2B]">
                      {story.storyteller}
                    </h5>
                    <span className="text-[10px] text-[#7A7A7A]">{story.role}</span>
                  </div>
                </div>

                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F6F1E9] text-[#7A7A7A] font-medium border border-[#EAE3D6]">
                  {story.durationOrReadTime}
                </span>
              </div>

              {/* Title & Excerpt */}
              <h3 className="font-serif text-xl font-bold text-[#2B2B2B] group-hover:text-[#C18B58] transition-colors leading-snug">
                {story.title}
              </h3>
              {story.amharicTitle && (
                <p className="font-serif text-xs text-[#7A7A7A] italic mt-0.5">
                  {story.amharicTitle}
                </p>
              )}
              <p className="text-xs text-[#5A5A5A] font-light leading-relaxed mt-2.5 line-clamp-3">
                {story.excerpt}
              </p>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#F6F1E9] flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#7A7A7A]">{story.date}</span>
              <Link
                href={`/${slug}/stories/${story.id}`}
                className="inline-flex items-center font-semibold text-[#C18B58] hover:underline space-x-1"
              >
                <span>{story.hasAudio ? "Listen & Read" : "Read Story"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
