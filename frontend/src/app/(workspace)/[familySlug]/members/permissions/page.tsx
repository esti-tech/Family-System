"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, X, Shield, Save } from "lucide-react";

interface PermissionRow {
  key: string;
  label: string;
  description: string;
  owner: boolean;
  admin: boolean;
  editor: boolean;
  contributor: boolean;
  member: boolean;
}

export default function RolesPermissionsPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [savedSuccess, setSavedSuccess] = useState(false);

  const [permissions, setPermissions] = useState<PermissionRow[]>([
    {
      key: "view_tree",
      label: "View Family Tree & Person Bios",
      description: "Read-only access to browse ancestry charts and profiles.",
      owner: true,
      admin: true,
      editor: true,
      contributor: true,
      member: true,
    },
    {
      key: "add_edit_persons",
      label: "Add & Edit Persons / Connections",
      description: "Create new tree nodes, add parents, children, and spouses.",
      owner: true,
      admin: true,
      editor: true,
      contributor: false,
      member: false,
    },
    {
      key: "approve_tree_changes",
      label: "Approve Proposed Tree Changes",
      description: "Review and merge genealogical changes suggested by members.",
      owner: true,
      admin: true,
      editor: false,
      contributor: false,
      member: false,
    },
    {
      key: "record_oral_stories",
      label: "Record & Curate Oral Stories",
      description: "Publish elder audio recordings, folklore, and written recipes.",
      owner: true,
      admin: true,
      editor: true,
      contributor: true,
      member: false,
    },
    {
      key: "upload_photos",
      label: "Upload Memories & Create Albums",
      description: "Upload high-res photos and documents to the family vault.",
      owner: true,
      admin: true,
      editor: true,
      contributor: true,
      member: false,
    },
    {
      key: "invite_members",
      label: "Invite New Relatives",
      description: "Send invitation emails and generate family joining codes.",
      owner: true,
      admin: true,
      editor: false,
      contributor: false,
      member: false,
    },
    {
      key: "events_qr",
      label: "Manage Events & QR Guest Uploads",
      description: "Create event guestbooks for weddings and memorials.",
      owner: true,
      admin: true,
      editor: true,
      contributor: false,
      member: false,
    },
    {
      key: "settings_billing",
      label: "Manage Workspace Settings & Ownership",
      description: "Change family name, privacy level, and transfer ownership.",
      owner: true,
      admin: false,
      editor: false,
      contributor: false,
      member: false,
    },
  ]);

  const togglePermission = (index: number, role: "admin" | "editor" | "contributor" | "member") => {
    const updated = [...permissions];
    updated[index][role] = !updated[index][role];
    setPermissions(updated);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#EAE3D6] gap-4">
        <div>
          <Link
            href={`/${slug}/members`}
            className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] flex items-center mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Family Members
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#2B2B2B]">
            Roles & Permissions Matrix
          </h1>
          <p className="text-xs text-[#5A5A5A] font-light mt-1">
            Configure access controls and editing capabilities across your workspace.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center px-5 py-2.5 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors space-x-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Permissions matrix updated successfully.</span>
        </div>
      )}

      {/* Matrix Table (Figma ui_part2 Page 4) */}
      <div className="bg-white rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D6] bg-[#F6F1E9]/60 text-[11px] uppercase tracking-wider text-[#7A7A7A]">
                <th className="py-4 px-6 font-semibold w-1/3">Capability</th>
                <th className="py-4 px-4 font-semibold text-center">Owner</th>
                <th className="py-4 px-4 font-semibold text-center">Admin</th>
                <th className="py-4 px-4 font-semibold text-center">Editor</th>
                <th className="py-4 px-4 font-semibold text-center">Contributor</th>
                <th className="py-4 px-4 font-semibold text-center">Member</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F6F1E9]">
              {permissions.map((p, idx) => (
                <tr key={p.key} className="hover:bg-[#F6F1E9]/30 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-semibold text-[#2B2B2B]">{p.label}</p>
                    <p className="text-[11px] text-[#7A7A7A] font-light mt-0.5">{p.description}</p>
                  </td>

                  {/* Owner (Always True) */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-800">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </td>

                  {/* Admin */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => togglePermission(idx, "admin")}
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                        p.admin ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {p.admin ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  {/* Editor */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => togglePermission(idx, "editor")}
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                        p.editor ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {p.editor ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  {/* Contributor */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => togglePermission(idx, "contributor")}
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                        p.contributor ? "bg-amber-100 text-amber-800 hover:bg-amber-200" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {p.contributor ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>

                  {/* Member */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => togglePermission(idx, "member")}
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                        p.member ? "bg-gray-200 text-gray-800 hover:bg-gray-300" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {p.member ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
