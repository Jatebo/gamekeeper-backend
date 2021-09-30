const {
  fetchCategories,
  writeCategory,
} = require("../models/categories.model");

exports.getCategories = async (req, res, next) => {
  try {
    const result = await fetchCategories();
    res.status(200).send({ categories: result });
  } catch (err) {
    next(err);
  }
};

exports.postCategory = async (req, res, next) => {
  try {
    const category = await writeCategory(req.body);

    res.status(201).send({ category });
  } catch (err) {
    next(err);
  }
};
