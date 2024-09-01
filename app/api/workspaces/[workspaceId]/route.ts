import { NextRequest, NextResponse } from "next/server";
import { MemberRole, WorkspaceVisibility } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile";
import { WorkspaceSchema } from "@/lib/schema";

export async function GET(req: NextRequest, { params }: { params: { workspaceId: string } }) {
  try {
    const workspaceId = params.workspaceId;
    const searchParams = req.nextUrl.searchParams;
    const includeProfile = searchParams.get("includeProfile") === "true";
    const includeMembers = searchParams.get("includeMembers") === "true";
    const includeChannels = searchParams.get("includeChannels") === "true";
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    let include = {};
    if (includeMembers) {
      include = { ...include, members: true };
    }

    if (includeChannels) {
      include = { ...include, channels: true };
    }

    if (includeProfile) {
      include = { ...include, members: { include: { profile: true } } };
    }

    const workspace = await db.workspace.findUnique({ where: { id: workspaceId }, include });
    if (!workspace) {
      return new NextResponse("Workspace not found", { status: 404 });
    }

    return NextResponse.json(workspace, { status: 200 });
  } catch (error) {
    console.error("[Method: GET, Path: /api/workspaces/:workspaceId]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { workspaceId: string } }) {
  try {
    const body = await req.json();
    const adminId = body.adminId;
    const workspaceId = params.workspaceId;
    const schema = WorkspaceSchema.safeParse(body);
    const profile = await currentProfile();

    if (!schema.success) {
      return new NextResponse(schema.error.errors[0].message, { status: 400 });
    }

    if (!profile || profile.id !== adminId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!adminId) {
      return new NextResponse("Admin ID is required", { status: 400 });
    }

    if (!workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    const { isPublic, name, description, image } = schema.data;

    const workspace = await db.workspace.update({
      where: { id: workspaceId, members: { some: { profileId: adminId, role: MemberRole.ADMIN } } },
      data: {
        name,
        image,
        description,
        visibility: isPublic ? WorkspaceVisibility.PUBLIC : WorkspaceVisibility.PRIVATE,
      },
      include: { members: true, channels: true },
    });

    if (!workspace) {
      return new NextResponse("Failed to update workspace", { status: 400 });
    }

    return NextResponse.json(workspace, { status: 200 });
  } catch (error) {
    console.error("[Method: PATCH, Path: /api/workspaces/:workspaceId]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { workspaceId: string } }) {
  try {
    const body = await req.json();
    const adminId = body.adminId;
    const profile = await currentProfile();

    if (!adminId) {
      return new NextResponse("Admin ID is required", { status: 400 });
    }

    if (!profile || profile.id !== adminId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const workspaceId = req.nextUrl.pathname.split("/").pop();
    if (!workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    const workspace = await db.workspace.delete({
      where: { id: workspaceId, members: { some: { profileId: adminId, role: MemberRole.ADMIN } } },
    });
    if (!workspace) {
      return new NextResponse("Failed to delete workspace", { status: 400 });
    }

    return NextResponse.json("Workspace deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[Method: DELETE, Path: /api/workspaces/:workspaceId]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
