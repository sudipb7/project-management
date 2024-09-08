import { Member, Profile } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import {
  WorkspaceDeletion,
  WorkspaceDescription,
  WorkspaceDisplayName,
  WorkspaceImage,
  WorkspaceLeave,
} from "./_components";
import { WorkspaceWithMembers } from "@/types";
import { currentProfile } from "@/lib/queries";
import { getWorkspacesByProfileId } from "@/lib/queries";

interface WorkspacePreferencesPageProps {
  params: {
    workspaceId: string;
  };
}

export interface WorkspacePreferencesProps {
  profile: Profile;
  isAdmin: boolean;
  members: Member[];
  admins: Member[];
  workspaces: WorkspaceWithMembers[];
  currentWorkspace: WorkspaceWithMembers;
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

  const props = { profile, isAdmin, members, admins, workspaces, currentWorkspace };

  return (
    <div className="mx-auto w-full max-w-xl lg:max-w-2xl xl:max-w-4xl flex-1 pb-4 pt-2">
      <h1 className="text-lg md:text-xl font-bold tracking-wide">Workspace Preferences</h1>
      <div className="space-y-6">
        <WorkspaceDisplayName {...props} />
        <WorkspaceDescription {...props} />
        <WorkspaceImage {...props} />
        <WorkspaceLeave {...props} />
        {isAdmin && <WorkspaceDeletion {...props} />}
      </div>
    </div>
  );
}
