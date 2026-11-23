"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Key, AlertCircle } from "lucide-react";

export default function JoinFamilyPage() {
  const router = useRouter();
  const [inviteToken, setInviteToken] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = inviteToken.trim();
    if (!cleaned) return;

    // Extract token if full URL was pasted
    let token = cleaned;
    if (cleaned.includes("/invitations/")) {
      const parts = cleaned.split("/invitations/");
      token = parts[1].replace("/", "");
    }

    if (token.length < 8) {
      setErrorMsg("Please enter a valid invitation code or link.");
      return;
    }

    router.push(`/invitations/${token}`);
  };

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col">
      <header className="h-20 bg-white border-b border-border px-6 flex items-center">
        <Link
          href="/families"
          className="inline-flex items-center text-xs font-semibold text-charcoal-700 hover:text-charcoal-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Family Spaces
        </Link>
      </header>

      <main className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-2xl border border-border shadow-card text-center">
          <div className="w-14 h-14 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <UserPlus className="w-7 h-7" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Join a Family Space
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-2">
            Enter the invitation link or token code shared with you by a family administrator.
          </p>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                Invitation Code or URL *
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={inviteToken}
                  onChange={(e) => setInviteToken(e.target.value)}
                  placeholder="Paste invitation token or link..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border text-sm text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-gold-500 bg-ivory-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-gold-500 hover:bg-gold-600 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center"
            >
              Verify Invitation
            </button>
          </form>

          <p className="text-xs text-charcoal-700 mt-6 leading-relaxed">
            Don&apos;t have an invitation code? Ask a family member to invite your email from their workspace.
          </p>
        </div>
      </main>
    </div>
  );
}
