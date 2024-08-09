const utils = require("../../lib/utils/common-utils");

describe("common-utils", () => {
  it("toTitleCase", async () => {
    expect(utils.toTitleCase("RSSHub IS AS aweSOme aS henry")).toBe("Rsshub Is As Awesome As Henry");
  });

  it("htmlToMarkdown", () => {
    expect(utils.htmlToMarkdown("<h1>hello</h1>")).toMatchSnapshot();
  });

  it("markdownToHtml", () => {
    expect(utils.markdownToHtml("# hello")).toMatchSnapshot();
  });

  describe("createGenericEndpoint", () => {
    const linkExtractor = jest.fn();
    const contentExtractor = jest.fn();
    const fetchText = jest.fn();
    const cache = { tryGet: jest.fn((key, runner) => runner()) };

    beforeEach(() => {
      jest.clearAllMocks();
      // html with title
      fetchText.mockResolvedValue("<html><title>hello</title></html>");
      linkExtractor.mockReturnValue([
        "https://example.com/1",
        "https://example.com/2",
        "https://example.com/3",
        "https://example.com/4",
        "https://example.com/5",
        "https://example.com/6",
      ]);
      contentExtractor.mockImplementation(() => ({
        title: "hello",
        link: "https://example.com/1",
        description: "hello",
        author: "henry",
        pubDate: new Date(),
        guid: "https://example.com/1",
      }));
    });

    it("createGenericEndpoint - simple", async () => {
      const handler = utils.createGenericEndpoint({
        endpointPath: "/test",
        entryUrl: "https://example.com",
        fetchText,
        linkExtractor,
        contentExtractor,
        maxItemsInList: 5,
      });

      const ctx = { state: {}, cache };
      await handler(ctx);
      expect(ctx.state.data.item).toHaveLength(5);
    });

    it("createGenericEndpoint - ignore old entries", async () => {
      const handler = utils.createGenericEndpoint({
        endpointPath: "/test",
        entryUrl: "https://example.com",
        fetchText,
        linkExtractor,
        contentExtractor,
        maxItemsInList: 5,
      });

      contentExtractor.mockImplementation(() => ({
        title: "hello",
        link: "https://example.com/1",
        description: "hello",
        author: "henry",
        pubDate: new Date("2020-01-01"),
        guid: "https://example.com/1",
      }));

      const ctx = { state: {}, cache };
      await handler(ctx);
      expect(ctx.state.data.item).toHaveLength(0);
    });

    it("createGenericEndpoint - remove failed entries", async () => {
      const handler = utils.createGenericEndpoint({
        endpointPath: "/test",
        entryUrl: "https://example.com",
        fetchText,
        linkExtractor,
        contentExtractor,
        maxItemsInList: 5,
      });

      contentExtractor.mockImplementation(() => {
        throw new Error("failed");
      });

      const ctx = { state: {}, cache };
      await handler(ctx);
      expect(ctx.state.data.item).toHaveLength(0);
    });
    it("createGenericEndpoint - remove texts", async () => {
      const handler = utils.createGenericEndpoint({
        endpointPath: "/test",
        entryUrl: "https://example.com",
        fetchText,
        linkExtractor,
        contentExtractor,
        removeTexts: ["hello"],
        maxItemsInList: 5,
      });

      fetchText.mockResolvedValue("<html><p>hello world</p><p>aaaa</p></html>");
      const ctx = { state: {}, cache };
      await handler(ctx);
      expect(contentExtractor.mock.calls?.[0]?.[0].html()).toBe("<html><head></head><body><p>aaaa</p></body></html>");
    });
  });
});
