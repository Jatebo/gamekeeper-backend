const reviewsRouter = require("express").Router();

const {
  getReviewByID,
  patchReviewVotes,
  getReviews,
  postReview,
  deleteReviewByID
} = require("../controllers/reviews.controller");
const {
  getCommentsByReview,
  postComment,
} = require("../controllers/comments.controller");

reviewsRouter.route("/").get(getReviews).post(postReview);

reviewsRouter.route("/:review_id").get(getReviewByID).patch(patchReviewVotes).delete(deleteReviewByID);

reviewsRouter
  .route("/:review_id/comments")
  .get(getCommentsByReview)
  .post(postComment);

module.exports = reviewsRouter;
