"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Check,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  QrCode,
  HardDrive,
  Users,
  HelpCircle,
  Download
} from "lucide-react";
import { apiRequest } from "@/services/api";

export default function PlansPricingPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [currency, setCurrency] = useState<"USD" | "ETB">("USD");
  const [backendPlans, setBackendPlans] = useState<any[]>([]);

  useEffect(() => {
    async function loadPlans() {
      const res = await apiRequest(`/api/v1/subscriptions/plans/`);
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setBackendPlans(res.data);
      }
    }
    loadPlans();
  }, []);

  const defaultPlans = [
    {
      id: "free-heritage",
      name: "Free Heritage",
      tagline: "For your first roots.",
      priceUSD: "$0",
      priceETB: "0 ብር",
      period: "forever",
      current: false,
      buttonText: "Current Basic Tier",
      buttonVariant: "secondary",
      features: [
        { label: "Family tree members", val: "Up to 5 people" },
        { label: "Memory vault storage", val: "1 GB archival storage" },
        { label: "Oral stories & audio memos", val: "Up to 5 recordings" },
        { label: "Event QR uploads", val: "Standard upload" },
        { label: "Offline archive export", val: "Standard HTML" }
      ]
    },
    {
      id: "family-roots",
      name: "Family Roots",
      tagline: "For a family growing closer.",
      priceUSD: billingCycle === "yearly" ? "$4.00" : "$5.00",
      priceETB: billingCycle === "yearly" ? "280 ብር" : "350 ብር",
      period: billingCycle === "yearly" ? "per month (billed annually)" : "per month",
      current: true,
      popular: true,
      buttonText: "Your Active Plan",
      buttonVariant: "primary",
      features: [
        { label: "Family tree members", val: "Up to 25 relatives" },
        { label: "Memory vault storage", val: "25 GB high-res vault" },
        { label: "Oral stories & audio memos", val: "Unlimited voice stories" },
        { label: "Event QR guest portals", val: "Unlimited occasions" },
        { label: "Dual English & Amharic AI", val: "Full translation toggle" },
        { label: "Collaborative albums", val: "Unlimited albums" }
      ]
    },
    {
      id: "dynasty-legacy",
      name: "Dynasty Legacy",
      tagline: "For a legacy without limits.",
      priceUSD: billingCycle === "yearly" ? "$10.00" : "$12.00",
      priceETB: billingCycle === "yearly" ? "680 ብር" : "850 ብር",
      period: billingCycle === "yearly" ? "per month (billed annually)" : "per month",
      current: false,
      buttonText: "Upgrade to Dynasty",
      buttonVariant: "outline",
      features: [
        { label: "Family tree members", val: "Up to 100 relatives & branches" },
        { label: "Memory vault storage", val: "100 GB archival preservation" },
        { label: "Oral stories & audio memos", val: "Studio-quality audio + AI transcripts" },
        { label: "Event QR guest portals", val: "Live TV stream & custom branding" },
        { label: "Printable Keepsake Book", val: "Hardcover PDF generator included" },
        { label: "Offline Vault Export", val: "Complete ZIP + Standalone app" }
      ]
    }
  ];

  const plans = defaultPlans;

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/billing`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C18B58]">
                <span>Billing & Plans</span>
                <span>/</span>
                <span>Subscriptions</span>
              </div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                Choose Your Family&apos;s Plan
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/${slug}/billing`}
              className="rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-4 py-2 text-xs font-semibold text-[#2B2B2B] hover:bg-[#EAE3D6]"
            >
              Manage Invoices
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        {/* Hero Section */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C18B58]">
            A Plan for Every Chapter
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-[#2B2B2B] md:text-5xl">
            Your family&apos;s next chapter starts here.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-xs text-[#736B5E] md:text-sm">
            Start simply. Make more room as your living ancestry and memories blossom.
          </p>

          {/* Billing Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Monthly / Yearly Switch */}
            <div className="flex items-center rounded-2xl border border-[#EAE3D6] bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-xl px-5 py-2 text-xs font-semibold transition ${
                  billingCycle === "monthly"
                    ? "bg-[#2B2B2B] text-white shadow-sm"
                    : "text-[#736B5E] hover:text-[#2B2B2B]"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`flex items-center gap-1.5 rounded-xl px-5 py-2 text-xs font-semibold transition ${
                  billingCycle === "yearly"
                    ? "bg-[#C18B58] text-white shadow-sm"
                    : "text-[#736B5E] hover:text-[#2B2B2B]"
                }`}
              >
                <span>Annual Billing</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px] font-bold text-white">
                  Save 20%
                </span>
              </button>
            </div>

            {/* Currency Switcher */}
            <div className="flex items-center rounded-2xl border border-[#EAE3D6] bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  currency === "USD"
                    ? "bg-[#FAF5EE] text-[#C18B58]"
                    : "text-[#736B5E] hover:text-[#2B2B2B]"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency("ETB")}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  currency === "ETB"
                    ? "bg-[#FAF5EE] text-[#C18B58]"
                    : "text-[#736B5E] hover:text-[#2B2B2B]"
                }`}
              >
                ETB (ብር Telebirr)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-3xl border bg-white p-8 transition hover:-translate-y-1 hover:shadow-xl ${
                plan.popular
                  ? "border-[#C18B58] shadow-lg ring-2 ring-[#C18B58]/20"
                  : "border-[#EAE3D6] shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#C18B58] px-4 py-1 text-[11px] font-semibold text-white shadow-sm">
                  Most Popular For Families
                </div>
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#736B5E]">
                  {plan.tagline}
                </p>
                <h3 className="mt-1 font-serif text-2xl font-bold text-[#2B2B2B]">
                  {plan.name}
                </h3>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-serif text-4xl font-bold text-[#2B2B2B]">
                    {currency === "USD" ? plan.priceUSD : plan.priceETB}
                  </span>
                  <span className="text-xs text-[#736B5E]">{plan.period}</span>
                </div>

                {/* Features List */}
                <div className="mt-8 space-y-3.5 border-t border-[#F2ECE1] pt-6">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#FAF5EE] text-[#C18B58] flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-semibold text-[#2B2B2B]">{feat.val}</span>
                        <span className="text-[#736B5E]"> — {feat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-4">
                {plan.current ? (
                  <div className="rounded-xl border border-[#4A7C59]/30 bg-[#EAF3EC] py-3 text-center text-xs font-semibold text-[#4A7C59]">
                    ✓ Current Active Plan
                  </div>
                ) : (
                  <Link
                    href={`/${slug}/billing/checkout?plan=${plan.id}&cycle=${billingCycle}&cur=${currency}`}
                    className={`block w-full rounded-xl py-3 text-center text-xs font-semibold transition ${
                      plan.popular
                        ? "bg-[#C18B58] text-white shadow-sm hover:bg-[#A97544]"
                        : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#2B2B2B] hover:border-[#C18B58]"
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Local Ethiopian Payment Note */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-3xl border border-[#EAE3D6] bg-white p-6 shadow-sm sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FAF5EE] text-[#C18B58]">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2B2B2B]">
                Ethiopian & Diaspora Payment Options
              </h4>
              <p className="text-[11px] text-[#736B5E]">
                We support Telebirr, CBE Birr, Awash, Chapa, and international credit/debit cards with instant activation.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#EAF3EC] px-3.5 py-1 text-xs font-semibold text-[#4A7C59]">
            ✓ Local Telebirr Ready
          </span>
        </div>
      </div>
    </div>
  );
}
