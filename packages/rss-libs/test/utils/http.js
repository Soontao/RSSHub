jest.mock("undici", () => ({ fetch: jest.fn(), ProxyAgent: jest.fn() }));

describe("http.js test suite", () => {
  const http = require("../../utils/http.js");
  const undici = require("undici");
  beforeEach(() => {
    global.fetch = jest.fn();
    undici.fetch.mockClear();
  });

  it("should support fetchText", async () => {
    global.fetch.mockResolvedValue({
      arrayBuffer: jest.fn().mockResolvedValue(Buffer.from("Hello World", "utf-8")),
    });
    const url = "https://example.com";
    expect(await http.fetchText(url)).toBe("Hello World");
  });
  it("should support fetchJson", async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({ hello: "world" }),
    });
    const url = "https://example.com";
    expect(await http.fetchJSON(url)).toEqual({ hello: "world" });
  });

  it("should support fetchTextWithCrossWallProxy", async () => {
    undici.fetch.mockResolvedValue({
      arrayBuffer: jest.fn().mockResolvedValue(Buffer.from("Hello World", "utf-8")),
    });
    const url = "https://example.com";
    expect(await http.fetchTextWithCrossWallProxy(url)).toBe("Hello World");
    expect(undici.fetch.mock.calls[0][1]?.dispatcher).not.toBeUndefined();
  });
});
