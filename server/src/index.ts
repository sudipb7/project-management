import Server from "./server";
import IndexRouter from "./routes/index.route";
import UserRouter from "./routes/user.route";
import WorkspaceRouter from "./routes/workspace.route";
import InviteRouter from "./routes/invite.route";

require("dotenv").config(".env");

const httpServer = new Server([
  new IndexRouter(),
  new UserRouter(),
  new WorkspaceRouter(),
  new InviteRouter(),
]);

httpServer.listen();
