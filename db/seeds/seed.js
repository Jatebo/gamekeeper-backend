const format = require("pg-format");
const db = require("../connection.js");

const {
  formatCategories,
  formatUserData,
  formatReviewData,
  formatCommentData,
} = require("../utils/data-manipulation.js");

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;

  await db.query(`DROP TABLE IF EXISTS comments, reviews, users, categories;`);

  await db.query(
    `CREATE TABLE categories (slug VARCHAR(50) PRIMARY KEY, description VARCHAR(200) NOT NULL);`
  );

  await db.query(
    `CREATE TABLE users (username VARCHAR(50) PRIMARY KEY, avatar_url TEXT, name VARCHAR(50) NOT NULL);`
  );

  await db.query(
    `CREATE TABLE reviews (review_id SERIAL PRIMARY KEY, title VARCHAR(100) NOT NULL, review_body TEXT, designer VARCHAR(50) NOT NULL, review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg', votes INT DEFAULT 0, category VARCHAR(50) REFERENCES categories(slug), owner VARCHAR(50) REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );`
  );

  await db.query(
    `CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, author VARCHAR(50) REFERENCES users(username), review_id INT REFERENCES reviews(review_id) ON DELETE CASCADE, votes INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, body TEXT );`
  );

  const insertCategoryData = async (categoryData) => {
    const formattedCategoryData = formatCategories(categoryData);
    const categoryStr = format(
      `INSERT INTO categories (slug, description) VALUES %L RETURNING *;`,
      formattedCategoryData
    );
    await db.query(categoryStr);
  };

  const insertUserData = async (userData) => {
    const formattedUserData = formatUserData(userData);
    const userStr = format(
      `INSERT INTO users (username, avatar_url, name) VALUES %L RETURNING *;`,
      formattedUserData
    );
    await db.query(userStr);
  };

  const insertReviewData = async (reviewData) => {
    const formattedReviewData = formatReviewData(reviewData);
    const reviewStr = format(
      `INSERT INTO reviews (title, review_body, designer, review_img_url, votes, category, owner, created_at) VALUES %L RETURNING *;`,
      formattedReviewData
    );
    await db.query(reviewStr);
  };

  const insertCommentData = async (commentData) => {
    const formattedCommentData = formatCommentData(commentData);
    const commentStr = format(
      `INSERT INTO comments (author, review_id, votes, created_at, body) VALUES %L RETURNING * ;`,
      formattedCommentData
    );
    await db.query(commentStr);
  };

  await insertCategoryData(categoryData);
  await insertUserData(userData);
  await insertReviewData(reviewData);
  await insertCommentData(commentData);
};

module.exports = { seed };
