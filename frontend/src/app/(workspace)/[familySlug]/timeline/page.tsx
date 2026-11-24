"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Clock,
  Plus,
  Calendar,
  MapPin,
  Sparkles,
  Users,
  Heart,
  Compass,
  ArrowLeft,
  X,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/services/api";

interface Milestone {
  id: string;
  year: string;
  exactDate?: string;
  title: string;
  location: string;
  category: "BIRTH" | "WEDDING" | "MIGRATION" | "REUNION" | "ACHIEVEMENT";
  description: string;
  relatives: string[];
}

export default function FamilyTimelinePage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [selectedEra, setSelectedEra] = useState<string>("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  // New milestone form
  const [newYear, setNewYear] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("Addis Ababa");
  const [newCategory, setNewCategory] = useState<Milestone["category"]>("BIRTH");
  const [newDesc, setNewDesc] = useState("");

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "m-1943",
      year: "1943",
      exactDate: "Circa 1943",
      title: "Birth of Patriarch Elias Bekele",
      location: "Gondar, Begemder, Ethiopia",
      category: "BIRTH",
      description: "Elias is born in the historic city of Gondar, the foundational root of our family archive.",
      relatives: ["Elias Bekele"],
    },
    {
      id: "m-1962",
      year: "1962",
      exactDate: "January 14, 1962",
      title: "Wedding of Elias Bekele & Aster Gebre",
      location: "Gondar, Ethiopia",
      category: "WEDDING",
      description: "A traditional celebratory union marked by a festive family gathering and traditional music.",
      relatives: ["Elias Bekele", "Aster Gebre"],
    },
    {
      id: "m-1964",
      year: "1964",
      exactDate: "June 20, 1964",
      title: "Birth of Dawit Elias Mekonnen",
      location: "Gondar, Ethiopia",
      category: "BIRTH",
      description: "The arrival of Dawit deepens the roots, carrying our family traditions into the modern era.",
      relatives: ["Dawit Mekonnen", "Elias Bekele", "Aster Gebre"],
    },
    {
      id: "m-1982",
      year: "1982",
      exactDate: "Autumn 1982",
      title: "Family Relocation to Addis Ababa",
      location: "Addis Ababa, Ethiopia",
      category: "MIGRATION",
      description: "The family establishes a new permanent residence in the Kazanchis district of Addis Ababa.",
      relatives: ["Elias Bekele", "Aster Gebre", "Dawit Mekonnen", "Tigist Alemu"],
    },
    {
      id: "m-1988",
      year: "1988",
      exactDate: "December 04, 1988",
      title: "Wedding of Dawit Mekonnen & Hana Tadesse",
      location: "Addis Ababa, Ethiopia",
      category: "WEDDING",
      description: "A joyous celebration joining the Mekonnen and Tadesse lineages with traditional Habesha attire.",
      relatives: ["Dawit Mekonnen", "Hana Mekonnen"],
    },
    {
      id: "m-1994",
      year: "1994",
      exactDate: "March 15, 1994",
      title: "Birth of Selam Dawit Mekonnen",
      location: "Addis Ababa, Ethiopia",
      category: "BIRTH",
      description: "The third generation begins, welcomed by her loving grandparents and parents.",
      relatives: ["Selam Mekonnen", "Dawit Mekonnen", "Hana Mekonnen"],
    },
    {
      id: "m-2025",
      year: "2025",
      exactDate: "September 2025",
      title: "Three Generations Reunion around the Table",
      location: "Addis Ababa & Global Diaspora",
      category: "REUNION",
      description: "Relatives from Gondar, Addis Ababa, and Washington D.C. gather to celebrate and preserve our oral history.",
      relatives: ["Elias Bekele", "Dawit Mekonnen", "Hana Mekonnen", "Selam Mekonnen", "Yonas Mekonnen"],
    },
  ]);

  useEffect(() => {
    async function loadMilestones() {
      const res = await apiRequest(`/api/v1/families/by-slug/${slug}/timeline/`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const liveMilestones: Milestone[] = res.data.map((m: any) => ({
          id: m.id,
          year: String(m.year),
          exactDate: m.is_approximate_date ? `Circa ${m.year}` : (m.date || String(m.year)),
          title: m.title,
          location: m.location || "Ethiopia",
          category: (m.category === "FOUNDATION" ? "ACHIEVEMENT" : m.category === "MARRIAGE" ? "WEDDING" : m.category) as any,
          description: m.description,
          relatives: ["Family Member"],
        }));
        setMilestones(liveMilestones);
      }
    }
    loadMilestones();
  }, [slug]);

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newYear) return;

    await apiRequest(`/api/v1/families/by-slug/${slug}/timeline/`, {
      method: "POST",
      body: JSON.stringify({
        title: newTitle,
        year: parseInt(newYear),
        location: newLocation,
        category: newCategory === "WEDDING" ? "MARRIAGE" : newCategory === "ACHIEVEMENT" ? "FOUNDATION" : newCategory,
        description: newDesc,
        is_approximate_date: true,
      }),
    });

    const newItem: Milestone = {
      id: `m-${Date.now()}`,
      year: newYear,
      exactDate: newYear,
      title: newTitle,
      location: newLocation,
      category: newCategory,
      description: newDesc,
      relatives: ["Family"],
    };

    setMilestones([newItem, ...milestones].sort((a, b) => Number(a.year) - Number(b.year)));
    setShowAddModal(false);
  };

  const filtered = milestones.filter((m) => {
    const y = Number(m.year);
    if (selectedEra === "EARLY") return y < 1970;
    if (selectedEra === "MID") return y >= 1970 && y < 1990;
    if (selectedEra === "LATE") return y >= 1990 && y < 2010;
    if (selectedEra === "MODERN") return y >= 2010;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#EAE3D6] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-semibold">
            FAMILY CONTINUUM
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2B2B2B] mt-0.5">
            Historical Timeline & Milestones
          </h1>
          <p className="text-xs text-[#5A5A5A] font-light mt-1">
            Chronological continuum of births, marriages, migrations, and achievements from 1943 to 2026.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors space-x-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Era Filter Bar */}
      <div className="flex border-b border-[#EAE3D6] space-x-6 text-xs font-medium overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedEra("ALL")}
          className={`pb-2 transition-colors whitespace-nowrap ${
            selectedEra === "ALL"
              ? "text-[#2B2B2B] font-bold border-b-2 border-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          All Eras ({milestones.length})
        </button>
        <button
          onClick={() => setSelectedEra("EARLY")}
          className={`pb-2 transition-colors whitespace-nowrap ${
            selectedEra === "EARLY"
              ? "text-[#2B2B2B] font-bold border-b-2 border-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          1940s–1960s (Foundational Roots)
        </button>
        <button
          onClick={() => setSelectedEra("MID")}
          className={`pb-2 transition-colors whitespace-nowrap ${
            selectedEra === "MID"
              ? "text-[#2B2B2B] font-bold border-b-2 border-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          1970s–1980s (Migrations & Capital)
        </button>
        <button
          onClick={() => setSelectedEra("LATE")}
          className={`pb-2 transition-colors whitespace-nowrap ${
            selectedEra === "LATE"
              ? "text-[#2B2B2B] font-bold border-b-2 border-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          1990s–2000s (New Generations)
        </button>
        <button
          onClick={() => setSelectedEra("MODERN")}
          className={`pb-2 transition-colors whitespace-nowrap ${
            selectedEra === "MODERN"
              ? "text-[#2B2B2B] font-bold border-b-2 border-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          2010s–Present (Living Heritage)
        </button>
      </div>

      {/* CONTINUUM VERTICAL TIMELINE */}
      <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-[#C18B58]/40 my-8">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Marker Dot */}
            <div className="w-4 h-4 rounded-full bg-[#C18B58] border-2 border-white absolute -left-[33px] sm:-left-[41px] top-1.5 shadow-xs group-hover:scale-125 transition-transform" />

            {/* Content Card */}
            <div className="bg-white rounded-2xl p-6 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] transition-all space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-serif text-2xl font-bold text-[#C18B58]">
                  {item.year}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    item.category === "BIRTH"
                      ? "bg-blue-100 text-blue-800"
                      : item.category === "WEDDING"
                      ? "bg-purple-100 text-purple-800"
                      : item.category === "MIGRATION"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {item.category}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#7A7A7A] flex items-center mt-0.5">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-[#C18B58]" />
                  {item.location} · {item.exactDate}
                </p>
              </div>

              <p className="text-xs text-[#5A5A5A] font-light leading-relaxed">
                {item.description}
              </p>

              {/* Relatives Involved */}
              <div className="pt-2 border-t border-[#F6F1E9] flex items-center space-x-2 text-[11px] text-[#7A7A7A]">
                <Users className="w-3.5 h-3.5 text-[#C18B58]" />
                <span>Relatives: {item.relatives.join(", ")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD MILESTONE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 border border-[#EAE3D6] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-semibold">
                  TIMELINE REGISTRATION
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2B2B2B] mt-0.5">
                  Add Historical Milestone
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-[#7A7A7A] hover:text-[#2B2B2B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMilestone} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#2B2B2B] mb-1">
                    Year (e.g. 1974) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="1974"
                    className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#2B2B2B] mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Milestone["category"])}
                    className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                  >
                    <option value="BIRTH">Birth</option>
                    <option value="WEDDING">Wedding</option>
                    <option value="MIGRATION">Migration</option>
                    <option value="REUNION">Reunion</option>
                    <option value="ACHIEVEMENT">Achievement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#2B2B2B] mb-1">
                  Milestone Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Enkutatash Celebration in Gondar"
                  className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#2B2B2B] mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#2B2B2B] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Tell what occurred during this milestone..."
                  className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-md border border-[#D5C9B8] text-[#5A5A5A] hover:bg-[#F6F1E9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white font-semibold"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
