"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Users, Shield, MapPin, Sparkles, Plus, Trash2, Loader2 } from "lucide-react";
import { apiRequest } from "@/services/api";

interface RelativeInvite {
  email: string;
  name: string;
  kinshipRelation: string;
  role: string;
}

export default function CreateFamilyPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);

  // Step 1 Fields
  const [familyName, setFamilyName] = useState("");
  const [ancestralCity, setAncestralCity] = useState("");
  const [country, setCountry] = useState("Ethiopia");
  const [description, setDescription] = useState("");
  const [privacyLevel, setPrivacyLevel] = useState("PRIVATE");

  // Step 2 Fields (Inviting relatives)
  const [invites, setInvites] = useState<RelativeInvite[]>([
    { email: "", name: "", kinshipRelation: "Parent", role: "EDITOR" },
  ]);

  const addInviteRow = () => {
    setInvites([...invites, { email: "", name: "", kinshipRelation: "Sibling", role: "CONTRIBUTOR" }]);
  };

  const removeInviteRow = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index));
  };

  const updateInvite = (index: number, field: keyof RelativeInvite, value: string) => {
    const updated = [...invites];
    updated[index][field] = value;
    setInvites(updated);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyName.trim()) return;
    setStep(2);
  };

  const handleFinalSubmit = async (skipInvites = false) => {
    setLoading(true);

    // Generate slug
    const slug = familyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const payload = {
      name: familyName,
      slug: slug || "family-workspace",
      description,
      origin_city: ancestralCity,
      origin_country: country,
      privacy_level: privacyLevel,
    };

    const res = await apiRequest("/api/v1/families/", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setLoading(false);

    // Redirect to the newly created family workspace dashboard
    const targetSlug = res.data?.slug || slug || "bekele-family";
    router.push(`/${targetSlug}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9] flex flex-col">
      {/* Top Header */}
      <header className="h-20 bg-white border-b border-[#EAE3D6] px-6 sm:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-serif font-bold text-2xl text-[#2B2B2B]">KinKeep</span>
        </Link>
        <Link
          href="/families"
          className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Family Spaces
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        {/* Step Progress Bar (Figma Page 37) */}
        <div className="mb-10">
          <div className="flex items-center justify-center space-x-8 text-xs">
            {/* Step 1 Pill */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 1 ? "bg-[#C18B58] text-white" : "bg-emerald-600 text-white"
                }`}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : "1"}
              </div>
              <span className={`font-medium ${step === 1 ? "text-[#2B2B2B]" : "text-[#7A7A7A]"}`}>
                Create your family space
              </span>
            </div>

            {/* Connecting line */}
            <div className="w-12 h-[1px] bg-[#D5C9B8]" />

            {/* Step 2 Pill */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                  step === 2 ? "bg-[#C18B58] text-white" : "bg-[#EAE3D6] text-[#7A7A7A]"
                }`}
              >
                2
              </div>
              <span className={`font-medium ${step === 2 ? "text-[#2B2B2B]" : "text-[#7A7A7A]"}`}>
                Invite relatives
              </span>
            </div>
          </div>
        </div>

        {/* STEP 1: TELL US ABOUT YOUR FAMILY */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#EAE3D6] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className="mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
                Tell us about your family
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A] mt-1 font-light">
                Fields marked <span className="text-[#C18B58]">*</span> are required. You can update these details later.
              </p>
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-6">
              {/* Family Name */}
              <div>
                <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                  Family name <span className="text-[#C18B58]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g. Bekele Family"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] bg-white transition-all"
                />
              </div>

              {/* Ancestral Origin & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                    Ancestral City / Town
                  </label>
                  <input
                    type="text"
                    value={ancestralCity}
                    onChange={(e) => setAncestralCity(e.target.value)}
                    placeholder="e.g. Gondar, Addis Ababa, Harar"
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                    Country of Origin
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] focus:outline-none focus:ring-2 focus:ring-[#C18B58] bg-white transition-all"
                  />
                </div>
              </div>

              {/* Motto / Description */}
              <div>
                <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                  Family Motto or Heritage Note
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Preserving our elders' stories, coffee ceremonies, and photos for generations to come."
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] bg-white transition-all resize-none"
                />
              </div>

              {/* Privacy Level */}
              <div>
                <label className="block text-xs font-medium text-[#2B2B2B] mb-2">
                  Privacy Setting
                </label>
                <div className="space-y-3">
                  <label className="flex items-start p-3.5 rounded-lg border border-[#D5C9B8] cursor-pointer hover:bg-[#F6F1E9]/50 transition-colors">
                    <input
                      type="radio"
                      name="privacy"
                      checked={privacyLevel === "PRIVATE"}
                      onChange={() => setPrivacyLevel("PRIVATE")}
                      className="mt-0.5 text-[#C18B58] focus:ring-[#C18B58]"
                    />
                    <div className="ml-3">
                      <span className="block text-xs font-semibold text-[#2B2B2B]">
                        Private Family Circle (Recommended)
                      </span>
                      <span className="block text-[11px] text-[#5A5A5A] mt-0.5 font-light">
                        Only members explicitly invited by you can view or contribute to the tree and memory vault.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start p-3.5 rounded-lg border border-[#D5C9B8] cursor-pointer hover:bg-[#F6F1E9]/50 transition-colors">
                    <input
                      type="radio"
                      name="privacy"
                      checked={privacyLevel === "RESTRICTED"}
                      onChange={() => setPrivacyLevel("RESTRICTED")}
                      className="mt-0.5 text-[#C18B58] focus:ring-[#C18B58]"
                    />
                    <div className="ml-3">
                      <span className="block text-xs font-semibold text-[#2B2B2B]">
                        Extended Kinship Discoverable
                      </span>
                      <span className="block text-[11px] text-[#5A5A5A] mt-0.5 font-light">
                        Relatives can search for this family space by ancestral surname and request an invitation.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-between">
                <Link
                  href="/families"
                  className="text-xs text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-2"
                >
                  <span>Continue to Invite Relatives</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: INVITE RELATIVES */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#EAE3D6] shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className="mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
                Invite Relatives to {familyName}
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A] mt-1 font-light">
                Bring your family together across cities and generations. You can also do this anytime later.
              </p>
            </div>

            <div className="space-y-4">
              {invites.map((inv, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[#EAE3D6] bg-[#F6F1E9]/40 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-[#2B2B2B]">
                      Relative #{idx + 1}
                    </span>
                    {invites.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInviteRow(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5A5A5A] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={inv.name}
                        onChange={(e) => updateInvite(idx, "name", e.target.value)}
                        placeholder="e.g. Hana Mekonnen"
                        className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5A5A5A] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={inv.email}
                        onChange={(e) => updateInvite(idx, "email", e.target.value)}
                        placeholder="hana@example.com"
                        className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#5A5A5A] mb-1">
                        Kinship Relation
                      </label>
                      <select
                        value={inv.kinshipRelation}
                        onChange={(e) => updateInvite(idx, "kinshipRelation", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                      >
                        <option value="Parent">Parent</option>
                        <option value="Grandparent">Grandparent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Child">Child</option>
                        <option value="Aunt">Aunt</option>
                        <option value="Uncle">Uncle</option>
                        <option value="Cousin">Cousin</option>
                        <option value="Spouse">Spouse / Partner</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#5A5A5A] mb-1">
                        Workspace Role
                      </label>
                      <select
                        value={inv.role}
                        onChange={(e) => updateInvite(idx, "role", e.target.value)}
                        className="w-full px-3 py-1.5 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                      >
                        <option value="ADMIN">Admin (Can manage tree & invites)</option>
                        <option value="EDITOR">Editor (Can add persons & stories)</option>
                        <option value="CONTRIBUTOR">Contributor (Can upload memories)</option>
                        <option value="MEMBER">Member (Can view archive)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addInviteRow}
                className="w-full py-2.5 rounded-lg border border-dashed border-[#D5C9B8] text-xs font-semibold text-[#5A5A5A] hover:bg-[#F6F1E9] transition-colors flex items-center justify-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#C18B58]" />
                <span>Add Another Relative</span>
              </button>
            </div>

            {/* Actions */}
            <div className="pt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors"
              >
                &larr; Back to Details
              </button>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(true)}
                  className="px-4 py-2.5 text-xs text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors"
                >
                  Skip for Now
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleFinalSubmit(false)}
                  className="px-6 py-2.5 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-2"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Finish & Open Workspace</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
