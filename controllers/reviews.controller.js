const { fetchReviewByID } = require("../models/reviews.model");

exports.getReviewByID = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const review = await fetchReviewByID(review_id);
    res.status(200).send({ review });
  } catch (err) {
    next(err);
  }
};
