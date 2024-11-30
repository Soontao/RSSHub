const supertest = require("supertest");
const Parser = require("rss-parser");
const parser = new Parser();
let server;

afterAll(() => {
  delete process.env.HOTLINK_TEMPLATE;
});

afterEach(() => {
  delete process.env.HOTLINK_TEMPLATE;
  jest.resetModules();
  server.close();
});

describe("anti-hotlink", () => {
  it("template", async () => {
    process.env.HOTLINK_TEMPLATE = "https://i3.wp.com/${host}${pathname}";
    server = require("../../index");
    const request = supertest(server);

    const response = await request.get("/test/complicated");
    const parsed = await parser.parseString(response.text);
    expect(parsed.items[0].content).toMatchSnapshot();
    expect(parsed.items[1].content).toMatchSnapshot();
  });
  it("url", async () => {
    process.env.HOTLINK_TEMPLATE = "${protocol}//${host}${pathname}";
    server = require("../../index");
    const request = supertest(server);

    const response = await request.get("/test/complicated");
    const parsed = await parser.parseString(response.text);
    expect(parsed.items[0].content).toMatchSnapshot();
    expect(parsed.items[1].content).toMatchSnapshot();
  });
  it("no-template", async () => {
    process.env.HOTLINK_TEMPLATE = "";
    server = require("../../index");
    const request = supertest(server);

    const response = await request.get("/test/complicated");
    const parsed = await parser.parseString(response.text);
    expect(parsed.items[0].content).toMatchSnapshot();
    expect(parsed.items[1].content).toMatchSnapshot();
  });
});
