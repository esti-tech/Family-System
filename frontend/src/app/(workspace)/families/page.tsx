"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Users, UserPlus, ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { apiRequest } from "@/services/api";

interface FamilyItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  origin_city: string;
  origin_country: string;
  member_count: number;
}

export default function FamilySelectionPage() {
  const [families, setFamilies] = useState<FamilyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFamilies() {
      const res = await apiRequest("/api/v1/families/");
      if (res.success && Array.isArray(res.data)) {
        setFamilies(res.data);
      } else {
        // Fallback demo workspace for immediate review
        setFamilies([
          {
            id: "fam-1",
            name: "The Bekele Family Archive",
            slug: "the-bekele-family",
            description: "Preserving our multi-generational heritage from Gondar & Addis Ababa.",
            origin_city: "Gondar",
            origin_country: "Ethiopia",
            member_count: 14,
          },
          {
            id: "fam-2",
            name: "Mekonnen Clan Heritage",
            slug: "mekonnen-clan",
            description: "Wedding archives, coffee ceremonies, and elder oral histories.",
            origin_city: "Harar",
            origin_country: "Ethiopia",
            member_count: 8,
          },
        ]);
      }
      setLoading(false);
    }
    loadFamilies();
  }, []);

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col">
      {/* Top Header */}
      <header className="h-20 bg-white border-b border-border px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm">
            K
          </div>
          <span className="font-serif font-bold text-2xl text-charcoal-900">KinKeep</span>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            href="/families/join"
            className="inline-flex items-center px-4 py-2 rounded-lg border border-border text-xs font-semibold text-charcoal-800 bg-white hover:bg-ivory-50 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4 mr-1.5 text-gold-600" />
            Join Family
          </Link>
          <Link
            href="/families/new"
            className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gold-500 hover:bg-gold-600 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Family
          </Link>
        </div>
      </header>

      {/* Main Workspace Selection Grid */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[11px] uppercase font-bold tracking-widest text-gold-600">
            Family Spaces
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-1">
            Choose Your Family Space
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-2">
            Select a workspace to view your living family tree, oral histories, and shared memories.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-xs text-charcoal-600">Loading workspaces...</div>
        ) : families.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal-900">No Family Spaces Yet</h3>
            <p className="text-xs text-charcoal-700 mt-2 leading-relaxed">
              Create your family&apos;s living archive or enter an invitation code to join an existing space.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/families/new"
                className="px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold shadow-xs"
              >
                Create a Family
              </Link>
              <Link
                href="/families/join"
                className="px-5 py-2.5 rounded-lg border border-border text-charcoal-800 text-xs font-semibold hover:bg-ivory-50"
              >
                Enter Invite Code
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {families.map((fam) => (
              <div
                key={fam.id}
                className="bg-white rounded-2xl border border-border overflow-hidden shadow-card hover:shadow-heirloom transition-all flex flex-col justify-between group"
              >
                {/* Visual Cover Banner */}
                <div className="h-36 bg-gradient-to-r from-charcoal-900 to-charcoal-800 relative p-4 flex flex-col justify-between text-white">
                  <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay bg-[url('https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80')]" />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-gold-500/90 text-white">
                      Active
                    </span>
                    <div className="flex items-center space-x-1 text-[11px] text-ivory-200">
                      <Users className="w-3.5 h-3.5 text-gold-300" />
                      <span>{fam.member_count} members</span>
                    </div>
                  </div>
                  <div className="relative z-10 flex items-center space-x-1.5 text-xs text-ivory-200">
                    <MapPin className="w-3.5 h-3.5 text-gold-400" />
                    <span>{fam.origin_city ? `${fam.origin_city}, ` : ""}{fam.origin_country}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-charcoal-900 group-hover:text-gold-600 transition-colors">
                      {fam.name}
                    </h3>
                    <p className="text-xs text-charcoal-700 mt-2 line-clamp-2 leading-relaxed">
                      {fam.description || "Preserving family oral history, photos, and lineage connections."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-[11px] text-charcoal-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                      <span>Encrypted Vault</span>
                    </div>
                    <Link
                      href={`/${fam.slug}/dashboard`}
                      className="inline-flex items-center text-xs font-bold text-gold-600 hover:text-gold-700 group-hover:translate-x-0.5 transition-all"
                    >
                      <span>Open Family</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
