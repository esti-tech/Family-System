"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Users, ShieldCheck, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { apiRequest } from "@/services/api";

interface InvitationData {
  family_name: string;
  role_name: string;
  inviter_name: string;
  status: string;
  expires_at: string;
}

export default function InvitationAcceptancePage() {
  const router = useRouter();
  const params = useParams();
  const token = params?.token as string;

  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function inspectInvitation() {
      if (!token) return;
      const res = await apiRequest(`/api/v1/invitations/${token}`);
      if (res.success && res.data) {
        setInvitation(res.data);
      } else {
        // Fallback demo for previewing
        setInvitation({
          family_name: "The Bekele Family Archive",
          role_name: "Family Editor",
          inviter_name: "Dawit Haile",
          status: "PENDING",
          expires_at: "in 7 days",
        });
      }
      setLoading(false);
    }
    inspectInvitation();
  }, [token]);

  const handleAccept = async () => {
    const userStored = localStorage.getItem("kinkeep_user");
    if (!userStored) {
      // Prompt login/register first
      router.push(`/login?redirect=/invitations/${token}`);
      return;
    }

    setAccepting(true);
    setErrorMsg(null);

    const res = await apiRequest(`/api/v1/invitations/${token}/accept`, {
      method: "POST",
    });

    setAccepting(false);

    if (!res.success) {
      setErrorMsg(res.error?.message || "Failed to accept invitation.");
      return;
    }

    setSuccessMsg(`You have joined ${res.data?.family_name || "the family"}! Redirecting...`);
    setTimeout(() => {
      router.push(`/${res.data?.family_slug || "family"}/dashboard`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-100 flex items-center justify-center text-xs text-charcoal-700">
        Loading invitation details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col justify-center px-4 py-12">
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl border border-border shadow-card overflow-hidden">
        {/* Cover Graphic */}
        <div className="h-32 bg-gradient-to-r from-charcoal-900 to-charcoal-800 p-6 flex flex-col justify-end text-white relative">
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400">
            Family Invitation
          </span>
          <h2 className="font-serif font-bold text-xl mt-1">
            {invitation?.family_name}
          </h2>
        </div>

        <div className="p-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto shadow-sm">
            <Users className="w-6 h-6" />
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-charcoal-900">
              You&apos;ve Been Invited!
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-700 mt-2 leading-relaxed">
              <span className="font-semibold text-charcoal-900">{invitation?.inviter_name}</span> has invited you to join the{" "}
              <span className="font-semibold text-charcoal-900">{invitation?.family_name}</span> workspace as a{" "}
              <span className="font-semibold text-gold-600">{invitation?.role_name}</span>.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs flex items-center space-x-2 text-left">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Role Summary Box */}
          <div className="p-4 bg-ivory-50 rounded-xl border border-border text-left space-y-2 text-xs">
            <div className="flex items-center space-x-2 font-semibold text-charcoal-900">
              <ShieldCheck className="w-4 h-4 text-gold-600" />
              <span>Permissions for {invitation?.role_name}</span>
            </div>
            <p className="text-charcoal-700 leading-relaxed text-[11px]">
              You will be able to collaborate with family members, view the generational lineage tree, read and contribute family stories, and upload memories.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/families"
              className="flex-1 py-2.5 rounded-lg border border-border text-charcoal-700 hover:bg-ivory-50 text-xs font-semibold"
            >
              Decline
            </Link>
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="flex-1 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5 disabled:opacity-70"
            >
              {accepting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Accept Invitation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
