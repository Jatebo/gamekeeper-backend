const { getCategories } = require("../controllers/categories.controller");
const { reviewsRouter } = require("./review.router");

const apiRouter = require("express").Router();

apiRouter.get("/categories", getCategories);

apiRouter.use("/reviews", reviewsRouter);

module.exports = { apiRouter };
