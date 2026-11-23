"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Save, AlertTriangle, ShieldCheck, Check, Trash2 } from "lucide-react";

export default function FamilySettingsPage() {
  const router = useRouter();
  const params = useParams();
  const familySlug = (params?.familySlug as string) || "family";

  const [activeTab, setActiveTab] = useState<"GENERAL" | "PRIVACY" | "DANGER">("GENERAL");
  const [name, setName] = useState("The Bekele Family Archive");
  const [originCity, setOriginCity] = useState("Gondar");
  const [originCountry, setOriginCountry] = useState("Ethiopia");
  const [description, setDescription] = useState("Preserving our multi-generational heritage and living stories.");
  const [allowGuestUploads, setAllowGuestUploads] = useState(true);
  const [requireReviewerApproval, setRequireReviewerApproval] = useState(true);

  const [saved, setSaved] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
          Family Settings
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
          Configure your family workspace profile, privacy controls, and data policies.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>Workspace settings saved successfully!</span>
        </div>
      )}

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-border space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("GENERAL")}
          className={`pb-3 transition-colors ${
            activeTab === "GENERAL"
              ? "border-b-2 border-gold-600 text-gold-700"
              : "text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          General Information
        </button>
        <button
          onClick={() => setActiveTab("PRIVACY")}
          className={`pb-3 transition-colors ${
            activeTab === "PRIVACY"
              ? "border-b-2 border-gold-600 text-gold-700"
              : "text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          Privacy & Moderation
        </button>
        <button
          onClick={() => setActiveTab("DANGER")}
          className={`pb-3 transition-colors ${
            activeTab === "DANGER"
              ? "border-b-2 border-red-600 text-red-600"
              : "text-charcoal-600 hover:text-charcoal-900"
          }`}
        >
          Danger Zone
        </button>
      </div>

      {/* Tab 1: General Information */}
      {activeTab === "GENERAL" && (
        <form onSubmit={handleSave} className="bg-white p-8 rounded-2xl border border-border shadow-card space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Family Workspace Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Ancestral City / Region
                </label>
                <input
                  type="text"
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Ancestral Homeland
                </label>
                <input
                  type="text"
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Family Motto / Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Privacy & Moderation */}
      {activeTab === "PRIVACY" && (
        <div className="bg-white p-8 rounded-2xl border border-border shadow-card space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-ivory-50/40">
              <div>
                <h4 className="text-xs font-bold text-charcoal-900">QR Guest Uploads</h4>
                <p className="text-[11px] text-charcoal-600">
                  Allow event guests to upload photos without creating KinKeep accounts.
                </p>
              </div>
              <input
                type="checkbox"
                checked={allowGuestUploads}
                onChange={(e) => setAllowGuestUploads(e.target.checked)}
                className="h-4 w-4 rounded border-border text-gold-600 focus:ring-gold-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-ivory-50/40">
              <div>
                <h4 className="text-xs font-bold text-charcoal-900">Moderation Review Queue</h4>
                <p className="text-[11px] text-charcoal-600">
                  Require an Administrator or Reviewer to approve guest uploads before they appear in family albums.
                </p>
              </div>
              <input
                type="checkbox"
                checked={requireReviewerApproval}
                onChange={(e) => setRequireReviewerApproval(e.target.checked)}
                className="h-4 w-4 rounded border-border text-gold-600 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
              className="px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Privacy Rules</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Danger Zone */}
      {activeTab === "DANGER" && (
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-card space-y-6">
          <div className="flex items-center space-x-3 text-red-600">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-serif text-lg font-bold">Destructive Actions</h3>
          </div>
          <p className="text-xs text-charcoal-700 leading-relaxed">
            Terminating this family workspace permanently removes all family-tree associations, albums, and stories. This action cannot be reversed.
          </p>

          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-red-900">Delete Family Workspace</div>
              <div className="text-[11px] text-red-700">Only the Family Owner can execute this action.</div>
            </div>
            <button
              onClick={() => setDeleteConfirmOpen(true)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Workspace</span>
            </button>
          </div>

          {deleteConfirmOpen && (
            <div className="p-4 rounded-xl border border-red-300 bg-white space-y-3">
              <p className="text-xs font-semibold text-charcoal-900">
                Are you absolutely certain you want to delete {name}?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-border text-xs text-charcoal-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => router.push("/families")}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                >
                  Confirm Permanent Deletion
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
