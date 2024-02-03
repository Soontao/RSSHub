const config = require("@/config").value;

const options = {
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    `--user-agent=${config.ua}`,
  ],
  headless: true,
  ignoreHTTPSErrors: true,
  userDataDir: "./tmp",
};

module.exports = async (timeout = 30 * 1000) => {
  const puppeteer = require("puppeteer");
  const logger = require("./logger");

  let browser;
  if (config.puppeteerWSEndpoint) {
    browser = await puppeteer.connect({
      browserWSEndpoint: config.puppeteerWSEndpoint,
    });
  } else {
    browser = await puppeteer.launch(options);
  }
  setTimeout(async () => {
    try {
      await browser.close();
    } catch (error) {
      logger.error(error);
    }
  }, timeout);

  return browser;
};
