"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Mail, Copy, Check, Shield, Loader2 } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function InviteMemberPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [kinship, setKinship] = useState("Cousin");
  const [role, setRole] = useState("EDITOR");
  const [message, setMessage] = useState(
    "Selam! Come help us keep our family’s stories, photos, and traditions together on KinKeep."
  );

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const inviteLink = `http://localhost:3000/invitations/inv-${slug}-x9q2`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    const res = await apiRequest(`/api/v1/families/${slug}/invitations`, {
      method: "POST",
      body: JSON.stringify({
        email,
        full_name: fullName,
        kinship_relation: kinship,
        role,
        personal_note: message,
      }),
    });

    setLoading(false);
    setSentSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EAE3D6]">
        <Link
          href={`/${slug}/members`}
          className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Family Members
        </Link>
      </div>

      {sentSuccess ? (
        <div className="bg-white rounded-2xl p-8 border border-[#EAE3D6] shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2B2B2B]">
            Invitation Dispatched
          </h2>
          <p className="text-xs text-[#5A5A5A] max-w-sm mx-auto">
            We’ve sent a private invitation link to <span className="font-semibold text-[#2B2B2B]">{email}</span> with instructions to join as an {role}.
          </p>

          <div className="pt-4 flex justify-center space-x-3">
            <button
              onClick={() => {
                setSentSuccess(false);
                setEmail("");
                setFullName("");
              }}
              className="px-4 py-2 rounded-md border border-[#D5C9B8] text-xs font-semibold text-[#2B2B2B]"
            >
              Invite Another Relative
            </button>
            <Link
              href={`/${slug}/members`}
              className="px-5 py-2 rounded-md bg-[#C18B58] text-white text-xs font-semibold"
            >
              Back to Members List
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#EAE3D6] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-semibold">
              INVITE RELATIVE
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B] mt-1">
              Add a Family Member
            </h1>
            <p className="text-xs text-[#5A5A5A] font-light mt-1">
              They will receive a secure invitation link to join your family space.
            </p>
          </div>

          <form onSubmit={handleSendInvite} className="space-y-5">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Hana Mekonnen"
                  className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hana@example.com"
                  className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
                />
              </div>
            </div>

            {/* Kinship Relation */}
            <div>
              <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                Kinship Relation to You
              </label>
              <select
                value={kinship}
                onChange={(e) => setKinship(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
              >
                <option value="Grandparent">Grandparent (አያት)</option>
                <option value="Parent">Parent (እናት/አባት)</option>
                <option value="Sibling">Sibling (ወንድም/እህት)</option>
                <option value="Child">Child (ልጅ)</option>
                <option value="Aunt">Aunt (አክስት)</option>
                <option value="Uncle">Uncle (አጎት)</option>
                <option value="Cousin">Cousin (የአክስት/አጎት ልጅ)</option>
                <option value="Spouse">Spouse / Partner (የትዳር አጋር)</option>
                <option value="In-Law">In-Law (አማች)</option>
              </select>
            </div>

            {/* Workspace Role Selection Cards (Figma ui_part2 Page 3) */}
            <div>
              <label className="block text-xs font-medium text-[#2B2B2B] mb-2">
                Workspace Role & Permissions
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setRole("ADMIN")}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    role === "ADMIN"
                      ? "border-[#C18B58] bg-[#F6F1E9]/60 shadow-xs"
                      : "border-[#D5C9B8] hover:bg-[#F6F1E9]/30"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#2B2B2B]">Admin</span>
                    <input
                      type="radio"
                      name="role"
                      checked={role === "ADMIN"}
                      onChange={() => setRole("ADMIN")}
                      className="text-[#C18B58]"
                    />
                  </div>
                  <p className="text-[11px] text-[#5A5A5A] font-light">
                    Can invite members, approve tree edits, and manage events.
                  </p>
                </label>

                <label
                  onClick={() => setRole("EDITOR")}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    role === "EDITOR"
                      ? "border-[#C18B58] bg-[#F6F1E9]/60 shadow-xs"
                      : "border-[#D5C9B8] hover:bg-[#F6F1E9]/30"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#2B2B2B]">Editor</span>
                    <input
                      type="radio"
                      name="role"
                      checked={role === "EDITOR"}
                      onChange={() => setRole("EDITOR")}
                      className="text-[#C18B58]"
                    />
                  </div>
                  <p className="text-[11px] text-[#5A5A5A] font-light">
                    Can add persons, connect relationships, and upload stories.
                  </p>
                </label>

                <label
                  onClick={() => setRole("CONTRIBUTOR")}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    role === "CONTRIBUTOR"
                      ? "border-[#C18B58] bg-[#F6F1E9]/60 shadow-xs"
                      : "border-[#D5C9B8] hover:bg-[#F6F1E9]/30"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#2B2B2B]">Contributor</span>
                    <input
                      type="radio"
                      name="role"
                      checked={role === "CONTRIBUTOR"}
                      onChange={() => setRole("CONTRIBUTOR")}
                      className="text-[#C18B58]"
                    />
                  </div>
                  <p className="text-[11px] text-[#5A5A5A] font-light">
                    Can upload photos, record voices, and comment on stories.
                  </p>
                </label>

                <label
                  onClick={() => setRole("MEMBER")}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    role === "MEMBER"
                      ? "border-[#C18B58] bg-[#F6F1E9]/60 shadow-xs"
                      : "border-[#D5C9B8] hover:bg-[#F6F1E9]/30"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#2B2B2B]">Member / Viewer</span>
                    <input
                      type="radio"
                      name="role"
                      checked={role === "MEMBER"}
                      onChange={() => setRole("MEMBER")}
                      className="text-[#C18B58]"
                    />
                  </div>
                  <p className="text-[11px] text-[#5A5A5A] font-light">
                    Read-only access to view the family tree and memory albums.
                  </p>
                </label>
              </div>
            </div>

            {/* Personal Message */}
            <div>
              <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                Personal Note in Invitation Email
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58] resize-none"
              />
            </div>

            {/* Quick Shareable Link Box */}
            <div className="p-3.5 bg-[#F6F1E9]/60 rounded-lg border border-[#EAE3D6] flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#7A7A7A]">
                  Or share invite link directly
                </p>
                <p className="text-xs font-mono text-[#2B2B2B] truncate max-w-sm">
                  {inviteLink}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded bg-white border border-[#D5C9B8] text-xs font-semibold text-[#2B2B2B] hover:bg-[#F6F1E9] flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex items-center justify-between">
              <Link
                href={`/${slug}/members`}
                className="text-xs text-[#7A7A7A] hover:text-[#2B2B2B]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-2"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Send Invitation Email</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
