const { fetchText } = require("rss-libs/utils/http");
const md5 = require("rss-libs/utils/md5");
const { uniq, concurrency } = require("@newdash/newdash");
const cheerio = require("cheerio");
const moment = require("moment");

// 2020-08-31T11:00:00.000+08:00
const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss.SSSZZ";

const RADIO_MP3_REG = /https:\/\/alioss.gcores.com\/uploads\/audio\/.*?\.mp3/gm;

const fetchItem = concurrency.limit(async (itemPath, cache) => {
  const link = "https://www.gcores.com" + itemPath;
  const parts = link.split("/");
  const itemId = parts.pop();
  const itemType = parts.pop();
  const apiUrl = `https://www.gcores.com/gapi/v1/${itemType}/${itemId}?include=user,djs`;

  return cache.tryGet(link, async () => {
    const [apiRes, itemPage] = await Promise.all([fetchText(apiUrl), fetchText(link)]);
    const apiData = JSON.parse(apiRes);
    const $item = cheerio.load(itemPage);

    const title = $item("div.originalPage_titleGroup h1").text();
    const cover = $item("img.newsPage_cover");
    $item("path").remove();
    $item("svg").remove();
    // remove loading indicator
    $item(".loadingPlaceholder").remove();
    $item(".md-editor-toolbar").remove();
    $item("style").remove();
    $item("script").remove();
    $item(".slick-dots").remove();
    $item(".gallery button").remove();
    $item("figure").remove();

    const content = $item(".story.story-show").html();
    const single = {
      title,
      description: cover + "<br>" + content,
      link,
      pubDate: moment.parseZone(apiData?.data.attributes["published-at"], DATE_FORMAT).toDate(),
      guid: md5(link),
      author: apiData?.included?.map((include) => include.attributes.nickname).join(", "),
    };

    if (itemType === "radios") {
      const [radioLink] = itemPage.match(RADIO_MP3_REG) || [];
      if (radioLink !== undefined) {
        single.enclosure_url = radioLink;
        single.enclosure_type = "audio/mpeg";
        single.description += `<br><audio controls><source src="${radioLink}" type="audio/mpeg"></audio>`;
      }
    }

    return single;
  });
}, 5);

const endpoint = async (ctx) => {
  const category = ctx.params.category;
  const url = `https://www.gcores.com/${category}`;
  const data = await fetchText(url);
  const $ = cheerio.load(data);
  const list = uniq(
    $("a")
      .toArray()
      .map((e) => $(e).attr("href"))
      .filter((h) => h?.startsWith?.("/articles/"))
  );
  const feedTitle = $("title").text();

  const out = await Promise.all(list.slice(0, 15).map((item) => fetchItem(item, ctx.cache)));
  ctx.state.data = {
    title: feedTitle,
    link: url,
    item: out,
  };
};

endpoint.name = "机核网";

endpoint.path = "/gcores/category/:category";

endpoint.examples = ["/gcores/category/radios", "/gcores/category/articles"];

module.exports = endpoint;
