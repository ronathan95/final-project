const puppeteerExtra = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");

let jobsFound = [];

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

//await page.screenshot({ path: "test.png" }); ---> screenshot for testing

module.exports.getJobtitle = function (job, city) {
    return new Promise(async (resolve, reject) => {
        const indeedUrl = `https://de.indeed.com/Jobs?q=${job}&l=${city}`;
        let browser;
        try {
            browser = await puppeteerConfig();
            const page = await browser.newPage();
            await page.waitFor(500);
            await page.goto(indeedUrl, { waitUntil: "networkidle2" });
            let data = await page.evaluate(() => {
                // getting jobs on current page
                let jobTitles = document.querySelectorAll(".title > a");
                const jobTitlesList = [...jobTitles];
                jobsFound = jobTitlesList.map((title) => {
                    return { firstPageResults: title.innerText };
                });
            });
            // // checking for more pages with results
            // let morePagesButtons = document.querySelectorAll(
            //     ".pagination-list"
            // );
            // const morePages = [...morePagesButtons];
            // if (morePages.length == 0) {
            //     return jobsFound;
            // } else {
            //     let pages = document.querySelectorAll(".pagination-list > li");
            //     const pagesList = [...pages];
            //     await page.click(pagesList[0]);
            //     await page.screenshot({ path: "test.png" });
            // }
            await browser.close();
            resolve(data);
        } catch (error) {
            console.log("error: ", error);
            reject(error);
        }
    });
};
