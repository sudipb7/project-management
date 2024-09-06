import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile";
import type { WorkspaceWithMembers } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q");
    const workspaceId = searchParams.get("workspaceId");
    const excludeWorkspaceMembers = searchParams.get("excludeWorkspaceMembers") === "true";
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (excludeWorkspaceMembers && !workspaceId) {
      return new NextResponse("Workspace ID is required", { status: 400 });
    }

    let where = {};
    let workspace: WorkspaceWithMembers | null = null;

    if (workspaceId) {
      workspace = await db.workspace.findUnique({
        where: { id: workspaceId },
        include: {
          members: true,
        },
      });

      if (!workspace) {
        return new NextResponse("Workspace not found", { status: 404 });
      }

      if (excludeWorkspaceMembers) {
        where = {
          id: {
            notIn: workspace.members.map((member) => member.profileId),
          },
        };
      }

      if (!excludeWorkspaceMembers) {
        where = {
          id: {
            in: workspace.members.map((member) => member.profileId),
          },
        };
      }
    }

    if (q) {
      where = {
        ...where,
        email: {
          contains: q,
          mode: "insensitive",
        },
      };
    }

    const profiles = await db.profile.findMany(where);

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("[Method: GET, Path: /api/profiles]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
