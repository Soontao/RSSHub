const config = require("@/config");

function fetchText(url, encoding = "utf-8") {
  return fetch(url, {
    headers: {
      "User-Agent": config.value.ua,
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      referer: url,
    },
  })
    .then((res) => res.arrayBuffer())
    .then((buff) => new TextDecoder(encoding).decode(buff));
}

function fetchJSON(url) {
  return fetch(url, {
    headers: {
      "User-Agent": config.value.ua,
      Accept: "application/json",
      referer: url,
    },
  }).then((res) => res.json());
}

function fetchTextWithCrossWallProxy(url, encoding = "utf-8") {
  const process = require("process");
  const { fetch, ProxyAgent } = require("undici");

  return fetch(url, {
    dispatcher: new ProxyAgent({
      uri: process.env.RSSHUB_CROSS_WALL_PROXY_URL,
      headersTimeout: 10_000,
      connectTimeout: 10_000,
      bodyTimeout: 10_000,
      maxRedirections: 2,
    }),
  })
    .then((res) => res.arrayBuffer())
    .then((buff) => new TextDecoder(encoding).decode(buff));
}

function fetchByJina(url) {
  return fetchTextWithCrossWallProxy("https://r.jina.ai/" + url);
}

module.exports = { fetchText, fetchJSON, fetchTextWithCrossWallProxy, fetchByJina };
