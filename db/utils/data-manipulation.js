// extract any functions you are using to manipulate your data, into this file

exports.formatCategories = (data) => {
  return data.map((item) => {
    return [item.slug, item.description];
  });
};

exports.formatUserData = (data) => {
  return data.map((item) => {
    return [item.username, item.avatar_url, item.name];
  });
};

exports.formatReviewData = (data) => {}