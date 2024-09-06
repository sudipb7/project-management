import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile";

export async function DELETE(req: NextRequest, { params }: { params: { workspaceId: string } }) {
  try {
    const reqBody = await req.json();
    const { memberId } = reqBody;
    const workspaceId = params.workspaceId;
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!workspaceId || !memberId) {
      return new NextResponse("Workspace ID and Member ID are required", { status: 400 });
    }

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });
    if (!workspace) {
      return new NextResponse("Workspace not found", { status: 404 });
    }

    const member = workspace.members.find((member) => member.id === memberId);

    if (!member) {
      return new NextResponse("You are not a member of this workspace", { status: 401 });
    }

    if (member.role === MemberRole.ADMIN) {
      return new NextResponse("You cannot leave the workspace as you are an admin.", {
        status: 400,
      });
    }

    if (workspace.members.length === 1) {
      return new NextResponse("You cannot leave the workspace as you are the only member.", {
        status: 400,
      });
    }

    await db.member.delete({ where: { id: memberId } });

    return NextResponse.json({ message: "You have left the workspace." }, { status: 200 });
  } catch (error) {
    console.error("[Method: DELETE, Path: /api/workspaces/:workspaceId/leave]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
