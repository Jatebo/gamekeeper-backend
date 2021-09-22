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

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use(handleCustomError);

app.use(handleErrorCodes);

app.use(handleServerErrors);

module.exports = app;
