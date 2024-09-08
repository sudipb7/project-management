import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/queries";

export async function PATCH(req: NextRequest, { params }: { params: { workspaceId: string } }) {
  try {
    const { role, adminId, memberId } = await req.json();
    const { workspaceId } = params;
    const profile = await currentProfile();

    if (!adminId) {
      return new NextResponse("Admin ID is required", { status: 400 });
    }

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("Member ID is required", { status: 400 });
    }

    if (!(role in MemberRole)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    const workspace = await db.workspace.findFirst({
      where: { id: workspaceId, members: { some: { id: adminId, role: MemberRole.ADMIN } } },
      include: { members: true },
    });

    if (!workspace) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const member = workspace.members.find((member) => member.id === memberId);

    if (!member) {
      return new NextResponse("Invalid member ID", { status: 400 });
    }

    if (member.role === MemberRole.ADMIN && role !== MemberRole.ADMIN) {
      const admins = workspace.members.filter((member) => member.role === MemberRole.ADMIN);

      if (admins.length === 1) {
        return new NextResponse("Cannot remove the last admin", { status: 400 });
      }
    }

    const updatedMember = await db.member.update({
      where: { id: memberId },
      data: { role },
    });

    return NextResponse.json({ workspace, member: updatedMember });
  } catch (error) {
    console.error("[Method: PATCH, Path: /api/workspaces/:workspaceId/roles]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
