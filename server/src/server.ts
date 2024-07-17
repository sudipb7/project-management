import cors from "cors";
import http from "http";
import morgan from "morgan";
import express from "express";

import { Routes } from "./types";
import { logger, stream } from "./lib/logger";
import { LOG_FORMAT, PORT, CORS_ORIGIN, NODE_ENV } from "./lib/config";

class Server {
  public app: express.Application;
  public env: string;
  public httpServer: http.Server;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || "development";
    this.port = PORT || 8000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);

    this.httpServer = http.createServer(this.app);
  }

  public listen() {
    this.httpServer.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 Columnz server is running on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.httpServer;
  }

  private initializeMiddlewares() {
    this.app.use(express.static("public"));
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    this.app.use(morgan(LOG_FORMAT || "dev", { stream }));
    this.app.use(cors({ origin: CORS_ORIGIN }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }
}

export default Server;
