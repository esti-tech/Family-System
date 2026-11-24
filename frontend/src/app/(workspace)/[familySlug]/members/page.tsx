"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Users,
  UserPlus,
  Search,
  Shield,
  MoreVertical,
  Mail,
  ChevronDown,
  Filter,
  CheckCircle,
  Clock,
} from "lucide-react";
import { apiRequest } from "@/services/api";

interface MemberItem {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "CONTRIBUTOR" | "MEMBER";
  kinship: string;
  status: "ACTIVE" | "INVITED" | "PENDING";
  joinedDate: string;
  isCurrentUser?: boolean;
}

export default function FamilyMembersPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [activeTab, setActiveTab] = useState<"all" | "invitations" | "requests">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const DEFAULT_MEMBERS: MemberItem[] = [
    {
      id: "m-1",
      name: "Selam Bekele",
      email: "selam.bekele@gmail.com",
      role: "OWNER",
      kinship: "You",
      status: "ACTIVE",
      joinedDate: "Nov 15, 2026",
      isCurrentUser: true,
    },
    {
      id: "m-2",
      name: "Dawit Bekele",
      email: "dawit.bekele@gmail.com",
      role: "ADMIN",
      kinship: "Brother",
      status: "ACTIVE",
      joinedDate: "Nov 16, 2026",
    },
    {
      id: "m-3",
      name: "Almaz Tesfaye",
      email: "almaz.tesfaye@gmail.com",
      role: "EDITOR",
      kinship: "Grandmother",
      status: "ACTIVE",
      joinedDate: "Nov 16, 2026",
    },
    {
      id: "m-4",
      name: "Hana Mekonnen",
      email: "hana.m@gmail.com",
      role: "EDITOR",
      kinship: "Aunt",
      status: "ACTIVE",
      joinedDate: "Nov 17, 2026",
    },
    {
      id: "m-5",
      name: "Yonas Haile",
      email: "yonas.haile@gmail.com",
      role: "CONTRIBUTOR",
      kinship: "Uncle",
      status: "ACTIVE",
      joinedDate: "Nov 18, 2026",
    },
    {
      id: "m-6",
      name: "Tigist Bekele",
      email: "tigist.b@gmail.com",
      role: "MEMBER",
      kinship: "Cousin",
      status: "ACTIVE",
      joinedDate: "Nov 19, 2026",
    },
  ];

  const [members, setMembers] = useState<MemberItem[]>(DEFAULT_MEMBERS);

  useEffect(() => {
    async function fetchLiveMembers() {
      const res = await apiRequest(`/api/v1/families/by-slug/${slug}/members`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const liveMembers: MemberItem[] = res.data.map((m: any) => ({
          id: m.id,
          name: m.user?.full_name || m.nickname || "Family Relative",
          email: m.user?.email || "",
          role: (m.role?.name?.toUpperCase().includes("ADMIN") ? "ADMIN" : m.role?.name?.toUpperCase().includes("OWNER") ? "OWNER" : "MEMBER") as any,
          kinship: m.nickname || "Relative",
          status: m.status || "ACTIVE",
          joinedDate: new Date(m.joined_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          isCurrentUser: false,
        }));
        setMembers(liveMembers);
      }
    }
    fetchLiveMembers();
  }, [slug]);

  const pendingInvitations: MemberItem[] = [
    {
      id: "inv-1",
      name: "Kalkidan Bekele",
      email: "kalkalpro19@gmail.com",
      role: "EDITOR",
      kinship: "Cousin",
      status: "INVITED",
      joinedDate: "Dispatched 2 days ago",
    },
    {
      id: "inv-2",
      name: "Berhanu Wolde",
      email: "berhanu.w@gmail.com",
      role: "CONTRIBUTOR",
      kinship: "Granduncle",
      status: "INVITED",
      joinedDate: "Dispatched 4 days ago",
    },
  ];

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header (Figma ui_part2 Page 2) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#EAE3D6] gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-semibold mb-1">
            YOUR FAMILY CIRCLE
          </p>
          <h1 className="font-serif text-3xl font-bold text-[#2B2B2B]">
            Family Members
          </h1>
          <p className="text-xs text-[#5A5A5A] font-light mt-1">
            24 relatives in this space · 22 active · 2 invitations pending
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/${slug}/members/permissions`}
            className="px-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs font-semibold text-[#2B2B2B] hover:bg-[#F6F1E9] transition-colors"
          >
            Roles & Permissions
          </Link>
          <Link
            href={`/${slug}/members/invite`}
            className="inline-flex items-center px-4 py-2 rounded-md bg-[#C18B58] hover:bg-[#b07d4b] text-white text-xs font-semibold shadow-sm transition-colors space-x-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Member</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#EAE3D6] space-x-8 text-xs font-medium">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 transition-colors relative ${
            activeTab === "all"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          All Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab("invitations")}
          className={`pb-3 transition-colors relative ${
            activeTab === "invitations"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Pending Invitations ({pendingInvitations.length})
        </button>
        <button
          onClick={() => setActiveTab("requests")}
          className={`pb-3 transition-colors relative ${
            activeTab === "requests"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Join Requests (0)
        </button>
      </div>

      {/* Filter Row */}
      {activeTab === "all" && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#7A7A7A]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email"
              className="w-full pl-9 pr-3.5 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] placeholder:text-[#9A9A9A] focus:outline-none focus:ring-1 focus:ring-[#C18B58] bg-white"
            />
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-md border border-[#D5C9B8] text-xs text-[#2B2B2B] bg-white focus:outline-none focus:ring-1 focus:ring-[#C18B58]"
            >
              <option value="ALL">All Roles</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="EDITOR">Editor</option>
              <option value="CONTRIBUTOR">Contributor</option>
              <option value="MEMBER">Member</option>
            </select>
          </div>
        </div>
      )}

      {/* 1. ALL MEMBERS TABLE */}
      {activeTab === "all" && (
        <div className="bg-white rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EAE3D6] bg-[#F6F1E9]/60 text-[11px] uppercase tracking-wider text-[#7A7A7A]">
                  <th className="py-3 px-6 font-semibold">Relative</th>
                  <th className="py-3 px-4 font-semibold">Kinship Relation</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F6F1E9]">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-[#F6F1E9]/30 transition-colors">
                    {/* Relative info */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-[#C18B58] text-white flex items-center justify-center font-serif font-bold text-sm">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-[#2B2B2B]">{member.name}</span>
                            {member.isCurrentUser && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#7A7A7A]">{member.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Kinship */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F6F1E9] border border-[#EAE3D6] text-[11px] font-medium text-[#2B2B2B]">
                        {member.kinship}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          member.role === "OWNER"
                            ? "bg-purple-100 text-purple-800"
                            : member.role === "ADMIN"
                            ? "bg-blue-100 text-blue-800"
                            : member.role === "EDITOR"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className="flex items-center text-emerald-600 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/${slug}/members/permissions`}
                        className="text-xs text-[#C18B58] hover:underline font-medium"
                      >
                        Edit permissions
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. PENDING INVITATIONS TAB */}
      {activeTab === "invitations" && (
        <div className="bg-white rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F6F1E9]">
            <span className="text-xs font-semibold text-[#2B2B2B]">
              Active Invitation Links & Codes
            </span>
            <Link
              href={`/${slug}/members/invite`}
              className="text-xs font-semibold text-[#C18B58] hover:underline"
            >
              Send New Invite +
            </Link>
          </div>

          <div className="divide-y divide-[#F6F1E9]">
            {pendingInvitations.map((inv) => (
              <div key={inv.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#EAE3D6] text-[#7A7A7A] flex items-center justify-center font-bold text-xs">
                    {inv.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-semibold text-xs text-[#2B2B2B]">{inv.name}</h5>
                    <p className="text-[11px] text-[#7A7A7A]">{inv.email} · Role: {inv.role}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-[#7A7A7A] text-[11px] flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-[#C18B58]" />
                    {inv.joinedDate}
                  </span>
                  <button
                    onClick={() => alert(`Resent invitation code to ${inv.email}`)}
                    className="px-2.5 py-1 rounded border border-[#D5C9B8] text-[11px] text-[#2B2B2B] hover:bg-[#F6F1E9]"
                  >
                    Resend
                  </button>
                  <button
                    onClick={() => alert("Invitation revoked")}
                    className="text-red-500 hover:text-red-700 text-[11px]"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. REQUESTS TAB */}
      {activeTab === "requests" && (
        <div className="bg-white rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-12 text-center text-xs text-[#7A7A7A]">
          <p>No pending membership requests for this family space.</p>
        </div>
      )}
    </div>
  );
}
