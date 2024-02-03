const storage = new Map();
const config = require("@/config").value;

const flush_entries = async function flush_entries() {};

/**
 *
 * @type {import("koa").Middleware}
 */
const s3_storage = async function s3_storage(ctx, next) {
  await next();
  if (ctx.state.data !== undefined) {
    const { data } = ctx.state;
    for (const i of data.item) {
    }
  }
};

module.exports = s3_storage;
