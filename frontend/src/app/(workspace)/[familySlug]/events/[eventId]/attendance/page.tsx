"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  Search,
  Filter,
  Mail,
  Copy,
  Check,
  Download,
  UserCheck
} from "lucide-react";

interface GuestRsvp {
  id: string;
  name: string;
  nameAmharic?: string;
  email?: string;
  kinship: string;
  status: "attending" | "maybe" | "declined" | "pending";
  adultsCount: number;
  childrenCount: number;
  dietaryNotes?: string;
  checkedIn: boolean;
  respondedAt?: string;
}

const MOCK_ATTENDANCE: GuestRsvp[] = [
  {
    id: "g-1",
    name: "Elias Bekele",
    nameAmharic: "ኤልያስ በቀለ",
    kinship: "Grandfather (Patriarch)",
    status: "attending",
    adultsCount: 2,
    childrenCount: 0,
    dietaryNotes: "Orthodox Tsom (Fasting food) preferred",
    checkedIn: true,
    respondedAt: "Jan 04, 2026"
  },
  {
    id: "g-2",
    name: "Aster Wolde",
    nameAmharic: "አስቴር ወልደ",
    kinship: "Grandmother (Matriarch)",
    status: "attending",
    adultsCount: 1,
    childrenCount: 0,
    checkedIn: true,
    respondedAt: "Jan 04, 2026"
  },
  {
    id: "g-3",
    name: "Dawit Bekele",
    nameAmharic: "ዳዊት በቀለ",
    kinship: "Father / Event Host",
    status: "attending",
    adultsCount: 2,
    childrenCount: 2,
    checkedIn: true,
    respondedAt: "Jan 02, 2026"
  },
  {
    id: "g-4",
    name: "Hana Mekonnen",
    nameAmharic: "ሃና መኮንን",
    kinship: "Mother / Event Host",
    status: "attending",
    adultsCount: 1,
    childrenCount: 0,
    checkedIn: true,
    respondedAt: "Jan 02, 2026"
  },
  {
    id: "g-5",
    name: "Selam Bekele",
    nameAmharic: "ሰላም በቀለ",
    kinship: "Daughter",
    status: "attending",
    adultsCount: 2,
    childrenCount: 1,
    checkedIn: false,
    respondedAt: "Jan 06, 2026"
  },
  {
    id: "g-6",
    name: "Yonas Bekele",
    nameAmharic: "ዮናስ በቀለ",
    kinship: "Son",
    status: "attending",
    adultsCount: 1,
    childrenCount: 0,
    checkedIn: false,
    respondedAt: "Jan 08, 2026"
  },
  {
    id: "g-7",
    name: "Tadesse Wolde",
    nameAmharic: "ታደሰ ወልደ",
    kinship: "Maternal Uncle (የእናት ወንድም / አጎት)",
    status: "maybe",
    adultsCount: 2,
    childrenCount: 0,
    dietaryNotes: "Traveling from Bahir Dar, depends on flight",
    checkedIn: false,
    respondedAt: "Jan 09, 2026"
  },
  {
    id: "g-8",
    name: "Almaz Kebede",
    nameAmharic: "አልማዝ ከበደ",
    kinship: "Cousin (የአክስት ልጅ)",
    status: "declined",
    adultsCount: 0,
    childrenCount: 0,
    dietaryNotes: "Currently overseas in North America",
    checkedIn: false,
    respondedAt: "Jan 05, 2026"
  },
  {
    id: "g-9",
    name: "Bereket Tadesse",
    nameAmharic: "በረከት ታደሰ",
    kinship: "Second Cousin",
    status: "pending",
    adultsCount: 1,
    childrenCount: 0,
    checkedIn: false
  }
];

