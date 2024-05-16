function fetchText(url, encoding = "utf-8") {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buff) => new TextDecoder(encoding).decode(buff));
}

module.exports = { fetchText };
