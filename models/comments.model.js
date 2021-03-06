const db = require("../db/connection");

exports.fetchCommentsByReview = async (review_id, limit = 10, p = 1) => {
  if (!Number(limit) || !Number(p)) {
    return Promise.reject({
      status: 400,
      msg: `Limit and page must be numbers`,
    });
  }

  const offset = (p - 1) * limit;

  const result = await db.query(
    `SELECT comment_id, votes, created_at, author, body
     FROM comments
     WHERE review_id = $1
     ORDER BY votes DESC
     LIMIT $2 OFFSET $3;`,
    [review_id, limit, offset]
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
  if (!body.body || !body.username) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - missing required field",
    });
  }
  const { username, body: commentBody } = body;

  const userQuery = await db.query(`SELECT username FROM users`);
  const validUsers = userQuery.rows.map((user) => {
    return user.username;
  });

  if (!validUsers.includes(username)) {
    return Promise.reject({ status: 404, msg: "User not found" });
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
