import { Router } from "express";

import InviteController from "../controllers/invite.controller";
import { Routes } from "../types";

class InviteRouter implements Routes {
  public path = "/invites";
  public router = Router();
  private controller = new InviteController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route(this.path)
      .get(this.controller.getInvites)
      .post(this.controller.createInviteLink);
    this.router.route(`${this.path}/join`).post(this.controller.joinWorkspaceByInviteLink);
    this.router.route(`${this.path}/reject`).post(this.controller.rejectWorkspaceInvite);
    this.router.route(`${this.path}/:id`).delete(this.controller.deleteInviteLink);
  }
}

export default InviteRouter;
