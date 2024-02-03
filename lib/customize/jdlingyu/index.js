const got = require("@/utils/got");
const cheerio = require("cheerio");

const baseUrl = "https://www.jdlingyu.mobi/";
const viewProps = {
  tuji: "图集",
  as: "文章",
};

const endpoint = async (ctx) => {
  const type = ctx.params.type || "tuji";
  const url = baseUrl + type;
  const response = await got({
    method: "get",
    url: url,
  });
  const $ = cheerio.load(response.data);

  const items = await Promise.all(
    $("#post-list > ul.b2_gap > li")
      .get()
      .map(async (div) => {
        const a = $(div).find(".post-info > h2 > a");
        const link = a.attr("href");
        const { description, author, pubDate } = await ctx.cache.tryGet(
          link,
          async () => {
            const response = await got.get(link);
            const $ = cheerio.load(response.data);
            // remove download box
            const content = $(".entry-content");
            content.find(".download-box").remove();
            content.find("noscript").each((_, noscriptNode) => {
              $(noscriptNode).replaceWith(noscriptNode.children);
            });
            content.find("img").each((_, ele) => {
              $(ele).removeAttr("style");
              $(ele).removeAttr("class");
              $(ele).removeAttr("width");
              $(ele).removeAttr("height");
              $(ele).removeAttr("referrerpolicy");
              $(ele).removeAttr("data-src");
              if (ele.attribs.src && ele.attribs.src.startsWith("data")) {
                $(ele).remove();
              }
            });

            return {
              description: content.html(),
              author: $(".post-user-name b").text(),
              pubDate: new Date(
                $(div).find(".b2timeago").attr("datetime"),
              ).toUTCString(),
            };
          },
        );
        return Promise.resolve({
          title: a.text(),
          description,
          author,
          link,
          pubDate,
        });
      }),
  );
  ctx.state.data = {
    title: `${viewProps[type]} - 绝对领域`,
    link: url,
    description: `${viewProps[type]} - 绝对领域`,
    item: items,
  };
};

endpoint.path = "/jdlingyu/:type";

endpoint.name = "绝对领域";

endpoint.examples = ["/jdlingyu/tuji", "/jdlingyu/as"];

module.exports = endpoint;
