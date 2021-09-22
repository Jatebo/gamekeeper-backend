const reviewsRouter = require("express").Router();

const {
  getReviewByID,
  patchReviewVotes,
} = require("../controllers/reviews.controller");

reviewsRouter.get("/", (req, res) => {});

reviewsRouter.route("/:review_id").get(getReviewByID).patch(patchReviewVotes);

module.exports = { reviewsRouter };
