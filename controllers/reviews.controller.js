const {
  fetchReviewByID,
  updateVotesByID,
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
    // console.log(review_id);
    // console.log(inc_votes);
    const updatedReview = await updateVotesByID(review_id, inc_votes);
    res.status(200).send({ updatedReview });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const result = await fetchReviews();
    // console.log(result, "<---- reviews in the controller");
    res.status(200).send({ reviews: result });
  } catch (err) {
    next(err);
  }
};
