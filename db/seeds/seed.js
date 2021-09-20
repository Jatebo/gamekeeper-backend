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
  // 1. create tables categories, users, reviews, comments
  const dropTables = async () => {
    await db.query(
      `DROP TABLE IF EXISTS categories, reviews, users, comments;`
    );
  };
  const createCategoriesTable = async () => {
    await db.query(
      `CREATE TABLE categories (slug VARCHAR(50) PRIMARY KEY NOT NULL, description VARCHAR(200) NOT NULL);`
    );
  };
  const createUsersTable = async () => {
    await db.query(
      `CREATE TABLE users (username VARCHAR(50) PRIMARY KEY NOT NULL, avatar_url TEXT, name VARCHAR(50) NOT NULL);`
    );
  };
  const createReviewsTable = async () => {
    await db.query(
      `CREATE TABLE reviews (review_id SERIAL PRIMARY KEY, title VARCHAR(100) NOT NULL, review_body TEXT, designer VARCHAR(50) NOT NULL, review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg', votes INT DEFAULT 0, category VARCHAR(50) REFERENCES categories(slug), owner VARCHAR(50) REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );`
    );
  };
  const createCommentsTable = async () => {
    await db.query(
      `CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, author VARCHAR(50) REFERENCES users(username), review_id INT REFERENCES reviews(review_id), votes INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, body TEXT );`
    );
  };

  // 2. insert categoryData, userData, reviewData, commentData
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

  const seedPromises = [
    dropTables,
    createCategoriesTable,
    createUsersTable,
    createReviewsTable,
    createCommentsTable,
    insertCategoryData,
    insertUserData,
    insertReviewData,
    insertCommentData,
  ];
  await Promise.all(seedPromises);
};

module.exports = seed;

/*

        Promises way to drop & create tables:
        return db
          .query(`DROP TABLE IF EXISTS categories, reviews, users, comments;`)
          .then(() => {
            return db.query(
              `CREATE TABLE categories (slug VARCHAR(50) PRIMARY KEY NOT NULL, description VARCHAR(200) NOT NULL);`
            );
          })
          .then(() => {
            return db.query(
              `CREATE TABLE users (username VARCHAR(50) PRIMARY KEY NOT NULL, avatar_url TEXT, name VARCHAR(50) NOT NULL);`
            );
          })
          .then(() => {
            return db.query(
              `CREATE TABLE reviews (review_id SERIAL PRIMARY KEY, title VARCHAR(100) NOT NULL, review_body TEXT, designer VARCHAR(50) NOT NULL, review_img_url TEXT DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg', votes INT DEFAULT 0, category VARCHAR(50) REFERENCES categories(slug), owner VARCHAR(50) REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP );`
            );
          })
          .then(() => {
            return db.query(
              `CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, author VARCHAR(50) REFERENCES users(username), review_id INT REFERENCES reviews(review_id), votes INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, body TEXT );`
            );
          })
          .catch((err) => {
            console.log(err);
          });
          */
