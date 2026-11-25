"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle2
} from "lucide-react";
import { apiRequest } from "@/services/api";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  severity: "info" | "warning" | "critical";
}

const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: "LOG-9281",
    timestamp: "Today at 10:14 AM",
    actor: "super.admin@kinkeep.com",
    action: "Sent official security notice to user",
    target: "USR-24892 (Emma Wilson)",
    ipAddress: "197.156.104.22 (Addis Ababa, ET)",
    severity: "info"
  },
  {
    id: "LOG-9280",
    timestamp: "Today at 09:30 AM",
    actor: "super.admin@kinkeep.com",
    action: "Suspended account access due to security hold",
    target: "USR-24802 (Daniel Brooks)",
    ipAddress: "197.156.104.22 (Addis Ababa, ET)",
    severity: "warning"
  },
  {
    id: "LOG-9279",
    timestamp: "Today at 08:45 AM",
    actor: "system.telebirr.webhook",
    action: "Verified renewal payment transaction TXN-9402",
    target: "WS-8492 (The Bekele Family)",
    ipAddress: "213.55.98.11 (Ethio Telecom API)",
    severity: "info"
  },
  {
    id: "LOG-9275",
    timestamp: "Yesterday at 05:12 PM",
    actor: "super.admin@kinkeep.com",
    action: "Updated workspace storage ceiling to 100 GB",
    target: "WS-8492 (The Bekele Family)",
    ipAddress: "197.156.104.22 (Addis Ababa, ET)",
    severity: "info"
  },
  {
    id: "LOG-9260",
    timestamp: "Nov 21, 2026",
    actor: "system.auth.otp",
    action: "Failed OTP verification attempt limit exceeded (3x)",
    target: "USR-24799",
    ipAddress: "185.220.101.4 (Tor Exit Node)",
    severity: "critical"
  }
];

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  useEffect(() => {
    async function loadLogs() {
      const res = await apiRequest(`/api/v1/platform-admin/audit-logs/`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const live: AuditLog[] = res.data.map((l: any) => ({
          id: l.id.slice(0, 8),
          timestamp: new Date(l.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
          actor: l.actor_email || "System",
          action: l.action.replace(/_/g, " "),
          target: `${l.target_type}: ${l.target_label || l.target_id}`,
          ipAddress: l.ip_address || "Internal API",
          severity: l.action.includes("SUSPEND") ? "warning" : "info"
        }));
        setLogs(live);
      }
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (severityFilter !== "all" && l.severity !== severityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.actor.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.target.toLowerCase().includes(q) ||
        l.ipAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
            Platform Security Audit Logs
          </h1>
          <p className="mt-1 text-xs text-[#736B5E]">
            Immutable chronological record of administrative actions, authentications, and policy events.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3D6] bg-white px-3.5 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
        >
          <Download className="h-4 w-4 text-[#C18B58]" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-[#EAE3D6] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {["all", "info", "warning", "critical"].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition ${
                severityFilter === sev
                  ? "bg-[#C18B58] text-white"
                  : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#736B5E] hover:border-[#C18B58]"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#A89F91]" />
          <input
            type="text"
            placeholder="Search by actor, target, action or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] py-2 pl-9 pr-4 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-[#EAE3D6] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#EAE3D6] bg-[#FAF8F5] font-medium text-[#736B5E]">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Timestamp</th>
                <th className="px-3 py-3.5">Actor</th>
                <th className="px-3 py-3.5">Action Executed</th>
                <th className="px-3 py-3.5">Target Entity</th>
                <th className="px-3 py-3.5">Source IP & Region</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6] text-[#2B2B2B]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="transition hover:bg-[#FAF8F5]">
                  <td className="py-4 pl-6 pr-3 font-mono text-[11px] text-[#736B5E]">
                    {log.timestamp}
                  </td>
                  <td className="px-3 py-4 font-semibold text-[#2B2B2B]">
                    {log.actor}
                  </td>
                  <td className="px-3 py-4 text-[#2B2B2B]">{log.action}</td>
                  <td className="px-3 py-4 font-mono text-[11px] text-[#C18B58]">
                    {log.target}
                  </td>
                  <td className="px-3 py-4 font-mono text-[11px] text-[#736B5E]">
                    {log.ipAddress}
                  </td>
                  <td className="py-4 pl-3 pr-6 text-right">
                    {log.severity === "info" && (
                      <span className="rounded-full bg-[#FAF5EE] px-2.5 py-0.5 text-[10px] font-semibold text-[#C18B58]">
                        Info
                      </span>
                    )}
                    {log.severity === "warning" && (
                      <span className="rounded-full bg-[#FFF8E6] px-2.5 py-0.5 text-[10px] font-semibold text-[#B8860B]">
                        Warning
                      </span>
                    )}
                    {log.severity === "critical" && (
                      <span className="rounded-full bg-[#FDF2F2] px-2.5 py-0.5 text-[10px] font-semibold text-[#9A3B3B]">
                        Critical
                      </span>
                    )}
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
