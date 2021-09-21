const { fetchCategories } = require("../models/categories.model");

exports.getCategories = async (req, res, next) => {
  try {
    const result = await fetchCategories();
    res.status(200).send({ categories: result });
  } catch (err) {
    console.log(err);
  }
};
