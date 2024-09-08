import { notFound, redirect } from "next/navigation";

import { currentProfile } from "@/lib/queries";
import { getWorkspaceById } from "@/lib/queries";
import { columns, DataTable, InvitePeople } from "./_components";
import { MemberTable, WorkspaceWithMembersAndProfileAndInvites } from "@/types";

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
    includeInvites: true,
  })) as WorkspaceWithMembersAndProfileAndInvites;
  if (!workspace) {
    return notFound();
  }

  const currentMember = workspace.members.find((member) => member.profileId === profile.id);
  const isAdmin = workspace.members.some(
    (member) => member.profileId === profile.id && member.role === "ADMIN"
  );

  if (!currentMember) {
    return notFound();
  }

  const modifiedMembers = workspace.members.map((member) => ({
    id: member.id,
    userId: member.profile.userId,
    profileId: member.profileId,
    role: member.role,
    createdAt: member.createdAt,
    workspaceId: member.workspaceId,
    email: member.profile.email,
    name: member.profile.name,
    image: member.profile.image,
    members: workspace.members,
    invites: workspace.invites,
  })) as MemberTable[];

  return (
    <div className="mx-auto w-full max-w-xl lg:max-w-2xl xl:max-w-4xl flex-1 pb-4 pt-2 space-y-4">
      <h1 className="text-lg md:text-xl font-bold tracking-wide">{workspace.name} - Members</h1>
      <div className="space-y-6">
        {isAdmin && <InvitePeople workspaceId={workspace.id} currentMemberId={currentMember.id} />}
        <DataTable columns={columns} data={modifiedMembers} />
      </div>
    </div>
  );
}
