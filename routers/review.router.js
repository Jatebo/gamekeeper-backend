const reviewsRouter = require("express").Router();

const {
  getReviewByID,
  patchReviewVotes,
  getReviews,
} = require("../controllers/reviews.controller");
const {
  getCommentsByReview,
  postComment,
} = require("../controllers/comments.controller");

reviewsRouter.get("/", getReviews);

reviewsRouter.route("/:review_id").get(getReviewByID).patch(patchReviewVotes);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReview)
  .post(postComment);

module.exports = { reviewsRouter };
