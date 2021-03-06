const {
  formatCategories,
  formatUserData,
  formatReviewData,
  formatCommentData,
} = require("../db/utils/data-manipulation.js");

describe("formatCategories", () => {
  test("it returns an array of arrays when passed an array of objects", () => {
    const testInput = [
      {
        slug: "euro game",
        description: "Abstact games that involve little luck",
      },
      {
        slug: "social deduction",
        description: "Players attempt to uncover each other's hidden role",
      },
      { slug: "dexterity", description: "Games involving physical skill" },
      { slug: "children's games", description: "Games suitable for children" },
    ];
    const expectedOutput = [
      ["euro game", "Abstact games that involve little luck"],
      [
        "social deduction",
        "Players attempt to uncover each other's hidden role",
      ],
      ["dexterity", "Games involving physical skill"],
      ["children's games", "Games suitable for children"],
    ];
    expect(formatCategories(testInput)).toEqual(expectedOutput);
  });
  test("the returned array is a different memory reference ", () => {
    const testInput = [
      {
        slug: "euro game",
        description: "Abstact games that involve little luck",
      },
      {
        slug: "social deduction",
        description: "Players attempt to uncover each other's hidden role",
      },
      { slug: "dexterity", description: "Games involving physical skill" },
      { slug: "children's games", description: "Games suitable for children" },
    ];
    expect(formatCategories(testInput)).not.toBe(testInput);
  });
  test("the original input is not mutated", () => {
    const testInput = [
      {
        slug: "euro game",
        description: "Abstact games that involve little luck",
      },
      {
        slug: "social deduction",
        description: "Players attempt to uncover each other's hidden role",
      },
      { slug: "dexterity", description: "Games involving physical skill" },
      { slug: "children's games", description: "Games suitable for children" },
    ];
    formatCategories(testInput);
    expect(testInput).toEqual([
      {
        slug: "euro game",
        description: "Abstact games that involve little luck",
      },
      {
        slug: "social deduction",
        description: "Players attempt to uncover each other's hidden role",
      },
      { slug: "dexterity", description: "Games involving physical skill" },
      { slug: "children's games", description: "Games suitable for children" },
    ]);
  });
});

