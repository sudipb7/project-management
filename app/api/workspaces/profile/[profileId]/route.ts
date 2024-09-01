import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/profile";

export async function GET(req: NextRequest, { params }: { params: { profileId: string } }) {
  try {
    const profileId = params.profileId;
    const searchParams = req.nextUrl.searchParams;
    const includeProfile = searchParams.get("includeProfile") === "true";
    const includeMembers = searchParams.get("includeMembers") === "true";
    const includeChannels = searchParams.get("includeChannels") === "true";
    const profile = await currentProfile();

    if (!profile || profile.id !== profileId) {
      return new NextResponse("Unauthorized", { status: 401 });
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

    const workspaces = await db.workspace.findMany({
      where: { members: { some: { profileId } } },
      include,
    });

    if (!workspaces) {
      return new NextResponse("Workspaces not found", { status: 404 });
    }

    return NextResponse.json(workspaces, { status: 200 });
  } catch (error) {
    console.error("[Method: GET, Path: /api/workspaces/profile/:profileId]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
