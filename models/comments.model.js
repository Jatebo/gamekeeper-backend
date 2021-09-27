const db = require("../db/connection");

exports.fetchCommentsByReview = async (review_id) => {
  const result = await db.query(
    `SELECT comment_id, votes, created_at, author, body
     FROM comments
     WHERE review_id = $1;`,
    [review_id]
  );

  const reviewQuery = await db.query(`SELECT review_id FROM reviews`);
  const validReviews = reviewQuery.rows.map((review) => {
    return review.review_id;
  });

  if (validReviews.includes(Number(review_id))) {
    return result.rows;
  } else {
    return Promise.reject({ status: 404, msg: "Review not found" });
  }
};

exports.writeComment = async (review_id, body) => {
  const { username, body: commentBody } = body;

  if (typeof commentBody !== "string") {
    return Promise.reject({
      status: 400,
      msg: "Bad request - comment must be in text format",
    });
  }

  const result = await db.query(
    `INSERT INTO comments
    (review_id, body, author)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [review_id, commentBody, username]
  );
  return result.rows[0];
};

exports.wipeComment = async (review_id) => {
  const result = await db.query(
    `DELETE from comments
    where comment_id = $1
    returning *;`,
    [review_id]
  );

  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Not found" });
  }

  return result.rows;
};

exports.updateCommentVotesByID = async (comment_id, votes) => {
  if (typeof votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  const result = await db.query(
    `UPDATE comments SET votes = votes + $2 WHERE comment_id = $1 RETURNING *;`,
    [comment_id, votes]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Comment not found" });
  }
  return result.rows[0];
};
