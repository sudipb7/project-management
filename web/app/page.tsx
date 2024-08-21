import React from "react";
import { redirect } from "next/navigation";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { currentUser, getUserWorkspaces } from "@/lib/api";

export default async function Page() {
  const user = await currentUser();
  if (user) {
    const workspaces = await getUserWorkspaces(user.id);
    return redirect(`/workspace/${workspaces[0].id}`);
  }

  return (
    <div>
      <ModeToggle />
    </div>
  );
}
