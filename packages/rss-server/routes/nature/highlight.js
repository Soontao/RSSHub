const cheerio = require("cheerio");
const got = require("rss-libs/utils/got");

module.exports = async (ctx) => {
  const base = "https://www.nature.com";
  const url = `${base}/nature/articles?type=research-highlight`;

  const res = await got.get(url);
  const $ = cheerio.load(res.data);
  const list = $(".border-bottom-1.pb20").get();

  const out = await Promise.all(
    list.slice(0, 2).map(async (item) => {
      const $ = cheerio.load(item);
      const title = $("h3 > a").text();
      const partial = $("h3 > a").attr("href");
      const address = `${base}${partial}`;
      const time = $("time").text();
      let author;
      if ($(".js-list-authors-3 li").length > 3) {
        author = $(".js-list-authors-3 li").slice(0, 1).text() + " et al.";
      } else {
        author = $(".js-list-authors-3 li").text();
      }
      const cache = await ctx.cache.get(address);
      if (cache) {
        return Promise.resolve(JSON.parse(cache));
      }
      const res = await got.get(address);
      const capture = cheerio.load(res.data);
      let figure = capture("figure .figure--bleed").html();
      if (figure === null) {
        figure = "";
      }
      let contents = capture(".article-item--open .article-item__body").html();
      if (contents === null) {
        contents = "";
      }
      const single = {
        title,
        author: author,
        description: figure + contents,
        link: address,
        guid: address,
        pubDate: new Date(time).toUTCString(),
      };
      ctx.cache.set(address, JSON.stringify(single));
      return Promise.resolve(single);
    }),
  );
  ctx.state.data = {
    title: "Nature | Research Highlight",
    description: "Nature, a nature research journal",
    link: url,
    item: out,
  };
};
