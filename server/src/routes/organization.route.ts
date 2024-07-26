import { Router } from "express";

import OrganizationController from "../controllers/organization.controller";
import { Routes } from "../types";
import { upload } from "../middlewares/multer.middleware";

class OrganizationRoute implements Routes {
  public path = "/organizations";
  public router = Router();
  private controller = new OrganizationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route(this.path)
      .get(this.controller.getOrganizations)
      .post(upload.single("image"), this.controller.createOrganization);
    this.router
      .route(`${this.path}/:id`)
      .get(this.controller.getOrganizationById)
      .patch(upload.single("image"), this.controller.updateOrganization);
    this.router.route(`${this.path}/user/:id`).get(this.controller.getOrganizationsByUser);
    this.router.route(`${this.path}/invite`).get(this.controller.joinOrganizationByInviteCode);
    this.router.route(`${this.path}/invite/:id`).patch(this.controller.updateInviteCode);
  }
}

export default OrganizationRoute;
