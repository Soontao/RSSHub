const config = require("rss-libs/config").value;
const Parser = require("rss-parser");

module.exports = async (ctx) => {
  const parser = new Parser({
    customFields: {
      item: ["magnet", ["nyaa:infoHash", "infoHash"]],
    },
    headers: {
      "User-Agent": config.ua,
    },
  });

  const { query = "" } = ctx.params;
  const feed = await parser.parseURL(
    `https://nyaa.uk/?page=rss&c=0_0&f=0&q=${encodeURI(query)}`,
  );

  feed.items.map((item) => {
    item.link = item.guid;
    item.description = item.content;
    item.enclosure_url = `magnet:?xt=urn:btih:${item.infoHash}`;
    item.enclosure_type = "application/x-bittorrent";
    return item;
  });

  ctx.state.data = {
    title: feed.title,
    link: `https://nyaa.uk/?f=0&c=0_0&q=${query}`,
    description: feed.description,
    item: feed.items,
  };
};
