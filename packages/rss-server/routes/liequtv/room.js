const got = require("rss-libs/utils/got");

const original_host = "https://liequ.tv";

module.exports = async (ctx) => {
  const id = ctx.params.id;

  const cache_key = `liequtv::latest_base_host::${new Date().toJSON().slice(0, 10)}`;
  const url = `${(await ctx.cache.get(cache_key)) || original_host}/${id}`;

  const response = await got({
    method: "get",
    url: url,
    hooks: {
      beforeRedirect: [
        (options) => {
          options.url.pathname = `/${id}`;
          ctx.cache.set(cache_key, options.url.origin);
        },
      ],
    },
  });

  if (response.data.match(/主播不存在/)) {
    throw "主播不存在";
  }

  const liveInfo = JSON.parse(response.data.match(/_DATA\.live=(.*?);/)[1]);
  const userInfo = JSON.parse(response.data.match(/_DATA\.anchor=(.*?);/)[1]);

  const item =
    liveInfo.islive !== "1"
      ? []
      : [
        {
          title: liveInfo.title,
          author: userInfo.user_nicename,
          description: liveInfo.thumb ? `<img src="${liveInfo.thumb}">` : "",
          pubDate: new Date(liveInfo.starttime * 1000),
          url: response.url,
          guid: liveInfo.room_num + liveInfo.starttime,
        },
      ];

  ctx.state.data = {
    title: `${userInfo.user_nicename} - 猎趣TV`,
    image: userInfo.avatar,
    description: userInfo.signature,
    link: response.url,
    item: item,
    allowEmpty: true,
  };
};
