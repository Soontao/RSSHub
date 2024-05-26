function fetchText(url, encoding = "utf-8") {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buff) => new TextDecoder(encoding).decode(buff));
}

function fetchTextWithCrossWallProxy(url, encoding = "utf-8") {
  const process = require("process");
  const { fetch, ProxyAgent } = require("undici");

  return fetch(url, { dispatcher: new ProxyAgent({ uri: process.env.RSSHUB_CROSS_WALL_PROXY_URL }) })
    .then((res) => res.arrayBuffer())
    .then((buff) => new TextDecoder(encoding).decode(buff));
}

module.exports = { fetchText, fetchTextWithCrossWallProxy };
