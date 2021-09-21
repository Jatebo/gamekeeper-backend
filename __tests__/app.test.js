const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const { seed } = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("/categories", () => {
      it('responds with an array of category objects', async () => {
         await request(app).get('/api/categories').expect(res.status.toBe(200).then(
            
         ) 
      });
  });

  it("200: Responds with a JSON object describing all the available API endpoints", () => {});
});
