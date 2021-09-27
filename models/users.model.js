const db = require("../db/connection");

exports.fetchUsers = async () => {
  const result = await db.query(`SELECT username FROM users;`);
  return result.rows;
};

exports.fetchUserByUsername = async (username) => {
  const user = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  if (Number(username) || typeof username === "undefined") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else if (user.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "User not found" });
  } else {
    return user.rows[0];
  }
};
