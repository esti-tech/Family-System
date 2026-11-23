"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Shield, Check, Loader2, AlertCircle } from "lucide-react";

export default function MemberPermissionsPage() {
  const router = useRouter();
  const params = useParams();
  const familySlug = (params?.familySlug as string) || "family";

  const [selectedRole, setSelectedRole] = useState("FAMILY_EDITOR");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Role descriptions
  const roles = [
    { code: "FAMILY_VIEWER", name: "Viewer", desc: "Can read published trees, stories, and view memories." },
    { code: "FAMILY_EDITOR", name: "Editor", desc: "Can add tree persons, write stories, schedule events, and upload photos." },
    { code: "FAMILY_REVIEWER", name: "Reviewer", desc: "Can moderate guest uploads, review drafts, and inspect proposed tree edits." },
    { code: "FAMILY_ADMIN", name: "Administrator", desc: "Can invite members, manage permissions, and update settings." },
  ];

  // Fine-grained permission checklist preview
  const permissionToggles = [
    { id: "tree_view", label: "View Family Tree", enabled: true },
    { id: "tree_edit", label: "Add & Edit People", enabled: ["FAMILY_EDITOR", "FAMILY_ADMIN", "FAMILY_OWNER"].includes(selectedRole) },
    { id: "story_write", label: "Write Stories & Oral Histories", enabled: ["FAMILY_EDITOR", "FAMILY_ADMIN", "FAMILY_OWNER"].includes(selectedRole) },
    { id: "memory_upload", label: "Upload Memories & Audio", enabled: ["FAMILY_EDITOR", "FAMILY_ADMIN", "FAMILY_OWNER"].includes(selectedRole) },
    { id: "memory_review", label: "Review Submissions & Guest Uploads", enabled: ["FAMILY_REVIEWER", "FAMILY_ADMIN", "FAMILY_OWNER"].includes(selectedRole) },
    { id: "member_invite", label: "Invite Relatives & Assign Roles", enabled: ["FAMILY_ADMIN", "FAMILY_OWNER"].includes(selectedRole) },
    { id: "workspace_settings", label: "Manage Workspace & Privacy Settings", enabled: ["FAMILY_ADMIN", "FAMILY_OWNER"].includes(selectedRole) },
  ];

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => router.push(`/${familySlug}/members`), 1200);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href={`/${familySlug}/members`}
        className="inline-flex items-center text-xs font-semibold text-charcoal-700 hover:text-charcoal-900"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Member Directory
      </Link>

      <div className="bg-white p-8 rounded-2xl border border-border shadow-card space-y-6">
        <div>
          <span className="text-[11px] uppercase font-bold tracking-widest text-gold-600">
            Access Control (RBAC)
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
            Manage Member Permissions
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Configure access levels for <span className="font-semibold text-charcoal-900">Dawit Solomon</span> (Brother).
          </p>
        </div>

        {saved && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Permissions updated successfully!</span>
          </div>
        )}

        {/* Role Presets */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
            Select Workspace Role Preset
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map((r) => (
              <button
                key={r.code}
                type="button"
                onClick={() => setSelectedRole(r.code)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedRole === r.code
                    ? "border-gold-500 bg-gold-50/50 ring-1 ring-gold-500"
                    : "border-border hover:bg-ivory-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-charcoal-900">{r.name}</span>
                  {selectedRole === r.code && <Check className="w-4 h-4 text-gold-600" />}
                </div>
                <p className="text-[11px] text-charcoal-600 mt-1 leading-snug">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Effective Permissions List */}
        <div className="pt-4 border-t border-border space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700">
            Active Capabilities for this Role
          </label>
          <div className="divide-y divide-border/60 rounded-xl border border-border bg-ivory-50/30 p-2">
            {permissionToggles.map((item) => (
              <div key={item.id} className="py-2 px-3 flex items-center justify-between text-xs">
                <span className="font-medium text-charcoal-800">{item.label}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.enabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item.enabled ? "Granted" : "Restricted"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-3">
          <Link
            href={`/${familySlug}/members`}
            className="px-5 py-2.5 rounded-lg border border-border text-xs font-semibold text-charcoal-700 hover:bg-ivory-50"
          >
            Cancel
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold shadow-xs flex items-center space-x-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Save Permissions</span>
          </button>
        </div>
      </div>
    </div>
  );
}
