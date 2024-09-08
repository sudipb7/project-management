import { NextApiRequest } from "next";
import { currentUser, getAuth } from "@clerk/nextjs/server";

import { db } from "./db";
import { GetWorkspaceIncludeOptions, GetWorkspaceReturn, GetWorkspacesReturn } from "@/types";

// ---------------------------- Profiles ----------------------------
export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await db.profile.create({
    data: {
      email: user.emailAddresses[0].emailAddress,
      name: user.fullName || user.emailAddresses[0].emailAddress.split("@")[0],
      userId: user.id,
      image: user.imageUrl,
    },
  });

  return newProfile;
};

export const currentProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  return profile;
};

// For API routes of pages router.
export const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};

// ---------------------------- Workspaces ----------------------------
// * API Routes for these methods are available but still we need these here
// * to be used while fetching data in server side rendering.
// * Fetching data by API routes in server side rendering is not working as expected.
// * So, we need these methods to fetch data in server side rendering.

export const getWorkspacesByProfileId = async (
  profileId: string,
  options: GetWorkspaceIncludeOptions
): Promise<GetWorkspacesReturn> => {
  try {
    const includeProfile = options.includeProfile;
    const includeMembers = options.includeMembers;
    const includeChannels = options.includeChannels;
    const includeInvites = options.includeInvites;

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

    if (includeInvites) {
      include = { ...include, invites: true };
    }

    if (!profileId) {
      return null;
    }

    const workspaces = await db.workspace.findMany({
      where: { members: { some: { profileId } } },
      include,
      orderBy: { createdAt: "asc" },
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
    const includeInvites = options.includeInvites;

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

    if (includeInvites) {
      include = { ...include, invites: true };
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
