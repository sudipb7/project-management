"use server";

import { auth } from "./auth";
import { api } from "./utils";

export const getUserById = async (id: string) => {
  try {
    return (await api.get(`/users/${id}`)).data;
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    // TODO: Fix this query
    return (await api.get(`/users?search=${email}`)).data.users[0];
  } catch (error: any) {
    console.error(error.message);
    return null;
  }
};

export const createUser = async (data: any) => {
  try {
    return (await api.post("/users", data)).data;
  } catch (error: any) {
    console.error(error.message);
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
    console.error(error.message);
    return null;
  }
};
