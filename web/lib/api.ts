import axios from "axios";
import { auth } from "./auth";
import { buildUrl } from "./utils";
import {
  MemberWithUser,
  User,
  Workspace,
  WorkspaceWithMembers,
  WorkspaceWithMembersAndUsers,
} from "@/types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getUserById = async (id: string) => {
  try {
    return (await api.get(`/users/${id}`)).data.user as User;
  } catch (error) {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return (await api.get(`/users/email/${email}`)).data.user as User;
  } catch (error) {
    return null;
  }
};

export const currentUser = async () => {
  try {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await getUserByEmail(session.user.email);
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserWorkspaces = async (
  userId: string,
  options?: { [key: string]: number | string | boolean }
) => {
  try {
    const url = buildUrl(`/workspaces/user/${userId}`, options);
    return (await api.get(url)).data.workspaces as
      | WorkspaceWithMembers[]
      | WorkspaceWithMembersAndUsers[];
  } catch (error) {
    return null;
  }
};

export const getWorkSpaceById = async (workspaceId: string) => {
  try {
    return (await api.get(`/workspaces/${workspaceId}`)).data.workspace as Workspace;
  } catch (error) {
    return null;
  }
};

export const getWorkspaceMembers = async (workspaceId: string) => {
  try {
    return (await api.get(`/workspaces/${workspaceId}/members`)).data.members as MemberWithUser[];
  } catch (error) {
    return null;
  }
};
