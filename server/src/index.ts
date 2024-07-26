import Server from "./server";
import IndexRouter from "./routes/index.route";
import UserRouter from "./routes/user.route";
import OrganizationRouter from "./routes/organization.route";

require("dotenv").config(".env");

const httpServer = new Server([new IndexRouter(), new UserRouter(), new OrganizationRouter()]);

httpServer.listen();
