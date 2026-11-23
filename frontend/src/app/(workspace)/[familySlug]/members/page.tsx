"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Users, UserPlus, Search, MoreVertical, ShieldCheck, Mail, ShieldAlert } from "lucide-react";

interface MemberRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  relationship: string;
  status: "ACTIVE" | "PENDING";
  joinedDate: string;
}

export default function FamilyMembersPage() {
  const params = useParams();
  const familySlug = (params?.familySlug as string) || "family";

  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [members, setMembers] = useState<MemberRecord[]>([
    {
      id: "m-1",
      name: "Solomon Abebe",
      email: "solomon.abebe@example.com",
      role: "Family Owner",
      relationship: "Father",
      status: "ACTIVE",
      joinedDate: "Nov 02, 2026",
    },
    {
      id: "m-2",
      name: "Almaz Tefera",
      email: "almaz.tefera@example.com",
      role: "Family Administrator",
      relationship: "Mother",
      status: "ACTIVE",
      joinedDate: "Nov 04, 2026",
    },
    {
      id: "m-3",
      name: "Dawit Solomon",
      email: "dawit.s@example.com",
      role: "Family Editor",
      relationship: "Brother",
      status: "ACTIVE",
      joinedDate: "Nov 10, 2026",
    },
    {
      id: "m-4",
      name: "Selamawit Bekele",
      email: "selamawit.b@example.com",
      role: "Family Viewer",
      relationship: "Aunt (Akst)",
      status: "ACTIVE",
      joinedDate: "Nov 15, 2026",
    },
    {
      id: "m-5",
      name: "Kalkidan Yonas",
      email: "kalkidan.y@example.com",
      role: "Family Editor",
      relationship: "Cousin (Ye'Agot Ljj)",
      status: "PENDING",
      joinedDate: "Nov 18, 2026 (Invited)",
    },
  ]);

  const filteredMembers = members.filter((m) => {
    if (activeTab === "PENDING" && m.status !== "PENDING") return false;
    if (activeTab === "ALL" && m.status === "PENDING") return false;
    if (roleFilter !== "ALL" && !m.role.toLowerCase().includes(roleFilter.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.relationship.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header and Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Family Members
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Manage who has access to this workspace and assign roles from Owner to Viewer.
          </p>
        </div>

        <Link
          href={`/${familySlug}/members/invite`}
          className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-1.5" />
          Invite Relatives
        </Link>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
          {/* Navigation Tabs */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "ALL"
                  ? "bg-gold-50 text-gold-700 border border-gold-200"
                  : "text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-50"
              }`}
            >
              Active Members ({members.filter((m) => m.status === "ACTIVE").length})
            </button>
            <button
              onClick={() => setActiveTab("PENDING")}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === "PENDING"
                  ? "bg-gold-50 text-gold-700 border border-gold-200"
                  : "text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-50"
              }`}
            >
              Pending Invitations ({members.filter((m) => m.status === "PENDING").length})
            </button>
          </div>

          {/* Search & Role Filter */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member name or email..."
                className="pl-8 pr-4 py-1.5 rounded-lg border border-border text-xs text-charcoal-900 bg-ivory-50/50 focus:outline-none focus:ring-1 focus:ring-gold-500 w-52 sm:w-64"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="py-1.5 px-3 rounded-lg border border-border text-xs text-charcoal-800 bg-ivory-50/50 focus:outline-none focus:ring-1 focus:ring-gold-500"
            >
              <option value="ALL">All Roles</option>
              <option value="Owner">Owner</option>
              <option value="Administrator">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
        </div>

        {/* Members Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-charcoal-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Relative</th>
                <th className="pb-3 font-semibold">Relationship</th>
                <th className="pb-3 font-semibold">Workspace Role</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Joined Date</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-ivory-50/60 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center font-bold text-xs uppercase border border-gold-200">
                        {member.name.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-charcoal-900">{member.name}</div>
                        <div className="text-[11px] text-charcoal-500">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-medium text-charcoal-800">
                    {member.relationship}
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-ivory-100 border border-border text-charcoal-800">
                      {member.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        member.status === "ACTIVE"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      {member.status === "ACTIVE" ? "Active" : "Invite Pending"}
                    </span>
                  </td>
                  <td className="py-4 text-charcoal-500">
                    {member.joinedDate}
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/${familySlug}/members/${member.id}/permissions`}
                      className="px-3 py-1 rounded-md text-[11px] font-semibold text-gold-600 hover:text-gold-700 hover:bg-gold-50 border border-transparent hover:border-gold-200 transition-colors"
                    >
                      Permissions
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
