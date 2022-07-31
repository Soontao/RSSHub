const process = require('process');
const { MeiliSearch } = require('meilisearch');
const md5 = require('@/utils/md5');
const logger = require('@/utils/logger');
const getImageLink = require('./getImageLink');
const getKeyWords = require('./getKeywords');

const cilent = new MeiliSearch({
    host: process.env.MEILLI_SEARCH_URL,
    apiKey: process.env.MEILLI_SEARCH_MASTER_KEY, // could be undefined
});

const newsIndex = cilent.index('news');

/**
 * @type {import("koa").Middleware}
 */
const meillisearchMiddleware = async (ctx, next) => {
    await next();
    const { data } = ctx.state;
    if (data !== undefined && data.item instanceof Array) {
        const documents = data
            .item
            .filter((item) => item.pubDate !== undefined && item.guid !== undefined && item?.description?.length > 10)
            .map((item) => ({
                id: md5(item.link),
                title: item.title,
                pubDate: item.pubDate,
                link: item.link,
                description: item.description,
                author: item.author,
                source: data.title,
                image: getImageLink(item.description),
                keywords: getKeyWords(item.description),
            }));
        if (documents.length > 0) {
            const response = await newsIndex.addDocuments(documents);
            logger.debug('push', documents.length, 'items to meillisearch', response);
        }
    }

};


module.exports = meillisearchMiddleware;
