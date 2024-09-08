import { InviteStatus } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/queries";
import { PENDING_INVITE_COOLDOWN } from "@/lib/constants";

export default async function InviteVerificationPage({
  searchParams: { code },
}: {
  searchParams: { code: string };
}) {
  const redirectUrl = encodeURI(`/invites?code=${code}`);

  const profile = await currentProfile();
  if (!profile || !code) {
    return redirect(`/sign-in?redirect_url=${redirectUrl}`);
  }

  const invite = await db.invite.findUnique({
    where: { code },
    include: { workspace: true, member: true },
  });

  if (!invite || invite.profileId !== profile.id || invite.status !== InviteStatus.PENDING) {
    return notFound();
  }

  if (new Date().getTime() - new Date(invite.createdAt).getTime() > PENDING_INVITE_COOLDOWN) {
    return notFound();
  }

  await db.$transaction([
    db.workspace.update({
      where: { id: invite.workspaceId },
      data: {
        members: {
          create: {
            profileId: invite.profileId,
          },
        },
      },
    }),
    db.invite.update({
      where: { code },
      data: { status: InviteStatus.ACCEPTED },
    }),
  ]);

  return redirect(`/workspaces/${invite.workspaceId}`);
}
