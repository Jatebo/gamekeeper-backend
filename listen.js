const app = require("./app.js");

const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server is listening on port ${PORT}...`);
});
