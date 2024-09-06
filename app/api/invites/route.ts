import { v4 as uuid } from "uuid";
import { Invite, InviteStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { currentProfile } from "@/lib/profile";
import { WorkspaceInviteMail } from "@/components/mails/workspace-invite";

const PENDING_INVITE_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const REJECTED_INVITE_COOLDOWN = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");

    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.redirect(new URL("/sign-in", req.nextUrl.origin));
    }

    if (!code) {
      return NextResponse.redirect(req.nextUrl.origin);
    }

    const invite = await db.invite.findUnique({
      where: { code },
      include: { workspace: true, member: true },
    });

    if (!invite) {
      return NextResponse.redirect(req.nextUrl.origin);
    }

    if (invite.profileId !== profile.id) {
      return NextResponse.redirect(req.nextUrl.origin);
    }

    if (invite.status !== InviteStatus.PENDING) {
      return NextResponse.redirect(req.nextUrl.origin);
    }

    const updatedWorkspace = await db.workspace.update({
      where: { id: invite.workspaceId },
      data: {
        members: {
          create: {
            profileId: invite.profileId,
          },
        },
      },
    });

    if (!updatedWorkspace) {
      return NextResponse.redirect(req.nextUrl.origin);
    }

    await db.invite.update({
      where: { code },
      data: { status: InviteStatus.ACCEPTED },
    });

    return NextResponse.redirect(new URL(`/workspace/${invite.workspaceId}`, req.nextUrl.origin));
  } catch (error) {
    console.error("[Method: GET, Path: /api/invites]", error);
    return NextResponse.redirect(req.nextUrl.origin);
  }
}

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

    const member = await db.member.findUnique({
      where: { id: memberId },
      include: { workspace: true },
    });
    if (!member || member.profileId !== profile.id) {
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

    const canSendInvite = await canSendInviteToMember(existingInvites, memberId);

    if (canSendInvite === true) {
      const invite = await createInvite(userProfile.id, workspaceId, memberId);
      if (!invite) {
        return new NextResponse("Unable to process invite", { status: 400 });
      }

      const MailBody = WorkspaceInviteMail({
        invitedBy: { name: profile.name, email: profile.email },
        sendTo: { name: userProfile.name, email: userProfile.email },
        workspaceName: member.workspace.name,
        inviteLink: `${process.env.NEXT_PUBLIC_SITE_URL}/api/invites?code=${invite.code}`,
      });

      await sendMail(
        userProfile.email,
        `${profile.name} invited you to join ${member.workspace.name}`,
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
  memberId: string
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
      return "Member already joined";
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