export default function EventAttendancePage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";
  const eventId = (params?.eventId as string) || "timkat-gathering-2026";

  const [guests, setGuests] = useState<GuestRsvp[]>(MOCK_ATTENDANCE);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleCheckIn = (id: string) => {
    setGuests(
      guests.map((g) => (g.id === id ? { ...g, checkedIn: !g.checkedIn } : g))
    );
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://kinkeep.com/events/rsvp/${eventId}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const attendingCount = guests.filter((g) => g.status === "attending").length;
  const maybeCount = guests.filter((g) => g.status === "maybe").length;
  const declinedCount = guests.filter((g) => g.status === "declined").length;
  const pendingCount = guests.filter((g) => g.status === "pending").length;
  const totalHeadcount = guests
    .filter((g) => g.status === "attending")
    .reduce((sum, g) => sum + g.adultsCount + g.childrenCount, 0);

  const filteredGuests = guests.filter((g) => {
    if (filterStatus !== "all" && g.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      const matchAmharic = g.nameAmharic?.toLowerCase().includes(q);
      const matchKin = g.kinship.toLowerCase().includes(q);
      if (!matchName && !matchAmharic && !matchKin) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#2B2B2B]">
      {/* Top Header */}
      <div className="border-b border-[#EAE3D6] bg-white px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${slug}/events/${eventId}`}
              className="rounded-lg p-1.5 text-[#736B5E] transition hover:bg-[#F6F1E9] hover:text-[#2B2B2B]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-xl font-bold text-[#2B2B2B]">
                RSVP & Attendance Tracking
              </h1>
              <p className="text-xs text-[#736B5E]">
                Bekele Family Timkat Gathering • Total Headcount: {totalHeadcount} attendees
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-semibold text-[#2B2B2B] hover:bg-[#EAE3D6]"
            >
              {copiedLink ? <Check className="h-4 w-4 text-[#4A7C59]" /> : <Copy className="h-4 w-4 text-[#C18B58]" />}
              <span>{copiedLink ? "Link Copied" : "Copy RSVP Link"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#736B5E]">Confirmed</span>
              <CheckCircle2 className="h-4 w-4 text-[#4A7C59]" />
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#4A7C59]">
              {attendingCount}
            </p>
            <p className="mt-0.5 text-[11px] text-[#736B5E]">
              {totalHeadcount} total head count
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#736B5E]">Maybe</span>
              <HelpCircle className="h-4 w-4 text-[#C18B58]" />
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#C18B58]">
              {maybeCount}
            </p>
            <p className="mt-0.5 text-[11px] text-[#736B5E]">
              Traveling / Tentative
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#736B5E]">Awaiting</span>
              <Clock className="h-4 w-4 text-[#736B5E]" />
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#2B2B2B]">
              {pendingCount}
            </p>
            <p className="mt-0.5 text-[11px] text-[#736B5E]">
              Reminder ready
            </p>
          </div>

          <div className="rounded-2xl border border-[#EAE3D6] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#736B5E]">Declined</span>
              <XCircle className="h-4 w-4 text-[#9A3B3B]" />
            </div>
            <p className="mt-2 font-serif text-2xl font-bold text-[#9A3B3B]">
              {declinedCount}
            </p>
            <p className="mt-0.5 text-[11px] text-[#736B5E]">
              Sent best wishes
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[#EAE3D6] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: `All (${guests.length})` },
              { id: "attending", label: `Attending (${attendingCount})` },
              { id: "maybe", label: `Maybe (${maybeCount})` },
              { id: "pending", label: `Awaiting (${pendingCount})` },
              { id: "declined", label: `Declined (${declinedCount})` }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filterStatus === f.id
                    ? "bg-[#C18B58] text-white"
                    : "border border-[#EAE3D6] bg-[#FAF8F5] text-[#736B5E] hover:border-[#C18B58]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#A89F91]" />
            <input
              type="text"
              placeholder="Search by relative name or relation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#EAE3D6] bg-[#FAF8F5] py-2 pl-9 pr-4 text-xs text-[#2B2B2B] focus:border-[#C18B58] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Guest Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#EAE3D6] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#EAE3D6] bg-[#FAF8F5] font-medium text-[#736B5E]">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Relative / Guest</th>
                  <th className="px-3 py-3.5">Kinship Relation</th>
                  <th className="px-3 py-3.5">RSVP Status</th>
                  <th className="px-3 py-3.5">Guests (+1 / Kids)</th>
                  <th className="px-3 py-3.5">Dietary / Notes</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Day-of Check In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D6] text-[#2B2B2B]">
                {filteredGuests.map((g) => (
                  <tr key={g.id} className="transition hover:bg-[#FAF8F5]/80">
                    <td className="py-4 pl-6 pr-3">
                      <div>
                        <p className="font-semibold">{g.name}</p>
                        {g.nameAmharic && (
                          <p className="text-[11px] text-[#C18B58]">
                            {g.nameAmharic}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-[#736B5E]">
                      {g.kinship}
                    </td>
                    <td className="px-3 py-4">
                      {g.status === "attending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF3EC] px-2.5 py-0.5 text-[11px] font-semibold text-[#4A7C59]">
                          <CheckCircle2 className="h-3 w-3" />
                          Attending
                        </span>
                      )}
                      {g.status === "maybe" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF5EE] px-2.5 py-0.5 text-[11px] font-semibold text-[#C18B58]">
                          <HelpCircle className="h-3 w-3" />
                          Maybe
                        </span>
                      )}
                      {g.status === "declined" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#FDF2F2] px-2.5 py-0.5 text-[11px] font-semibold text-[#9A3B3B]">
                          <XCircle className="h-3 w-3" />
                          Declined
                        </span>
                      )}
                      {g.status === "pending" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F4F4] px-2.5 py-0.5 text-[11px] font-medium text-[#736B5E]">
                          <Clock className="h-3 w-3" />
                          Awaiting
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-[#736B5E]">
                      {g.status === "attending" ? (
                        <span>
                          {g.adultsCount} Adults {g.childrenCount > 0 ? `+ ${g.childrenCount} Kids` : ""}
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-[#736B5E]">
                      {g.dietaryNotes || "—"}
                    </td>
                    <td className="py-4 pl-3 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => toggleCheckIn(g.id)}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                          g.checkedIn
                            ? "bg-[#EAF3EC] text-[#4A7C59] border border-[#4A7C59]/30"
                            : "border border-[#EAE3D6] bg-white text-[#736B5E] hover:border-[#C18B58]"
                        }`}
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        <span>{g.checkedIn ? "Checked In" : "Check In"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
