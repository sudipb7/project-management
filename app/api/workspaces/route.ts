import { NextResponse } from "next/server";
import { ChannelType, MemberRole } from "@prisma/client";

import { db } from "@/lib/db";
import { WorkspaceSchema } from "@/lib/schema";
import { currentProfile } from "@/lib/profile";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const adminId = body.adminId;
    const schema = WorkspaceSchema.safeParse(body);
    if (!schema.success) {
      return new NextResponse(schema.error.errors[0].message, { status: 400 });
    }

    const { name, description, isPublic, image } = schema.data;

    if (!adminId) {
      return new NextResponse("Admin ID is required", { status: 400 });
    }

    const profile = await currentProfile();
    if (!profile || profile.id !== adminId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const workspace = await db.workspace.create({
      data: {
        name,
        image,
        description,
        visibility: isPublic ? "PUBLIC" : "PRIVATE",
        members: {
          create: {
            profileId: adminId,
            role: MemberRole.ADMIN,
          },
        },
        channels: {
          create: [
            {
              name: "general",
              description:
                "This is the primary channel in your workspace, designated as 'general'. It is a permanent fixture and cannot be removed or renamed. Although you can change description, the name will always remain the same.",
              type: ChannelType.GENERAL,
            },
            {
              name: "announcement",
              description:
                "This is the announcement channel in your workspace, designated as 'announcement'. It is a permanent fixture and cannot be removed or renamed. Although you can change description, the name will always remain the same.",
              type: ChannelType.ANNOUCEMENT,
            },
          ],
        },
      },
      include: {
        members: true,
        channels: true,
      },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error("[Method: POST, Path: /api/workspaces]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
