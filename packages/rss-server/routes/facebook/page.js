const got = require("rss-libs/utils/got");
const cheerio = require("cheerio");

const fetchPageHtml = async (linkPath, cacheKey, cache) => {
  const url = `https://mbasic.facebook.com${linkPath}`;

  return cache.tryGet(cacheKey, async () => {
    const { data: html } = await got.get(url);
    return html;
  });
};

const parseStoryPage = async (linkPath, cache) => {
  const { searchParams: q } = new URL("https://mbasic.facebook.com" + linkPath);
  const storyFbId = q.get("story_fbid");
  const storyId = q.get("id");
  const cacheKey = `story/${storyFbId}/${storyId}`;

  const html = await fetchPageHtml(linkPath, cacheKey, cache);
  const $ = cheerio.load(html);

  const url = `https://www.facebook.com/story.php?story_fbid=${storyFbId}&id=${storyId}`;
  const $story = $("#m_story_permalink_view").first();
  const $box = $story.find("div > div > div > div").eq(0);
  const $header = $box.find("header").eq(0);
  const $content = $box.find("div > div").eq(0);
  const $attach = $box.find("div > div").eq(1);

  const attachLinkList = $attach
    .find("a")
    .toArray()
    .map((a) => $(a).attr("href"));
  const isAttachAreImageSet =
    attachLinkList.filter((link) => new RegExp("/photos/").test(link))
      .length === attachLinkList.length;
  const title = $header.find("h3").text();

  let content = "";
  if ($content.find("p").length === 0) {
    $content.find("br").replaceWith("\n");
    content = $content.text();
  } else {
    const $ps = $content.find("p");
    $ps.find("br").replaceWith("\n");
    content = $ps
      .toArray()
      .map((p) => $(p).text())
      .join("\n");
  }

  let images = [];
  if (isAttachAreImageSet) {
    images = await Promise.all(
      attachLinkList.map((link) => parsePhotoPage(link, cache)),
    );
  }

  return {
    url,
    title,
    content,
    images,
  };
};

const parsePhotoPage = async (linkPath, cache) => {
  const { pathname } = new URL("https://mbasic.facebook.com" + linkPath);
  const cacheKey = `photos${pathname}`;

  const html = await fetchPageHtml(linkPath, cacheKey, cache);
  const $ = cheerio.load(html);

  const title = $("#MPhotoContent div.msg > a > strong").first().text();
  const url = `https://www.facebook.com${pathname}`;
  const $content = $("#MPhotoContent div.msg > div");
  $content.find("br").replaceWith("\n");
  const content = $content.text();
  const image = $(
    "#MPhotoContent div.desc.attachment > span > div > span > a[target=_blank].sec",
  ).attr("href");

  return {
    title,
    url,
    content,
    image,
  };
};

module.exports = async (ctx) => {
  const { id } = ctx.params;
  const pageId = encodeURIComponent(id);
  const linkPath = `/${pageId}`;

  const html = await fetchPageHtml(linkPath, pageId, ctx.cache);
  const $ = cheerio.load(html);

  const itemLinks = $("footer > div:nth-child(2) > a:nth-child(1)")
    .toArray()
    .map((a) => $(a).attr("href"));

  const items = await Promise.all(
    itemLinks.map(async (itemLink) => {
      if (new RegExp("^/.+/photos/").test(itemLink)) {
        const data = await parsePhotoPage(itemLink, ctx.cache);
        return {
          title: data.title,
          link: data.url,
          description: `<img src="${data.image}"><br>${data.content.replace(/\n/g, "<br>")}`,
        };
      }
      if (new RegExp("^/story.php").test(itemLink)) {
        const data = await parseStoryPage(itemLink, ctx.cache);
        const isSingleImageStory = data.images.length === 1;
        const isEmptyImageList = data.images.length === 0;

        let desc = "";
        desc += data.images
          .map(
            (image) =>
              `<img src="${image.image}"><br>${image.content.replace(/\n/g, "<br>")}`,
          )
          .join("<br>");
        if (!isSingleImageStory) {
          !isEmptyImageList && (desc += "<br>");
          desc += data.content.replace(/\n/g, "<br>");
        }

        return {
          title: data.title,
          link: data.url,
          description: desc,
        };
      }
    }),
  );

  ctx.state.data = {
    title: $("#m-timeline-cover-section h1 span").text(),
    link: `https://www.facebook.com/${pageId}`,
    description: $("#sub_profile_pic_content>div>div:nth-child(3) div>span")
      .find("br")
      .replaceWith("\n")
      .text(),
    item: items.filter((item) => !!item),
  };
};
