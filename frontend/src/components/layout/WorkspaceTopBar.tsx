"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, User as UserIcon, LogOut, Settings } from "lucide-react";

interface WorkspaceTopBarProps {
  familySlug: string;
  familyName?: string;
}

export function WorkspaceTopBar({ familySlug, familyName = "Family Workspace" }: WorkspaceTopBarProps) {
  const router = useRouter();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("kinkeep_access_token");
    localStorage.removeItem("kinkeep_refresh_token");
    localStorage.removeItem("kinkeep_user");
    router.push("/login");
  };

  return (
    <header className="h-18 bg-white border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Search Input */}
      <div className="w-72 sm:w-96 relative">
        <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search relatives, stories, memories, events..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border text-xs text-charcoal-900 bg-ivory-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        {/* Notifications Shortcut */}
        <Link
          href={`/${familySlug}/notifications`}
          className="p-2 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-100 relative transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-600 ring-2 ring-white" />
        </Link>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center space-x-2.5 p-1.5 rounded-lg hover:bg-ivory-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gold-200 text-gold-800 flex items-center justify-center font-bold text-xs">
              <UserIcon className="w-4 h-4" />
            </div>
            <span className="hidden sm:inline-block text-xs font-semibold text-charcoal-900">
              My Account
            </span>
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-border py-1 z-50">
              <Link
                href="/profile"
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-xs text-charcoal-700 hover:bg-ivory-50 hover:text-charcoal-900"
              >
                <UserIcon className="w-4 h-4 mr-2 text-charcoal-400" />
                <span>Personal Profile</span>
              </Link>
              <Link
                href={`/${familySlug}/settings`}
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center px-4 py-2 text-xs text-charcoal-700 hover:bg-ivory-50 hover:text-charcoal-900"
              >
                <Settings className="w-4 h-4 mr-2 text-charcoal-400" />
                <span>Family Settings</span>
              </Link>
              <div className="border-t border-border my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
