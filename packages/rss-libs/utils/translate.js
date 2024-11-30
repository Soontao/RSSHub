const process = require("process");
const logger = require("./logger");
const os = require("os");
const md5 = require("rss-libs/utils/md5");
const { concurrency, memoize } = require("@newdash/newdash");
const { FileSystemCache } = require("rss-libs/middleware/cache/fs");

const cache = new FileSystemCache({
  prefix: "rsshub_translation_fs_cache_",
});

/**
 * translate any language text to chinese
 *
 * @param {string} text
 * @returns {string}
 */
async function translate(text) {
  if (process.env.DIFY_TRANSLATE_API && process.env.DIFY_TRANSLATE_API_KEY) {
    const hash = md5(text);
    return cache.tryGet(
      hash,
      async () => {
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
            user: `rsshub-${os.hostname()}`,
          }),
        });
        if (response.status !== 200) {
          logger.error(`Failed to translate text: ${text}`);
          return text;
        }
        const data = await response.json();
        /**
         * @type {string}
         */
        const answer = data?.answer?.trim();
        logger.debug("translated result:", answer);
        if (answer?.startsWith("{") && answer.includes("output_text")) {
          try {
            return JSON.parse(answer)?.output_text;
          } catch (error) {
            logger.error("translate failed, parse output_text failed", answer);
            return text;
          }
        }
        return data?.answer;
      },
      3600 * 24
    );
  }
  return text;
}

module.exports = memoize(concurrency.limit(translate, 5));
