const db = require("../db/connection");

exports.fetchCategories = async () => {
  const result = await db.query(`SELECT * FROM categories;`);
  return result.rows;
};

exports.writeCategory = async (body) => {
  if (!body.slug || !body.description) {
    return Promise.reject({
      status: 400,
      msg: "Bad request - missing required field",
    });
  }

  const { slug, description } = body;

  const catQuery = await db.query(`SELECT slug FROM categories`);
  const existingCategories = catQuery.rows.map((cat) => {
    return cat.slug;
  });
  if (existingCategories.includes(slug)) {
    return Promise.reject({ status: 400, msg: "Bad request - category already exists" });
  }

  const result = await db.query(
    `INSERT INTO categories
      (slug, description)
      VALUES ($1, $2)
      RETURNING *;`,
    [slug, description]
  );

  return result.rows[0];
};
