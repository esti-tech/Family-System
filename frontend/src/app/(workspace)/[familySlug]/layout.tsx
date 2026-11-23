"use client";

import { useParams } from "next/navigation";
import { WorkspaceSidebar } from "@/components/layout/WorkspaceSidebar";
import { WorkspaceTopBar } from "@/components/layout/WorkspaceTopBar";

export default function FamilyWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const familySlug = (params?.familySlug as string) || "family";

  // Format title from slug
  const title = familySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div className="min-h-screen flex bg-ivory-100">
      {/* Persistent Left Sidebar */}
      <WorkspaceSidebar familySlug={familySlug} familyName={title} />

      {/* Main Workspace Stage */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <WorkspaceTopBar familySlug={familySlug} familyName={title} />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
