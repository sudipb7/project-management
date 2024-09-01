import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile";
import { Onboarding } from "@/components/modals/onboarding";

export const metadata = {
  title: "Onboarding",
};

export default async function OnboardingLayout() {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/sign-in");
  }

  const workspace = await db.workspace.findFirst({
    where: { members: { some: { profileId: profile.id } } },
  });

  if (workspace) {
    return redirect(`/workspace/${workspace.id}`);
  }

  return <Onboarding profile={profile} />;
}
