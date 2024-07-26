import { Router } from "express";

import UserController from "../controllers/user.controller";
import { Routes } from "../types";
import { upload } from "../middlewares/multer.middleware";

class UserRouter implements Routes {
  public path = "/users";
  public router = Router();
  private controller = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router
      .route(this.path)
      .get(this.controller.getUsers)
      .post(upload.single("image"), this.controller.createUser);
    this.router.route(`${this.path}/org/:orgId`).get(this.controller.getUsersByOrganization);
    this.router
      .route(`${this.path}/:id`)
      .get(this.controller.getUserById)
      .patch(upload.single("image"), this.controller.updateUser);
    this.router.route(`${this.path}/:id/image`).delete(this.controller.deleteUserImage);
  }
}

export default UserRouter;
