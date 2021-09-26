const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/", () => {
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
  });
  describe("/api/reviews", () => {
    describe("GET", () => {
      it("200: should respond with an array of review objects", async () => {
        const res = await request(app).get("/api/reviews").expect(200);
        res.body.reviews.forEach((review) => {
          // console.log(review.title);
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
      });
      it("default sort_by is created_at date in descending order", async () => {
        const res = await request(app).get("/api/reviews").expect(200);
        const reviewObjects = res.body.reviews;
        expect(reviewObjects).toBeSortedBy("created_at", { descending: true });
      });
      it("accepts queries to sort by any other valid column", async () => {
        const res = await request(app)
          .get("/api/reviews?sort_by=designer")
          .expect(200);
        const reviewObjects = res.body.reviews;
        expect(reviewObjects).toBeSortedBy("designer", { descending: true });
      });
      it("accepts queries input to sort by asc or desc if user specifies", async () => {
        const res = await request(app)
          .get("/api/reviews?order=ASC")
          .expect(200);
        const reviewObjects = res.body.reviews;
        expect(reviewObjects).toBeSortedBy("created_at");
      });
      it("accepts category filter queries", async () => {
        const res = await request(app)
          .get("/api/reviews?sort_by=designer&order=ASC&filter_by=dexterity")
          .expect(200);
        const reviewObjects = res.body.reviews;
        reviewObjects.forEach((review) => {
          expect(review.category).toBe("dexterity");
        });
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
        const res = await request(app)
          .get("/api/reviews?order=DESK")
          .expect(400);
        expect(res.body.msg).toBe("Bad request - cannot order by DESK");
      });
      it("400: responds with a 400: Bad Request if an invalid filter category is used", async () => {
        const res = await request(app)
          .get("/api/reviews?sort_by=somethingInvalid")
          .expect(400);
        expect(res.body.msg).toBe(
          "Bad request - cannot sort by somethingInvalid"
        );
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
        it("400: responds with a 400 if the requested review_id is not a number ", async () => {
          const res = await request(app).get("/api/reviews/two").expect(400);
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
      describe("/api/reviews/:review_id/comments", () => {
        describe("GET", () => {
          it("200: responds with an array of comment objects for the provided review id, which have properties comment_id, votes, created_at, author and body", async () => {
            const res = await request(app)
              .get("/api/reviews/2/comments")
              .expect(200);
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
            const res = await request(app)
              .get("/api/reviews/1/comments")
              .expect(200);
            expect(res.body.comments).toHaveLength(0);
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
        });
        describe("POST", () => {
          it("201: accepts an object containing username and body, and responds with the posted comment", async () => {
            const res = await request(app)
              .post("/api/reviews/1/comments")
              .send({
                username: "dav3rid",
                body: "Wow, this was such a great game, can't believe I'm the first person to review it!!",
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
          it("400: responds with bad request if the username is incorrect ", async () => {
            const res = await request(app)
              .post("/api/reviews/1/comments")
              .send({
                username: "dav3",
                body: "Wow, this was such a great game, can't believe I'm the first person to review it!!",
              });
            expect(400);
            expect(res.body.msg).toBe("Bad request");
          });
          it("400: responds with bad request if the input type is not string", async () => {
            const res = await request(app)
              .post("/api/reviews/1/comments")
              .send({
                username: "dav3rid",
                body: true,
              });
            expect(400);
            expect(res.body.msg).toBe(
              "Bad request - comment must be in text format"
            );
          });
          it("404: responds with a 404 if the requested review_id does not exist in the table", async () => {
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
    });
  });
  describe.only("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
      it("204: deletes the comment by comment ID provided in the path, and responds with a 'no content' message", async () => {
        const res = await request(app).delete("/api/comments/2");
        expect(204);
        // expect(res.body.msg).toBe("No content");
      });
      it("400: responds with a 400 error if the comment_id is an invalid input type", async () => {
        const res = await request(app).delete("/api/comments/two");
        expect(400);
        expect(res.body.msg).toBe("Bad request");
      });
      it("404: responds with a 404 error if the requested comment ID does not exist", async () => {
        const res = await request(app).delete("/api/comments/12423");
        expect(404);
        expect(res.body.msg).toBe("Not found");
      });
    });
    //   describe("PATCH", () => {});
    // });
    // describe("/api/users", () => {
    //   describe("GET", () => {});
    //   describe("/api/user/:username", () => {
    //     describe("GET", () => {});
    //   });
  });
});
