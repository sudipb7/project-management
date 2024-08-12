import { Prisma } from "@prisma/client";
import { db } from "../lib/db";

class WorkspaceService {
  private workspace = db.workspace;

  public getWorkspaces = async (
    where?: Prisma.WorkspaceWhereInput,
    take?: number,
    skip?: number,
    include?: Prisma.WorkspaceInclude
  ) => {
    let filters = {};

    filters = { take, skip };

    if (where) {
      filters = { ...filters, where };
    }

    if (include) {
      filters = { ...filters, include };
    }

    return this.workspace.findMany({ where, take, skip, include });
  };

  public getUniqueWorkspace = async (where: Prisma.WorkspaceWhereUniqueInput) => {
    return this.workspace.findUnique({ where, include: { members: true } });
  };

  public getWorkspace = async (where: Prisma.WorkspaceWhereInput) => {
    return this.workspace.findFirst({ where, include: { members: true } });
  };

  public getWorkspaceCount = async (where: Prisma.WorkspaceWhereInput) => {
    return this.workspace.count({ where });
  };

  public createWorkspace = async (data: Prisma.WorkspaceCreateInput) => {
    return this.workspace.create({ data });
  };

  public updateWorkspace = async (id: string, data: Prisma.WorkspaceUpdateInput) => {
    return this.workspace.update({ where: { id }, data });
  };

  public deleteWorkspace = async (id: string) => {
    return this.workspace.delete({ where: { id } });
  };
}

export default WorkspaceService;
