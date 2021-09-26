const { getCategories } = require("../controllers/categories.controller");
const { reviewsRouter } = require("./review.router");
const commentsRouter = require("./comments.router");

const endpoints = require("../endpoints.json");

const apiRouter = require("express").Router();

apiRouter.get("/categories", getCategories);

apiRouter.use("/reviews", reviewsRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.get("/", (req, res, next) => {
  try {
    res.status(200).send(endpoints);
  } catch (err) {
    next(err);
  }
});

module.exports = { apiRouter };
