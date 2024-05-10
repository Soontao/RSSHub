process.env.SENTRY = "https://mock@mock.com/1";

const supertest = require("supertest");
const server = require("../../lib/index");
const request = supertest(server);

afterAll(() => {
  server.close();
});

afterAll(() => {
  delete process.env.SENTRY;
});

describe("error", () => {
  it("error", async () => {
    const response = await request.get("/test/error");
    expect(response.status).toBe(500);
    expect(response.text).toMatch(/Error: Error test/);
  });
});
