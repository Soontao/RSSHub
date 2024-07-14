const process = require("process");
const logger = require("./logger");
const { concurrency, memoize } = require("@newdash/newdash");

/**
 * translate any language text to chinese
 *
 * @param {string} text
 * @returns {string}
 */
async function translate(text) {
  if (process.env.DIFY_TRANSLATE_API && process.env.DIFY_TRANSLATE_API_KEY) {
    logger.debug("translating text:", text.slice(0, 100));
    const response = await fetch(process.env.DIFY_TRANSLATE_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DIFY_TRANSLATE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: { query: text },
        response_mode: "blocking",
        user: "technical",
      }),
    });
    if (response.status !== 200) {
      logger.error(`Failed to translate text: ${text}`);
      return text;
    }
    const data = await response.json();
    logger.debug("translated result:", data?.answer);
    return data?.answer;
  }
  return text;
}

module.exports = memoize(concurrency.limit(translate, 5));
