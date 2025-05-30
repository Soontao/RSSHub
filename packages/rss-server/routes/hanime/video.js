const got = require("rss-libs/utils/got");

module.exports = async (ctx) => {
  const response = await got({
    method: "POST",
    url: "https://search.htv-services.com/",
    headers: {
      Referer: "https://hanime.tv/",
      "Content-Type": "application/json;charset=utf-8",
    },
    data: JSON.stringify({
      search_text: "",
      tags: [],
      tags_mode: "AND",
      brands: [],
      blacklist: [],
      order_by: "created_at_unix",
      ordering: "desc",
      page: 0,
    }),
  });

  const data = response.data.hits;
  const list = JSON.parse(data);

  ctx.state.data = {
    title: "Hanime",
    link: "https://hanime.tv/",
    item: list.map((item) => {
      const videoUrl = "https://hanime.tv/hentai-videos/" + item.slug;
      // 视频预览图，可通过视频页面的预览图片获取
      const videoImage = item.poster_url;
      const videoCover = item.cover_url;
      const videoDescription = item.description;
      const videoTags = item.tags;
      const videoBrand = item.brand;
      const videoEnglishName = item.name;
      const videoName = item.titles;
      const videoJapanseName = videoName.slice(-1);

      return {
        title: videoEnglishName,
        description:
          "Name: ".bold() +
          videoEnglishName +
          " (" +
          videoJapanseName +
          ")" +
          "<br>" +
          "Brand: ".bold() +
          videoBrand +
          "<br>" +
          "Tags: ".bold() +
          videoTags +
          "<br>" +
          "Description: ".bold() +
          videoDescription +
          "<br>" +
          '<img src="' +
          videoCover +
          '">' +
          "<br>" +
          '<img src="' +
          videoImage +
          '">',
        link: videoUrl,
      };
    }),
  };
};
