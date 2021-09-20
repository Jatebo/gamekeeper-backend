// extract any functions you are using to manipulate your data, into this file

exports.formatCategories = (data) => {
  return data.map((item) => {
    return [item.slug, item.description];
  });
};
