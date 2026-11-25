"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  HardDrive,
  Users,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { apiRequest } from "@/services/api";

interface AdminWorkspace {
  id: string;
  name: string;
  slug: string;
  plan: "Family Plus" | "Legacy Premium" | "Basic";
  membersCount: number;
  storageUsed: string;
  storageQuota: string;
  createdDate: string;
  adminEmail: string;
}

const MOCK_ADMIN_WORKSPACES: AdminWorkspace[] = [
  {
    id: "WS-8492",
    name: "The Bekele Family Archive",
    slug: "bekele-family",
    plan: "Family Plus",
    membersCount: 14,
    storageUsed: "38.4 GB",
    storageQuota: "100 GB",
    createdDate: "Oct 12, 2025",
    adminEmail: "dawit.bekele@example.com"
  },
  {
    id: "WS-8491",
    name: "The Kalkidan Family Archive",
    slug: "kalkidan-family",
    plan: "Legacy Premium",
    membersCount: 28,
    storageUsed: "142.8 GB",
    storageQuota: "1 TB",
    createdDate: "Nov 01, 2025",
    adminEmail: "kalkalpro19@gmail.com"
  },
  {
    id: "WS-8488",
    name: "Tadesse & Wolde Lineage",
    slug: "tadesse-wolde",
    plan: "Family Plus",
    membersCount: 19,
    storageUsed: "45.1 GB",
    storageQuota: "100 GB",
    createdDate: "Sep 24, 2025",
    adminEmail: "tadesse.wolde@example.com"
  },
  {
    id: "WS-8470",
    name: "The Wilson Homestead",
    slug: "wilson-archive",
    plan: "Basic",
    membersCount: 6,
    storageUsed: "3.2 GB",
    storageQuota: "5 GB",
    createdDate: "Nov 17, 2026",
    adminEmail: "emma.wilson@example.com"
  }
];

export default function AdminWorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<AdminWorkspace[]>(MOCK_ADMIN_WORKSPACES);
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  useEffect(() => {
    async function loadWorkspaces() {
      const res = await apiRequest(`/api/v1/platform-admin/workspaces/`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const live: AdminWorkspace[] = res.data.map((w: any) => ({
          id: w.id,
          name: w.name,
          slug: w.slug,
          plan: (w.plan_name === "Dynasty Legacy" ? "Legacy Premium" : w.plan_name === "Family Roots" ? "Family Plus" : "Basic") as any,
          membersCount: w.member_count || 1,
          storageUsed: `${w.storage_used_gb || 0} GB`,
          storageQuota: "100 GB",
          createdDate: new Date(w.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          adminEmail: "family.admin@kinkeep.family"
        }));
        setWorkspaces(live);
      }
    }
    loadWorkspaces();
  }, []);

  const filteredWorkspaces = workspaces.filter((ws) => {
    if (planFilter !== "all" && ws.plan !== planFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        ws.name.toLowerCase().includes(q) ||
        ws.slug.toLowerCase().includes(q) ||
        ws.adminEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 md:p-10">
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
          Family Workspaces
        </h1>
        <p className="mt-1 text-xs text-[#736B5E]">
          Monitor 6,418 family archive workspaces, storage consumption, and membership quotas.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {["all", "Family Plus", "Legacy Premium", "Basic"].map((plan) => (
            <button
              key={plan}
              onClick={() => setPlanFilter(plan)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                planFilter === plan
                  ? "bg-[#C18B58] text-white"
                  : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#736B5E] hover:border-[#C18B58]"
              }`}
            >
              {plan === "all" ? "All Plans" : plan}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#A89F91]" />
          <input
            type="text"
            placeholder="Search workspaces by name or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] py-2 pl-9 pr-4 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Workspaces Table */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-[#EAE3D6] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#EAE3D6] bg-[#FAF8F5] font-medium text-[#736B5E]">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Workspace Name & Slug</th>
                <th className="px-3 py-3.5">Plan Tier</th>
                <th className="px-3 py-3.5">Members</th>
                <th className="px-3 py-3.5">Storage Quota</th>
                <th className="px-3 py-3.5">Admin Email</th>
                <th className="px-3 py-3.5">Created Date</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6] text-[#2B2B2B]">
              {filteredWorkspaces.map((ws) => (
                <tr key={ws.id} className="transition hover:bg-[#FAF8F5]">
                  <td className="py-4 pl-6 pr-3">
                    <Link
                      href={`/admin/workspaces/${ws.slug}`}
                      className="font-serif font-bold text-sm text-[#2B2B2B] hover:text-[#C18B58]"
                    >
                      {ws.name}
                    </Link>
                    <p className="font-mono text-[10px] text-[#A89F91]">slug: {ws.slug}</p>
                  </td>
                  <td className="px-3 py-4">
                    <span className="rounded-full bg-[#FAF5EE] px-2.5 py-0.5 text-[11px] font-semibold text-[#C18B58] border border-[#EAE3D6]">
                      {ws.plan}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-[#736B5E]">
                    {ws.membersCount} relatives
                  </td>
                  <td className="px-3 py-4 text-[#736B5E]">
                    <span className="font-semibold text-[#2B2B2B]">{ws.storageUsed}</span> / {ws.storageQuota}
                  </td>
                  <td className="px-3 py-4 text-[#736B5E]">{ws.adminEmail}</td>
                  <td className="px-3 py-4 text-[#736B5E]">{ws.createdDate}</td>
                  <td className="py-4 pl-3 pr-6 text-right">
                    <Link
                      href={`/admin/workspaces/${ws.slug}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#C18B58] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#A97544]"
                    >
                      <span>Manage</span>
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