describe("formatUserData", () => {
  test("it returns an array of arrays when passed an array of objects", () => {
    const testInput = [
      {
        username: "mallionaire",
        name: "haz",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "philippaclaire9",
        name: "philippa",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ];

    const expectedOutput = [
      [
        "mallionaire",
        "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        "haz",
      ],
      [
        "philippaclaire9",
        "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        "philippa",
      ],
    ];
    expect(formatUserData(testInput)).toEqual(expectedOutput);
  });
  test("the returned array is a different memory reference", () => {
    const testInput = [
      {
        username: "mallionaire",
        name: "haz",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "philippaclaire9",
        name: "philippa",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ];
    expect(formatUserData(testInput)).not.toBe(testInput);
  });
  test("the input array is not mutated", () => {
    const testInput = [
      {
        username: "mallionaire",
        name: "haz",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "philippaclaire9",
        name: "philippa",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ];
    formatUserData(testInput);
    expect(testInput).toEqual([
      {
        username: "mallionaire",
        name: "haz",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      },
      {
        username: "philippaclaire9",
        name: "philippa",
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
      },
    ]);
  });
});

describe("formatReviewData", () => {
  test("takes and array of objects and returns an array of arrays, presenting the property values in the order needed to insert into the database", () => {
    const testInput = [
      {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: new Date(1610964020514),
        votes: 1,
      },
      {
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: new Date(1610964101251),
        votes: 5,
      },
      {
        title: "Ultimate Werewolf",
        designer: "Akihisa Okui",
        owner: "bainesface",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "We couldn't find the werewolf!",
        category: "social deduction",
        created_at: new Date(1610964101251),
        votes: 5,
      },
    ];
    const expectedOutput = [
      [
        "Agricola",
        "Farmyard fun!",
        "Uwe Rosenberg",
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        1,
        "euro game",
        "mallionaire",
        new Date(1610964020514),
      ],
      [
        "Jenga",
        "Fiddly fun for all the family",
        "Leslie Scott",
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        5,
        "dexterity",
        "philippaclaire9",
        new Date(1610964101251),
      ],
      [
        "Ultimate Werewolf",
        "We couldn't find the werewolf!",
        "Akihisa Okui",
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        5,
        "social deduction",
        "bainesface",
        new Date(1610964101251),
      ],
    ];
    expect(formatReviewData(testInput)).toEqual(expectedOutput);
  });
  test("should return a new array", () => {
    const testInput = [
      {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: new Date(1610964020514),
        votes: 1,
      },
      {
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: new Date(1610964101251),
        votes: 5,
      },
      {
        title: "Ultimate Werewolf",
        designer: "Akihisa Okui",
        owner: "bainesface",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "We couldn't find the werewolf!",
        category: "social deduction",
        created_at: new Date(1610964101251),
        votes: 5,
      },
    ];
    expect(formatReviewData(testInput)).not.toBe(testInput);
  });
  test("should not mutate the original array", () => {
    const testInput = [
      {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: new Date(1610964020514),
        votes: 1,
      },
      {
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: new Date(1610964101251),
        votes: 5,
      },
      {
        title: "Ultimate Werewolf",
        designer: "Akihisa Okui",
        owner: "bainesface",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "We couldn't find the werewolf!",
        category: "social deduction",
        created_at: new Date(1610964101251),
        votes: 5,
      },
    ];
    formatReviewData(testInput);
    expect(testInput).toEqual([
      {
        title: "Agricola",
        designer: "Uwe Rosenberg",
        owner: "mallionaire",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Farmyard fun!",
        category: "euro game",
        created_at: new Date(1610964020514),
        votes: 1,
      },
      {
        title: "Jenga",
        designer: "Leslie Scott",
        owner: "philippaclaire9",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "Fiddly fun for all the family",
        category: "dexterity",
        created_at: new Date(1610964101251),
        votes: 5,
      },
      {
        title: "Ultimate Werewolf",
        designer: "Akihisa Okui",
        owner: "bainesface",
        review_img_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        review_body: "We couldn't find the werewolf!",
        category: "social deduction",
        created_at: new Date(1610964101251),
        votes: 5,
      },
    ]);
  });
});

describe("formatCommentData", () => {
  test("should take an array of comment objects, and return an array of inputtable comment info in the order [author, review_id, votes, created_at, body]", () => {
    const testInput = [
      {
        body: "I loved this game too!",
        votes: 16,
        author: "bainesface",
        review_id: 2,
        created_at: new Date(1511354613389),
      },
      {
        body: "My dog loved this game too!",
        votes: 13,
        author: "mallionaire",
        review_id: 3,
        created_at: new Date(1610964545410),
      },
    ];
    const expectedOutput = [
      ["bainesface", 2, 16, new Date(1511354613389), "I loved this game too!"],
      [
        "mallionaire",
        3,
        13,
        new Date(1610964545410),
        "My dog loved this game too!",
      ],
    ];
    expect(formatCommentData(testInput)).toEqual(expectedOutput);
  });
  test("should return a new array", () => {
    const testInput = [
      {
        body: "I loved this game too!",
        votes: 16,
        author: "bainesface",
        review_id: 2,
        created_at: new Date(1511354613389),
      },
      {
        body: "My dog loved this game too!",
        votes: 13,
        author: "mallionaire",
        review_id: 3,
        created_at: new Date(1610964545410),
      },
    ];
    expect(formatCommentData(testInput)).not.toBe(testInput);
  });
  test("should not manipulate the original input array", () => {
    const testInput = [
      {
        body: "I loved this game too!",
        votes: 16,
        author: "bainesface",
        review_id: 2,
        created_at: new Date(1511354613389),
      },
      {
        body: "My dog loved this game too!",
        votes: 13,
        author: "mallionaire",
        review_id: 3,
        created_at: new Date(1610964545410),
      },
    ];
    formatCommentData(testInput);
    expect(testInput).toEqual([
      {
        author: "bainesface",
        review_id: 2,
        votes: 16,
        created_at: new Date(1511354613389),
        body: "I loved this game too!",
      },
      {
        author: "mallionaire",
        review_id: 3,
        votes: 13,
        created_at: new Date(1610964545410),
        body: "My dog loved this game too!",
      },
    ]);
  });
});
