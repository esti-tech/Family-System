"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Shield, Save, Check, AlertTriangle, Trash2, MapPin, Globe } from "lucide-react";

export default function WorkspaceSettingsPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [familyName, setFamilyName] = useState("Bekele Family");
  const [ancestralTown, setAncestralTown] = useState("Gondar");
  const [country, setCountry] = useState("Ethiopia");
  const [foundationYear, setFoundationYear] = useState("1948");
  const [motto, setMotto] = useState("Rooted in love, preserved for eternity across generations.");
  const [approvalMode, setApprovalMode] = useState("ADMIN_APPROVAL");
  const [maskMinors, setMaskMinors] = useState(true);
  const [languageMode, setLanguageMode] = useState("AMHARIC_ENGLISH");

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header (Figma ui_part2 Page 5) */}
      <div className="pb-4 border-b border-[#EAE3D6]">
        <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-semibold">
          SETTINGS & POLICIES
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#2B2B2B] mt-1">
          Workspace Settings
        </h1>
        <p className="text-xs text-[#5A5A5A] font-light mt-1">
          Manage family profile details, genealogy permissions, cultural preferences, and access rules.
        </p>
      </div>

      {saved && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Workspace settings updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. GENERAL INFORMATION */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-5">
          <h2 className="font-serif text-lg font-bold text-[#2B2B2B] pb-3 border-b border-[#F6F1E9]">
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                Family Space Name
              </label>
              <input
                type="text"
                required
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                Foundation / Historical Year
              </label>
              <input
                type="text"
                value={foundationYear}
                onChange={(e) => setFoundationYear(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                Ancestral City / Region
              </label>
              <input
                type="text"
                value={ancestralTown}
                onChange={(e) => setAncestralTown(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Family Motto / Heritage Statement
            </label>
            <textarea
              rows={2}
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58] resize-none"
            />
          </div>
        </div>

        {/* 2. GENEALOGY & TREE RULES */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-5">
          <h2 className="font-serif text-lg font-bold text-[#2B2B2B] pb-3 border-b border-[#F6F1E9]">
            Genealogy Tree Rules & Privacy
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#2B2B2B] mb-2">
              Tree Edit Verification Policy
            </label>
            <div className="space-y-2">
              <label className="flex items-start p-3 rounded-md border border-[#D5C9B8] cursor-pointer hover:bg-[#F6F1E9]/40">
                <input
                  type="radio"
                  name="approval"
                  checked={approvalMode === "ADMIN_APPROVAL"}
                  onChange={() => setApprovalMode("ADMIN_APPROVAL")}
                  className="mt-0.5 text-[#C18B58] focus:ring-[#C18B58]"
                />
                <div className="ml-3 text-xs">
                  <span className="font-semibold text-[#2B2B2B]">
                    Require Admin Review for Tree Changes (Recommended)
                  </span>
                  <p className="text-[11px] text-[#5A5A5A] mt-0.5">
                    When contributors or members add branches or edit biological relations, a change proposal is submitted for admin review before merging into the main graph.
                  </p>
                </div>
              </label>

              <label className="flex items-start p-3 rounded-md border border-[#D5C9B8] cursor-pointer hover:bg-[#F6F1E9]/40">
                <input
                  type="radio"
                  name="approval"
                  checked={approvalMode === "IMMEDIATE"}
                  onChange={() => setApprovalMode("IMMEDIATE")}
                  className="mt-0.5 text-[#C18B58] focus:ring-[#C18B58]"
                />
                <div className="ml-3 text-xs">
                  <span className="font-semibold text-[#2B2B2B]">
                    Immediate Merge (Collaborative Mode)
                  </span>
                  <p className="text-[11px] text-[#5A5A5A] mt-0.5">
                    Editors can directly modify the tree canvas without an approval checkpoint.
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={maskMinors}
                onChange={(e) => setMaskMinors(e.target.checked)}
                className="h-4 w-4 rounded border-[#D5C9B8] text-[#C18B58] focus:ring-[#C18B58]"
              />
              <span className="text-xs text-[#2B2B2B] font-medium">
                Mask exact birth dates and location for living minors from non-admin relatives
              </span>
            </label>
          </div>
        </div>

        {/* 3. CULTURAL HERITAGE PREFERENCES */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#2B2B2B] pb-3 border-b border-[#F6F1E9]">
            Ethiopian Heritage & Localization
          </h2>

          <div>
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Kinship Naming Display
            </label>
            <select
              value={languageMode}
              onChange={(e) => setLanguageMode(e.target.value)}
              className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
            >
              <option value="AMHARIC_ENGLISH">Dual: English & Amharic (e.g. Grandmother / አያት)</option>
              <option value="ENGLISH_ONLY">English Only (e.g. Grandmother)</option>
              <option value="AMHARIC_ONLY">Amharic Only (አማርኛ)</option>
              <option value="OROMO">Afaan Oromoo</option>
              <option value="TIGRINYA">Tigrinya (ትግርኛ)</option>
            </select>
          </div>
        </div>

        {/* 4. SAVE BUTTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Workspace Settings</span>
          </button>
        </div>

        {/* 5. DANGER ZONE */}
        <div className="bg-red-50/50 rounded-xl p-6 border border-red-200 space-y-4">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider">
              Danger Zone
            </h3>
          </div>
          <p className="text-xs text-red-700 font-light">
            Actions performed here cannot be easily undone. Only the workspace Owner can initiate these actions.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => alert("Ownership transfer dialog opened")}
              className="px-3.5 py-2 rounded-md border border-red-300 text-xs font-medium text-red-800 bg-white hover:bg-red-50 transition-colors"
            >
              Transfer Workspace Ownership
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to archive this family workspace?")) {
                  alert("Workspace archived.");
                }
              }}
              className="px-3.5 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition-colors"
            >
              Archive Family Workspace
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
