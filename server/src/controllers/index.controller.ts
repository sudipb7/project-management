import { RequestHandler } from "express";

class IndexController {
  public helloWorld: RequestHandler = (_, res) => {
    try {
      return res.status(200).json({ message: "Hello World!" });
    } catch (error) {
      console.log(JSON.stringify(error));
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default IndexController;
