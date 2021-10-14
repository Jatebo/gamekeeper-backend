const {
  getCategories,
  postCategory,
} = require("../controllers/categories.controller");
const reviewsRouter = require("./review.router");
const commentsRouter = require("./comments.router");
const usersRouter = require("./users.router");

const endpoints = require("../endpoints.json");

const apiRouter = require("express").Router();

apiRouter.route("/categories").get(getCategories).post(postCategory);

apiRouter.use("/reviews", reviewsRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.get("/", (req, res, next) => {
  try {
    res.status(200).send(endpoints);
  } catch (err) {
    next(err);
  }
});

module.exports = { apiRouter };
