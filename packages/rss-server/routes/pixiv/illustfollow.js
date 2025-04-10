const getToken = require("./token");
const getIllustFollows = require("./api/getIllustFollows");
const config = require("rss-libs/config").value;
module.exports = async (ctx) => {
  if (!config.pixiv || !config.pixiv.username || !config.pixiv.password) {
    throw 'pixiv RSS is disabled due to the lack of <a href="https://docs.rsshub.app/install/#%E9%83%A8%E5%88%86-rss-%E6%A8%A1%E5%9D%97%E9%85%8D%E7%BD%AE">relevant config</a>';
  }
  if (!getToken()) {
    throw "pixiv not login";
  }
  const response = await getIllustFollows(getToken());
  const illusts = response.data.illusts;
  ctx.state.data = {
    title: "Pixiv关注的新作品",
    link: "https://www.pixiv.net/bookmark_new_illust.php",
    description: "Pixiv关注的画师们的最新作品",
    item: illusts.map((illust) => {
      const images = [];
      if (illust.page_count === 1) {
        images.push(`<p><img src="https://pixiv.cat/${illust.id}.jpg"/></p>`);
      } else {
        for (let i = 0; i < illust.page_count; i++) {
          images.push(
            `<p><img src="https://pixiv.cat/${illust.id}-${i + 1}.jpg"/></p>`,
          );
        }
      }
      return {
        title: illust.title,
        author: illust.user.name,
        pubDate: new Date(illust.create_date).toUTCString(),
        description: `<p>画师：${illust.user.name} - 阅览数：${illust.total_view} - 收藏数：${illust.total_bookmarks}</p>${images.join("")}`,
        link: `https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illust.id}`,
      };
    }),
  };
};
