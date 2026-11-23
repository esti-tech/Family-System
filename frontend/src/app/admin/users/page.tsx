"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ChevronRight,
  Mail,
  ShieldAlert,
  ArrowUpDown,
  Lock
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended";
  registeredDate: string;
  lastActivity: string;
  workspacesCount: number;
}

const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: "USR-24892",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    status: "active",
    registeredDate: "Nov 17, 2026",
    lastActivity: "2 mins ago",
    workspacesCount: 2
  },
  {
    id: "USR-24881",
    name: "James Patel",
    email: "james.patel@example.com",
    status: "active",
    registeredDate: "Nov 16, 2026",
    lastActivity: "1 hour ago",
    workspacesCount: 1
  },
  {
    id: "USR-24834",
    name: "Olivia Chen",
    email: "olivia.chen@example.com",
    status: "active",
    registeredDate: "Nov 15, 2026",
    lastActivity: "Yesterday",
    workspacesCount: 1
  },
  {
    id: "USR-24802",
    name: "Daniel Brooks",
    email: "daniel.brooks@example.com",
    status: "suspended",
    registeredDate: "Nov 14, 2026",
    lastActivity: "Nov 18, 2026",
    workspacesCount: 1
  },
  {
    id: "USR-24761",
    name: "Sofia Martinez",
    email: "sofia.m@example.com",
    status: "active",
    registeredDate: "Nov 12, 2026",
    lastActivity: "3 days ago",
    workspacesCount: 3
  },
  {
    id: "USR-24719",
    name: "Noah Anderson",
    email: "noah.a@example.com",
    status: "active",
    registeredDate: "Nov 10, 2026",
    lastActivity: "5 days ago",
    workspacesCount: 1
  },
  {
    id: "USR-24680",
    name: "Amelia Taylor",
    email: "amelia.t@example.com",
    status: "active",
    registeredDate: "Nov 08, 2026",
    lastActivity: "1 week ago",
    workspacesCount: 2
  },
  {
    id: "USR-24622",
    name: "Ethan Kim",
    email: "ethan.kim@example.com",
    status: "active",
    registeredDate: "Nov 05, 2026",
    lastActivity: "2 weeks ago",
    workspacesCount: 1
  }
];

export default function AdminUsersPage() {
  const [filterTab, setFilterTab] = useState<"all" | "active" | "suspended">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = MOCK_ADMIN_USERS.filter((u) => {
    if (filterTab !== "all" && u.status !== filterTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 md:p-10">
      {/* Page Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
          Platform Users
        </h1>
        <p className="mt-1 text-xs text-[#736B5E]">
          Manage platform accounts, access and account communications.
        </p>
      </div>

      {/* KPI Cards (Matching PDF Page 2) */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold text-[#736B5E]">Total users</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#2B2B2B]">
              24,892
            </span>
            <span className="text-xs font-semibold text-[#4A7C59]">
              +12.8% this month
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#A89F91]">All registered accounts</p>
        </div>

        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold text-[#736B5E]">Active users</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#4A7C59]">
              24,431
            </span>
            <span className="text-xs text-[#736B5E]">
              98.1% of all accounts
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#A89F91]">Access enabled</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {(["all", "active", "suspended"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`rounded-xl px-4 py-1.5 text-xs font-semibold capitalize transition ${
                filterTab === tab
                  ? "bg-[#C18B58] text-white shadow-sm"
                  : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#736B5E] hover:border-[#C18B58]"
              }`}
            >
              {tab === "all" ? "All Users (24,892)" : tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#A89F91]" />
          <input
            type="text"
            placeholder="Search by name, email, or USR-ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] py-2 pl-9 pr-4 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Users Table (Matching PDF Page 2 layout) */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-[#EAE3D6] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#EAE3D6] bg-[#FAF8F5] font-medium text-[#736B5E]">
              <tr>
                <th className="py-3.5 pl-6 pr-3">User Name & ID</th>
                <th className="px-3 py-3.5">Email Address</th>
                <th className="px-3 py-3.5">Account Status</th>
                <th className="px-3 py-3.5">Workspaces</th>
                <th className="px-3 py-3.5">Registered Date</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6] text-[#2B2B2B]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-[#FAF8F5]">
                  <td className="py-4 pl-6 pr-3">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="font-semibold text-[#2B2B2B] hover:text-[#C18B58]"
                    >
                      {user.name}
                    </Link>
                    <p className="font-mono text-[10px] text-[#A89F91]">{user.id}</p>
                  </td>
                  <td className="px-3 py-4 text-[#736B5E]">{user.email}</td>
                  <td className="px-3 py-4">
                    {user.status === "active" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EC] px-2.5 py-0.5 text-[11px] font-semibold text-[#4A7C59]">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF2F2] px-2.5 py-0.5 text-[11px] font-semibold text-[#9A3B3B]">
                        <XCircle className="h-3 w-3" />
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-[#736B5E]">
                    {user.workspacesCount} workspace{user.workspacesCount > 1 ? "s" : ""}
                  </td>
                  <td className="px-3 py-4 text-[#736B5E]">{user.registeredDate}</td>
                  <td className="py-4 pl-3 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/users/${user.id}/notice`}
                        className="rounded-xl border border-[#EAE3D6] bg-white p-1.5 text-[#736B5E] hover:text-[#C18B58]"
                        title="Send Notice"
                      >
                        <Mail className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-[#C18B58] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#A97544]"
                      >
                        <span>Details</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-between border-t border-[#EAE3D6] bg-[#FAF8F5] px-6 py-3 text-xs text-[#736B5E]">
          <span>Showing 1–{filteredUsers.length} of 24,892 users</span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-[#EAE3D6] bg-white px-2.5 py-1 text-xs disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="rounded-lg border border-[#EAE3D6] bg-white px-2.5 py-1 text-xs hover:bg-[#FAF8F5]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
