"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Mic,
  BookOpen,
  Image as ImageIcon,
  Heart,
  Users,
  Clock,
  Sparkles,
  Share2,
  Edit,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/services/api";

interface RelativeLink {
  id: string;
  name: string;
  relation: string;
}

export default function PersonProfilePage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";
  const personId = (params?.personId as string) || "p-aster";

  const [activeTab, setActiveTab] = useState<"bio" | "family" | "memories" | "timeline">("bio");
  const [loading, setLoading] = useState(false);
  const [livePerson, setLivePerson] = useState<any | null>(null);

  useEffect(() => {
    async function loadPerson() {
      if (!personId || personId.startsWith("p-")) return;
      setLoading(true);
      const res = await apiRequest(`/api/v1/families/by-slug/${slug}/persons/${personId}/`);
      if (res.success && res.data) {
        setLivePerson(res.data);
      }
      setLoading(false);
    }
    loadPerson();
  }, [slug, personId]);

  // Default fallback details (Grandmother Aster Gebre)
  const defaultPerson = {
    id: personId,
    name: "Aster Gebre Mariam",
    amharicName: "አስቴር ገብረ ማርያም",
    lifespan: "1945 – 2021",
    kinship: "Grandmother",
    ethiopianKinship: "አያት (የአባት እናት)",
    birthDate: "April 12, 1945 (circa)",
    birthPlace: "Axum, Tigray, Ethiopia",
    deathDate: "October 14, 2021",
    deathPlace: "Addis Ababa, Ethiopia",
    bio: "Revered matriarch of our family. Known for her wisdom, hospitality, and dedication to preserving oral traditions. During the 1970s and 80s, her home in Gondar and later Addis Ababa served as the sanctuary for family gatherings and celebratory coffee ceremonies.",
    parents: [
      { id: "p-gebre", name: "Gebre Mariam Kassa", relation: "Father" },
      { id: "p-walatta", name: "Walatta Petros", relation: "Mother" },
    ],
    spouse: { id: "p-elias", name: "Elias Bekele Wolde", relation: "Husband (Married 1962)" },
    children: [
      { id: "p-dawit", name: "Dawit Elias Mekonnen", relation: "Son (Your Father)" },
      { id: "p-tigist", name: "Tigist Elias Alemu", relation: "Daughter (Your Aunt)" },
    ],
    stories: [
      {
        title: "The Sunday Morning Coffee Ceremony in Gondar",
        duration: "14 min audio",
        date: "Recorded Nov 2018",
        summary: "Aster explains the symbolism of Abol, Tona, and Baraka, roasting frankincense and brewing in the clay jebena.",
      },
      {
        title: "Memories of the Historic Axum Harvest",
        duration: "Written story",
        date: "Documented Jan 2019",
        summary: "Childhood recollections of the seasonal teff harvest and community song traditions in Northern Ethiopia.",
      },
    ],
    memories: [
      { title: "Dawit & Hana's Wedding Ceremony", year: "1988", type: "Sepia Photo" },
      { title: "Aster holding newborn Selam", year: "1994", type: "Family Portrait" },
      { title: "50th Anniversary with Elias", year: "2012", type: "Color Photograph" },
    ],
    timeline: [
      { year: "1945", event: "Born in Axum, Tigray." },
      { year: "1962", event: "Married Elias Bekele in Gondar." },
      { year: "1964", event: "Gave birth to first son, Dawit." },
      { year: "1982", event: "Moved with family to Addis Ababa." },
      { year: "2012", event: "Celebrated Golden 50th Wedding Anniversary." },
      { year: "2021", event: "Passed peacefully in Addis Ababa surrounded by children and grandchildren." },
    ],
  };

  const person = livePerson
    ? {
        ...defaultPerson,
        name: livePerson.full_name || livePerson.first_name,
        amharicName: livePerson.cultural_titles || "",
        lifespan: `${livePerson.birth_year || "Unknown"} – ${livePerson.is_living ? "Present" : livePerson.death_year || "Deceased"}`,
        kinship: livePerson.cultural_titles || `Generation ${livePerson.generation_level || 1}`,
        birthDate: livePerson.birth_date || `${livePerson.birth_year || "Unknown"}`,
        birthPlace: livePerson.birth_place || "Ethiopia",
        bio: livePerson.biography || defaultPerson.bio,
        parents: Array.isArray(livePerson.parents)
          ? livePerson.parents.map((p: any) => ({ id: p.id, name: p.full_name, relation: "Parent" }))
          : defaultPerson.parents,
        children: Array.isArray(livePerson.children)
          ? livePerson.children.map((c: any) => ({ id: c.id, name: c.full_name, relation: "Child" }))
          : defaultPerson.children,
      }
    : defaultPerson;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D6]">
        <Link
          href={`/${slug}/tree`}
          className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Family Tree Canvas
        </Link>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert("Shareable link copied")}
            className="p-2 rounded-md border border-[#D5C9B8] text-[#5A5A5A] hover:bg-[#F6F1E9]"
            title="Share Profile"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Person Header Card */}
      <div className="bg-white rounded-2xl p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-[#A75D5D] text-white flex items-center justify-center font-serif font-bold text-4xl shadow-md shrink-0">
          {person.name.charAt(0)}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#2B2B2B]">
              {person.name}
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F6F1E9] border border-[#EAE3D6] font-medium text-[#C18B58]">
              {person.kinship} · {person.ethiopianKinship}
            </span>
          </div>

          <p className="font-serif text-sm text-[#7A7A7A] font-medium">
            {person.amharicName}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-[#5A5A5A]">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#C18B58]" />
              {person.lifespan}
            </span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#C18B58]" />
              {person.birthPlace}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EAE3D6] space-x-8 text-xs font-medium">
        <button
          onClick={() => setActiveTab("bio")}
          className={`pb-3 transition-colors relative ${
            activeTab === "bio"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Biography & Stories
        </button>
        <button
          onClick={() => setActiveTab("family")}
          className={`pb-3 transition-colors relative ${
            activeTab === "family"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Immediate Family Connections
        </button>
        <button
          onClick={() => setActiveTab("timeline")}
          className={`pb-3 transition-colors relative ${
            activeTab === "timeline"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Life Timeline & Milestones
        </button>
        <button
          onClick={() => setActiveTab("memories")}
          className={`pb-3 transition-colors relative ${
            activeTab === "memories"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Photos & Memories ({person.memories.length})
        </button>
      </div>

      {/* 1. BIOGRAPHY & ORAL RECORDINGS */}
      {activeTab === "bio" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE3D6] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
              Life Story & Recollections
            </h3>
            <p className="text-xs sm:text-sm text-[#5A5A5A] font-light leading-relaxed">
              {person.bio}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE3D6] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
              Elder Oral Stories & Voice Memos
            </h3>
            <div className="space-y-4">
              {person.stories.map((st, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#F6F1E9]/60 border border-[#EAE3D6] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-[#2B2B2B]">
                      {st.title}
                    </h4>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                      {st.duration}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A5A5A] font-light">
                    {st.summary}
                  </p>
                  <span className="text-[10px] text-[#7A7A7A] block pt-1">{st.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. IMMEDIATE FAMILY CONNECTIONS */}
      {activeTab === "family" && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE3D6] space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
            Immediate Genealogical Relationships
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Spouse */}
            <div className="p-4 rounded-xl bg-[#F6F1E9]/40 border border-[#EAE3D6] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#7A7A7A]">Spouse / Partner</span>
              <p className="font-serif font-bold text-sm text-[#2B2B2B]">{person.spouse.name}</p>
              <p className="text-[11px] text-[#5A5A5A]">{person.spouse.relation}</p>
            </div>

            {/* Parents */}
            <div className="p-4 rounded-xl bg-[#F6F1E9]/40 border border-[#EAE3D6] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#7A7A7A]">Parents</span>
              {person.parents.map((p: RelativeLink, i: number) => (
                <div key={i}>
                  <p className="font-serif font-bold text-xs text-[#2B2B2B]">{p.name}</p>
                  <p className="text-[10px] text-[#7A7A7A]">{p.relation}</p>
                </div>
              ))}
            </div>

            {/* Children */}
            <div className="sm:col-span-2 p-4 rounded-xl bg-[#F6F1E9]/40 border border-[#EAE3D6] space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#7A7A7A]">Children & Descendants</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {person.children.map((c: RelativeLink, i: number) => (
                  <div key={i} className="p-2.5 rounded-lg bg-white border border-[#EAE3D6]">
                    <p className="font-serif font-bold text-xs text-[#2B2B2B]">{c.name}</p>
                    <p className="text-[10px] text-[#7A7A7A]">{c.relation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TIMELINE & MILESTONES */}
      {activeTab === "timeline" && (
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE3D6] space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
            Chronological Life Continuum
          </h3>
          <div className="relative pl-6 space-y-6 border-l-2 border-[#C18B58]">
            {person.timeline.map((tm, i) => (
              <div key={i} className="relative">
                <div className="w-3 h-3 rounded-full bg-[#C18B58] absolute -left-[31px] top-1" />
                <span className="text-xs font-serif font-bold text-[#C18B58]">{tm.year}</span>
                <p className="text-xs text-[#2B2B2B] mt-0.5 font-light">{tm.event}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MEMORIES */}
      {activeTab === "memories" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {person.memories.map((m, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden border border-[#EAE3D6] shadow-xs">
              <div className="aspect-[4/3] bg-[#EAE3D6] flex items-center justify-center text-[#7A7A7A]">
                <ImageIcon className="w-8 h-8" />
              </div>
              <div className="p-4">
                <h4 className="font-serif font-bold text-xs text-[#2B2B2B]">{m.title}</h4>
                <div className="flex justify-between items-center text-[10px] text-[#7A7A7A] mt-2">
                  <span>{m.type}</span>
                  <span>{m.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
