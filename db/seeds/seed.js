const format = require("pg-format");
const db = require("../connection.js");

const { formatCategories } = require("../utils/data-manipulation.js");

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
      `INSERT INTO users (username, avatar_url, name )VALUES %L RETURNING *;`,
      formattedUserData
    );
    await db.query(userStr);
  };

  
  // const insertReviewData = db.query();
  // {
  //   title: "Settlers of Catan: Don't Settle For Less",
  //   designer: 'Klaus Teuber',
  //   owner: 'mallionaire',
  //   review_img_url:
  //     'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
  //   review_body:
  //     'You have stumbled across an uncharted island rich in natural resources, but you are not alone; other adventurers have come ashore too, and the race to settle the island of Catan has begun! Whether you exert military force, build a road to rival the Great Wall, trade goods with ships from the outside world, or some combination of all three, the aim is the same: to dominate the island. Will you prevail? Proceed strategically, trade wisely, and may the odds be in favour.',
  //   category: 'social deduction',
  //   created_at: new Date(788918400),
  //   votes: 16
  // }

  // const insertCommentData = db.query();
  // {
  //   body: 'I loved this game too!',
  //   votes: 16,
  //   author: 'bainesface',
  //   review_id: 2,
  //   created_at: new Date(1511354613389),
  // }

  const seedPromises = [
    dropTables,
    createCategoriesTable,
    createUsersTable,
    createReviewsTable,
    createCommentsTable,
    insertCategoryData,
    insertUserData,
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
