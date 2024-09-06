import { Workspace } from "@prisma/client";

import { db } from "./db";
import { WorkspaceWithMembers, WorkspaceWithMembersAndProfile } from "@/types";

// * API Routes for these methods are available but still we need these here
// * to be used while fetching data in server side rendering.
// * Fetching data by API routes in server side rendering is not working as expected.
// * So, we need these methods to fetch data in server side rendering.

export type GetWorkspaceIncludeOptions = {
  includeMembers?: boolean;
  includeChannels?: boolean;
  includeProfile?: boolean;
};

export type GetWorkspaceReturn =
  | Workspace
  | WorkspaceWithMembers
  | WorkspaceWithMembersAndProfile
  | null;
export type GetWorkspacesReturn =
  | (Workspace | WorkspaceWithMembers | WorkspaceWithMembersAndProfile)[]
  | null;

export const getWorkspacesByProfileId = async (
  profileId: string,
  options: GetWorkspaceIncludeOptions
): Promise<GetWorkspacesReturn> => {
  try {
    const includeProfile = options.includeProfile;
    const includeMembers = options.includeMembers;
    const includeChannels = options.includeChannels;

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

    if (!profileId) {
      return null;
    }

    const workspaces = await db.workspace.findMany({
      where: { members: { some: { profileId } } },
      include,
    });

    if (!workspaces) {
      return null;
    }

    return workspaces;
  } catch (error) {
    console.error("[Method: getWorkspacesByProfileId]", error);
    return null;
  }
};

export const getWorkspaceById = async (
  workspaceId: string,
  options: GetWorkspaceIncludeOptions
): Promise<GetWorkspaceReturn> => {
  try {
    const includeProfile = options.includeProfile;
    const includeMembers = options.includeMembers;
    const includeChannels = options.includeChannels;

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

    if (!workspaceId) {
      return null;
    }

    const workspace = await db.workspace.findUnique({ where: { id: workspaceId }, include });
    if (!workspace) {
      return null;
    }

    return workspace;
  } catch (error) {
    console.error("[Method: getWorkspacebyId]", error);
    return null;
  }
};
