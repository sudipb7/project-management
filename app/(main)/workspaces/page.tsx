import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/queries";
import { getWorkspacesByProfileId } from "@/lib/queries";

export default async function WorkspacePage() {
  const profile = await currentProfile();
  if (!profile?.id) {
    return redirect("/sign-in");
  }

  const workspaces = await getWorkspacesByProfileId(profile.id, {});
  if (!workspaces || workspaces.length === 0) {
    return redirect("/onboarding");
  }

  return redirect(`/workspaces/${workspaces[0].id}`);
}
