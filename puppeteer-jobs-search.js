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

module.exports.getJobtitleAndLink = function (job, city) {
    return new Promise(async (resolve, reject) => {
        const indeedUrl = `https://de.indeed.com/Jobs?q=${job}&l=${city}`;
        let browser;
        try {
            browser = await puppeteerConfig();
            const page = await browser.newPage();
            await page.waitFor(500);
            await page.goto(indeedUrl, { waitUntil: "networkidle2" });
            jobsFound = await page.evaluate(() => {
                // getting jobs titels and links from 1st page
                let jobTitles = document.querySelectorAll(".title > a");
                const jobTitlesList = [...jobTitles];
                return jobTitlesList.map((title) => {
                    return {
                        title: title.innerText,
                        link: title.href,
                    };
                });
            });

            /////////// checking for more pages with results ///////////

            // let numOfNextPages = await page.evaluate(() => {
            //     let nextPagesBtns = document.querySelectorAll(".pn");
            //     return nextPagesBtns.length;
            // });

            ////////// clicking on page "li:nth-child(#)" //////////////

            // await page.click(
            //     ".pagination > .pagination-list > li:nth-child(2) > a > .pn"
            // );
            // await page.waitFor(5000);
            // data = await page.evaluate(() => {
            //     // getting jobs on page
            //     let jobTitles = document.querySelectorAll(".title > a");
            //     const jobTitlesList = [...jobTitles];
            //     return {
            //         secondPageResults: (jobsFound = jobTitlesList.map(
            //             (title) => {
            //                 return title.innerText;
            //             }
            //         )),
            //     };
            // });

            await browser.close();
            resolve(jobsFound);
        } catch (error) {
            console.log("error: ", error);
            reject(error);
        }
    });
};

module.exports.getJobDescription = function (link) {
    return new Promise(async (resolve, reject) => {
        let browser;
        try {
            browser = await puppeteerConfig();
            const page = await browser.newPage();
            await page.waitFor(500);
            await page.goto(link);
            let description = await page.evaluate(() => {
                let jobDescription = document.querySelector(
                    "#jobDescriptionText"
                );
                return jobDescription.innerText;
            });
            await browser.close();
            resolve(description);
        } catch (error) {
            console.log("error: ", error);
            reject(error);
        }
    });
};
