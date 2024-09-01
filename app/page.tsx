import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/profile";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const profile = await initialProfile();

  if (profile) {
    return redirect("/workspace");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome to Mk-1</h1>
      <p className="md:text-lg mb-2.5">Streamline your workflow. Collaborate seamlessly.</p>
      <div>
        <Button size="sm" asChild>
          <Link href="/sign-in">Get Started</Link>
        </Button>
      </div>
    </main>
  );
}
