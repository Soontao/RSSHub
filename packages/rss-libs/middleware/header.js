const etagCalculate = require("etag");
const config = require("rss-libs/config").value;

const headers = {
  "Access-Control-Allow-Methods": "GET",
  "Content-Type": "application/xml; charset=utf-8",
  "Cache-Control": `public, max-age=${config.cache.routeExpire}`,
};

if (config.nodeName) {
  headers["RSSHub-Node"] = config.nodeName;
}

module.exports = async (ctx, next) => {
  ctx.set(headers);
  ctx.set({ "Access-Control-Allow-Origin": `${ctx.host}` });

  await next();

  if (!ctx.body || typeof ctx.body !== "string" || ctx.response.get("ETag")) {
    return;
  }

  const status = (ctx.status / 100) | 0;
  if (2 !== status) {
    return;
  }

  ctx.set(
    "ETag",
    etagCalculate(
      ctx.body
        .replace(/<lastBuildDate>(.*)<\/lastBuildDate>/, "")
        .replace(/<atom:link(.*)\/>/, ""),
    ),
  );

  if (ctx.fresh) {
    ctx.status = 304;
    ctx.body = null;
  } else {
    const match = ctx.body.match(/<lastBuildDate>(.*)<\/lastBuildDate>/);
    if (match) {
      ctx.set({
        "Last-Modified": match[1],
      });
    }
  }
};
