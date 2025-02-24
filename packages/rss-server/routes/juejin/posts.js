const got = require("rss-libs/utils/got");
const util = require("./utils");

module.exports = async (ctx) => {
  const { id } = ctx.params;

  const response = await got({
    method: "post",
    url: "https://apinew.juejin.im/content_api/v1/article/query_list",
    json: {
      user_id: id,
      sort_type: 2,
    },
  });
  const { data } = response.data;
  const username =
    data[0] && data[0].author_user_info && data[0].author_user_info.user_name;
  const resultItems = await util.ProcessFeed(data, ctx.cache);

  ctx.state.data = {
    title: `掘金专栏-${username}`,
    link: `https://juejin.im/user/${id}/posts`,
    description: `掘金专栏-${username}`,
    item: resultItems,
  };
};
