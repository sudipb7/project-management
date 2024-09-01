import { NextApiRequest } from "next";
import { currentUser, getAuth } from "@clerk/nextjs/server";

import { db } from "./db";

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
