"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calculator,
  GitFork,
  ArrowRight,
  Sparkles,
  Users,
  CheckCircle,
} from "lucide-react";

export default function KinshipCalculatorPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [personA, setPersonA] = useState("p-selam");
  const [personB, setPersonB] = useState("p-aster");

  const relatives = [
    { id: "p-selam", name: "Selam Mekonnen", role: "You" },
    { id: "p-dawit", name: "Dawit Mekonnen", role: "Father" },
    { id: "p-hana", name: "Hana Mekonnen", role: "Mother" },
    { id: "p-elias", name: "Elias Bekele", role: "Grandfather" },
    { id: "p-aster", name: "Aster Gebre", role: "Grandmother" },
    { id: "p-tigist", name: "Tigist Alemu", role: "Aunt" },
    { id: "p-abebe", name: "Abebe Tesfaye", role: "Uncle" },
    { id: "p-yonas", name: "Yonas Mekonnen", role: "Brother" },
    { id: "p-meron", name: "Meron Tesfaye", role: "Cousin" },
  ];

  // Kinship lookup engine
  const getKinshipData = (a: string, b: string) => {
    if (a === b) {
      return {
        title: "Self",
        amharic: "እኔ (ራስ)",
        degree: "Same Individual",
        path: ["Identical Node"],
      };
    }

    if ((a === "p-selam" && b === "p-aster") || (a === "p-aster" && b === "p-selam")) {
      return {
        title: a === "p-selam" ? "Paternal Grandmother" : "Granddaughter",
        amharic: a === "p-selam" ? "አያት (የአባት እናት)" : "የልጅ ልጅ (የወንድ ልጅ ልጅ)",
        degree: "2nd Degree Lineal Ancestor (Direct Descendant)",
        path: ["Selam Mekonnen", "Dawit Mekonnen (Father)", "Aster Gebre (Mother of Dawit)"],
      };
    }

    if ((a === "p-selam" && b === "p-elias") || (a === "p-elias" && b === "p-selam")) {
      return {
        title: a === "p-selam" ? "Paternal Grandfather" : "Granddaughter",
        amharic: a === "p-selam" ? "አያት (የአባት አባት)" : "የልጅ ልጅ",
        degree: "2nd Degree Lineal Ancestor",
        path: ["Selam Mekonnen", "Dawit Mekonnen (Father)", "Elias Bekele (Father of Dawit)"],
      };
    }

    if ((a === "p-selam" && b === "p-meron") || (a === "p-meron" && b === "p-selam")) {
      return {
        title: "First Cousin (Maternal/Paternal Parallel)",
        amharic: "የአክስት ልጅ",
        degree: "4th Degree Collateral Kin",
        path: [
          "Selam Mekonnen",
          "Dawit Mekonnen (Father)",
          "Elias & Aster (Shared Grandparents)",
          "Tigist Alemu (Aunt)",
          "Meron Tesfaye (Daughter of Tigist)",
        ],
      };
    }

    if ((a === "p-selam" && b === "p-tigist") || (a === "p-tigist" && b === "p-selam")) {
      return {
        title: a === "p-selam" ? "Paternal Aunt" : "Niece",
        amharic: a === "p-selam" ? "አክስት (የአባት እህት)" : "የወንድም ልጅ",
        degree: "3rd Degree Collateral Kin",
        path: ["Selam Mekonnen", "Dawit Mekonnen (Father)", "Tigist Alemu (Sister of Father)"],
      };
    }

    if ((a === "p-selam" && b === "p-yonas") || (a === "p-yonas" && b === "p-selam")) {
      return {
        title: a === "p-selam" ? "Full Brother" : "Full Sister",
        amharic: a === "p-selam" ? "ወንድም" : "እህት",
        degree: "2nd Degree Collateral Kin",
        path: ["Selam Mekonnen", "Dawit & Hana (Shared Parents)", "Yonas Mekonnen"],
      };
    }

    // Default fallback
    return {
      title: "Direct Family Relative",
      amharic: "የቅርብ ቤተሰብ",
      degree: "Blood Relation",
      path: ["Relative A", "Shared Ancestor Node", "Relative B"],
    };
  };

  const kinshipResult = getKinshipData(personA, personB);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-[#EAE3D6]">
        <Link
          href={`/${slug}/tree`}
          className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] flex items-center mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Family Tree Canvas
        </Link>
        <h1 className="font-serif text-3xl font-bold text-[#2B2B2B]">
          Kinship Calculator & Lineage Path Finder
        </h1>
        <p className="text-xs text-[#5A5A5A] font-light mt-1">
          Select two relatives to calculate their genealogical relationship degree and dual Ethiopian kinship title.
        </p>
      </div>

      {/* Selectors */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7A7A] mb-1.5">
              Person 1 (Focal Relative)
            </label>
            <select
              value={personA}
              onChange={(e) => setPersonA(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-xs font-medium text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
            >
              {relatives.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7A7A] mb-1.5">
              Person 2 (Target Relative)
            </label>
            <select
              value={personB}
              onChange={(e) => setPersonB(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-xs font-medium text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
            >
              {relatives.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Calculation Result Banner */}
        <div className="p-6 rounded-xl bg-[#F6F1E9]/70 border border-[#EAE3D6] space-y-4">
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#C18B58] font-bold">
            <Sparkles className="w-4 h-4" />
            <span>CALCULATED KINSHIP RELATION</span>
          </div>

          <div>
            <h2 className="font-serif text-3xl font-bold text-[#2B2B2B]">
              {kinshipResult.title}
            </h2>
            <p className="font-serif text-lg text-[#C18B58] font-medium mt-0.5">
              {kinshipResult.amharic}
            </p>
            <span className="text-xs text-[#7A7A7A] block mt-1">
              Degree: {kinshipResult.degree}
            </span>
          </div>

          {/* Traversal Path */}
          <div className="pt-4 border-t border-[#EAE3D6] space-y-2">
            <span className="text-[11px] font-semibold text-[#7A7A7A] uppercase tracking-wider">
              Genealogical Traversal Path
            </span>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {kinshipResult.path.map((step, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs">
                  <span className="px-2.5 py-1 rounded-md bg-white border border-[#D5C9B8] font-medium text-[#2B2B2B]">
                    {step}
                  </span>
                  {idx < kinshipResult.path.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-[#C18B58]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cultural Ethiopian Reference Table */}
      <div className="bg-white rounded-xl p-6 border border-[#EAE3D6] space-y-3">
        <h3 className="font-serif text-sm font-bold text-[#2B2B2B] uppercase tracking-wider">
          Traditional Ethiopian Kinship Terminology Reference
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="p-2.5 rounded-lg bg-[#F6F1E9]/40 border border-[#EAE3D6]">
            <span className="font-bold text-[#2B2B2B]">አያት (Ayat)</span> &rarr; Grandparent (Maternal or Paternal)
          </div>
          <div className="p-2.5 rounded-lg bg-[#F6F1E9]/40 border border-[#EAE3D6]">
            <span className="font-bold text-[#2B2B2B]">አክስት (Akist)</span> &rarr; Aunt (Father's or Mother's Sister)
          </div>
          <div className="p-2.5 rounded-lg bg-[#F6F1E9]/40 border border-[#EAE3D6]">
            <span className="font-bold text-[#2B2B2B]">አጎት (Agot)</span> &rarr; Uncle (Father's or Mother's Brother)
          </div>
          <div className="p-2.5 rounded-lg bg-[#F6F1E9]/40 border border-[#EAE3D6]">
            <span className="font-bold text-[#2B2B2B]">የአጎት/የአክስት ልጅ</span> &rarr; First Cousin
          </div>
        </div>
      </div>
    </div>
  );
}
