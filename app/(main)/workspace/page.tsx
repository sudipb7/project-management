import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/profile";
import { getWorkspacesByProfileId } from "@/lib/workspace";

export default async function WorkspacePage() {
  const profile = await currentProfile();
  if (!profile?.id) {
    return redirect("/sign-in");
  }

  const workspaces = await getWorkspacesByProfileId(profile.id, {});
  if (!workspaces || workspaces.length === 0) {
    return redirect("/onboarding");
  }

  return redirect(`/workspace/${workspaces[0].id}`);
}
