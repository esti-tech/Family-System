"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Bell, CheckCheck, Users, Calendar, Image as ImageIcon, GitFork, ArrowRight } from "lucide-react";

interface NotificationItem {
  id: string;
  type: "INVITE" | "EVENT" | "MEMORY" | "TREE";
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
  actionText?: string;
  actionHref?: string;
}

export default function NotificationsPage() {
  const params = useParams();
  const familySlug = (params?.familySlug as string) || "family";

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      type: "TREE",
      title: "Tree Change Pending Approval",
      message: "Dawit Solomon proposed adding Grandmother Almaz's birthplace details.",
      time: "10 minutes ago",
      isUnread: true,
      actionText: "Review Change",
      actionHref: `/${familySlug}/tree`,
    },
    {
      id: "n-2",
      type: "MEMORY",
      title: "Guest Photos Awaiting Moderation",
      message: "4 new guest memories were uploaded via QR code from Mulugeta & Selam's Wedding.",
      time: "2 hours ago",
      isUnread: true,
      actionText: "Review Photos",
      actionHref: `/${familySlug}/memories`,
    },
    {
      id: "n-3",
      type: "EVENT",
      title: "Upcoming Coffee Ceremony",
      message: "Monthly family gathering scheduled for this Saturday at 3:00 PM.",
      time: "Yesterday",
      isUnread: false,
      actionText: "RSVP Now",
      actionHref: `/${familySlug}/events`,
    },
    {
      id: "n-4",
      type: "INVITE",
      title: "New Member Joined",
      message: "Selamawit Bekele accepted your invitation and joined the workspace.",
      time: "3 days ago",
      isUnread: false,
    },
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isUnread: false })));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "TREE": return <GitFork className="w-4 h-4 text-gold-600" />;
      case "MEMORY": return <ImageIcon className="w-4 h-4 text-gold-600" />;
      case "EVENT": return <Calendar className="w-4 h-4 text-gold-600" />;
      case "INVITE": return <Users className="w-4 h-4 text-gold-600" />;
    }
  };

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-700 mt-1">
            Stay updated on tree changes, submitted guest memories, and event invitations.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="inline-flex items-center text-xs font-semibold text-gold-600 hover:text-gold-700 transition-colors"
          >
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-card overflow-hidden">
        {/* Filter Pills */}
        <div className="p-4 border-b border-border flex items-center space-x-2 text-xs">
          {["ALL", "TREE", "MEMORY", "EVENT"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeFilter === tab
                  ? "bg-gold-50 text-gold-700 border border-gold-200"
                  : "text-charcoal-600 hover:text-charcoal-900 hover:bg-ivory-50"
              }`}
            >
              {tab === "ALL" ? "All Updates" : tab === "TREE" ? "Tree Changes" : tab === "MEMORY" ? "Memories" : "Events"}
            </button>
          ))}
        </div>

        {/* Notifications Feed */}
        <div className="divide-y divide-border/60">
          {notifications
            .filter((n) => activeFilter === "ALL" || n.type === activeFilter)
            .map((item) => (
              <div
                key={item.id}
                className={`p-5 flex items-start space-x-4 transition-colors ${
                  item.isUnread ? "bg-ivory-50/70" : "hover:bg-ivory-50/30"
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center shrink-0 mt-0.5 border border-gold-200">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-charcoal-900 truncate">
                      {item.title}
                    </h4>
                    {item.isUnread && (
                      <span className="w-2 h-2 rounded-full bg-gold-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-charcoal-700 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  <span className="text-[10px] text-charcoal-700 mt-2 block">
                    {item.time}
                  </span>
                </div>

                {item.actionText && item.actionHref && (
                  <a
                    href={item.actionHref}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-charcoal-800 hover:bg-white hover:border-gold-300 transition-colors shrink-0 shadow-xs"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3 h-3 ml-1 text-gold-600" />
                  </a>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
