const moment = require("moment/moment");

const config = require("@/config").value;
const { stringify } = require("csv/sync");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const logger = require("@/utils/logger");

const TurndownService = require("turndown");
const turndownService = new TurndownService();

const storage = new Map();
const alreadySent = new Set();

const flush_entries = async function flush_entries() {
  const timestamp = moment().format("YYYYMMDD_HHmmss");
  const items = Array.from(storage.values());
  const keys = Array.from(storage.keys());
  // mark keys to sent
  keys.forEach((k) => alreadySent.add(k));

  storage.clear();

  // convert storage articles into csv, via csv module sync
  const records = items.map((i) => ({
    title: i.title,
    description: turndownService.turndown(i.description),
    link: i.link,
    pubDate: moment(i.pubDate).toISOString(),
    author: i.author,
    guid: i.guid,
    category: i.category,
  }));

  const csv = stringify(records, {
    header: true,
    columns: [
      "title",
      "description",
      "link",
      "pubDate",
      "author",
      "guid",
      "category",
    ],
  });

  const filename = ["rsshub", "collection", timestamp].join("_") + ".csv";
  // upload to s3
  const client = new S3Client({
    region: config.s3Storage.region,
    credentials: {
      accessKeyId: config.s3Storage.accessKeyId,
      secretAccessKey: config.s3Storage.secretAccessKey,
    },
  });
  await client.send(
    new PutObjectCommand({
      Bucket: config.s3Storage.bucket,
      Key: filename,
      Body: Buffer.from(csv, "utf-8"),
    })
  );
};

/**
 *
 * @type {import("koa").Middleware}
 */
const s3_storage = async function s3_storage(ctx, next) {
  await next();
  if (ctx.state?.data?.item instanceof Array) {
    for (const i of ctx.state.data.item) {
      const key = i.guid ?? i.link;
      if (alreadySent.has(key)) {
        continue;
      }
      storage.set(key, { ...i, category: ctx.state.data.title });
    }
  }
  if (storage.size > config.s3Storage.forceFlushSize) {
    flush_entries().catch((e) => logger.error("upload csv to s3 failed", e));
  }
};

module.exports = s3_storage;
