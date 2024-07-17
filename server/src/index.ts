import Server from "./server";
import IndexRoute from "./routes/index.route";

require("dotenv").config(".env");

const httpServer = new Server([new IndexRoute()]);

httpServer.listen();
