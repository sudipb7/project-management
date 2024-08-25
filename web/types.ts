export type MemberRole = "ADMIN" | "MEMBER";

export type User = {
  id: string;
  name: string;
  image: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Member = {
  id: string;
  userId: string;
  workspaceId: string;
  role: MemberRole;
  createdAt: Date;
  updatedAt: Date;
};

export type Workspace = {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ModifiedMember = {
  id: string;
  userId: string;
  role: MemberRole;
  createdAt: Date;
  workspaceId: string;
  email: string;
  name: string;
  image: string | null;
};

export type MemberWithUser = Member & { user: User };

export type WorkspaceWithMembers = Workspace & { members: Member[] };

export type WorkspaceWithMembersAndUsers = Workspace & { members: MemberWithUser[] };
