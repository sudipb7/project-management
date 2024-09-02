import { notFound, redirect } from "next/navigation";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { currentProfile } from "@/lib/profile";
import { getWorkspaceById } from "@/lib/workspace";
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
    notFound();
  }

  const isMember = workspace.members.find((member) => member.profileId === profile.id);
  const isAdmin = workspace.members.find(
    (member) => member.profileId === profile.id && member.role === "ADMIN"
  );

  if (!isMember) {
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

  return (
    <div className="mx-auto w-full max-w-xl lg:max-w-2xl xl:max-w-4xl flex-1 pb-4 pt-2">
      <h1 className="text-lg md:text-xl font-bold tracking-wide mb-4">Members</h1>
      <DataTable columns={columns} data={modifiedMembers} />
    </div>
  );
}
