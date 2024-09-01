import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/profile";
import { getWorkspaceById } from "@/lib/workspace";

export default async function WorkspacePage({ params }: { params: { workspaceId: string } }) {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }

  const workspace = await getWorkspaceById(params.workspaceId, {});
  if (!workspace) {
    return <></>;
  }

  return (
    <pre className="whitespace-pre-wrap text-xs overflow-hidden">
      {JSON.stringify(workspace, null, 2)}
    </pre>
  );
}
