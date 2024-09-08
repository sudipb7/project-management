import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/queries";

export async function POST(req: NextRequest, { params }: { params: { workspaceId: string } }) {
  try {
    const { workspaceId } = params;
    const { adminId, memberId } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!adminId) {
      return new NextResponse("Admin ID is required", { status: 400 });
    }

    if (!workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("Member ID is required", { status: 400 });
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

    if (member.role === MemberRole.ADMIN) {
      return new NextResponse("Cannot kick out an admin", { status: 400 });
    }

    await db.member.delete({ where: { id: memberId } });

    return NextResponse.json({ message: "Member has been kicked out successfully" });
  } catch (error) {
    console.error("[Method: POST, Path: /api/workspaces/:workspaceId/kick]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
