import React from "react";
import { redirect } from "next/navigation";

import SideNavigation from "@/components/navigation";
import { currentProfile } from "@/lib/queries";
import { WorkspaceHeader } from "@/components/workspace-header";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }

  return (
    <div className="relative">
      <SideNavigation />
      <div className="relative md:pl-64 min-h-screen w-full">
        <WorkspaceHeader profile={profile} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
