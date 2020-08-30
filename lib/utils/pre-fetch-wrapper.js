const logger = require('./logger');
const config = require('@/config').value;
const got = require('got');

const jobs = new Map();

const scheduleJob = (ctx) => {
    if (!jobs.has(ctx.url)) {
        const interval = config.cache.routeExpire;
        logger.info(`schedule job for ${ctx.url} every ${interval}s`);
        const jobId = setInterval(async () => {
            try {
                logger.info(`running job for ${ctx.url}`);
                await got(`http://127.0.0.1:${config.connect.port}${ctx.url}`);
            } catch (error) {
                logger.error(error);
            }
        }, interval * 1000);
        jobs.set(ctx.url, jobId);
    }
};

module.exports = (router) => async (...args) => {
    const rt = await router(...args);
    if (config.prefetch) {
        scheduleJob(args[0], router);
    }
    return rt;
};
