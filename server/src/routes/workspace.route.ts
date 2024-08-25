import { Router } from "express";

import WorkspaceController from "../controllers/workspace.controller";
import { Routes } from "../types";
import { upload } from "../middlewares/multer.middleware";

class WorkspaceRoute implements Routes {
  public path = "/workspaces";
  public router = Router();
  private controller = new WorkspaceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route(this.path)
      .get(this.controller.getWorkspaces)
      .post(upload.single("image"), this.controller.createWorkspace);
    this.router
      .route(`${this.path}/:id`)
      .get(this.controller.getWorkspaceById)
      .patch(upload.single("image"), this.controller.updateWorkspace)
      .delete(this.controller.deleteWorkspace);
    this.router.route(`${this.path}/:id/members`).get(this.controller.getWorkspaceMembers);
    this.router.route(`${this.path}/user/:id`).get(this.controller.getWorkspacesByUser);
  }
}

export default WorkspaceRoute;
