"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Tag,
  CreditCard,
  HardDrive,
  BarChart3,
  Bell,
  HelpCircle,
  ShieldCheck,
  Settings,
  Search,
  Sparkles,
  Command,
  Lock,
  ChevronRight,
  Menu,
  X
} from "lucide-react";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Family Workspaces", href: "/admin/workspaces", icon: Building2 },
    { label: "Subscriptions & Invoices", href: "/admin/billing", icon: CreditCard },
    { label: "Support Tickets", href: "/admin/support", icon: HelpCircle },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-[#EAE3D6] bg-white px-6 py-3.5 md:px-8">
        <div className="flex items-center justify-between">
          {/* Brand & Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-1.5 text-[#736B5E] md:hidden hover:bg-[#FAF8F5]"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2B2B2B] text-xs font-serif font-bold text-white">
                K
              </div>
              <span className="font-serif text-base font-bold tracking-tight text-[#2B2B2B]">
                KinKeep
              </span>
              <span className="rounded bg-[#FAF5EE] px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#C18B58]">
                ADMIN CONSOLE
              </span>
            </div>

            <div className="hidden items-center gap-1.5 text-xs text-[#736B5E] md:flex">
              <span>/</span>
              <span className="font-medium text-[#2B2B2B]">Platform Oversight</span>
            </div>
          </div>

          {/* Search bar & Super Admin Profile */}
          <div className="flex items-center gap-4">
            <div className="relative hidden w-72 sm:block">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#A89F91]" />
              <input
                type="text"
                placeholder="Search users, workspaces, invoices..."
                className="w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] py-2 pl-8 pr-12 text-xs text-[#2B2B2B] placeholder-[#A89F91] focus:border-[#C18B58] focus:bg-white focus:outline-none"
              />
              <div className="absolute right-2.5 top-2 flex items-center gap-0.5 rounded border border-[#EAE3D6] bg-white px-1.5 py-0.5 text-[10px] text-[#A89F91]">
                <Command className="h-2.5 w-2.5" />
                <span>K</span>
              </div>
            </div>

            {/* Admin Badge */}
            <div className="flex items-center gap-2.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C18B58] text-[10px] font-bold text-white">
                SA
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#2B2B2B] leading-none">Super Admin</p>
                <p className="text-[10px] text-[#736B5E]">Platform Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 transform border-r border-[#EAE3D6] bg-white pt-16 transition-transform duration-200 ease-in-out md:static md:translate-x-0 md:pt-0 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col justify-between p-4">
            <div className="space-y-6">
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-[#A89F91]">
                  Platform Controls
                </p>
                <nav className="mt-2 space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                          isActive
                            ? "bg-[#FAF5EE] text-[#C18B58]"
                            : "text-[#736B5E] hover:bg-[#FAF8F5] hover:text-[#2B2B2B]"
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? "text-[#C18B58]" : "text-[#736B5E]"}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Admin Actions */}
              <div className="rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] p-3 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#C18B58]">
                  Quick Actions
                </p>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/admin/users?action=notice"
                    className="block rounded-lg px-2 py-1 text-[11px] text-[#736B5E] hover:bg-white hover:text-[#2B2B2B]"
                  >
                    Send Platform Notice
                  </Link>
                  <Link
                    href="/bekele-family/dashboard"
                    className="block rounded-lg px-2 py-1 text-[11px] text-[#736B5E] hover:bg-white hover:text-[#2B2B2B]"
                  >
                    Back to Family App &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Privacy Safeguard Notice */}
            <div className="rounded-2xl border border-[#EAE3D6] bg-white p-3 text-[11px] text-[#736B5E] leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-[#2B2B2B]">
                <Lock className="h-3.5 w-3.5 text-[#4A7C59]" />
                <span>Privacy Safeguard</span>
              </div>
              <p className="mt-1 text-[10px]">
                Platform-level operational data only. Private family trees and living memory archives are never exposed to platform administrators.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Admin Area */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
