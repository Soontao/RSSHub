require("dotenv").config();

const os = require("os");
const process = require("process");
const envs = process.env;
const bilibili_cookies = {};
const twitter_tokens = {};
const email_config = {};
const discuz_cookies = {};

const value = {
  isPackage: envs.IS_PACKAGE,
  noLogfiles: envs.NO_LOGFILES,
  connect: {
    port: parseInt(envs.PORT) || 1200, // 监听端口
    socket: envs.SOCKET || null, // 监听 Unix Socket, null 为禁用
  },
  cache: {
    /**
     * 缓存类型，支持 'memory' 和 'redis'，设为空可以禁止缓存
     * @type {'memory' | 'redis' | 'fs'}
     */
    type: ['memory', 'redis', 'fs'].includes(envs.CACHE_TYPE) ? envs.CACHE_TYPE : "memory",
    // 路由缓存时间，单位为秒
    routeExpire: parseInt(envs.CACHE_EXPIRE, 10) || 1 * 60,
    // 不变内容缓存时间，单位为秒
    contentExpire: parseInt(envs.CACHE_CONTENT_EXPIRE, 10) || 15 * 24 * 60 * 60,
  },
  longWarningThreshold: parseFloat(envs.LONG_WARNING_THRESHOLD, 10) || 5, // in seconds
  prefetch: Boolean(envs.PRE_FETCH),
  ua: envs.UA || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  listenInaddrAny: envs.LISTEN_INADDR_ANY || 1, // 是否允许公网连接，取值 0 1
  requestRetry: parseInt(envs.REQUEST_RETRY) || 2, // 请求失败重试次数
  // 是否显示 Debug 信息，取值 boolean 'false' 'key' ，取值为 'false' false 时永远不显示，取值为 'key' 时带上 ?debug=key 显示
  debugInfo: envs.DEBUG_INFO || true,
  disallowRobot: envs.DISALLOW_ROBOT !== "0" && envs.DISALLOW_ROBOT !== "false",
  titleLengthLimit: parseInt(envs.TITLE_LENGTH_LIMIT) || 150,
  maxOldItemPubDateInDays: parseInt(envs.MAX_OLD_ITEM_PUB_DATE_IN_DAYS) || 1,
  redis: {
    url: envs.REDIS_URL ?? envs.RSSHUB_REDIS_URL ?? "redis://localhost:6379/",
  },
  fsCache: {
    basePath: os.tmpdir(),
    prefix: "rsshub_fs_cache_"
  },
  nodeName: envs.NODE_NAME,
  suffix: envs.SUFFIX,
  pixiv: {
    username: envs.PIXIV_USERNAME,
    password: envs.PIXIV_PASSWORD,
  },
  fanbox: {
    session: envs.FANBOX_SESSION_ID,
  },
  disqus: {
    api_key: envs.DISQUS_API_KEY,
  },
  twitter: {
    consumer_key: envs.TWITTER_CONSUMER_KEY,
    consumer_secret: envs.TWITTER_CONSUMER_SECRET,
    tokens: twitter_tokens,
  },
  youtube: {
    key: envs.YOUTUBE_KEY,
  },
  telegram: {
    token: envs.TELEGRAM_TOKEN,
  },
  github: {
    access_token: envs.GITHUB_ACCESS_TOKEN,
  },
  authentication: {
    name: envs.HTTP_BASIC_AUTH_NAME || "usernam3",
    pass: envs.HTTP_BASIC_AUTH_PASS || "passw0rd",
  },
  bilibili: {
    cookies: bilibili_cookies,
  },
  yuque: {
    token: envs.YUQUE_TOKEN,
  },
  loggerLevel: envs.LOGGER_LEVEL || "info",
  proxyUri: envs.PROXY_URI,
  proxy: {
    protocol: envs.PROXY_PROTOCOL,
    host: envs.PROXY_HOST,
    port: envs.PROXY_PORT,
    auth: envs.PROXY_AUTH,
    url_regex: envs.PROXY_URL_REGEX || ".*",
  },
  blacklist: envs.BLACKLIST && envs.BLACKLIST.split(","),
  whitelist: envs.WHITELIST && envs.WHITELIST.split(","),
  allowLocalhost: envs.ALLOW_LOCALHOST,
  accessKey: envs.ACCESS_KEY,
  enableCluster: envs.ENABLE_CLUSTER,
  email: {
    config: email_config,
  },
  sentry: envs.SENTRY,
  chuiniu: {
    member: envs.CHUINIU_MEMBER,
  },
  weibo: {
    app_key: envs.WEIBO_APP_KEY,
    app_secret: envs.WEIBO_APP_SECRET,
    redirect_url: envs.WEIBO_REDIRECT_URL,
  },
  fanfou: {
    consumer_key: envs.FANFOU_CONSUMER_KEY,
    consumer_secret: envs.FANFOU_CONSUMER_SECRET,
    username: envs.FANFOU_USERNAME,
    password: envs.FANFOU_PASSWORD,
  },
  lastfm: {
    api_key: envs.LASTFM_API_KEY,
  },
  pkubbs: {
    cookie: envs.PKUBBS_COOKIE,
  },
  nhentai: {
    username: envs.NHENTAI_USERNAME,
    password: envs.NHENTAI_PASSWORD,
  },
  discuz: {
    cookies: discuz_cookies,
  },
  scihub: {
    host: envs.SCIHUB_HOST || "https://sci-hub.tw/",
  },
  hotlink: {
    template: envs.HOTLINK_TEMPLATE,
  },
  initium: {
    username: envs.INITIUM_USERNAME,
    password: envs.INITIUM_PASSWORD,
    bearertoken: envs.INITIUM_BEARER_TOKEN,
  },
  btbyr: {
    host: envs.BTBYR_HOST,
    cookies: envs.BTBYR_COOKIE,
  },
  mastodon: {
    apiHost: envs.MASTODON_API_HOST,
    accessToken: envs.MASTODON_API_ACCESS_TOKEN,
    acctDomain: envs.MASTODON_API_ACCT_DOMAIN,
  },
  xiaoyuzhou: {
    device_id: envs.XIAOYUZHOU_ID,
    refresh_token: envs.XIAOYUZHOU_TOKEN,
  },
  nga: {
    uid: envs.NGA_PASSPORT_UID,
    cid: envs.NGA_PASSPORT_CID,
  },
  newrank: {
    cookie: envs.NEWRANK_COOKIE,
  },
  ximalaya: {
    token: envs.XIMALAYA_TOKEN,
  },
  s3Storage: {
    enabled: envs.S3_STORAGE_ENABLED === "true",
    forceFlushSize: parseInt(envs.S3_STORAGE_FORCE_FLUSH_ENTRY_SIZE ?? 200, 10),
    region: envs.S3_STORAGE_REGION,
    bucket: envs.S3_STORAGE_BUCKET,
    accessKeyId: envs.S3_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: envs.S3_STORAGE_SECRET_ACCESS_KEY,
  },
};

module.exports = {
  get value() {
    return value;
  },
};
