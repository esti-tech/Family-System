"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, UserPlus, Shield, MapPin, ChevronDown, Bell, Users, Clock, Sparkles } from "lucide-react";

interface FamilySpace {
  id: string;
  name: string;
  slug: string;
  role: string;
  ownerName: string;
  origin: string;
  memberCount: number;
  recentActivity: string;
  coverImage?: string;
}

export default function FamilySelectionPage() {
  const [filterSort, setFilterSort] = useState("recently_opened");
  const [viewState, setViewState] = useState<"active" | "empty" | "loading">("active");

  const familySpaces: FamilySpace[] = [
    {
      id: "fam-1",
      name: "Bekele Family",
      slug: "bekele-family",
      role: "Owner (you)",
      ownerName: "Selam Bekele",
      origin: "Gondar & Addis Ababa",
      memberCount: 18,
      recentActivity: "2 new stories added yesterday",
    },
    {
      id: "fam-2",
      name: "Mekonnen Family",
      slug: "mekonnen-family",
      role: "Admin",
      ownerName: "Hana Mekonnen",
      origin: "Harar, Ethiopia",
      memberCount: 24,
      recentActivity: "Wedding photo album created 3 days ago",
    },
    {
      id: "fam-3",
      name: "Tesfaye Family",
      slug: "tesfaye-family",
      role: "Contributor",
      ownerName: "Dawit Tesfaye",
      origin: "Dire Dawa & Hawassa",
      memberCount: 11,
      recentActivity: "Oral history recording shared last week",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1E9] flex flex-col">
      {/* Top Navigation Bar (Figma Page 32) */}
      <header className="h-20 bg-white border-b border-[#EAE3D6] px-6 sm:px-10 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center">
          <span className="font-serif font-bold text-2xl text-[#2B2B2B]">
            KinKeep
          </span>
        </Link>

        {/* User Navigation Pill */}
        <div className="flex items-center space-x-6">
          <Link
            href="/notifications"
            className="relative p-2 text-[#5A5A5A] hover:text-[#2B2B2B] transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#C18B58] text-white text-[10px] font-bold flex items-center justify-center">
              2
            </span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center space-x-3 py-1.5 px-3 rounded-full hover:bg-[#F6F1E9] transition-colors border border-transparent hover:border-[#EAE3D6]"
          >
            <div className="w-8 h-8 rounded-full bg-[#C18B58] text-white font-serif font-bold text-sm flex items-center justify-center shadow-xs">
              S
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#2B2B2B]">Selam Bekele</span>
              <span className="text-[10px] text-[#7A7A7A]">Personal account ⌄</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 py-12">
        {/* State Toggle for Review (Active / Empty / Loading) */}
        <div className="mb-8 flex items-center justify-end space-x-2 text-xs">
          <span className="text-[#7A7A7A]">Figma State Preview:</span>
          <button
            onClick={() => setViewState("active")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              viewState === "active" ? "bg-[#C18B58] text-white" : "bg-white text-[#5A5A5A] border border-[#EAE3D6]"
            }`}
          >
            With Families (P.32)
          </button>
          <button
            onClick={() => setViewState("empty")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              viewState === "empty" ? "bg-[#C18B58] text-white" : "bg-white text-[#5A5A5A] border border-[#EAE3D6]"
            }`}
          >
            Empty (P.33)
          </button>
          <button
            onClick={() => setViewState("loading")}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              viewState === "loading" ? "bg-[#C18B58] text-white" : "bg-white text-[#5A5A5A] border border-[#EAE3D6]"
            }`}
          >
            Loading (P.34)
          </button>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-8 border-b border-[#EAE3D6] gap-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#7A7A7A] font-semibold mb-2">
              WELCOME BACK, SELAM
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#2B2B2B] font-normal tracking-tight">
              Choose Your Family Space
            </h1>
            <p className="text-sm text-[#5A5A5A] font-light mt-2 max-w-xl">
              Pick up where you left off, or begin a new branch of your family’s story.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/families/join"
              className="inline-flex items-center px-4 py-2.5 rounded-md border border-[#D5C9B8] text-xs font-semibold text-[#2B2B2B] bg-white hover:bg-[#F6F1E9] transition-colors shadow-xs"
            >
              <UserPlus className="w-4 h-4 mr-1.5 text-[#C18B58]" />
              Join a Family
            </Link>
            <Link
              href="/families/new"
              className="inline-flex items-center px-5 py-2.5 rounded-md text-xs font-semibold text-white bg-[#C18B58] hover:bg-[#b07d4b] transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create a New Family
            </Link>
          </div>
        </div>

        {/* 1. STATE: LOADING (Figma Page 34) */}
        {viewState === "loading" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#7A7A7A] font-medium">
                Your Family Spaces · Loading…
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-[#EAE3D6] space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#EAE3D6]" />
                  <div className="w-3/4 h-5 bg-[#EAE3D6] rounded" />
                  <div className="w-1/2 h-3 bg-[#EAE3D6] rounded" />
                  <div className="w-full h-8 bg-[#EAE3D6] rounded mt-4" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. STATE: EMPTY (Figma Page 33) */}
        {viewState === "empty" && (
          <div className="bg-white rounded-2xl p-12 sm:p-16 border border-[#EAE3D6] shadow-sm text-center max-w-2xl mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-[#F6F1E9] text-[#C18B58] flex items-center justify-center mx-auto mb-6 border border-[#EAE3D6]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2B2B2B] mb-2">
              No family spaces yet
            </h3>
            <p className="text-sm text-[#5A5A5A] font-light max-w-md mx-auto mb-8 leading-relaxed">
              A family space starts with you. Create a home for your family’s stories, or join the people you love with an invitation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/families/new"
                className="w-full sm:w-auto px-6 py-2.5 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Create a New Family
              </Link>
              <Link
                href="/families/join"
                className="w-full sm:w-auto px-6 py-2.5 rounded-md border border-[#D5C9B8] text-[#2B2B2B] text-xs font-semibold hover:bg-[#F6F1E9] transition-colors"
              >
                Join a Family
              </Link>
            </div>
            <p className="text-xs text-[#7A7A7A] mt-8 font-light">
              Have an invite link? Open it to join your family’s space, or ask the owner for a code.
            </p>
          </div>
        )}

        {/* 3. STATE: ACTIVE WITH CARDS (Figma Page 32) */}
        {viewState === "active" && (
          <div>
            {/* Sub-header with spaces count and filter */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-serif font-bold text-[#2B2B2B]">
                  Your Family Spaces
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#EAE3D6] text-[11px] font-medium text-[#7A7A7A]">
                  {familySpaces.length} spaces
                </span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center text-xs text-[#5A5A5A] bg-white px-3 py-1.5 rounded-md border border-[#EAE3D6] hover:text-[#2B2B2B]"
                >
                  Recently opened
                  <ChevronDown className="w-3.5 h-3.5 ml-1 text-[#7A7A7A]" />
                </button>
              </div>
            </div>

            {/* Family Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {familySpaces.map((fam) => (
                <div
                  key={fam.id}
                  className="bg-white rounded-xl p-6 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top row: Initial icon + role tag */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#F6F1E9] border border-[#EAE3D6] text-[#C18B58] font-serif font-bold text-xl flex items-center justify-center group-hover:bg-[#C18B58] group-hover:text-white transition-colors">
                        {fam.name.charAt(0)}
                      </div>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-[#F6F1E9] text-[#7A7A7A] font-semibold border border-[#EAE3D6]">
                        {fam.role}
                      </span>
                    </div>

                    {/* Family Name */}
                    <h3 className="font-serif text-xl font-bold text-[#2B2B2B] mb-1 group-hover:text-[#C18B58] transition-colors">
                      {fam.name}
                    </h3>
                    <p className="text-xs text-[#7A7A7A] mb-4 flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#C18B58]" />
                      {fam.origin}
                    </p>

                    {/* Stats & Activity */}
                    <div className="pt-4 border-t border-[#F6F1E9] space-y-2 text-xs text-[#5A5A5A]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-[#7A7A7A]">
                          <Users className="w-3.5 h-3.5 mr-1.5" />
                          Members
                        </span>
                        <span className="font-medium text-[#2B2B2B]">{fam.memberCount} relatives</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center text-[#7A7A7A]">
                          <Clock className="w-3.5 h-3.5 mr-1.5" />
                          Activity
                        </span>
                        <span className="text-[#5A5A5A] text-[11px] truncate max-w-[140px]">
                          {fam.recentActivity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Open Space Action */}
                  <div className="mt-6 pt-4 border-t border-[#EAE3D6]">
                    <Link
                      href={`/${fam.slug}/dashboard`}
                      className="w-full py-2 px-3 rounded-md bg-[#F6F1E9] hover:bg-[#C18B58] hover:text-white text-[#2B2B2B] text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Open family space</span>
                      <span className="text-xs">↗</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Invitation Helper */}
            <div className="mt-12 p-4 bg-white rounded-xl border border-[#EAE3D6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-xs text-[#5A5A5A]">
                <Shield className="w-4 h-4 text-[#C18B58]" />
                <span>
                  All family spaces are isolated and private by default. Only invited members can view tree records.
                </span>
              </div>
              <Link
                href="/families/join"
                className="text-xs font-semibold text-[#C18B58] hover:underline shrink-0"
              >
                Have an invitation code? Join here &rarr;
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#EAE3D6] bg-white text-center text-xs text-[#7A7A7A]">
        <p>© 2026 KinKeep. Rooted in family. All stories belong.</p>
      </footer>
    </div>
  );
}
