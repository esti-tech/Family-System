"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShieldCheck, Users, CheckCircle, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/services/api";

interface InvitationData {
  id: string;
  family_name: string;
  role_name: string;
  inviter_name: string;
  status: string;
  expires_at: string;
}

export default function AcceptInvitationPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;

  const [inspectLoading, setInspectLoading] = useState(true);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    async function inspect() {
      if (!token) return;
      setInspectLoading(true);
      const res = await apiRequest<InvitationData>(`/api/v1/invitations/${token}`);
      if (res.success && res.data) {
        setInvitation(res.data);
      } else {
        setErrorMessage(res.error?.message || "This invitation link is invalid or has expired.");
      }
      setInspectLoading(false);
    }
    inspect();
  }, [token]);

  const handleAccept = async () => {
    setActionLoading(true);
    setErrorMessage("");

    const res = await apiRequest<{ family_slug: string; family_name: string }>(
      `/api/v1/invitations/${token}/accept`,
      { method: "POST" }
    );

    setActionLoading(false);

    if (res.success && res.data) {
      router.push(`/${res.data.family_slug}/dashboard`);
    } else {
      if (res.error?.code === "UNAUTHORIZED" || res.error?.code === "NOT_AUTHENTICATED") {
        router.push(`/login?next=/invitations/${token}`);
      } else {
        setErrorMessage(res.error?.message || "Failed to accept invitation.");
      }
    }
  };

  const handleDecline = async () => {
    setActionLoading(true);
    const res = await apiRequest(`/api/v1/invitations/${token}/decline`, {
      method: "POST",
    });
    setActionLoading(false);
    setDeclined(true);
  };

  if (declined) {
    return (
      <div className="min-h-screen bg-[#F6F1E9] flex flex-col justify-center items-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-[#EAE3D6] max-w-md w-full shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#2B2B2B]">Invitation Declined</h2>
          <p className="text-xs text-[#5A5A5A]">
            You have declined the invitation to join {invitation?.family_name || "the family space"}. No membership was created.
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

  if (inspectLoading) {
    return (
      <div className="min-h-screen bg-[#F6F1E9] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-[#C18B58] animate-spin mb-3" />
        <p className="text-xs text-[#5A5A5A]">Validating family invitation...</p>
      </div>
    );
  }

  if (errorMessage && !invitation) {
    return (
      <div className="min-h-screen bg-[#F6F1E9] flex flex-col justify-center items-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-red-200 max-w-md w-full shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#2B2B2B]">Invitation Unavailable</h2>
          <p className="text-xs text-red-600 font-light">
            {errorMessage}
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

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Family Box */}
          <div className="p-5 rounded-xl bg-[#F6F1E9]/70 border border-[#EAE3D6] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-[#C18B58] font-bold">
                PRIVATE FAMILY SPACE
              </span>
              <span className="text-xs text-[#7A7A7A]">Ethiopia</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2B2B2B]">
              {invitation?.family_name}
            </h3>
            <p className="text-xs text-[#5A5A5A]">
              Invited by <span className="font-semibold text-[#2B2B2B]">{invitation?.inviter_name || "Family Administrator"}</span>
            </p>

            {/* Note from inviter */}
            <div className="pt-3 border-t border-[#EAE3D6]">
              <p className="text-[10px] uppercase tracking-wider text-[#7A7A7A] font-semibold mb-1">
                INVITATION NOTE
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
              <span className="font-semibold text-[#2B2B2B]">{invitation?.role_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#F6F1E9]">
              <span className="text-[#5A5A5A]">Valid Until</span>
              <span className="text-[#2B2B2B]">
                {invitation?.expires_at ? new Date(invitation.expires_at).toLocaleDateString() : "Active"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleAccept}
              disabled={actionLoading}
              className="w-full py-3 px-4 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Accept Invitation & Join Space</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
            <button
              onClick={handleDecline}
              disabled={actionLoading}
              className="w-full py-2.5 px-4 rounded-md border border-[#D5C9B8] text-[#7A7A7A] hover:text-red-600 text-xs font-medium transition-colors disabled:opacity-50"
            >
              Decline Invitation
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
