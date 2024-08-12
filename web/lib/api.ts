import axios from "axios";
import { auth } from "./auth";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getUserById = async (id: string) => {
  try {
    return (await api.get(`/users/${id}`)).data.user;
  } catch (error: any) {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    return (await api.get(`/users/email/${email}`)).data.user;
  } catch (error: any) {
    return null;
  }
};

export const currentUser = async () => {
  try {
    const session = await auth();
    if (!session?.user?.email) return null;

    const user = await getUserByEmail(session.user.email);
    return user;
  } catch (error: any) {
    return null;
  }
};

export const getUserWorkspaces = async (userId: string) => {
  try {
    return (await api.get(`/workspaces/user/${userId}`)).data.workspaces;
  } catch (error: any) {
    return null;
  }
};

export const getWorkSpaceById = async (workspaceId: string) => {
  try {
    return (await api.get(`/workspaces/${workspaceId}`)).data.workspace;
  } catch (error: any) {
    return null;
  }
};
