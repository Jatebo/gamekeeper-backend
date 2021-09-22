const reviewsRouter = require("express").Router();

const { getReviewByID } = require("../controllers/reviews.controller");

reviewsRouter.get("/", (req, res) => {});

reviewsRouter.route("/:review_id").get(getReviewByID);

module.exports = { reviewsRouter };
