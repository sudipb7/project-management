import { Prisma } from "@prisma/client";
import { db } from "../lib/db";

class OrganizationService {
  private organization = db.organization;

  public getOrganizations = async (
    take = 10,
    skip = 10,
    where?: Prisma.OrganizationWhereInput,
    include?: Prisma.OrganizationInclude
  ) => {
    let filters = {};

    filters = { take, skip };

    if (where) {
      filters = { ...filters, where };
    }

    if (include) {
      filters = { ...filters, include };
    }

    return this.organization.findMany({ where, take, skip, include });
  };

  public getUniqueOrganization = async (where: Prisma.OrganizationWhereUniqueInput) => {
    return this.organization.findUnique({ where, include: { members: true } });
  };

  public getOrganization = async (where: Prisma.OrganizationWhereInput) => {
    return this.organization.findFirst({ where, include: { members: true } });
  };

  public getOrganizationCount = async (where: Prisma.OrganizationWhereInput) => {
    return this.organization.count({ where });
  };

  public createOrganization = async (data: Prisma.OrganizationCreateInput) => {
    return this.organization.create({ data });
  };

  public updateOrganization = async (id: string, data: Prisma.OrganizationUpdateInput) => {
    return this.organization.update({ where: { id }, data });
  };

  public deleteOrganization = async (id: string) => {
    return this.organization.delete({ where: { id } });
  };
}

export default OrganizationService;
