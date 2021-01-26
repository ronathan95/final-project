const puppeteerExtra = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");

const sanitizeHtml = require("sanitize-html");

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
            await page.screenshot({ path: "1.png" });
            jobsFound = await page.evaluate(() => {
                // getting jobs titels and links from 1st page
                let jobTitles = document.querySelectorAll(".title > a");
                let jobCompany = document.querySelectorAll(".company");
                const jobTitlesList = [...jobTitles];
                const jobCompanyList = [...jobCompany];
                const jobArray = jobTitlesList.map((title) => {
                    return {
                        title: title.title,
                        link: title.href,
                    };
                });
                for (let i = 0; i < jobArray.length; i++) {
                    jobArray[i].id = i + 1;
                    jobArray[i].company = jobCompanyList[i].innerText;
                }
                return jobArray;
            });

            /////////// checking for more pages with results ///////////

            const numOfNextPages = await page.evaluate(() => {
                let nextPagesBtns = document.querySelectorAll(".pn");
                let numOfPages = 0;
                for (let i = 0; i < nextPagesBtns.length; i++) {
                    if (nextPagesBtns[i].innerText.length > 0) {
                        numOfPages++;
                    }
                }
                return numOfPages;
            });

            // numOfNextPages ----> number of times to do the loop
            //".pagination-list > li:nth-child(2) > a > .pn" ----> starter selctor, number 2 is changing in the loop

            ////////// trying to get results from next pages //////////////

            let pagesObj = {};
            for (let i = 2; i <= numOfNextPages; i++) {
                pagesObj[i] = [];
            }

            if (numOfNextPages > 0) {
                // on 1st page, clicking 2nd page
                await page.click(
                    `.pagination-list > li:nth-child(2) > a > .pn`
                );
                await page.waitFor(5000);
                await page.screenshot({ path: "2.png" });
                let data = await page.evaluate(() => {
                    let jobTitles = document.querySelectorAll(".title > a");
                    const jobTitlesList = [...jobTitles];
                    const jobArray = jobTitlesList.map((title) => {
                        return title.title;
                    });
                    return jobArray;
                });
                pagesObj[2] = data;
            }

            if (numOfNextPages > 1) {
                // on 2nd page
                for (
                    let pageNum = 3;
                    pageNum <= numOfNextPages + 1;
                    pageNum++
                ) {
                    // to enter pageNum
                    await page.click(
                        `.pagination-list > li:nth-child(${
                            pageNum + 1
                        }) > a > .pn`
                    );
                    await page.waitFor(5000);
                    let data = await page.evaluate(() => {
                        let jobTitles = document.querySelectorAll(".title > a");
                        const jobTitlesList = [...jobTitles];
                        const jobArray = jobTitlesList.map((title) => {
                            return title.title;
                        });
                        return jobArray;
                    });
                    pagesObj[pageNum] = data;
                }
            }

            const result = {};
            result.jobsFound = jobsFound;
            result.pagesObj = pagesObj;

            await browser.close();
            resolve(result);
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
            let dirtyDescription = await page.evaluate(() => {
                let jobDescription = document.querySelector(
                    "#jobDescriptionText"
                );
                return jobDescription.innerHTML;
            });
            const cleanDescription = sanitizeHtml(dirtyDescription);
            await browser.close();
            resolve(cleanDescription);
        } catch (error) {
            console.log("error: ", error);
            reject(error);
        }
    });
};
