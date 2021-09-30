const {
  fetchReviewByID,
  updateReviewVotesByID,
  fetchReviews,
  writeReview,
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
    const { sort_by, order, category, limit, p } = req.query;
    const { result, total_count } = await fetchReviews(
      sort_by,
      order,
      category,
      limit,
      p
    );
    res.status(200).send({ reviews: result, total_count });
  } catch (err) {
    next(err);
  }
};

exports.postReview = async (req, res, next) => {
  try {
    const newReview = await writeReview(req.body);
    res.status(201).send({
      review: newReview,
    });
  } catch (err) {
    next(err);
  }
};
