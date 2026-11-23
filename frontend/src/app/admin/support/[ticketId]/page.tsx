"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  Clock,
  Building2,
  Mail,
  User,
  Check
} from "lucide-react";

interface TicketMessage {
  id: string;
  sender: string;
  role: "user" | "admin";
  time: string;
  body: string;
}

export default function AdminTicketDetailPage() {
  const params = useParams();
  const ticketId = (params?.ticketId as string) || "TCK-4819";

  const [messages, setMessages] = useState<TicketMessage[]>([
    {
      id: "msg-1",
      sender: "Tadesse Wolde",
      role: "user",
      time: "25 mins ago",
      body: "Hello Support, I initiated a 2,900 ETB subscription upgrade via Telebirr on my mobile phone. The USSD PIN prompt completed successfully on Ethio Telecom, but my workspace is still showing as awaiting payment. Can you please verify the transaction reference TXN-9402?"
    }
  ]);

  const [replyText, setReplyText] = useState("");
  const [ticketStatus, setTicketStatus] = useState<"open" | "in_progress" | "resolved">("open");
  const [isSending, setIsSending] = useState(false);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSending(true);
    setTimeout(() => {
      const newMsg: TicketMessage = {
        id: `msg-${Date.now()}`,
        sender: "KinKeep Support Team",
        role: "admin",
        time: "Just now",
        body: replyText
      };
      setMessages([...messages, newMsg]);
      setReplyText("");
      setTicketStatus("resolved");
      setIsSending(false);
    }, 600);
  };

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/support"
          className="rounded-lg p-1.5 text-[#736B5E] hover:bg-[#FAF8F5] hover:text-[#2B2B2B]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
            <span>Support</span>
            <span>/</span>
            <span>{ticketId}</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2B2B2B]">
            Telebirr Payment Confirmation Inquiry
          </h1>
        </div>
      </div>

      <div className="mt-8 max-w-4xl space-y-6">
        {/* Ticket Header & Status */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#F2ECE1] pb-4">
            <div>
              <p className="font-semibold text-sm text-[#2B2B2B]">Submitter: Tadesse Wolde</p>
              <p className="text-xs text-[#736B5E]">Email: tadesse.wolde@example.com • Workspace: Tadesse & Wolde Lineage</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#736B5E]">Status:</span>
              <select
                value={ticketStatus}
                onChange={(e) => setTicketStatus(e.target.value as any)}
                className="rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3 py-1.5 text-xs font-semibold text-[#2B2B2B]"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Conversation Thread */}
          <div className="mt-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-2xl p-4 text-xs ${
                  msg.role === "admin"
                    ? "border border-[#C18B58]/30 bg-[#FAF5EE] ml-8"
                    : "border border-[#EAE3D6] bg-white mr-8"
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-[#2B2B2B] mb-1.5">
                  <span className={msg.role === "admin" ? "text-[#C18B58]" : ""}>
                    {msg.sender} {msg.role === "admin" && "(Platform Support)"}
                  </span>
                  <span className="text-[10px] text-[#A89F91] font-normal">{msg.time}</span>
                </div>
                <p className="leading-relaxed text-[#736B5E]">{msg.body}</p>
              </div>
            ))}
          </div>

          {/* Reply Textarea */}
          <form onSubmit={handleSendReply} className="mt-6 border-t border-[#F2ECE1] pt-4 space-y-3">
            <label className="block text-xs font-semibold text-[#2B2B2B]">
              Send Official Response to Tadesse
            </label>
            <textarea
              rows={4}
              required
              placeholder="Type your resolution or transaction verification details..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSending || !replyText.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544] disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{isSending ? "Sending..." : "Send Reply & Resolve"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
