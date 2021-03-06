const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/  - homepage", () => {
  describe("GET", () => {
    it("200: should display a welcome message when successfully connected to the API url", async () => {
      const res = await request(app).get("/");
      expect(200);
      expect(res.body.msg).toEqual("Connected to project-gamekeeper");
    });
    it("404: should respond with 404 not found for any endpoints not specified in /api", async () => {
      const res = await request(app).get("/ap");
      expect(404);
      expect(res.body.msg).toEqual("Page not found");
    });
  });
});
describe("/api", () => {
  describe("GET", () => {
    it("200: Responds with a JSON object describing all the available API endpoints", async () => {
      const testEndpoints = require("../endpoints.json");
      const res = await request(app).get("/api");
      expect(200);
      expect(res.body).toEqual(testEndpoints);
    });
  });
});
describe("/api/categories", () => {
  describe("GET", () => {
    it("200: responds with an array of category objects", async () => {
      const { body } = await request(app).get("/api/categories").expect(200);
      expect(body.categories).toHaveLength(4);
      body.categories.forEach((category) => {
        expect(category).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
    });
  });
  describe("POST- categories", () => {
    it("201: accepts an object containing owner, title, review_body, designer and category, and responds with the posted review (including review_id, votes, created_at and comment_count)", async () => {
      const res = await request(app).post("/api/categories").send({
        slug: "new-category",
        description: "category description here",
      });
      expect(201);
      expect(res.body.category).toMatchObject({
        slug: "new-category",
        description: "category description here",
      });
    });
    it("201: ignores irrelevant fields passed in the request body", async () => {
      let res = await request(app).post("/api/categories").send({
        slug: "new-category",
        description: "category description here",
        randomProperty: "whoops",
        other: "yes",
      });
      expect(201);
      expect(res.body.category).toMatchObject({
        slug: "new-category",
        description: "category description here",
      });
    });
    it("400: responds with bad request if the post is missing slug or description", async () => {
      const res = await request(app).post("/api/categories").send({
        owner: "dav3rid",
      });
      expect(400);
      expect(res.body.msg).toBe("Bad request - missing required field");
    });
    it("400: responds with bad request if user tries to add a category that already exists", async () => {
      const res = await request(app).post("/api/categories").send({
        slug: "dexterity",
        description: "category description here",
      });
      expect(400);
      expect(res.body.msg).toBe("Bad request - category already exists");
    });
  });
});
describe("/api/reviews", () => {
  describe("GET", () => {
    it("200: should respond with an array of review objects, using pagination with a default of 10 results per page", async () => {
      const res = await request(app).get("/api/reviews").expect(200);
      expect(res.body.reviews).toHaveLength(10);
      res.body.reviews.forEach((review) => {
        expect(review).toMatchObject({
          owner: expect.any(String),
          title: expect.any(String),
          review_id: expect.any(Number),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
        });
      });
      expect(res.body.total_count).toBe(13);
    });
    it.only("200: default sort_by is created_at date in descending order", async () => {
      const res = await request(app).get("/api/reviews").expect(200);
      const reviewObjects = res.body.reviews;
      expect(reviewObjects).toBeSortedBy("created_at", { descending: true });
      console.log(reviewObjects);
    });
    it("200: accepts queries to sort by any other valid column", async () => {
      const res = await request(app)
        .get("/api/reviews?sort_by=designer")
        .expect(200);
      const reviewObjects = res.body.reviews;
      expect(reviewObjects).toBeSortedBy("designer", { descending: true });
    });
    it("200: accepts queries input to sort by asc or desc if user specifies", async () => {
      const res = await request(app).get("/api/reviews?order=ASC").expect(200);
      const reviewObjects = res.body.reviews;
      expect(reviewObjects).toBeSortedBy("created_at");
    });
    it("200: accepts category queries", async () => {
      const res = await request(app)
        .get("/api/reviews?sort_by=designer&order=asc&category=dexterity")
        .expect(200);
      const reviewObjects = res.body.reviews;
      expect(reviewObjects).toHaveLength(1);
      reviewObjects.forEach((review) => {
        expect(review.category).toBe("dexterity");
      });
    });
    it("200: when passed a valid category with no reviews, responds with an empty array of reviews ", async () => {
      const res = await request(app)
        .get(`/api/reviews?category=children's games`)
        .expect(200);
      const reviewObjects = res.body.reviews;
      expect(reviewObjects).toHaveLength(0);
    });
    it("200: accepts user determined limits", async () => {
      const res = await request(app).get("/api/reviews?limit=5").expect(200);
      expect(res.body.reviews).toHaveLength(5);
    });
    it("200: accepts page input", async () => {
      const res = await request(app).get("/api/reviews?p=2").expect(200);
      expect(res.body.reviews).toHaveLength(3);
    });
    it("400: responds with a 400: Bad Request if an invalid column is used to sort by", async () => {
      const res = await request(app)
        .get("/api/reviews?sort_by=somethingInvalid")
        .expect(400);
      expect(res.body.msg).toBe(
        "Bad request - cannot sort by somethingInvalid"
      );
    });
    it("400: responds with a 400: Bad Request if an invalid sort order is used", async () => {
      const res = await request(app).get("/api/reviews?order=DESK").expect(400);
      expect(res.body.msg).toBe("Bad request - cannot order by DESK");
    });
    it("404: responds with a 404: Not Found if an invalid category is specified", async () => {
      const res = await request(app)
        .get("/api/reviews?category=bananas")
        .expect(404);
      expect(res.body.msg).toBe("Category 'bananas' not found");
    });
    it("400: responds with a 400: Bad Request if an invalid limit or page is input", async () => {
      let res = await request(app).get("/api/reviews?limit=;ten").expect(400);
      expect(res.body.msg).toBe("Limit and page must be numbers");
      res = await request(app).get("/api/reviews?p=;ten").expect(400);
      expect(res.body.msg).toBe("Limit and page must be numbers");
    });
  });
  describe("POST - reviews", () => {
    it("201: accepts an object containing owner, title, review_body, designer and category, and responds with the posted review (including review_id, votes, created_at and comment_count)", async () => {
      const res = await request(app).post("/api/reviews").send({
        owner: "dav3rid",
        title: "GRAFFITI- the Game: BEST GAME EVER",
        review_body:
          "Wow, this was such a great game, can't believe I'm the first person to review it!! I pushed my luck a bit too hard though, and got caught by the feds before I became famous",
        designer: "Banksy",
        category: "dexterity",
      });
      expect(201);
      expect(res.body.review).toMatchObject({
        owner: "dav3rid",
        title: "GRAFFITI- the Game: BEST GAME EVER",
        review_id: 14,
        review_body:
          "Wow, this was such a great game, can't believe I'm the first person to review it!! I pushed my luck a bit too hard though, and got caught by the feds before I became famous",
        designer: "Banksy",
        review_img_url: `https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg`,
        category: "dexterity",
        created_at: expect.any(String),
        votes: 0,
        comment_count: "0",
      });
    });
    it("404: responds with not found if the username or category is incorrect ", async () => {
      let res = await request(app).post("/api/reviews").send({
        owner: "dave",
        title: "GRAFITTI- the Game: BEST GAME EVER",
        review_body:
          "Wow, this was such a great game, can't believe I'm the first person to review it!! I pushed my luck a bit too hard though, and got caught by the feds before I became famous",
        designer: "Banksy",
        category: "dexterity",
      });
      expect(404);
      expect(res.body.msg).toBe("User/Owner not found");

      res = await request(app).post("/api/reviews").send({
        owner: "dav3rid",
        title: "GRAFITTI- the Game: BEST GAME EVER",
        review_body:
          "Wow, this was such a great game, can't believe I'm the first person to review it!! I pushed my luck a bit too hard though, and got caught by the feds before I became famous",
        designer: "Banksy",
        category: "random-category",
      });
      expect(404);
      expect(res.body.msg).toBe("Category not found");
    });
    it("400: responds with bad request if the post is missing owner, title, designer, category or review_body", async () => {
      const res = await request(app).post("/api/reviews").send({
        owner: "dav3rid",
      });
      expect(400);
      expect(res.body.msg).toBe("Bad request - missing required field");
    });
  });
});
describe("/api/reviews/:review_id", () => {
  describe("GET", () => {
    it("200: responds with a review object with properties owner, title, review_id, review_body,designer,review_img_url, category, created_at,votes, and comment_count", async () => {
      const res = await request(app).get("/api/reviews/2").expect(200);
      expect(res.body.review).toMatchObject({
        owner: expect.any(String),
        title: expect.any(String),
        review_id: expect.any(Number),
        review_body: expect.any(String),
        designer: expect.any(String),
        review_img_url: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        comment_count: expect.any(String),
      });
    });
    it("404: responds with a 404 when the requested review id does not exist in the table", async () => {
      const res = await request(app).get("/api/reviews/2255").expect(404);
      expect(res.body.msg).toBe("Review not found");
    });
  });
  describe("PATCH", () => {
    it("200: when passed an object to increment/decrement the votes count, adjusts the votes accordingly and responds with the updated review", async () => {
      const originalReview = await request(app).get("/api/reviews/1");
      const ogVotes = originalReview.body.review.votes;
      const votesToInc = { inc_votes: 5 };
      const res = await request(app)
        .patch("/api/reviews/1")
        .send(votesToInc)
        .expect(200);
      expect(res.body.updatedReview).toMatchObject({
        owner: expect.any(String),
        title: expect.any(String),
        review_id: expect.any(Number),
        review_body: expect.any(String),
        designer: expect.any(String),
        review_img_url: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
      });
      expect(res.body.updatedReview.votes).toBe(votesToInc.inc_votes + ogVotes);
    });
    it('400: when patch method sends an invalid object, responds with a 400 error and message "Bad request"', async () => {
      const res = await request(app)
        .patch("/api/reviews/1")
        .send({ inc_votes: "Not a number" })
        .expect(400);
      expect(res.body.msg).toBe("Bad request");
    });
    it("400: responds with a 400 if the requested review_id is not a number ", async () => {
      const res = await request(app)
        .patch("/api/reviews/two")
        .send({ inc_votes: 5 })
        .expect(400);
      expect(res.body.msg).toBe("Bad request");
    });
    it("404: responds with a 404 when the requested review id does not exist in the table", async () => {
      const res = await request(app)
        .patch("/api/reviews/11234")
        .send({ inc_votes: 5 })
        .expect(404);
      expect(res.body.msg).toBe("Review not found");
    });
  });
  describe("DELETE", () => {
    it("204: deletes the review by review ID provided in the path", async () => {
      const res = await request(app).delete("/api/reviews/2").expect(204);
    });
    it("204: deletes the comments associated with the review ID provided in the path", async () => {
      const res = await request(app).delete("/api/reviews/2").expect(204);
      const commentQuery = await db.query(
        `SELECT * FROM comments WHERE review_id = 2;`
      );
      expect(commentQuery.rows).toHaveLength(0);
    });
    it("400: responds with a 400 error if the review_id is an invalid input type", async () => {
      const res = await request(app).delete("/api/reviews/two").expect(400);
      expect(res.body.msg).toBe("Bad request");
    });
    it("404: responds with a 404 error if the requested review ID does not exist", async () => {
      const res = await request(app).delete("/api/reviews/12423").expect(404);
      expect(res.body.msg).toBe("Not found");
    });
  });
});
describe("/api/reviews/:review_id/comments", () => {
  describe("GET", () => {
    it("200: responds with an array of comment objects for the provided review id, which have properties comment_id, votes, created_at, author and body", async () => {
      const res = await request(app).get("/api/reviews/2/comments").expect(200);
      expect(res.body.comments).toHaveLength(3);
      res.body.comments.forEach((comment) => {
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        });
      });
    });
    it("200: responds with an empty array if the requested review exists but has no comments", async () => {
      const res = await request(app).get("/api/reviews/1/comments").expect(200);
      expect(res.body.comments).toHaveLength(0);
    });
    it("200: accepts limit and page input for pagination, defaulting to a limit of 10 comments", async () => {
      let res = await request(app)
        .get("/api/reviews/2/comments?limit=1")
        .expect(200);
      expect(res.body.comments).toHaveLength(1);
      res = await request(app)
        .get("/api/reviews/2/comments?limit=2&p=2")
        .expect(200);
      expect(res.body.comments).toHaveLength(1);
    });
    it("400: responds with a 400 if the requested review_id is not a number ", async () => {
      const res = await request(app)
        .get("/api/reviews/two/comments")
        .expect(400);
      expect(res.body.msg).toBe("Bad request");
    });
    it("404: responds with a 404 if the requested review_id does not exist in the table", async () => {
      const res = await request(app)
        .get("/api/reviews/12523/comments")
        .expect(404);
      expect(res.body.msg).toBe("Review not found");
    });
    it("400: responds with a 400: Bad Request if an invalid limit or page is input", async () => {
      let res = await request(app)
        .get("/api/reviews/2/comments?limit=;one")
        .expect(400);
      expect(res.body.msg).toBe("Limit and page must be numbers");
      res = await request(app)
        .get("/api/reviews/2/comments?limit=1&p=;two")
        .expect(400);
      expect(res.body.msg).toBe("Limit and page must be numbers");
    });
  });
  describe("POST", () => {
    it("201: accepts an object containing username and body, and responds with the posted comment", async () => {
      const res = await request(app).post("/api/reviews/1/comments").send({
        username: "dav3rid",
        body: "Wow, this was such a great game review, can't believe I'm the first person to comment on it!!",
      });
      expect(201);
      expect(res.body.comment).toMatchObject({
        comment_id: expect.any(Number),
        author: expect.any(String),
        review_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        body: expect.any(String),
      });
    });
    it("404: responds with not found if the username is does not exist in the database ", async () => {
      const res = await request(app).post("/api/reviews/1/comments").send({
        username: "dav3",
        body: "Wow, this was such a great game, can't believe I'm the first person to review it!!",
      });
      expect(404);
      expect(res.body.msg).toBe("User not found");
    });
    it("400: responds with bad request if the post is missing username or comment body", async () => {
      const res = await request(app).post("/api/reviews/1/comments").send({
        username: "dav3rid",
      });
      expect(400);
      expect(res.body.msg).toBe("Bad request - missing required field");
    });
    it("404: responds with a 404 if the requested review_id does not exist in the database", async () => {
      const res = await request(app)
        .post("/api/reviews/1121234/comments")
        .send({
          username: "dav3rid",
          body: "Wow, this was such a great game, can't believe I'm the first person to review it!!",
        });
      expect(400);
      expect(res.body.msg).toBe("Bad request");
    });
  });
});
describe("/api/comments/:comment_id", () => {
  describe("DELETE", () => {
    it("204: deletes the comment by comment ID provided in the path", async () => {
      const res = await request(app).delete("/api/comments/2").expect(204);
    });
    it("400: responds with a 400 error if the comment_id is an invalid input type", async () => {
      const res = await request(app).delete("/api/comments/two").expect(400);
      expect(res.body.msg).toBe("Bad request");
    });
    it("404: responds with a 404 error if the requested comment ID does not exist", async () => {
      const res = await request(app).delete("/api/comments/12423").expect(404);
      expect(res.body.msg).toBe("Not found");
    });
  });
  describe("PATCH", () => {
    it("200: when passed an object to increment/decrement the votes count, adjusts the votes accordingly and responds with the updated review", async () => {
      const commentQry = await db.query(
        `select * from comments where comment_id = 1`
      );
      const originalComment = commentQry.rows[0];
      const ogVotes = originalComment.votes;
      const votesToInc = { inc_votes: 5 };
      const res = await request(app)
        .patch("/api/comments/1")
        .send(votesToInc)
        .expect(200);
      expect(res.body.updatedComment).toMatchObject({
        comment_id: expect.any(Number),
        votes: expect.any(Number),
        created_at: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
      });
      expect(res.body.updatedComment.votes).toBe(
        votesToInc.inc_votes + ogVotes
      );
    });
    it('400: when patch method sends an invalid object, responds with a 400 error and message "Bad request"', async () => {
      const res = await request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "Not a number" })
        .expect(400);
      expect(res.body.msg).toBe("Bad request");
    });
    it("400: responds with a 400 if the requested comment_id is not a number ", async () => {
      const res = await request(app)
        .patch("/api/comments/One")
        .send({ inc_votes: 5 })
        .expect(400);
      expect(res.body.msg).toBe("Bad request");
    });
    it("404: responds with a 404 when the requested comment id does not exist in the table", async () => {
      const res = await request(app)
        .patch("/api/comments/11234")
        .send({ inc_votes: 5 })
        .expect(404);
      expect(res.body.msg).toBe("Comment not found");
    });
  });
});
describe("/api/users", () => {
  describe("GET", () => {
    it("200: responds with an array of objects, each object having a username property", async () => {
      const res = await request(app).get("/api/users").expect(200);
      expect(res.body.users).toHaveLength(4);
      res.body.users.forEach((user) => {
        expect(user).toMatchObject({
          username: expect.any(String),
        });
      });
    });
  });
});
describe("/api/user/:username", () => {
  describe("GET", () => {
    it("200: responds with a user object with the properties username, avatar URL and name", async () => {
      const res = await request(app).get("/api/users/mallionaire").expect(200);
      expect(res.body.user).toMatchObject({
        username: expect.any(String),
        avatar_url: expect.any(String),
        name: expect.any(String),
      });
    });
    it("400: responds with a 400 bad request when requested username is invalid", async () => {
      const res = await request(app).get("/api/users/15").expect(400);
      expect(res.body.msg).toBe("Bad request");
    });
    it("404: responds with a 404 if the requested username is non existent", async () => {
      const res = await request(app).get("/api/users/mrUser0ne").expect(404);
      expect(res.body.msg).toBe("User not found");
    });
  });
});
