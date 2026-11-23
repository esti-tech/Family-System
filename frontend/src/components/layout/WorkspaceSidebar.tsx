"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GitFork,
  Users,
  Scroll,
  BookOpen,
  Clock,
  Calendar,
  Image as ImageIcon,
  FolderArchive,
  Bell,
  CreditCard,
  Settings,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface WorkspaceSidebarProps {
  familySlug: string;
  familyName?: string;
}

export function WorkspaceSidebar({ familySlug, familyName = "Family Workspace" }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: `/${familySlug}/dashboard`, icon: LayoutDashboard },
    { name: "Family Tree", href: `/${familySlug}/tree`, icon: GitFork },
    { name: "Members", href: `/${familySlug}/members`, icon: Users },
    { name: "Heritage", href: `/${familySlug}/heritage`, icon: Scroll },
    { name: "Stories", href: `/${familySlug}/stories`, icon: BookOpen },
    { name: "Timeline", href: `/${familySlug}/timeline`, icon: Clock },
    { name: "Events", href: `/${familySlug}/events`, icon: Calendar },
    { name: "Memories", href: `/${familySlug}/memories`, icon: ImageIcon },
    { name: "Albums", href: `/${familySlug}/albums`, icon: FolderArchive },
    { name: "Notifications", href: `/${familySlug}/notifications`, icon: Bell },
    { name: "Subscription", href: `/${familySlug}/billing`, icon: CreditCard },
    { name: "Settings", href: `/${familySlug}/settings`, icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="h-18 px-6 flex items-center border-b border-border bg-ivory-50/50">
          <Link href={`/${familySlug}/dashboard`} className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gold-500 flex items-center justify-center text-white font-serif font-bold text-lg shadow-sm">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-charcoal-900 tracking-tight leading-none">
                KinKeep
              </span>
              <span className="text-[10px] tracking-wider uppercase text-gold-600 font-medium mt-0.5">
                Family Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Current Family Badge */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-ivory-100 border border-border">
          <div className="text-[10px] uppercase font-bold tracking-widest text-gold-700">
            Active Workspace
          </div>
          <div className="font-serif font-bold text-sm text-charcoal-900 truncate mt-0.5">
            {familyName}
          </div>
          <Link
            href="/families"
            className="text-[11px] text-gold-600 hover:text-gold-700 font-medium mt-1 inline-flex items-center"
          >
            Switch family <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gold-50 text-gold-700 font-semibold shadow-xs"
                    : "text-charcoal-700 hover:bg-ivory-50 hover:text-charcoal-900"
                }`}
              >
                <Icon className={`w-4 h-4 mr-3 ${isActive ? "text-gold-600" : "text-charcoal-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Security Badge */}
      <div className="p-4 border-t border-border bg-ivory-50/50">
        <div className="flex items-center space-x-2 text-[11px] text-charcoal-500">
          <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
          <span>Tenant Isolated & Encrypted</span>
        </div>
      </div>
    </aside>
  );
}
