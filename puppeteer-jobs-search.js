const puppeteerExtra = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");
let jobsFound = [];
const job = "developer";
const city = "berlin";
const indeedUrl = `https://de.indeed.com/Jobs?q=${job}&l=${city}`;

async function puppeteerConfig() {
    let browser;
    puppeteerExtra.use(pluginStealth());
    if (process.env.PORT) {
        browser = await puppeteerExtra.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: true,
        });
    } else {
        browser = await puppeteerExtra.launch({
            executablePath: "/usr/bin/chromium",
        });
    }
    return browser;
}

module.exports.getJobtitle = function () {
    return new Promise(async (resolve, reject) => {
        let browser;
        try {
            browser = await puppeteerConfig();
            const page = await browser.newPage();
            await page.waitFor(500);
            await page.goto(indeedUrl, { waitUntil: "networkidle2" });
            // let data = await page.screenshot({ path: "test.png" });
            await page.screenshot({ path: "test.png" });
            await browser.close();
            // resolve(data);
        } catch (error) {
            console.log("error: ", error);
            reject(error);
        }
    });
};
