// all job will share single timer
const logger = require('@/utils/logger');
const config = require('@/config').value;
const got = require('got');
const { Semaphore } = require('@newdash/newdash/functional/Semaphore');

/**
 * interval for job
 */
const interval = (config.cache.routeExpire * 0.8) * 1000;

const jobPath = new Set();

const scheduleJob = (ctx) => {
    if (!jobPath.has(ctx.url)) {
        logger.info(`schedule job for ${ctx.url} every ${interval / 1000} seconds`);
        jobPath.add(ctx.url);
    }
};

const sem = new Semaphore(5);

const runner = async () => {

    await Promise.all(Array.from(jobPath.values()).map((jobUrl) => sem.use(async () => {
        try {
            logger.debug(`running job for ${jobUrl}`);
            await got(`http://127.0.0.1:${config.connect.port}${jobUrl}`, { headers: { 'x-ignore-cache': 'true' } });
        } catch (error) {
            logger.error(error);
        }
    })));


    setTimeout(runner, interval);

};

setTimeout(runner, interval);

module.exports = async (ctx, next) => {

    await next();

    if (ctx.url.startsWith('/test') || ctx.url.startsWith('/api')) {
        // do nothing
    }
    else {
        if (ctx.state.data !== undefined) {
            scheduleJob(ctx);
        }
    }


};
