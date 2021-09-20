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

exports.formatReviewData = (data) => {
  return data.map((item) => {
    return [
      item.title,
      item.review_body,
      item.designer,
      item.review_img_url,
      item.votes,
      item.category,
      item.owner,
      item.created_at,
    ];
  });
};
