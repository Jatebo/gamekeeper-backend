const db = require("../db/connection");

exports.fetchReviewByID = async (review_id) => {
  const result = await db.query(
    `SELECT
    reviews.*,
    COUNT(comments.review_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON  comments.review_id = reviews.review_id
    WHERE reviews.review_id = $1
    GROUP BY reviews.review_id;`,
    [review_id]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Review not found" });
  }
  return result.rows[0];
};

exports.updateVotesByID = async (review_id, votes) => {
  const result = await db.query(
    `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`,
    [review_id, votes]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Review not found" });
  }
  return result.rows[0];
};

// exports.fetchReviewByID = async (review_id) => {
//   const resultReviews = await db.query(
//     `SELECT *
//     FROM reviews
//     WHERE review_id = $1;`,
//     [review_id]
//   );
//   const resultComments = await db.query(
//     `SELECT *
//   FROM comments
//   WHERE review_id = $1;`,
//     [review_id]
//   );
//   console.log(resultReviews.rows[0], "<--- reviews console log");
//   console.log(resultComments.rows, "<--- comments console log");
//   return resultReviews.rows[0];
// };
