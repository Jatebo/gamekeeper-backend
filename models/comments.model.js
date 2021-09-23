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
