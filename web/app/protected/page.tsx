import { redirect } from "next/navigation";

import { currentUser } from "@/lib/queries";

export default async function ProtectedPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <pre className="whitespace-nowrap">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
