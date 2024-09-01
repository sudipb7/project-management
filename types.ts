import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import { Profile, Workspace, Member, MemberRole } from "@prisma/client";

export type MemberWithProfile = Member & { profile: Profile };

export type WorkspaceWithMembers = Workspace & { members: Member[] };

export type WorkspaceWithMembersAndProfile = Workspace & { members: MemberWithProfile[] };

export type MemberTable = {
  id: string;
  userId: string;
  profileId: string;
  role: MemberRole;
  createdAt: Date;
  workspaceId: string;
  email: string;
  name: string;
  image: string | null;
};

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
