import { NextApiResponse } from "next";
import { Server as NetServer, Socket } from "net";
import { Server as SocketIOServer } from "socket.io";
import { Profile, Workspace, Member, MemberRole, Invite } from "@prisma/client";

export type MemberWithProfile = Member & { profile: Profile };

export type InviteWithMemberProfile = Invite & { member: MemberWithProfile };

export type WorkspaceWithMembers = Workspace & { members: Member[] };

export type WorkspaceWithMembersAndProfile = Workspace & { members: MemberWithProfile[] };

export type WorkspaceWithMembersAndProfileAndInvites = WorkspaceWithMembersAndProfile & {
  invites: InviteWithMemberProfile[];
};

export type GetWorkspaceIncludeOptions = {
  includeMembers?: boolean;
  includeChannels?: boolean;
  includeProfile?: boolean;
  includeInvites?: boolean;
};

export type GetWorkspaceReturn =
  | Workspace
  | WorkspaceWithMembers
  | WorkspaceWithMembersAndProfile
  | WorkspaceWithMembersAndProfileAndInvites
  | null;
export type GetWorkspacesReturn =
  | (
      | Workspace
      | WorkspaceWithMembers
      | WorkspaceWithMembersAndProfile
      | WorkspaceWithMembersAndProfileAndInvites
    )[]
  | null;

export type MemberTable = {
  id: string;
  userId: string;
  profileId: string;
  role: MemberRole;
  createdAt: Date;
  workspaceId: string;
  email: string;
  name: string;
  members: MemberWithProfile[];
  invites: InviteWithMemberProfile[];
  image: string | null;
};

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
