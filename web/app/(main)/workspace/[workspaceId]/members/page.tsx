import React from "react";
import { notFound, redirect } from "next/navigation";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { currentUser, getWorkSpaceById, getWorkspaceMembers } from "@/lib/api";

export default async function WorkspaceMembersPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }

  const workspace = await getWorkSpaceById(params.workspaceId);
  if (!workspace) {
    notFound();
  }

  const members = await getWorkspaceMembers(params.workspaceId);
  if (!members) {
    notFound();
  }

  const isMember = members.find((member: any) => member.userId === user.id);
  const isAdmin = members.find(
    (member: any) => member.userId === user.id && member.role === "ADMIN"
  );

  if (!isMember) {
    return notFound();
  }

  const modifiedMembers = members.map((member) => ({
    id: member.id,
    userId: member.userId,
    role: member.role,
    createdAt: member.createdAt,
    workspaceId: member.workspaceId,
    email: member.user.email,
    name: member.user.name,
    image: member.user.image,
  }));

  return (
    <div className="mx-auto w-full max-w-xl lg:max-w-2xl xl:max-w-4xl flex-1 pb-4 pt-2">
      <h1 className="text-lg md:text-xl font-bold tracking-wide mb-4">Members</h1>
      <DataTable columns={columns} data={modifiedMembers} />
    </div>
  );
}
