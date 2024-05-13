function fetchText(url) {
  return fetch(url).then((res) => res.text());
}

module.exports = { fetchText };
