"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle2,
  Check,
  ShieldCheck,
  Loader2
} from "lucide-react";

export default function SendAccountNoticePage() {
  const router = useRouter();
  const params = useParams();
  const userId = (params?.userId as string) || "USR-24892";

  const isSuspended = userId === "USR-24802";
  const userName = isSuspended ? "Daniel Brooks" : "Emma Wilson";
  const userEmail = isSuspended ? "daniel.brooks@example.com" : "emma.wilson@example.com";

  const [subject, setSubject] = useState("Please review your account security");
  const [message, setMessage] = useState(
    `Hi ${userName},\n\nPlease review your recent KinKeep account activity. If you made these changes, no further action is necessary. If you did not recognize this activity, please reset your password immediately.\n\nWarmly,\nKinKeep Platform Security Team`
  );

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 800);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/users/${userId}`}
          className="rounded-lg p-1.5 text-[#736B5E] hover:bg-[#FAF8F5] hover:text-[#2B2B2B]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
            <span>Account Communication</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2B2B]">
            Send Official Notice
          </h1>
        </div>
      </div>

      <div className="mt-8 max-w-2xl">
        {isSent ? (
          /* Sent Confirmation Screen (Matching PDF Page 11 & 12) */
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-8 text-center shadow-sm md:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF3EC] text-[#4A7C59]">
              <Check className="h-7 w-7" />
            </div>

            <h2 className="mt-4 font-serif text-2xl font-bold text-[#2B2B2B]">
              Notice Sent
            </h2>
            <p className="mt-1 text-xs text-[#736B5E]">
              Your official communication was delivered to <strong>{userName}</strong> ({userEmail}).
            </p>

            <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-[11px] text-[#736B5E]">
              <span className="font-semibold text-[#4A7C59]">✓ Delivery Recorded:</span> Request logged with message ID in platform audit logs.
            </div>

            <Link
              href={`/admin/users/${userId}`}
              className="mt-6 inline-block rounded-xl bg-[#C18B58] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
            >
              Done
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-6 rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm md:p-8">
            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B]">
                Recipient Email
              </label>
              <input
                type="email"
                disabled
                value={userEmail}
                className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-mono text-[#736B5E]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B]">
                Subject Line *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-white px-3.5 py-2.5 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2B2B2B]">
                Notice Body *
              </label>
              <textarea
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[#EAE3D6] bg-white p-3 text-xs leading-relaxed text-[#2B2B2B] focus:border-[#C18B58] focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#F2ECE1] pt-4">
              <Link
                href={`/admin/users/${userId}`}
                className="rounded-xl border border-[#EAE3D6] px-4 py-2 text-xs font-semibold text-[#736B5E] hover:bg-[#FAF8F5]"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544] disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Notice...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Official Notice</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
