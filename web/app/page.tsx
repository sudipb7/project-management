import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { currentUser, getUserWorkspaces } from "@/lib/api";

export default async function Page() {
  const user = await currentUser();
  if (user) {
    const workspaces = await getUserWorkspaces(user.id);
    return redirect(`/workspace/${workspaces[0].id}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome to ColumnZ</h1>
      <p className="md:text-lg mb-2.5">Streamline your workflow. Collaborate seamlessly.</p>
      <div>
        <Button size="sm" asChild>
          <Link href="/sign-in">Get Started</Link>
        </Button>
      </div>
    </main>
  );
}
