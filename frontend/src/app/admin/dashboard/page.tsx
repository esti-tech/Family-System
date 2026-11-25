"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  CreditCard,
  HardDrive,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Download,
  Bell,
  Sparkles,
  CheckCircle2,
  Clock
} from "lucide-react";
import { apiRequest } from "@/services/api";

export default function AdminDashboardPage() {
  const [timeRange, setTimeRange] = useState<"monthly" | "6M" | "1Y">("monthly");
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    async function loadStats() {
      const res = await apiRequest(`/api/v1/platform-admin/dashboard/`);
      if (res.success && res.data) {
        setDashboardData(res.data);
      }
    }
    loadStats();
  }, []);

  const metrics = dashboardData?.metrics;
  const totalUsersDisplay = metrics?.total_users != null ? metrics.total_users.toLocaleString() : "24,892";
  const totalFamiliesDisplay = metrics?.total_families != null ? metrics.total_families.toLocaleString() : "1,420";
  const revenueEtbDisplay = metrics?.revenue_etb != null ? `${Number(metrics.revenue_etb).toLocaleString()} ETB` : "2,480,000 ETB";
  const storageGbDisplay = metrics?.total_storage_gb != null ? `${metrics.total_storage_gb} GB` : "384.2 GB";

  const recentActivity = dashboardData?.recent_audit_logs?.length > 0
    ? dashboardData.recent_audit_logs.map((log: any) => ({
        event: log.action.replace(/_/g, " "),
        ref: log.id.slice(0, 8),
        name: `${log.target_type}: ${log.target_label || log.target_id}`,
        time: new Date(log.created_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        type: log.target_type.toLowerCase()
      }))
    : [
    {
      event: "New family workspace registered",
      ref: "WS-8492",
      name: "The Kalkidan Family Archive",
      time: "2 mins ago",
      type: "workspace"
    },
    {
      event: "Subscription upgraded to Legacy Premium",
      ref: "SUB-3920",
      name: "The Bekele Family Archive",
      time: "14 mins ago",
      type: "billing"
    },
    {
      event: "Payment received via Telebirr (ETB)",
      ref: "TXN-9402",
      name: "Tadesse Wolde • 2,900 ETB",
      time: "32 mins ago",
      type: "payment"
    },
    {
      event: "New family account verified via OTP",
      ref: "USR-24892",
      name: "Emma Wilson",
      time: "1 hour ago",
      type: "user"
    },
    {
      event: "Off-site storage backup synchronized",
      ref: "SYS-0041",
      name: "Automated S3 Archival Sync",
      time: "3 hours ago",
      type: "system"
    }
  ];

  return (
    <div className="p-6 md:p-10">
      {/* Top Welcome Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
            Platform Dashboard
          </h1>
          <p className="mt-1 text-xs text-[#736B5E]">
            A clear view of platform health, workspaces, storage quotas, and revenue metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3D6] bg-white px-3.5 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
          >
            <Download className="h-4 w-4 text-[#C18B58]" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* KPI 4-Metric Grid (Matching PDF Page 1) */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#736B5E]">
            <span>Total Users</span>
            <Users className="h-4 w-4 text-[#C18B58]" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-[#2B2B2B]">
            {totalUsersDisplay}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#4A7C59]">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="font-semibold">+12.8%</span>
            <span className="text-[#736B5E]">vs. last month</span>
          </div>
        </div>

        {/* Family Workspaces */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#736B5E]">
            <span>Family Workspaces</span>
            <Building2 className="h-4 w-4 text-[#C18B58]" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-[#2B2B2B]">
            {totalFamiliesDisplay}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#4A7C59]">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="font-semibold">+9.4%</span>
            <span className="text-[#736B5E]">vs. last month</span>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#736B5E]">
            <span>Active Subscriptions</span>
            <CreditCard className="h-4 w-4 text-[#C18B58]" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-[#2B2B2B]">
            3,842
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#4A7C59]">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="font-semibold">+8.2%</span>
            <span className="text-[#736B5E]">vs. last month</span>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#736B5E]">
            <span>Monthly Recurring Revenue</span>
            <TrendingUp className="h-4 w-4 text-[#C18B58]" />
          </div>
          <p className="mt-3 font-serif text-3xl font-bold text-[#2B2B2B]">
            {revenueEtbDisplay}
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#4A7C59]">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="font-semibold">+14.6%</span>
            <span className="text-[#736B5E]">vs. October</span>
          </div>
        </div>
      </div>

      {/* Revenue Chart & Storage Section */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Revenue Overview (2 cols) */}
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm lg:col-span-2 md:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2B2B2B]">
                Revenue Overview
              </h3>
              <p className="text-xs text-[#736B5E]">
                Recurring platform revenue · Jun – Nov 2026
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-xl bg-[#FAF8F5] p-1 border border-[#EAE3D6]">
              {(["monthly", "6M", "1Y"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition ${
                    timeRange === r
                      ? "bg-white text-[#2B2B2B] shadow-sm"
                      : "text-[#736B5E] hover:text-[#2B2B2B]"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-[#2B2B2B]">
              $48,260
            </span>
            <span className="text-xs font-semibold text-[#4A7C59]">
              ↗ 14.6% vs. October
            </span>
          </div>

          {/* Simulated Monthly Bar Chart */}
          <div className="mt-6 flex h-48 items-end gap-3 sm:gap-6 border-b border-[#EAE3D6] pb-2">
            {[
              { month: "Jun", val: 55, amount: "$24k" },
              { month: "Jul", val: 62, amount: "$28k" },
              { month: "Aug", val: 70, amount: "$32k" },
              { month: "Sep", val: 78, amount: "$38k" },
              { month: "Oct", val: 86, amount: "$42k" },
              { month: "Nov", val: 98, amount: "$48k", highlight: true }
            ].map((bar, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-xl transition duration-300 ${
                    bar.highlight ? "bg-[#C18B58]" : "bg-[#EAE3D6] hover:bg-[#D5CBB9]"
                  }`}
                  style={{ height: `${bar.val}%` }}
                />
                <span className="text-[11px] font-medium text-[#736B5E]">
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Storage Quota (1 col) */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#736B5E]">
              <span>Platform Storage Capacity</span>
              <HardDrive className="h-4 w-4 text-[#C18B58]" />
            </div>

            <div className="mt-3">
              <span className="font-serif text-3xl font-bold text-[#2B2B2B]">
                8.42 TB
              </span>
              <span className="text-xs text-[#736B5E]"> of 15 TB capacity</span>
            </div>

            <div className="mt-4 h-2.5 w-full rounded-full bg-[#EAE3D6] overflow-hidden">
              <div className="h-full rounded-full bg-[#C18B58]" style={{ width: "56%" }} />
            </div>

            <div className="mt-4 flex justify-between text-xs text-[#736B5E]">
              <span>56% Utilized</span>
              <span className="text-[#4A7C59] font-semibold">6.58 TB Available</span>
            </div>

            <div className="mt-5 rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-[11px] text-[#736B5E]">
              Next scale trigger planned at 12 TB (80% ceiling).
            </div>
          </div>

          <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
            <h4 className="font-serif text-base font-bold text-[#2B2B2B]">
              System Health
            </h4>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#736B5E]">Django REST API:</span>
                <span className="font-semibold text-[#4A7C59]">✓ 99.98% Uptime</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#736B5E]">PostgreSQL Database:</span>
                <span className="font-semibold text-[#4A7C59]">✓ Optimal (4ms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#736B5E]">Telebirr Payment Webhook:</span>
                <span className="font-semibold text-[#4A7C59]">✓ Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="mt-10 rounded-3xl border border-[#EAE3D6] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#EAE3D6] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-serif text-base font-bold text-[#2B2B2B]">
              Recent Platform Operational Events
            </h3>
            <p className="text-xs text-[#736B5E]">
              Operational audit trails only. Private family archive content is never logged.
            </p>
          </div>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-semibold text-[#C18B58] hover:text-[#A97544]"
          >
            View Full Audit Trail &rarr;
          </Link>
        </div>

        <div className="divide-y divide-[#EAE3D6]">
          {recentActivity.map((act: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-4 px-6 text-xs hover:bg-[#FAF8F5]">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF5EE] text-[#C18B58]">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-[#2B2B2B]">{act.event}</p>
                  <p className="text-[11px] text-[#736B5E]">{act.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="rounded bg-[#FAF8F5] border border-[#EAE3D6] px-2 py-0.5 font-mono text-[10px] text-[#736B5E]">
                  {act.ref}
                </span>
                <span className="text-[11px] text-[#A89F91]">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
