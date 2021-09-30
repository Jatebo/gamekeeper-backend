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
  category,
  limit = 10,
  p = 1
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

  if (!validOrders.includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      msg: `Bad request - cannot order by ${order}`,
    });
  }

  let reviewQueryStr = ` SELECT reviews.*,  COUNT(comments.review_id) AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON  comments.review_id = reviews.review_id
      `;

  const catQuery = await db.query("SELECT slug FROM categories");

  const validCategories = catQuery.rows.map((category) => {
    return category.slug;
  });

  const queryValues = [];

  if (category) {
    if (!validCategories.includes(category)) {
      return Promise.reject({
        status: 404,
        msg: `Category '${category}' not found`,
      });
    } else {
      queryValues.push(category);
      reviewQueryStr += ` WHERE reviews.category = $1`;
    }
  }

  if (!Number(limit) || !Number(p)) {
    return Promise.reject({
      status: 400,
      msg: `Limit and page must be numbers`,
    });
  }
  const offset = (p - 1) * limit;

  const totalReviews = await db.query(`SELECT Count(review_id) FROM reviews;`);

  reviewQueryStr += ` GROUP BY reviews.review_id
      ORDER BY ${sort_by} ${order}
      LIMIT ${limit} OFFSET ${offset}`;

  const result = await db.query(reviewQueryStr, queryValues);
  const reviewsAndTotal = {};
  reviewsAndTotal.result = result.rows;
  reviewsAndTotal.total_count = Number(totalReviews.rows[0].count);
  return reviewsAndTotal;
};

exports.writeReview = async (body) => {
  if (
    !body.review_body ||
    !body.owner ||
    !body.title ||
    !body.designer ||
    !body.category
  ) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - missing required field",
    });
  }
  const { owner, title, review_body, designer, category } = body;

  const userQuery = await db.query(`SELECT username FROM users`);
  const validUsers = userQuery.rows.map((user) => {
    return user.username;
  });

  if (!validUsers.includes(owner)) {
    return Promise.reject({ status: 404, msg: "User/Owner not found" });
  }

  const catQuery = await db.query(`SELECT slug FROM categories`);
  const validCategories = catQuery.rows.map((cat) => {
    return cat.slug;
  });
  if (!validCategories.includes(category)) {
    return Promise.reject({ status: 404, msg: "Category not found" });
  }

  const result = await db.query(
    `INSERT INTO reviews
      (owner, title, review_body, designer, category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;`,
    [owner, title, review_body, designer, category]
  );

  const newReview = await db.query(
    `SELECT
  reviews.*,
  COUNT(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON  comments.review_id = reviews.review_id
  WHERE reviews.review_id = $1
  GROUP BY reviews.review_id;`,
    [result.rows[0].review_id]
  );
  return newReview.rows[0];
};
