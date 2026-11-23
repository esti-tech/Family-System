"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Users, CheckCircle, ArrowRight, X } from "lucide-react";

export default function AcceptInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [loading, setLoading] = useState(false);
  const [declined, setDeclined] = useState(false);

  const handleAccept = () => {
    setLoading(true);
    setTimeout(() => {
      // Navigate into the joined family space
      router.push("/mekonnen-family/dashboard");
    }, 1000);
  };

  if (declined) {
    return (
      <div className="min-h-screen bg-[#F6F1E9] flex flex-col justify-center items-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-[#EAE3D6] max-w-md w-full shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#2B2B2B]">Invitation Declined</h2>
          <p className="text-xs text-[#5A5A5A]">
            You have declined the invitation to join Mekonnen Family. No membership was created.
          </p>
          <Link
            href="/families"
            className="inline-block mt-4 text-xs font-semibold text-[#C18B58] hover:underline"
          >
            Return to Family Spaces &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F1E9] flex flex-col">
      {/* Header */}
      <header className="h-20 bg-white border-b border-[#EAE3D6] px-6 sm:px-10 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-serif font-bold text-2xl text-[#2B2B2B]">KinKeep</span>
        </Link>
        <Link href="/families" className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B]">
          Return to Family Spaces
        </Link>
      </header>

      {/* Main Preview Container (Figma Page 50) */}
      <main className="flex-1 max-w-xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#EAE3D6] shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-6">
          <div className="text-center">
            <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded bg-[#F6F1E9] text-[#7A7A7A] font-semibold border border-[#EAE3D6]">
              INVITATION PREVIEW
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B2B2B] mt-4">
              You've Been Invited to Join This Family
            </h1>
            <p className="text-xs sm:text-sm text-[#5A5A5A] mt-2 font-light">
              A place for your roots, your people, and the stories you share.
            </p>
          </div>

          {/* Family Box */}
          <div className="p-5 rounded-xl bg-[#F6F1E9]/70 border border-[#EAE3D6] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#C18B58] font-bold">
                PRIVATE FAMILY SPACE
              </span>
              <span className="text-xs text-[#7A7A7A]">Harar, Ethiopia</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2B2B2B]">
              Mekonnen Family
            </h3>
            <p className="text-xs text-[#5A5A5A]">
              Invited by <span className="font-semibold text-[#2B2B2B]">Hana Mekonnen</span> (Family Owner)
            </p>

            {/* Note from inviter */}
            <div className="pt-3 border-t border-[#EAE3D6]">
              <p className="text-[10px] uppercase tracking-wider text-[#7A7A7A] font-semibold mb-1">
                A NOTE FROM HANA
              </p>
              <p className="text-xs font-serif italic text-[#343434] leading-relaxed">
                “Selam, come help us keep our family’s stories, photos, and traditions together. It wouldn’t be the same without you.”
              </p>
            </div>
          </div>

          {/* Role details */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-2 border-b border-[#F6F1E9]">
              <span className="text-[#5A5A5A]">Assigned Role</span>
              <span className="font-semibold text-[#2B2B2B]">Editor (Can contribute to tree & memories)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F6F1E9]">
              <span className="text-[#5A5A5A]">Invited Email</span>
              <span className="font-mono text-[#2B2B2B]">selam.bekele@gmail.com</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="w-full py-3 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>Accept Invitation & Join Space</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeclined(true)}
              className="w-full py-2.5 px-4 rounded-md border border-[#D5C9B8] text-[#7A7A7A] hover:text-red-600 text-xs font-medium transition-colors"
            >
              Decline Invitation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
