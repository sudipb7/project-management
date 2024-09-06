import { notFound, redirect } from "next/navigation";

import { currentProfile } from "@/lib/profile";
import { getWorkspaceById } from "@/lib/workspace";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { InviteMembers } from "./_components/invite-members";
import { MemberTable, WorkspaceWithMembersAndProfile } from "@/types";

export default async function WorkspaceMembersPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }

  const workspace = (await getWorkspaceById(params.workspaceId, {
    includeProfile: true,
  })) as WorkspaceWithMembersAndProfile;
  if (!workspace) {
    return notFound();
  }

  const member = workspace.members.find((member) => member.profileId === profile.id);
  const isAdmin = workspace.members.some(
    (member) => member.profileId === profile.id && member.role === "ADMIN"
  );

  if (!member) {
    return notFound();
  }

  const modifiedMembers = workspace.members.map((member) => ({
    id: member.id,
    userId: member.profileId,
    role: member.role,
    createdAt: member.createdAt,
    workspaceId: member.workspaceId,
    email: member.profile.email,
    name: member.profile.name,
    image: member.profile.image,
  })) as MemberTable[];

  const showInvite = workspace.visibility === "PUBLIC" || isAdmin;

  return (
    <div className="mx-auto w-full max-w-xl lg:max-w-2xl xl:max-w-4xl flex-1 pb-4 pt-2 space-y-6">
      {showInvite && <InviteMembers workspaceId={workspace.id} currentMemberId={member.id} />}
      <DataTable columns={columns} data={modifiedMembers} />
    </div>
  );
}
