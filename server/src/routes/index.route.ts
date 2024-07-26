import { Router } from "express";

import IndexController from "../controllers/index.controller";
import { Routes } from "../types";

class IndexRouter implements Routes {
  public path = "/";
  public router = Router();
  private controller = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.controller.helloWorld);
  }
}

export default IndexRouter;
