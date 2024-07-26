import { Prisma } from "@prisma/client";
import { db } from "../lib/db";

class UserService {
  private user = db.user;

  public getUsers = async (
    take = 10,
    skip = 10,
    where?: Prisma.UserWhereInput,
    include?: Prisma.UserInclude
  ) => {
    let filters = {};

    filters = { take, skip };

    if (where) {
      filters = { ...filters, where };
    }

    if (include) {
      filters = { ...filters, include };
    }

    return this.user.findMany({ where, take, skip, include });
  };

  public getUniqueUser = async (where: Prisma.UserWhereUniqueInput) => {
    return this.user.findUnique({ where });
  };

  public getUser = async (where: Prisma.UserWhereInput) => {
    return this.user.findFirst({ where });
  };

  public getUserCount = async (where: Prisma.UserWhereInput) => {
    return this.user.count({ where });
  };

  public createUser = async (data: Prisma.UserCreateInput) => {
    return this.user.create({ data });
  };

  public updateUser = async (where: Prisma.UserWhereUniqueInput, data: Prisma.UserUpdateInput) => {
    return this.user.update({ where, data });
  };

  public deleteUser = async (id: string) => {
    return this.user.delete({ where: { id } });
  };
}

export default UserService;
