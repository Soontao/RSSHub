const got = require("rss-libs/utils/got");

module.exports = async (ctx) => {
  const response = await got({
    method: "post",
    url: "https://apinew.juejin.im/booklet_api/v1/booklet/listbycategory",
    json: { category_id: "0", cursor: "0", limit: 20 },
  });

  const { data } = response.data;
  const items = data.map(({ base_info }) => ({
    title: base_info.title,
    link: `https://juejin.im/book/${base_info.booklet_id}`,
    description: `
            <img src="${base_info.cover_img}"><br>
            <strong>${base_info.title}</strong><br><br>
            ${base_info.summary}<br>
            <strong>价格:</strong> ${base_info.price / 100}元
        `,
    pubDate: new Date(base_info.ctime * 1000).toUTCString(),
    guid: base_info.booklet_id,
  }));

  ctx.state.data = {
    title: "掘金小册",
    link: "https://juejin.im/books",
    item: items,
  };
};
