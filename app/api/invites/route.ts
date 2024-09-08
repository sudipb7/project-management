import { v4 as uuid } from "uuid";
import { Invite, InviteStatus, MemberRole, Workspace } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { currentProfile } from "@/lib/queries";
import { WorkspaceInviteMail } from "@/components/mails/workspace-invite";
import { PENDING_INVITE_COOLDOWN, REJECTED_INVITE_COOLDOWN } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const { email, workspaceId, memberId } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!workspaceId || !memberId || !email) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const workspace = await db.workspace.findFirst({
      where: { id: workspaceId, members: { some: { id: memberId, role: MemberRole.ADMIN } } },
      include: { members: { include: { profile: true } } },
    });

    if (!workspace) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentMember = workspace.members.find((member) => member.profileId === profile.id);
    if (!currentMember) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userProfile = await db.profile.findUnique({ where: { email } });
    if (!userProfile) {
      return new NextResponse("Profile not found", { status: 404 });
    }

    const existingInvites = await db.invite.findMany({
      where: { profileId: userProfile.id, workspaceId },
      orderBy: { createdAt: "desc" },
    });

    const isUserAlreadyInWorkspace = workspace.members.some(
      (member) => member.profile.email === email
    );
    if (isUserAlreadyInWorkspace) {
      return new NextResponse("User is already in the workspace", { status: 409 });
    }

    const canSendInvite = await canSendInviteToMember(
      existingInvites,
      memberId,
      isUserAlreadyInWorkspace
    );

    if (canSendInvite === true) {
      const invite = await createInvite(userProfile.id, workspaceId, memberId);
      if (!invite) {
        return new NextResponse("Unable to process invite", { status: 400 });
      }

      const MailBody = WorkspaceInviteMail({
        invitedBy: { name: profile.name, email: profile.email },
        sendTo: { name: userProfile.name, email: userProfile.email },
        workspaceName: currentMember.profile.name,
        inviteLink: `${req.nextUrl.origin}/invites?code=${invite.code}`,
      });

      await sendMail(
        userProfile.email,
        `${profile.name} invited you to join ${workspace.name}`,
        MailBody
      );

      return NextResponse.json(invite, { status: 201 });
    } else if (typeof canSendInvite === "string") {
      return new NextResponse(canSendInvite, { status: 429 });
    }

    return new NextResponse("Unable to process invite", { status: 400 });
  } catch (error) {
    console.error("[Method: POST, Path: /api/invites]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function canSendInviteToMember(
  existingInvites: Invite[],
  memberId: string,
  isUserAlreadyInWorkspace: boolean
): Promise<boolean | string> {
  const memberInvites = existingInvites.filter((invite) => invite.memberId === memberId);

  if (memberInvites.length === 0) {
    return true;
  }

  const lastInvite = memberInvites[0];
  const timeSinceLastInvite = new Date().getTime() - lastInvite.updatedAt.getTime();

  switch (lastInvite.status) {
    case InviteStatus.PENDING:
      return timeSinceLastInvite > PENDING_INVITE_COOLDOWN
        ? true
        : "You cannot send another invite within 7 days";
    case InviteStatus.ACCEPTED:
      return isUserAlreadyInWorkspace ? "Member already joined" : true;
    case InviteStatus.REJECTED:
      return timeSinceLastInvite > REJECTED_INVITE_COOLDOWN
        ? true
        : "You cannot send another invite within 14 days";
    default:
      return true;
  }
}

async function createInvite(profileId: string, workspaceId: string, memberId: string) {
  return db.invite.create({
    data: {
      profileId,
      workspaceId,
      memberId,
      code: uuid(),
    },
  });
}
