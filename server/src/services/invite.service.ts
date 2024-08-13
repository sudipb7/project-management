import { Prisma } from "@prisma/client";
import { db } from "../lib/db";

class InviteService {
  private invite = db.invite;

  public getInvites = async (
    take = 10,
    skip = 10,
    where?: Prisma.InviteWhereInput,
    include?: Prisma.InviteInclude
  ) => {
    let filters = {};

    filters = { take, skip };

    if (where) {
      filters = { ...filters, where };
    }

    if (include) {
      filters = { ...filters, include };
    }

    return this.invite.findMany({ where, take, skip, include });
  };

  public getUniqueInvite = async (where: Prisma.InviteWhereUniqueInput) => {
    return this.invite.findUnique({ where });
  };

  public getInvite = async (where: Prisma.InviteWhereInput) => {
    return this.invite.findFirst({ where });
  };

  public getInviteCount = async (where: Prisma.InviteWhereInput) => {
    return this.invite.count({ where });
  };

  public createInvite = async (data: Prisma.InviteCreateInput) => {
    return this.invite.create({ data });
  };

  public updateInvite = async (
    where: Prisma.InviteWhereUniqueInput,
    data: Prisma.InviteUpdateInput
  ) => {
    return this.invite.update({ where, data });
  };

  public deleteInvite = async (id: string) => {
    return this.invite.delete({ where: { id } });
  };
}

export default InviteService;
