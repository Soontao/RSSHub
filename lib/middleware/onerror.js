const logger = require('@/utils/logger');
const config = require('@/config').value;
const Sentry = require('@sentry/node');

if (config.sentry) {
    Sentry.init({ dsn: config.sentry, });
    Sentry.configureScope((scope) => { scope.setTag('node_name', config.nodeName); });
    logger.info('Sentry initialized.');
}

module.exports = async (ctx, next) => {
    try {
        await next();
    }
    catch (err) {

        logger.error(`Error in ${ctx.request.path}: [${err.constructor.name}] ${err.message}`);
        logger.error(err.stack);

        const status = err.status || 500;

        ctx.body = {
            error: {
                message: err.message,
                stack: err.stack,
                status,
            },
        };

        ctx.status = status;

        if (!ctx.debug.errorPaths[ctx.request.path]) {
            ctx.debug.errorPaths[ctx.request.path] = 0;
        }
        ctx.debug.errorPaths[ctx.request.path]++;

        if (!ctx.debug.errorRoutes[ctx._matchedRoute]) {
            ctx._matchedRoute && (ctx.debug.errorRoutes[ctx._matchedRoute] = 0);
        }
        ctx._matchedRoute && ctx.debug.errorRoutes[ctx._matchedRoute]++;

        if (!ctx.state.debuged) {
            if (!ctx.debug.routes[ctx._matchedRoute]) {
                ctx._matchedRoute && (ctx.debug.routes[ctx._matchedRoute] = 0);
            }
            ctx._matchedRoute && ctx.debug.routes[ctx._matchedRoute]++;

            if (ctx.response.get('X-Koa-Redis-Cache') || ctx.response.get('X-Koa-Memory-Cache')) {
                ctx.debug.hitCache++;
            }
        }

        if (config.sentry) {
            Sentry.withScope((scope) => {
                scope.setTag('route', ctx._matchedRoute);
                scope.setTag('name', ctx.request.path.split('/')[1]);
                scope.addEventProcessor((event) => Sentry.Handlers.parseRequest(event, ctx.request));
                Sentry.captureException(err);
            });
        }
    }
};
