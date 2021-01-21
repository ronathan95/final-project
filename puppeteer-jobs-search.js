const puppeteer = require("puppeteer");
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
            executablePath: "/usr/bin/chromium-browser",
        });
    }
    return browser;
}

// module.exports.getJobtitle = async function () {
//     let browser = await puppeteer.launch();
//     let page = browser.newPage();

//     await page.goto(indeedUrl, { waitUntil: "networkidle2" });

//     let data = await page.evaluate(() => {
//         jobTitle = document.querySelectorAll('h2[class="title"] > a').innerText;
//     });
//     return data;
// };

module.exports.getJobtitle = function () {
    return new Promise(async (resolve, reject) => {
        let browser;
        try {
            browser = await puppeteerConfig();
            const page = await browser.newPage();
            await page.waitFor(500);
            let data = await page.evaluate(() => {
                jobTitle = document.querySelectorAll('h2[class="title"] > a')
                    .innerText;
            });
            await browser.close();
            resolve(data);
        } catch (error) {
            console.log("error: ", error);
            reject(error);
        }
    });
};

// function getPriceFromAmazon(books) {
//     booksPricesToUpdate = [];
//     return new Promise(async (resolve, reject) => {
//         let browser;
//         try {
//             browser = await puppeteerConfig();
//             const page = await browser.newPage();
//             await page.waitFor(500);
//             for (const book of books) {
//                 await performSearch(page, book);
//             }
//             await browser.close();
//             resolve(booksPricesToUpdate);
//         } catch (error) {
//             console.log("error: ", error);
//             reject(error);
//         }
//     });
// }
