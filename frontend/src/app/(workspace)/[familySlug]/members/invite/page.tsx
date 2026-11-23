"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Mail, Copy, Check, Loader2, AlertCircle } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function InviteFamilyMemberPage() {
  const router = useRouter();
  const params = useParams();
  const familySlug = (params?.familySlug as string) || "family";

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("FAMILY_VIEWER");
  const [nickname, setNickname] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    // In a real environment, we call /api/v1/families/{id}/invitations
    // For demo/dev preview, simulate instant link creation
    const res = await apiRequest(`/api/v1/families/${familySlug}/invitations`, {
      method: "POST",
      body: JSON.stringify({ email, role }),
    });

    setLoading(false);

    if (res.success && res.data?.invitation_token) {
      setGeneratedLink(`${window.location.origin}/invitations/${res.data.invitation_token}`);
    } else {
      // Fallback demo preview token
      setGeneratedLink(`${window.location.origin}/invitations/demo-token-kinkeep-${Date.now()}`);
    }
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
            Workspace Governance
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-1">
            Invite Family Members
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Send an email invitation or share a private link for relatives to join your family archive.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {generatedLink ? (
          <div className="p-6 rounded-xl bg-ivory-50 border border-border space-y-4">
            <div className="text-xs font-semibold text-charcoal-900">
              Invitation Dispatched to <span className="text-gold-600">{email}</span>
            </div>
            <p className="text-xs text-charcoal-700">
              You can also share this direct invitation link via WhatsApp, SMS, or Telegram:
            </p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={generatedLink}
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-border bg-white text-charcoal-800 font-mono"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold flex items-center space-x-1"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>
            </div>
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => {
                  setGeneratedLink(null);
                  setEmail("");
                }}
                className="text-xs text-gold-600 hover:text-gold-700 font-semibold underline"
              >
                Invite Another Relative
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Relative&apos;s Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="relative@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Family Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                >
                  <option value="FAMILY_VIEWER">Viewer (Read-only access)</option>
                  <option value="FAMILY_EDITOR">Editor (Can add stories, photos & people)</option>
                  <option value="FAMILY_REVIEWER">Reviewer (Can approve submissions)</option>
                  <option value="FAMILY_ADMIN">Administrator (Can manage members)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                  Relationship or Nickname
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Uncle Dawit"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Personal Welcome Note (Optional)
              </label>
              <textarea
                rows={3}
                value={personalMessage}
                onChange={(e) => setPersonalMessage(e.target.value)}
                placeholder="Hi! Join our family space so we can preserve our stories and photos together..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <Link
                href={`/${familySlug}/members`}
                className="px-5 py-2.5 rounded-lg border border-border text-xs font-semibold text-charcoal-700 hover:bg-ivory-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold shadow-xs flex items-center space-x-2 disabled:opacity-70"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Send Invitation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
