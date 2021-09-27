const {
  fetchReviewByID,
  updateReviewVotesByID,
  fetchReviews,
} = require("../models/reviews.model");

exports.getReviewByID = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const review = await fetchReviewByID(review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};

exports.patchReviewVotes = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    const updatedReview = await updateReviewVotesByID(review_id, inc_votes);
    res.status(200).send({ updatedReview });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const { sort_by, order, category } = req.query;
    const result = await fetchReviews(sort_by, order, category);
    res.status(200).send({ reviews: result });
  } catch (err) {
    next(err);
  }
};
