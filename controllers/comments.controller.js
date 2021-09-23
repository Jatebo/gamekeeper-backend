const { fetchCommentsByReview } = require("../models/comments.model");

exports.getCommentsByReview = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const comments = await fetchCommentsByReview(review_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.postComment = async (req, res, next) => {
  console.log(req.body);
};
