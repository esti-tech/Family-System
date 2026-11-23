"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  Download,
  CheckCircle2,
  Phone,
  ArrowUpRight,
  Sparkles
} from "lucide-react";

interface PlatformTransaction {
  id: string;
  workspace: string;
  amount: string;
  gateway: "Telebirr" | "Stripe" | "Chapa";
  date: string;
  status: "succeeded" | "pending";
}

const MOCK_TRANSACTIONS: PlatformTransaction[] = [
  {
    id: "TXN-9402",
    workspace: "The Bekele Family Archive",
    amount: "2,900 ETB",
    gateway: "Telebirr",
    date: "Today at 09:42 AM",
    status: "succeeded"
  },
  {
    id: "TXN-9401",
    workspace: "The Kalkidan Family Archive",
    amount: "$239.88",
    gateway: "Stripe",
    date: "Today at 08:15 AM",
    status: "succeeded"
  },
  {
    id: "TXN-9400",
    workspace: "Tadesse & Wolde Lineage",
    amount: "1,200 ETB",
    gateway: "Chapa",
    date: "Yesterday at 04:30 PM",
    status: "succeeded"
  },
  {
    id: "TXN-9398",
    workspace: "The Wilson Homestead",
    amount: "$95.88",
    gateway: "Stripe",
    date: "Nov 20, 2026",
    status: "succeeded"
  }
];

export default function AdminBillingPage() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
            Subscription & Revenue Analytics
          </h1>
          <p className="mt-1 text-xs text-[#736B5E]">
            Platform-wide recurring revenue, payment gateway distribution, and financial health.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3D6] bg-white px-3.5 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
        >
          <Download className="h-4 w-4 text-[#C18B58]" />
          <span>Export Financial Report</span>
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <span className="text-xs font-semibold text-[#736B5E]">Monthly Recurring Revenue</span>
          <p className="mt-2 font-serif text-3xl font-bold text-[#2B2B2B]">$48,260</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#4A7C59]">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="font-semibold">+14.6%</span>
            <span className="text-[#736B5E]">vs. October</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <span className="text-xs font-semibold text-[#736B5E]">Active Subscriptions</span>
          <p className="mt-2 font-serif text-3xl font-bold text-[#2B2B2B]">3,842</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-[#4A7C59]">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="font-semibold">+8.2%</span>
            <span className="text-[#736B5E]">active family plans</span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <span className="text-xs font-semibold text-[#736B5E]">Average Rev / Workspace</span>
          <p className="mt-2 font-serif text-3xl font-bold text-[#2B2B2B]">$12.56</p>
          <p className="mt-1 text-[11px] text-[#A89F91]">ARPU across all tiers</p>
        </div>

        <div className="rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm">
          <span className="text-xs font-semibold text-[#736B5E]">Local Telebirr Share</span>
          <p className="mt-2 font-serif text-3xl font-bold text-[#C18B58]">62%</p>
          <p className="mt-1 text-[11px] text-[#4A7C59]">Primary payment channel in ET</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-10 overflow-hidden rounded-3xl border border-[#EAE3D6] bg-white shadow-sm">
        <div className="border-b border-[#EAE3D6] px-6 py-4">
          <h3 className="font-serif text-base font-bold text-[#2B2B2B]">
            Recent Platform Billing Transactions
          </h3>
          <p className="text-xs text-[#736B5E]">
            Verified payments processed through Telebirr, Chapa, and Stripe
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#EAE3D6] bg-[#FAF8F5] font-medium text-[#736B5E]">
              <tr>
                <th className="py-3.5 pl-6 pr-3">Txn Reference</th>
                <th className="px-3 py-3.5">Workspace</th>
                <th className="px-3 py-3.5">Amount</th>
                <th className="px-3 py-3.5">Payment Gateway</th>
                <th className="px-3 py-3.5">Date & Time</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D6] text-[#2B2B2B]">
              {MOCK_TRANSACTIONS.map((txn) => (
                <tr key={txn.id} className="transition hover:bg-[#FAF8F5]">
                  <td className="py-4 pl-6 pr-3 font-mono font-semibold">{txn.id}</td>
                  <td className="px-3 py-4 font-semibold text-[#2B2B2B]">{txn.workspace}</td>
                  <td className="px-3 py-4 font-serif font-bold text-[#2B2B2B]">{txn.amount}</td>
                  <td className="px-3 py-4">
                    <span className="rounded-full bg-[#FAF5EE] border border-[#EAE3D6] px-2.5 py-0.5 text-[11px] font-semibold text-[#C18B58]">
                      {txn.gateway}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-[#736B5E]">{txn.date}</td>
                  <td className="py-4 pl-3 pr-6 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A7C59]">
                      <CheckCircle2 className="h-3 w-3" />
                      Succeeded
                    </span>
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
