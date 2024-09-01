import { notFound, redirect } from "next/navigation";

import { WorkspaceWithMembers } from "@/types";
import { currentProfile } from "@/lib/profile";
import { getWorkspacesByProfileId } from "@/lib/workspace";
import { WorkspacePreferences } from "@/components/cards/workspace-preferences";

interface WorkspacePreferencesPageProps {
  params: {
    workspaceId: string;
  };
}

export const metadata = {
  title: "Workspace Preferences",
};

export default async function WorkspacePreferencesPage({ params }: WorkspacePreferencesPageProps) {
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

  const currentWorkspace = workspaces.find((workspace) => workspace.id === params.workspaceId);
  if (!currentWorkspace) {
    notFound();
  }

  const members = currentWorkspace.members;
  const admins = members.filter((member) => member.role === "ADMIN");
  const isMember = members.find((member) => member.profileId === profile.id);
  const isAdmin = admins.some((admin) => admin.profileId === profile.id);

  if (!isMember) {
    return notFound();
  }

  return (
    <div className="mx-auto w-full max-w-xl lg:max-w-2xl xl:max-w-4xl flex-1 pb-4 pt-2">
      <h1 className="text-lg md:text-xl font-bold tracking-wide">Workspace Preferences</h1>
      <WorkspacePreferences
        profile={profile}
        admins={admins}
        members={members}
        isAdmin={isAdmin}
        workspaces={workspaces}
        currentWorkspace={currentWorkspace}
      />
    </div>
  );
}
