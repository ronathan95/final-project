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
                return {
                    firstPageResults: (jobsFound = jobTitlesList.map(
                        (title) => {
                            return title.innerText;
                        }
                    )),
                };
            });
            // checking for more pages with results

            let pagesButtons = await page.evaluate(() => {
                let morePagesButtons = document.querySelectorAll(
                    ".pagination-list"
                );
                const morePages = [...morePagesButtons];
                let pages = document.querySelectorAll(".pn");
                const pagesBtns = [...pages];
                return pagesBtns;
            });
            await page.click(
                ".pagination > .pagination-list > li:nth-child(2) > a > .pn"
            );
            await page.waitFor(5000);
            data = await page.evaluate(() => {
                // getting jobs on current page
                let jobTitles = document.querySelectorAll(".title > a");
                const jobTitlesList = [...jobTitles];
                return {
                    secondPageResults: (jobsFound = jobTitlesList.map(
                        (title) => {
                            return title.innerText;
                        }
                    )),
                };
            });

            // let morePagesButtons = document.querySelectorAll(
            //     ".pagination-list"
            // );
            // const morePages = [...morePagesButtons];
            // let pages = document.querySelectorAll(".pagination-list > li");
            // const pagesList = [...pages];
            // await page.click(pagesList[0]);
            // await page.screenshot({ path: "test.png" });
            await browser.close();
            resolve(data);
            //////////////
            // if (morePages.length == 0) {
            //     await browser.close();
            //     resolve(data);
            // } else {
            //     let pages = document.querySelectorAll(".pagination-list > li");
            //     const pagesList = [...pages];
            //     await page.click(pagesList[0]);
            //     await page.screenshot({ path: "test.png" });
            //     await browser.close();
            //     resolve(data);
            // }
        } catch (error) {
            console.log("error: ", error);
            reject(error);
        }
    });
};
