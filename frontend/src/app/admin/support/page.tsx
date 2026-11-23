"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  MessageSquare
} from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  submitterName: string;
  submitterEmail: string;
  workspaceName: string;
  priority: "urgent" | "normal" | "low";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "TCK-4819",
    subject: "Telebirr payment confirmation delayed after USSD prompt",
    submitterName: "Tadesse Wolde",
    submitterEmail: "tadesse.wolde@example.com",
    workspaceName: "Tadesse & Wolde Lineage",
    priority: "urgent",
    status: "open",
    createdAt: "25 mins ago"
  },
  {
    id: "TCK-4815",
    subject: "Inquiry on scanning vintage Amharic parchment certificates",
    submitterName: "Dawit Bekele",
    submitterEmail: "dawit.bekele@example.com",
    workspaceName: "The Bekele Family Archive",
    priority: "normal",
    status: "in_progress",
    createdAt: "3 hours ago"
  },
  {
    id: "TCK-4802",
    subject: "Requesting storage quota extension for Gondar history project",
    submitterName: "Emma Wilson",
    submitterEmail: "emma.wilson@example.com",
    workspaceName: "The Wilson Homestead",
    priority: "normal",
    status: "resolved",
    createdAt: "Nov 20, 2026"
  }
];

export default function AdminSupportPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTickets = MOCK_TICKETS.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="p-6 md:p-10">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
          Support Tickets & Inquiries
        </h1>
        <p className="mt-1 text-xs text-[#736B5E]">
          Assist family workspace administrators with payments, genealogy tools, and storage.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex items-center gap-2">
        {["all", "open", "in_progress", "resolved"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-xl px-4 py-1.5 text-xs font-semibold capitalize transition ${
              statusFilter === st
                ? "bg-[#C18B58] text-white shadow-sm"
                : "border border-[#EAE3D6] bg-white text-[#736B5E] hover:border-[#C18B58]"
            }`}
          >
            {st === "all" ? "All Inquiries" : st.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-[#EAE3D6] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#EAE3D6] bg-[#FAF8F5] font-medium text-[#736B5E]">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Ticket ID & Subject</th>
                <th className="px-3 py-3.5">Submitter & Workspace</th>
                <th className="px-3 py-3.5">Priority</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-3 py-3.5">Created</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Resolve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6] text-[#2B2B2B]">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="transition hover:bg-[#FAF8F5]">
                  <td className="py-4 pl-6 pr-3">
                    <Link
                      href={`/admin/support/${t.id}`}
                      className="font-serif font-bold text-sm text-[#2B2B2B] hover:text-[#C18B58]"
                    >
                      {t.subject}
                    </Link>
                    <p className="font-mono text-[10px] text-[#A89F91]">{t.id}</p>
                  </td>
                  <td className="px-3 py-4">
                    <p className="font-semibold text-[#2B2B2B]">{t.submitterName}</p>
                    <p className="text-[11px] text-[#736B5E]">{t.workspaceName}</p>
                  </td>
                  <td className="px-3 py-4">
                    {t.priority === "urgent" && (
                      <span className="rounded-full bg-[#FDF2F2] px-2.5 py-0.5 text-[10px] font-semibold text-[#9A3B3B]">
                        Urgent
                      </span>
                    )}
                    {t.priority === "normal" && (
                      <span className="rounded-full bg-[#FAF5EE] px-2.5 py-0.5 text-[10px] font-semibold text-[#C18B58]">
                        Normal
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    {t.status === "open" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#B8860B]">
                        <Clock className="h-3 w-3" />
                        Open
                      </span>
                    )}
                    {t.status === "in_progress" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C18B58]">
                        <Clock className="h-3 w-3" />
                        In Progress
                      </span>
                    )}
                    {t.status === "resolved" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A7C59]">
                        <CheckCircle2 className="h-3 w-3" />
                        Resolved
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-[#736B5E]">{t.createdAt}</td>
                  <td className="py-4 pl-3 pr-6 text-right">
                    <Link
                      href={`/admin/support/${t.id}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#C18B58] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#A97544]"
                    >
                      <span>Reply</span>
                      <ChevronRight className="h-3 w-3" />
                    </Link>
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
