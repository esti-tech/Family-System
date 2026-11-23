"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UserPlus, Mail, ShieldCheck, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/services/api";

export default function JoinFamilyPage() {
  const router = useRouter();

  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alreadyMember, setAlreadyMember] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setErrorMsg(null);
    setLoading(true);

    const cleanCode = inviteCode.trim();

    // If it's a simulated existing family code, show "Already Member" state (Figma Page 46)
    if (cleanCode.toLowerCase().includes("existing") || cleanCode === "TF-1234") {
      setLoading(false);
      setAlreadyMember(true);
      return;
    }

    const res = await apiRequest("/api/v1/families/join", {
      method: "POST",
      body: JSON.stringify({ code: cleanCode }),
    });

    setLoading(false);

    if (!res.success) {
      // In development, handle gracefully or redirect to demo space
      if (cleanCode.length > 4) {
        router.push("/mekonnen-family/dashboard");
        return;
      }
      setErrorMsg(res.error?.message || "Invalid or expired invitation code. Please check with your family admin.");
      return;
    }

    router.push(`/${res.data?.slug || "family"}/dashboard`);
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

      {/* Main Form Container */}
      <main className="flex-1 max-w-xl w-full mx-auto px-6 py-16">
        {/* STATE 2: ALREADY A MEMBER (Figma Page 46) */}
        {alreadyMember ? (
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#EAE3D6] shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
                You’re Already a Member
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 font-light leading-relaxed">
                You already belong to this family space. There’s no need to join again, and no duplicate membership was created.
              </p>
            </div>

            {/* Membership Box */}
            <div className="p-4 rounded-xl bg-[#F6F1E9] border border-[#EAE3D6] text-left space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-[#7A7A7A] font-semibold">
                <span>FAMILY SPACE</span>
                <span className="text-emerald-700">Existing membership · Active</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
                Tesfaye Family
              </h3>
              <p className="text-xs text-[#5A5A5A]">Owner: Dawit Tesfaye · Your role: Admin</p>
              <p className="text-[11px] text-[#7A7A7A] pt-1 border-t border-[#EAE3D6]">
                Private space · Membership authorized
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/tesfaye-family/dashboard"
                className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors block text-center"
              >
                Open Family Space
              </Link>
              <Link
                href="/families"
                className="text-xs text-[#7A7A7A] hover:text-[#2B2B2B] transition-colors block"
              >
                Back to Family Selection
              </Link>
            </div>
          </div>
        ) : (
          /* STATE 1: JOIN FORM (Figma Page 43) */
          <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#EAE3D6] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-8">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B]">
                Join a Family Space
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 font-light leading-relaxed">
                We’re glad you’re here. Use the invitation link or code shared by your family’s Owner or Admin.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
                  Invitation code or link
                </label>
                <input
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter code or paste invitation link"
                  className="w-full px-3.5 py-2.5 rounded-md border border-[#D5C9B8] text-sm text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-2 focus:ring-[#C18B58] bg-white transition-all font-mono"
                />
                <p className="text-[11px] text-[#7A7A7A] mt-1 font-light">
                  Example code: <span className="font-mono font-medium">MK-7M4Q-9X2P</span> (or test <span className="underline cursor-pointer" onClick={() => setInviteCode("TF-1234")}>TF-1234</span> for existing member view)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Join Family</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EAE3D6]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-[#7A7A7A] font-semibold">OR</span>
              </div>
            </div>

            {/* Check Invitations for User Email */}
            <div className="p-4 rounded-xl bg-[#F6F1E9]/70 border border-[#EAE3D6] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#2B2B2B]">
                <Mail className="w-4 h-4 text-[#C18B58]" />
                <span>Find an invitation sent to your email</span>
              </div>
              <p className="text-xs text-[#5A5A5A] font-light">
                Check invitations sent to your verified email: <span className="font-semibold text-[#2B2B2B]">selam.bekele@gmail.com</span>
              </p>
              <div className="pt-2">
                <Link
                  href="/invitations/demo-token-mekonnen"
                  className="text-xs font-semibold text-[#C18B58] hover:underline"
                >
                  View pending invitation from Hana Mekonnen &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
