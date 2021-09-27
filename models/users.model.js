const db = require("../db/connection");

exports.fetchUsers = async () => {
  const result = await db.query(`SELECT username FROM users;`);
  return result.rows;
};

exports.fetchUserByUsername = async (username) => {
  const user = await db.query(`SELECT * FROM users WHERE username = $1`, [
    username,
  ]);
  const userQuery = await db.query("SELECT username FROM users");

  const validUsernames = userQuery.rows.map((user) => {
    return user.username;
  });

  if (Number(username)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  } else if (!validUsernames.includes(username)) {
    return Promise.reject({ status: 404, msg: "User not found" });
  } else {
    return user.rows[0];
  }
};
