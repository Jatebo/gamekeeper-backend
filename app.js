const express = require("express");
const {
  handleCustomError,
  handleErrorCodes,
  handleServerErrors,
} = require("./controllers/errorHandlers.controller");
const { apiRouter } = require("./routers/api.router");
const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.get("/", (req, res, next) => {
  try {
    res.status(200).send({ msg: "Connected to project-gamekeeper" });
  } catch (err) {
    next(err);
  }
});

app.use(handleCustomError);

app.use(handleErrorCodes);

app.use(handleServerErrors);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});
module.exports = app;
