const {
  fetchCommentsByReview,
  writeComment,
} = require("../models/comments.model");

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
  try {
    const body = req.body;
    const { review_id } = req.params;
    const comment = await writeComment(review_id, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};
