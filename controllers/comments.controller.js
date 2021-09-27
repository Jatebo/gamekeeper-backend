const {
  fetchCommentsByReview,
  writeComment,
  wipeComment,
  updateCommentVotesByID,
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

exports.deleteCommentByID = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const result = await wipeComment(comment_id);
    res.status(204).send();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.patchCommentByID = async (req, res, next) => {
  try {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    const updatedComment = await updateCommentVotesByID(comment_id, inc_votes);
    res.status(200).send({ updatedComment });
  } catch (err) {
    next(err);
  }
};
