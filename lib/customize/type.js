/**
 * @typedef Item
 * @type {{title:string,pubDate:string,author:string,link:string,guid:string,description:string}}
 */

/**
 * @typedef ContextData
 * @type {{title:string,link:string,item:Array<Item>}}
 */

/**
 * @typedef ContextCache
 * @type {import("@/middleware/cache/base").Cache}
 */

/**
 * @typedef RSSHubKoaContext
 * @type {import("koa").ParameterizedContext<{data:ContextData}, {cache:ContextCache}>}
 */
