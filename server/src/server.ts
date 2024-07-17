import express from "express";

require("dotenv").config(".env");

const app = express();

app.get("/", (req, res) => {
  res.send("Ok");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
