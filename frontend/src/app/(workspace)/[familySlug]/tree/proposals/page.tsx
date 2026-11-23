"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  Clock,
  GitFork,
  CheckCircle,
  AlertCircle,
  UserPlus,
  Shield,
} from "lucide-react";

interface TreeProposal {
  id: string;
  type: "ADD_PERSON" | "CONNECT_PARENT_CHILD" | "UPDATE_BIO";
  personName: string;
  proposedBy: string;
  relationshipSummary: string;
  details: string;
  timestamp: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function TreeProposalsPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const [proposals, setProposals] = useState<TreeProposal[]>([
    {
      id: "prop-1",
      type: "ADD_PERSON",
      personName: "Kalkidan Bekele",
      proposedBy: "Dawit Bekele (Admin)",
      relationshipSummary: "Daughter of Dawit Mekonnen & Hana Mekonnen",
      details: "Born in Addis Ababa, 1998. Adding as sibling of Selam and Yonas.",
      timestamp: "Yesterday at 4:32 PM",
      status: "PENDING",
    },
    {
      id: "prop-2",
      type: "CONNECT_PARENT_CHILD",
      personName: "Meron Tesfaye",
      proposedBy: "Tigist Alemu (Editor)",
      relationshipSummary: "Child of Tigist Alemu and Abebe Tesfaye",
      details: "Connecting maternal lineage branch to Elias Bekele.",
      timestamp: "3 days ago",
      status: "PENDING",
    },
    {
      id: "prop-3",
      type: "ADD_PERSON",
      personName: "Aster Gebre",
      proposedBy: "Selam Bekele (Owner)",
      relationshipSummary: "Matriarch & Grandmother",
      details: "Initial root genealogical registration.",
      timestamp: "Nov 15, 2026",
      status: "APPROVED",
    },
  ]);

  const handleApprove = (id: string) => {
    setProposals(
      proposals.map((p) => (p.id === id ? { ...p, status: "APPROVED" } : p))
    );
  };

  const handleReject = (id: string) => {
    setProposals(
      proposals.map((p) => (p.id === id ? { ...p, status: "REJECTED" } : p))
    );
  };

  const pendingList = proposals.filter((p) => p.status === "PENDING");
  const historyList = proposals.filter((p) => p.status !== "PENDING");

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#EAE3D6] gap-4">
        <div>
          <Link
            href={`/${slug}/tree`}
            className="text-xs text-[#5A5A5A] hover:text-[#2B2B2B] flex items-center mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Family Tree Canvas
          </Link>
          <h1 className="font-serif text-3xl font-bold text-[#2B2B2B]">
            Tree Change Proposals & Review Queue
          </h1>
          <p className="text-xs text-[#5A5A5A] font-light mt-1">
            Review proposed genealogy additions, connections, and edits submitted by contributors before merging.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
            {pendingList.length} Pending Approval
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EAE3D6] space-x-8 text-xs font-medium">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 transition-colors relative ${
            activeTab === "pending"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Pending Review ({pendingList.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`pb-3 transition-colors relative ${
            activeTab === "history"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Audit History & Merged ({historyList.length})
        </button>
      </div>

      {/* 1. PENDING QUEUE */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {pendingList.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center text-xs text-[#7A7A7A] border border-[#EAE3D6]">
              All proposed changes have been reviewed and merged into the tree graph.
            </div>
          ) : (
            pendingList.map((prop) => (
              <div
                key={prop.id}
                className="bg-white rounded-xl p-6 border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#F6F1E9] text-[#C18B58] flex items-center justify-center font-bold shrink-0">
                      <GitFork className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F6F1E9] text-[#C18B58]">
                          {prop.type === "ADD_PERSON" ? "New Relative" : "Relationship Connection"}
                        </span>
                        <span className="text-[11px] text-[#7A7A7A]">{prop.timestamp}</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[#2B2B2B] mt-1">
                        {prop.personName}
                      </h3>
                      <p className="text-xs font-medium text-[#5A5A5A]">
                        Proposed by {prop.proposedBy}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F6F1E9]/50 rounded-lg border border-[#EAE3D6] text-xs space-y-1">
                  <p className="font-semibold text-[#2B2B2B]">{prop.relationshipSummary}</p>
                  <p className="text-[#5A5A5A] font-light">{prop.details}</p>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    onClick={() => handleReject(prop.id)}
                    className="px-4 py-2 rounded-md border border-[#D5C9B8] text-xs font-medium text-[#7A7A7A] hover:text-red-600 transition-colors"
                  >
                    Reject with Feedback
                  </button>
                  <button
                    onClick={() => handleApprove(prop.id)}
                    className="px-5 py-2 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve & Merge into Tree</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. AUDIT HISTORY TAB */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EAE3D6] bg-[#F6F1E9]/60 text-[11px] uppercase tracking-wider text-[#7A7A7A]">
                  <th className="py-3 px-6 font-semibold">Change</th>
                  <th className="py-3 px-4 font-semibold">Proposed By</th>
                  <th className="py-3 px-4 font-semibold">Date</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F1E9]">
                {historyList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F6F1E9]/20">
                    <td className="py-3 px-6">
                      <p className="font-semibold text-[#2B2B2B]">{item.personName}</p>
                      <p className="text-[11px] text-[#7A7A7A]">{item.relationshipSummary}</p>
                    </td>
                    <td className="py-3 px-4 text-[#5A5A5A]">{item.proposedBy}</td>
                    <td className="py-3 px-4 text-[#7A7A7A]">{item.timestamp}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          item.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
