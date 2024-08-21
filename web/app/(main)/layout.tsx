import React from "react";
import { redirect } from "next/navigation";

import SideNavigation from "@/components/navigation";
import { currentUser, getUserWorkspaces } from "@/lib/api";
import { DashboardHeader } from "@/components/dashboard-header";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const userWorkSpaces = await getUserWorkspaces(user.id);
  if (!userWorkSpaces || userWorkSpaces.length === 0) {
    return redirect("/onboarding");
  }

  return (
    <div className="relative">
      <SideNavigation />
      <main className="relative md:pl-60 min-h-screen w-full">
        <DashboardHeader user={user} />
        {children}
      </main>
    </div>
  );
}
