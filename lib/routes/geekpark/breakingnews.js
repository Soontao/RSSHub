const { fetchJSON } = require("@/utils/http");

module.exports = async (ctx) => {
  const url = "https://mainssl.geekpark.net/api/v1/posts";
  const link = "https://www.geekpark.net";

  const data = await fetchJSON(url);

  ctx.state.data = {
    title: "极客公园 - 资讯",
    description: "极客公园聚焦互联网领域，跟踪最新的科技新闻动态，关注极具创新精神的科技产品。",
    link,
    item: data?.posts?.map(({ title, content, published_at, id, authors }) => ({
      title,
      link: `https://www.geekpark.net/news/${id}`,
      description: content,
      pubDate: new Date(published_at).toUTCString(),
      author: authors?.[0]?.nickname ?? "Unknown",
    })),
  };
};
