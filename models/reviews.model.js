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

exports.updateReviewVotesByID = async (review_id, votes) => {
  if (typeof votes !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  const result = await db.query(
    `UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *;`,
    [review_id, votes]
  );
  if (result.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Review not found" });
  }
  return result.rows[0];
};

exports.fetchReviews = async (
  sort_by = "created_at",
  order = "DESC",
  filter_by
) => {
  const validColumns = [
    "review_id",
    "title",
    "review_body",
    "designer",
    "review_img_url",
    "votes",
    "category",
    "owner",
    "created_at",
    "comment_count",
  ];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - cannot sort by " + sort_by,
    });
  }

  const validOrders = ["ASC", "DESC"];

  if (!validOrders.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: `Bad request - cannot order by ${order}`,
    });
  }

  let reviewQueryStr = ` SELECT reviews.*,  COUNT(comments.review_id) AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON  comments.review_id = reviews.review_id`;

  const catQuery = await db.query("SELECT slug FROM categories");

  const validCategories = catQuery.rows.map((category) => {
    return category.slug;
  });
  const queryValues = [];
  // console.log(validCategories);
  if (filter_by) {
    if (!validCategories.includes(filter_by)) {
      return Promise.reject({
        status: 400,
        msg: `Bad request - cannot filter by ${filter_by}`,
      });
    } else {
      queryValues.push(filter_by);
      reviewQueryStr += ` WHERE reviews.category = $1`;
    }
  }

  reviewQueryStr += ` GROUP BY reviews.review_id
      ORDER BY ${sort_by} ${order}`;

  const result = await db.query(reviewQueryStr, queryValues);
  return result.rows;
};
