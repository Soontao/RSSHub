// all job will share single timer
const logger = require('@/utils/logger');
const config = require('@/config').value;
const got = require('@/utils/got');

const jobPath = new Set();

const scheduleJob = (ctx) => {
    if (!jobPath.has(ctx.url)) {
        const interval = config.cache.routeExpire;
        logger.info(`schedule job for ${ctx.url} every ${interval} seconds`);
        jobPath.add(ctx.url);
    }
};

/**
 * interval seconds
 */
const interval = config.cache.routeExpire * 1000;

const runner = async () => {

    // loop each url one by one
    for (const jobUrl of jobPath.values()) {
        try {
            logger.info(`running job for ${jobUrl}`);
            await got(`http://127.0.0.1:${config.connect.port}${jobUrl}`);
        } catch (error) {
            logger.error(error);
        }
    }

    setTimeout(runner, interval);
};

setTimeout(runner, interval);

module.exports = async (ctx, next) => {
    await next();
    scheduleJob(ctx);
};
