"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  GitFork,
  Plus,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  User,
  Heart,
  Calendar,
  MapPin,
  ChevronRight,
  X,
  ExternalLink,
  BookOpen,
  Mic,
  Calculator,
  Clock,
  Sparkles,
} from "lucide-react";

interface PersonNode {
  id: string;
  firstName: string;
  patronymic: string;
  familyName: string;
  amharicName?: string;
  birthYear: string;
  deathYear?: string;
  isLiving: boolean;
  gender: "MALE" | "FEMALE";
  generation: 1 | 2 | 3;
  relationshipToUser: string;
  ethiopianKinship: string;
  birthPlace: string;
  bio: string;
  avatarColor: string;
  parentIds?: string[];
  spouseId?: string;
  isCurrentUser?: boolean;
}

export default function FamilyTreePage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState<number | "ALL">("ALL");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [focusedPersonId, setFocusedPersonId] = useState<string>("p-selam");
  const [selectedPerson, setSelectedPerson] = useState<PersonNode | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New person form state
  const [newFirstName, setNewFirstName] = useState("");
  const [newPatronymic, setNewPatronymic] = useState("");
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newGender, setNewGender] = useState<"MALE" | "FEMALE">("MALE");
  const [newBirthYear, setNewBirthYear] = useState("");
  const [newBirthPlace, setNewBirthPlace] = useState("Addis Ababa");
  const [newRelation, setNewRelation] = useState("Child");
  const [newParentId, setNewParentId] = useState("p-selam");

  // Core Ethiopian Multi-Generational Lineage (Figma ui_part2 Page 9)
  const [persons, setPersons] = useState<PersonNode[]>([
    // GENERATION 1: GRANDPARENTS
    {
      id: "p-elias",
      firstName: "Elias",
      patronymic: "Bekele",
      familyName: "Wolde",
      amharicName: "ኤልያስ በቀለ",
      birthYear: "1943",
      isLiving: true,
      gender: "MALE",
      generation: 1,
      relationshipToUser: "Grandfather",
      ethiopianKinship: "አያት (የአባት አባት)",
      birthPlace: "Gondar, Begemder",
      bio: "Patriarch of the Bekele family. Master artisan and coffee merchant who established our family home in Gondar before moving to Addis Ababa.",
      avatarColor: "bg-[#8B5E3C]",
      spouseId: "p-aster",
    },
    {
      id: "p-aster",
      firstName: "Aster",
      patronymic: "Gebre",
      familyName: "Mariam",
      amharicName: "አስቴር ገብረ",
      birthYear: "1945",
      deathYear: "2021",
      isLiving: false,
      gender: "FEMALE",
      generation: 1,
      relationshipToUser: "Grandmother",
      ethiopianKinship: "አያት (የአባት እናት)",
      birthPlace: "Axum, Tigray",
      bio: "Revered matriarch, renowned for her oral storytelling and traditional jebena coffee roasting ceremonies.",
      avatarColor: "bg-[#A75D5D]",
      spouseId: "p-elias",
    },

    // GENERATION 2: PARENTS & AUNTS/UNCLES
    {
      id: "p-dawit",
      firstName: "Dawit",
      patronymic: "Elias",
      familyName: "Mekonnen",
      amharicName: "ዳዊት ኤልያስ",
      birthYear: "1964",
      isLiving: true,
      gender: "MALE",
      generation: 2,
      relationshipToUser: "Father",
      ethiopianKinship: "አባት",
      birthPlace: "Gondar, Ethiopia",
      bio: "Civil engineer and historian of the family lineage. Documented our migration to Addis Ababa during the 1980s.",
      avatarColor: "bg-[#3D5A80]",
      parentIds: ["p-elias", "p-aster"],
      spouseId: "p-hana",
    },
    {
      id: "p-hana",
      firstName: "Hana",
      patronymic: "Mekonnen",
      familyName: "Tadesse",
      amharicName: "ሃና መኮንን",
      birthYear: "1969",
      isLiving: true,
      gender: "FEMALE",
      generation: 2,
      relationshipToUser: "Mother",
      ethiopianKinship: "እናት",
      birthPlace: "Harar, Ethiopia",
      bio: "Teacher and community leader. Preserves traditional Harari embroidery and family recipes.",
      avatarColor: "bg-[#293241]",
      spouseId: "p-dawit",
    },
    {
      id: "p-tigist",
      firstName: "Tigist",
      patronymic: "Elias",
      familyName: "Alemu",
      amharicName: "ትዕግስት ኤልያስ",
      birthYear: "1975",
      isLiving: true,
      gender: "FEMALE",
      generation: 2,
      relationshipToUser: "Aunt",
      ethiopianKinship: "አክስት (የአባት እህት)",
      birthPlace: "Addis Ababa",
      bio: "Physician currently living in Washington D.C., active in the Ethiopian diaspora archive network.",
      avatarColor: "bg-[#6B705C]",
      parentIds: ["p-elias", "p-aster"],
      spouseId: "p-abebe",
    },
    {
      id: "p-abebe",
      firstName: "Abebe",
      patronymic: "Tesfaye",
      familyName: "Kassa",
      amharicName: "አበበ ተስፋዬ",
      birthYear: "1972",
      isLiving: true,
      gender: "MALE",
      generation: 2,
      relationshipToUser: "Uncle",
      ethiopianKinship: "አጎት (የአክስት ባል)",
      birthPlace: "Dire Dawa",
      bio: "Agronomist and coffee exporter.",
      avatarColor: "bg-[#4A5759]",
      spouseId: "p-tigist",
    },

    // GENERATION 3: OUR GENERATION
    {
      id: "p-selam",
      firstName: "Selam",
      patronymic: "Dawit",
      familyName: "Mekonnen",
      amharicName: "ሰላም ዳዊት",
      birthYear: "1994",
      isLiving: true,
      gender: "FEMALE",
      generation: 3,
      relationshipToUser: "You · Daughter",
      ethiopianKinship: "እኔ (ልጅ)",
      birthPlace: "Addis Ababa",
      bio: "Software designer and current KinKeep archive administrator for the Bekele & Mekonnen family.",
      avatarColor: "bg-[#C18B58]",
      parentIds: ["p-dawit", "p-hana"],
      isCurrentUser: true,
    },
    {
      id: "p-yonas",
      firstName: "Yonas",
      patronymic: "Dawit",
      familyName: "Mekonnen",
      amharicName: "ዮናስ ዳዊት",
      birthYear: "2000",
      isLiving: true,
      gender: "MALE",
      generation: 3,
      relationshipToUser: "Brother",
      ethiopianKinship: "ወንድም",
      birthPlace: "Addis Ababa",
      bio: "Architectural student at Addis Ababa University, researching historical Ethiopian stone churches.",
      avatarColor: "bg-[#588157]",
      parentIds: ["p-dawit", "p-hana"],
    },
    {
      id: "p-meron",
      firstName: "Meron",
      patronymic: "Abebe",
      familyName: "Tesfaye",
      amharicName: "ሜሮን አበበ",
      birthYear: "2004",
      isLiving: true,
      gender: "FEMALE",
      generation: 3,
      relationshipToUser: "Cousin",
      ethiopianKinship: "የአክስት ልጅ",
      birthPlace: "Washington, D.C.",
      bio: "High school senior and competitive swimmer.",
      avatarColor: "bg-[#B5838D]",
      parentIds: ["p-tigist", "p-abebe"],
    },
  ]);

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName) return;

    const newPerson: PersonNode = {
      id: `p-${Date.now()}`,
      firstName: newFirstName,
      patronymic: newPatronymic || "Dawit",
      familyName: newFamilyName || "Mekonnen",
      birthYear: newBirthYear || "2026",
      isLiving: true,
      gender: newGender,
      generation: newRelation === "Parent" ? 2 : 3,
      relationshipToUser: newRelation,
      ethiopianKinship: newRelation,
      birthPlace: newBirthPlace,
      bio: "Recently added family member.",
      avatarColor: "bg-[#C18B58]",
      parentIds: [newParentId],
    };

    setPersons([...persons, newPerson]);
    setShowAddModal(false);
    setSelectedPerson(newPerson);
  };

  const filteredPersons = persons.filter((p) => {
    const fullName = `${p.firstName} ${p.patronymic} ${p.familyName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesGen = selectedGeneration === "ALL" || p.generation === selectedGeneration;
    return matchesSearch && matchesGen;
  });

  const gen1 = filteredPersons.filter((p) => p.generation === 1);
  const gen2 = filteredPersons.filter((p) => p.generation === 2);
  const gen3 = filteredPersons.filter((p) => p.generation === 3);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. TOP HEADER & TOOLBAR (Figma ui_part2 Page 9) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#EAE3D6] gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#7A7A7A] font-semibold mb-1">
            <span>FAMILY CONNECTIONS</span>
            <span>·</span>
            <span className="text-[#C18B58]">{persons.length} relatives · 3 generations</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#2B2B2B]">
            Our Family Tree
          </h1>
          <p className="text-xs text-[#5A5A5A] font-light mt-1">
            Every generation, one shared story. Click any relative to explore their biography, photos, and kinship path.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/${slug}/tree/kinship`}
            className="inline-flex items-center px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs font-semibold text-[#2B2B2B] bg-white hover:bg-[#F6F1E9] transition-colors shadow-xs space-x-1.5"
          >
            <Calculator className="w-3.5 h-3.5 text-[#C18B58]" />
            <span>Kinship Calculator</span>
          </Link>

          <Link
            href={`/${slug}/tree/proposals`}
            className="inline-flex items-center px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs font-semibold text-[#2B2B2B] bg-white hover:bg-[#F6F1E9] transition-colors shadow-xs space-x-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-[#C18B58]" />
            <span>Pending Proposals</span>
          </Link>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-4 py-2 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Family Member</span>
          </button>
        </div>
      </div>

      {/* 2. CONTROLS BAR: SEARCH, FILTERS & ZOOM (Figma Page 9) */}
      <div className="bg-white p-3.5 rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-wrap items-center justify-between gap-4">
        {/* Left: Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7A7A7A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search family by name…"
            className="w-full pl-8 pr-12 py-1.5 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-1 focus:ring-[#C18B58] bg-white"
          />
          <kbd className="absolute right-2.5 top-2 text-[10px] font-mono text-[#7A7A7A] bg-[#F6F1E9] px-1 rounded">
            ⌘ K
          </kbd>
        </div>

        {/* Middle: Generation Filter */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[#7A7A7A] text-[11px]">Filter:</span>
          <select
            value={selectedGeneration}
            onChange={(e) =>
              setSelectedGeneration(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
            }
            className="px-2.5 py-1.5 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
          >
            <option value="ALL">All Generations (1–3)</option>
            <option value={1}>Gen 1 · Grandparents</option>
            <option value={2}>Gen 2 · Parents & Aunts/Uncles</option>
            <option value={3}>Gen 3 · Our Generation</option>
          </select>
        </div>

        {/* Right: Zoom controls & Focus on me */}
        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFocusedPersonId("p-selam")}
            className="px-3 py-1.5 rounded-md border border-[#D5C9B8] text-[#2B2B2B] hover:bg-[#F6F1E9] text-xs font-medium flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C18B58]" />
            <span>Focus on me</span>
          </button>

          <div className="flex items-center border border-[#D5C9B8] rounded-md overflow-hidden bg-white">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 15))}
              className="p-1.5 hover:bg-[#F6F1E9] text-[#5A5A5A]"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono text-[#2B2B2B] border-x border-[#D5C9B8]">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
              className="p-1.5 hover:bg-[#F6F1E9] text-[#5A5A5A]"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1.5 hover:bg-[#F6F1E9] text-[#5A5A5A] border-l border-[#D5C9B8]"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. VISUAL FAMILY TREE CANVAS (Figma Page 9) */}
      <div
        className="bg-white rounded-2xl border border-[#EAE3D6] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-10 overflow-x-auto min-h-[620px] transition-all"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
      >
        <div className="max-w-4xl mx-auto space-y-12">
          {/* GENERATION 1: GRANDPARENTS */}
          {(selectedGeneration === "ALL" || selectedGeneration === 1) && gen1.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-2 border-b border-[#F6F1E9]">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C18B58]">
                  GENERATION 1 · GRANDPARENTS
                </span>
                <div className="flex-1 h-[1px] bg-[#EAE3D6]" />
              </div>

              <div className="flex flex-wrap justify-center items-center gap-8">
                {gen1.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    isFocused={focusedPersonId === person.id}
                    onSelect={() => setSelectedPerson(person)}
                  />
                ))}
              </div>

              {/* Connecting genealogical drop line */}
              <div className="w-[2px] h-8 bg-[#C18B58] mx-auto my-2" />
            </div>
          )}

          {/* GENERATION 2: PARENTS & AUNTS/UNCLES */}
          {(selectedGeneration === "ALL" || selectedGeneration === 2) && gen2.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-2 border-b border-[#F6F1E9]">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C18B58]">
                  GENERATION 2 · PARENTS & AUNTS / UNCLES
                </span>
                <div className="flex-1 h-[1px] bg-[#EAE3D6]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
                {gen2.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    isFocused={focusedPersonId === person.id}
                    onSelect={() => setSelectedPerson(person)}
                  />
                ))}
              </div>

              {/* Connecting genealogical drop line */}
              <div className="w-[2px] h-8 bg-[#C18B58] mx-auto my-2" />
            </div>
          )}

          {/* GENERATION 3: OUR GENERATION */}
          {(selectedGeneration === "ALL" || selectedGeneration === 3) && gen3.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-2 border-b border-[#F6F1E9]">
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C18B58]">
                  GENERATION 3 · OUR GENERATION (CHILDREN & COUSINS)
                </span>
                <div className="flex-1 h-[1px] bg-[#EAE3D6]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-center">
                {gen3.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    isFocused={focusedPersonId === person.id}
                    onSelect={() => setSelectedPerson(person)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tree Canvas Legend (Bottom Right) */}
        <div className="mt-12 pt-6 border-t border-[#EAE3D6] flex flex-wrap items-center justify-between text-xs text-[#7A7A7A] gap-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-[2px] bg-[#C18B58]" />
              <span>Parent–child lineage</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-[2px] border-t-2 border-dashed border-[#7A7A7A]" />
              <span>Spouse / Union</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>You (Focus)</span>
            </div>
          </div>
          <span className="text-[11px] italic">
            Click any relative to view full profile & oral recordings
          </span>
        </div>
      </div>

      {/* 4. SLIDE-OVER PERSON PROFILE DRAWER (Figma ui_part2 Page 36) */}
      {selectedPerson && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#EAE3D6] flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="p-6 bg-[#F6F1E9]/60 border-b border-[#EAE3D6] flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-14 h-14 rounded-full ${selectedPerson.avatarColor} text-white flex items-center justify-center font-serif font-bold text-xl shadow-xs`}
                  >
                    {selectedPerson.firstName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-serif text-xl font-bold text-[#2B2B2B]">
                        {selectedPerson.firstName} {selectedPerson.patronymic}
                      </h3>
                      {selectedPerson.isCurrentUser && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C18B58] text-white font-semibold">
                          You
                        </span>
                      )}
                    </div>
                    {selectedPerson.amharicName && (
                      <p className="text-xs text-[#7A7A7A] font-medium font-serif mt-0.5">
                        {selectedPerson.amharicName}
                      </p>
                    )}
                    <p className="text-xs text-[#C18B58] font-medium mt-0.5">
                      {selectedPerson.relationshipToUser} · {selectedPerson.ethiopianKinship}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPerson(null)}
                  className="p-1 rounded-md text-[#7A7A7A] hover:text-[#2B2B2B] hover:bg-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 text-xs">
                {/* Vital Statistics */}
                <div className="space-y-3">
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#7A7A7A]">
                    Vital Statistics
                  </h4>
                  <div className="space-y-2 p-3.5 bg-[#F6F1E9]/40 rounded-xl border border-[#EAE3D6]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#5A5A5A] flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-[#C18B58]" /> Lifespan
                      </span>
                      <span className="font-medium text-[#2B2B2B]">
                        {selectedPerson.birthYear} – {selectedPerson.isLiving ? "Present (Living)" : selectedPerson.deathYear}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#5A5A5A] flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-[#C18B58]" /> Birthplace
                      </span>
                      <span className="font-medium text-[#2B2B2B]">{selectedPerson.birthPlace}</span>
                    </div>
                  </div>
                </div>

                {/* Biography */}
                <div className="space-y-2">
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#7A7A7A]">
                    Biography & Living Memory
                  </h4>
                  <p className="text-xs text-[#5A5A5A] font-light leading-relaxed">
                    {selectedPerson.bio}
                  </p>
                </div>

                {/* Linked Oral Stories & Memories */}
                <div className="space-y-3">
                  <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#7A7A7A]">
                    Linked Stories & Recordings
                  </h4>
                  <div className="p-3 bg-[#F6F1E9]/50 rounded-xl border border-[#EAE3D6] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#2B2B2B] flex items-center">
                        <Mic className="w-3.5 h-3.5 mr-1.5 text-[#C18B58]" /> Sunday Coffee in Gondar
                      </span>
                      <span className="text-[10px] text-[#7A7A7A]">14 min audio</span>
                    </div>
                    <p className="text-[11px] text-[#5A5A5A]">
                      Oral tradition passed down through generations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-[#EAE3D6] bg-white space-y-2">
              <Link
                href={`/${slug}/tree/person/${selectedPerson.id}`}
                className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold text-center block transition-colors shadow-sm"
              >
                View Full Biography & Milestones &rarr;
              </Link>
              <button
                onClick={() => setSelectedPerson(null)}
                className="w-full py-2 text-xs text-[#7A7A7A] hover:text-[#2B2B2B]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD PERSON MODAL DIALOG (Page 19) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 border border-[#EAE3D6] shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-semibold">
                  GENEALOGY REGISTRATION
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2B2B2B] mt-0.5">
                  Add Family Member
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-[#7A7A7A] hover:text-[#2B2B2B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPerson} className="space-y-4 text-xs">
              {/* Three-part Ethiopian naming: First, Father, Grandfather */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#2B2B2B] mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="e.g. Kalkidan"
                    className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#2B2B2B] mb-1">
                    Father's Name
                  </label>
                  <input
                    type="text"
                    value={newPatronymic}
                    onChange={(e) => setNewPatronymic(e.target.value)}
                    placeholder="e.g. Dawit"
                    className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#2B2B2B] mb-1">
                    Grandfather's
                  </label>
                  <input
                    type="text"
                    value={newFamilyName}
                    onChange={(e) => setNewFamilyName(e.target.value)}
                    placeholder="e.g. Mekonnen"
                    className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                  />
                </div>
              </div>

              {/* Gender & Relationship */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#2B2B2B] mb-1">
                    Gender
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as "MALE" | "FEMALE")}
                    className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                  >
                    <option value="FEMALE">Female</option>
                    <option value="MALE">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#2B2B2B] mb-1">
                    Relationship
                  </label>
                  <select
                    value={newRelation}
                    onChange={(e) => setNewRelation(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                  >
                    <option value="Child">Child (ልጅ)</option>
                    <option value="Sibling">Sibling (ወንድም/እህት)</option>
                    <option value="Parent">Parent (እናት/አባት)</option>
                    <option value="Spouse">Spouse (የትዳር አጋር)</option>
                  </select>
                </div>
              </div>

              {/* Birth Year & Place */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#2B2B2B] mb-1">
                    Birth Year (Circa)
                  </label>
                  <input
                    type="text"
                    value={newBirthYear}
                    onChange={(e) => setNewBirthYear(e.target.value)}
                    placeholder="e.g. 1998"
                    className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#2B2B2B] mb-1">
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    value={newBirthPlace}
                    onChange={(e) => setNewBirthPlace(e.target.value)}
                    placeholder="e.g. Addis Ababa"
                    className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                  />
                </div>
              </div>

              {/* Connect to Parent Node */}
              <div>
                <label className="block font-medium text-[#2B2B2B] mb-1">
                  Connect as descendant of
                </label>
                <select
                  value={newParentId}
                  onChange={(e) => setNewParentId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                >
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.patronymic} ({p.relationshipToUser})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
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
                  Save Person to Tree
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// INDIVIDUAL PERSON NODE CARD (Figma ui_part2 Page 9 & 36)
function PersonCard({
  person,
  isFocused,
  onSelect,
}: {
  person: PersonNode;
  isFocused: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-xl border bg-white cursor-pointer transition-all duration-200 min-w-[210px] max-w-[240px] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 relative group ${
        isFocused ? "border-[#C18B58] ring-2 ring-[#C18B58]/30 shadow-md" : "border-[#EAE3D6]"
      }`}
    >
      {/* Top row: Avatar + Lifespan */}
      <div className="flex items-center space-x-3 mb-2.5">
        <div
          className={`w-10 h-10 rounded-full ${person.avatarColor} text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs shrink-0`}
        >
          {person.firstName.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <h4 className="font-serif font-bold text-sm text-[#2B2B2B] truncate group-hover:text-[#C18B58] transition-colors">
            {person.firstName} {person.patronymic}
          </h4>
          <span className="text-[11px] text-[#7A7A7A] block">
            {person.birthYear} – {person.isLiving ? "Present" : person.deathYear}
          </span>
        </div>
      </div>

      {/* Kinship Label badge */}
      <div className="pt-2 border-t border-[#F6F1E9] flex items-center justify-between text-[11px]">
        <span className="font-medium text-[#5A5A5A] truncate">
          {person.relationshipToUser}
        </span>
        {person.isCurrentUser ? (
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
            You
          </span>
        ) : (
          <span className="text-[#C18B58] opacity-0 group-hover:opacity-100 transition-opacity">
            &rarr;
          </span>
        )}
      </div>
    </div>
  );
}
