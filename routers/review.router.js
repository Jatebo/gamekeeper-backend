const reviewsRouter = require("express").Router();

const {
  getReviewByID,
  patchReviewVotes,
  getReviews,
} = require("../controllers/reviews.controller");

reviewsRouter.get("/", getReviews);

reviewsRouter.route("/:review_id").get(getReviewByID).patch(patchReviewVotes);

module.exports = { reviewsRouter };
