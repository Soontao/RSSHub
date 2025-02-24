const got = require("rss-libs/utils/got");
const utils = require("./utils");

module.exports = async (ctx) => {
  const uid = ctx.params.uid;
  const full_url =
    utils.base_url + `/v6/user/feedList?uid=${uid}&page=1&showAnonymous=0`;
  let username;
  const response = await got({
    method: "get",
    url: full_url,
    headers: utils.getHeaders(),
  });
  const data = response.data.data;
  if (!data) {
    throw Error("这个人没有任何动态。");
  }
  let out = await Promise.all(
    data.map(async (item) => {
      if (!username) {
        username = item.username;
      }

      if (item.type === 12) {
        // 图文内容
        return utils.parseTuwen(item, ctx);
      } else if (String(item.type) in utils.dynamicTpye) {
        return utils.parseDongtai(item, ctx);
      } else {
        return null;
      }
    }),
  );

  out = out.filter((i) => i); // 去除空值
  if (out.length === 0) {
    throw Error("这个人还没有图文或动态。");
  }
  ctx.state.data = {
    title: `酷安个人动态-${username}`,
    link: `https://www.coolapk.com/u/${uid}`,
    description: `酷安个人动态-${username}`,
    item: out,
  };
};
