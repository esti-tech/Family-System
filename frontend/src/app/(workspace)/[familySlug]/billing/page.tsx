"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CreditCard,
  HardDrive,
  Users,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Receipt,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText
} from "lucide-react";
import { apiRequest } from "@/services/api";

interface Invoice {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: "paid" | "pending";
  pdfUrl: string;
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-2026-0082",
    date: "Jan 15, 2026",
    plan: "Family Plus (Annual)",
    amount: "$95.88",
    status: "paid",
    pdfUrl: "#"
  },
  {
    id: "INV-2025-0041",
    date: "Jan 15, 2025",
    plan: "Family Plus (Annual)",
    amount: "$95.88",
    status: "paid",
    pdfUrl: "#"
  }
];

export default function SubscriptionBillingPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [subData, setSubData] = useState<any>(null);
  const [storageData, setStorageData] = useState<any>(null);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  useEffect(() => {
    async function loadBilling() {
      const [subRes, storRes, invRes] = await Promise.all([
        apiRequest(`/api/v1/families/by-slug/${slug}/subscription/`),
        apiRequest(`/api/v1/families/by-slug/${slug}/storage/`),
        apiRequest(`/api/v1/families/by-slug/${slug}/invoices/`),
      ]);

      if (subRes.success && subRes.data) {
        setSubData(subRes.data);
      }
      if (storRes.success && storRes.data) {
        setStorageData(storRes.data);
      }
      if (invRes.success && Array.isArray(invRes.data) && invRes.data.length > 0) {
        const live: Invoice[] = invRes.data.map((inv: any) => ({
          id: inv.invoice_number,
          date: new Date(inv.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          plan: inv.line_items?.[0]?.description || "Subscription Plan",
          amount: `${inv.amount} ${inv.currency}`,
          status: inv.status.toLowerCase() === "paid" ? "paid" : "pending",
          pdfUrl: inv.pdf_url || "#"
        }));
        setInvoices(live);
      }
    }
    loadBilling();
  }, [slug]);

  const handleDownloadInvoice = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1000);
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    const res = await apiRequest(`/api/v1/families/by-slug/${slug}/subscription/cancel/`, { method: "POST" });
    setIsCancelling(false);
    if (res.success) {
      setCancelSuccess(true);
      setTimeout(() => {
        setShowCancelModal(false);
        setCancelSuccess(false);
      }, 1500);
    }
  };

  const currentPlanName = subData?.plan?.name || "Family Roots";
  const usedGb = storageData?.storage_used_gb ?? 38.4;
  const limitGb = storageData?.storage_limit_gb ?? 100;
  const usagePercent = storageData?.usage_percentage ?? 38;
  const membersCount = storageData?.active_members_count ?? 14;

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
              <Receipt className="h-4 w-4" />
              <span>Workspace Administration</span>
            </div>
            <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#2B2B2B] md:text-3xl">
              Subscription & Billing
            </h1>
            <p className="mt-1 text-sm text-[#736B5E]">
              Manage your family workspace subscription, storage quotas, invoices, and payment methods.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/${slug}/billing/export`}
              className="inline-flex items-center gap-2 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-[#EAE3D6]"
            >
              <Download className="h-4 w-4 text-[#C18B58]" />
              <span>Offline Archive</span>
            </Link>
            <Link
              href={`/${slug}/billing/plans`}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C18B58] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Upgrade Plan</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Active Plan Card */}
        <div className="rounded-3xl border border-[#C18B58]/30 bg-gradient-to-r from-white via-[#FAF5EE] to-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#C18B58] px-3 py-0.5 text-[11px] font-semibold text-white">
                  Active Subscription
                </span>
                <span className="text-xs text-[#736B5E]">Annual billing</span>
              </div>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[#2B2B2B]">
                {currentPlanName} Plan
              </h2>
              <p className="mt-1 text-xs text-[#736B5E]">
                Next renewal: <strong>January 15, 2027</strong> for $95.88 / year (~11,500 ETB)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/${slug}/billing/plans`}
                className="rounded-xl bg-[#C18B58] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#A97544]"
              >
                Change or Upgrade Plan
              </Link>
              <button
                type="button"
                onClick={() => setShowCancelModal(true)}
                className="rounded-xl border border-[#EAE3D6] bg-white px-4 py-2.5 text-xs font-semibold text-[#736B5E] hover:text-[#9A3B3B]"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Quick Metrics Inside Subscription */}
          <div className="mt-8 grid grid-cols-1 gap-4 border-t border-[#EAE3D6] pt-6 sm:grid-cols-3">
            <Link
              href={`/${slug}/billing/storage`}
              className="flex items-center justify-between rounded-2xl border border-[#EAE3D6] bg-white p-4 transition hover:border-[#C18B58]"
            >
              <div>
                <span className="text-[11px] text-[#736B5E]">Vault Storage</span>
                <p className="font-serif text-lg font-bold text-[#2B2B2B]">
                  {usedGb} GB / {limitGb} GB
                </p>
                <div className="mt-1.5 h-1.5 w-32 rounded-full bg-[#EAE3D6]">
                  <div className="h-full rounded-full bg-[#C18B58]" style={{ width: `${Math.min(usagePercent, 100)}%` }} />
                </div>
              </div>
              <HardDrive className="h-5 w-5 text-[#C18B58]" />
            </Link>

            <div className="flex items-center justify-between rounded-2xl border border-[#EAE3D6] bg-white p-4">
              <div>
                <span className="text-[11px] text-[#736B5E]">Family Relatives</span>
                <p className="font-serif text-lg font-bold text-[#2B2B2B]">
                  {membersCount} Members
                </p>
                <p className="text-[10px] text-[#4A7C59]">Unlimited on Plus</p>
              </div>
              <Users className="h-5 w-5 text-[#C18B58]" />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-[#EAE3D6] bg-white p-4">
              <div>
                <span className="text-[11px] text-[#736B5E]">Payment Method</span>
                <p className="font-serif text-base font-bold text-[#2B2B2B]">
                  Telebirr (+251 91 123 4567)
                </p>
                <p className="text-[10px] text-[#736B5E]">Auto-renews via CBE/Telebirr</p>
              </div>
              <CreditCard className="h-5 w-5 text-[#C18B58]" />
            </div>
          </div>
        </div>

        {/* Invoices History Table */}
        <div className="mt-10 rounded-3xl border border-[#EAE3D6] bg-white shadow-sm overflow-hidden">
          <div className="border-b border-[#EAE3D6] px-6 py-4">
            <h3 className="font-serif text-base font-bold text-[#2B2B2B]">
              Payment History & Receipts
            </h3>
            <p className="text-xs text-[#736B5E]">
              Download official receipts for family records and tax compliance
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#EAE3D6] bg-[#FAF8F5] font-medium text-[#736B5E]">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Invoice Number</th>
                  <th className="px-3 py-3.5">Date</th>
                  <th className="px-3 py-3.5">Plan Description</th>
                  <th className="px-3 py-3.5">Amount Paid</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Download Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D6] text-[#2B2B2B]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="transition hover:bg-[#FAF8F5]">
                    <td className="py-4 pl-6 pr-3 font-mono font-semibold">
                      {inv.id}
                    </td>
                    <td className="px-3 py-4 text-[#736B5E]">{inv.date}</td>
                    <td className="px-3 py-4 font-medium">{inv.plan}</td>
                    <td className="px-3 py-4 font-serif font-bold text-[#2B2B2B]">
                      {inv.amount}
                    </td>
                    <td className="px-3 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EC] px-2.5 py-0.5 text-[11px] font-semibold text-[#4A7C59]">
                        <CheckCircle2 className="h-3 w-3" />
                        Paid
                      </span>
                    </td>
                    <td className="py-4 pl-3 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(inv.id)}
                        className="inline-flex items-center gap-1 rounded-xl border border-[#EAE3D6] bg-white px-3 py-1.5 text-xs font-semibold text-[#2B2B2B] hover:bg-[#FAF8F5]"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#C18B58]" />
                        <span>{downloadingId === inv.id ? "Preparing..." : "PDF Receipt"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDF2F2] text-[#9A3B3B]">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-[#2B2B2B]">
              Cancel Family Subscription?
            </h3>
            <p className="mt-1 text-xs text-[#736B5E] leading-relaxed">
              Your workspace will remain active until the end of your billing cycle on <strong>January 15, 2027</strong>. After that date, your storage quota will drop to 5 GB, and older media will be safeguarded in read-only mode.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="rounded-xl border border-[#EAE3D6] px-4 py-2 text-xs font-semibold text-[#736B5E] hover:bg-[#FAF8F5]"
              >
                Keep My Plan
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="rounded-xl bg-[#9A3B3B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#802E2E] disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : cancelSuccess ? "Cancelled!" : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
