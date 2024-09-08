import { redirect } from "next/navigation";

import { SideNavigationList } from "./navigation-list";
import { SideNavigationHeader } from "./navigation-header";
import { currentProfile } from "@/lib/queries";
import { ProfileDropdownMenu } from "@/components/profile-dropdown-menu";
import { WorkspaceWithMembers } from "@/types";
import { getWorkspacesByProfileId } from "@/lib/queries";
import { ComboboxItem } from "@/components/ui/combobox";

export default async function SideNavigation() {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }

  const workspaces = (await getWorkspacesByProfileId(profile.id, {
    includeMembers: true,
  })) as WorkspaceWithMembers[];
  if (!workspaces) {
    return redirect("/sign-in");
  }

  const comboboxData = workspaces.map((workspace) => ({
    value: workspace.id,
    label: workspace.name,
    ...workspace,
  }));

  return (
    <div className="border-r bg-background hidden md:block w-64 fixed inset-y-0 left-0 z-30 pb-3">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <SideNavigationHeader data={comboboxData as unknown as ComboboxItem[]} profile={profile} />
        <div className="flex-1">
          <SideNavigationList profile={profile} workspaces={workspaces} />
        </div>
        <div className="px-2">
          <ProfileDropdownMenu profile={profile} />
        </div>
      </div>
    </div>
  );
}
