"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Bell,
  GitFork,
  BookOpen,
  Image as ImageIcon,
  UserPlus,
  Check,
  CheckCheck,
  ArrowRight,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: "TREE" | "STORY" | "MEMORY" | "INVITE";
  title: string;
  description: string;
  actor: string;
  timeAgo: string;
  read: boolean;
  link: string;
}

export default function WorkspaceNotificationsPage() {
  const params = useParams();
  const slug = (params?.familySlug as string) || "bekele-family";

  const [filter, setFilter] = useState<"ALL" | "TREE" | "STORY" | "INVITE">("ALL");

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      type: "STORY",
      title: "New Oral Audio Story Recorded",
      description: "Grandmother Almaz added an oral recording to 'Sunday Coffee Ceremony in Gondar'.",
      actor: "Almaz Tesfaye",
      timeAgo: "2 hours ago",
      read: false,
      link: `/${slug}/stories`,
    },
    {
      id: "n-2",
      type: "TREE",
      title: "Tree Change Proposal Submitted",
      description: "Dawit Bekele proposed adding 2 new descendants to the family lineage tree.",
      actor: "Dawit Bekele",
      timeAgo: "Yesterday",
      read: false,
      link: `/${slug}/tree`,
    },
    {
      id: "n-3",
      type: "MEMORY",
      title: "Wedding Memories Album Created",
      description: "Hana Mekonnen uploaded 12 vintage sepia photographs from 1974.",
      actor: "Hana Mekonnen",
      timeAgo: "3 days ago",
      read: true,
      link: `/${slug}/memories`,
    },
    {
      id: "n-4",
      type: "INVITE",
      title: "Invitation Accepted",
      description: "Yonas Haile accepted your invitation and joined as a Contributor.",
      actor: "Yonas Haile",
      timeAgo: "5 days ago",
      read: true,
      link: `/${slug}/members`,
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === "ALL") return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header (Figma ui_part2 Page 7) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-[#EAE3D6] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#7A7A7A] font-semibold">
            ACTIVITY ALERTS
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#2B2B2B] mt-1">
            Notifications
          </h1>
          <p className="text-xs text-[#5A5A5A] font-light mt-1">
            {unreadCount > 0 ? `${unreadCount} unread activity alerts` : "You're all caught up!"}
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs font-semibold text-[#C18B58] hover:underline flex items-center space-x-1"
          >
            <CheckCheck className="w-4 h-4 mr-1" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-[#EAE3D6] space-x-6 text-xs font-medium">
        <button
          onClick={() => setFilter("ALL")}
          className={`pb-3 transition-colors relative ${
            filter === "ALL"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("TREE")}
          className={`pb-3 transition-colors relative ${
            filter === "TREE"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Tree Changes
        </button>
        <button
          onClick={() => setFilter("STORY")}
          className={`pb-3 transition-colors relative ${
            filter === "STORY"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Stories & Audio
        </button>
        <button
          onClick={() => setFilter("INVITE")}
          className={`pb-3 transition-colors relative ${
            filter === "INVITE"
              ? "text-[#2B2B2B] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#C18B58]"
              : "text-[#7A7A7A] hover:text-[#2B2B2B]"
          }`}
        >
          Invitations
        </button>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-xl border border-[#EAE3D6] shadow-[0_2px_8px_rgba(0,0,0,0.02)] divide-y divide-[#F6F1E9] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#7A7A7A]">
            No notifications in this filter category.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 flex items-start justify-between transition-colors ${
                !item.read ? "bg-[#F6F1E9]/40" : "hover:bg-[#F6F1E9]/20"
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    item.type === "TREE"
                      ? "bg-blue-100 text-blue-700"
                      : item.type === "STORY"
                      ? "bg-amber-100 text-amber-700"
                      : item.type === "MEMORY"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {item.type === "TREE" ? (
                    <GitFork className="w-4 h-4" />
                  ) : item.type === "STORY" ? (
                    <BookOpen className="w-4 h-4" />
                  ) : item.type === "MEMORY" ? (
                    <ImageIcon className="w-4 h-4" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-[#2B2B2B]">{item.title}</h4>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[#C18B58]" />
                    )}
                  </div>
                  <p className="text-xs text-[#5A5A5A] font-light leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-[10px] text-[#7A7A7A]">{item.timeAgo}</p>
                </div>
              </div>

              <Link
                href={item.link}
                className="shrink-0 ml-4 px-3 py-1.5 rounded bg-white border border-[#D5C9B8] text-[11px] font-semibold text-[#2B2B2B] hover:bg-[#F6F1E9] transition-colors"
              >
                View
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
