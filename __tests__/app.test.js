const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("/categories", () => {
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
  });
  describe("/reviews", () => {
    describe("GET", () => {});
    describe("/:review_id", () => {
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
          expect(res.body.updatedReview.votes).toBe(
            votesToInc.inc_votes + ogVotes
          );
        });
        it('400: when patch method sends an invalid object, responds with a 400 error and message "Bad request"', async () => {
          const res = await request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: "Not a number" })
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
      describe("/comments", () => {
        describe("GET", () => {});
        describe("POST", () => {});
      });
    });
  });
  describe("GET", () => {
    it("200: Responds with a JSON object describing all the available API endpoints", () => {});
  });
});
