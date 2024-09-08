import { notFound, redirect } from "next/navigation";

import { currentProfile } from "@/lib/queries";
import { getWorkspaceById } from "@/lib/queries";
import { WorkspaceWithMembers } from "@/types";

export default async function WorkspacePage({ params }: { params: { workspaceId: string } }) {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }

  const workspace = (await getWorkspaceById(params.workspaceId, {
    includeMembers: true,
  })) as WorkspaceWithMembers;
  if (!workspace || !workspace?.members.some((member) => member.profileId === profile.id)) {
    return notFound();
  }

  return (
    <pre className="whitespace-pre-wrap text-xs overflow-hidden">
      {JSON.stringify(workspace, null, 2)}
    </pre>
  );
}
