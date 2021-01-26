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

            // let pagesObj = {};
            // for (let i = 2; i <= numOfNextPages; i++) {
            //     pagesObj[i] = [];
            // }

            /////////// checking for more pages with results ///////////

            let morePages = {};
            morePages = await page.evaluate(() => {
                const nextPagesBtns = document.querySelectorAll(".pn");
                const nextPagesBtnsList = [...nextPagesBtns];
                if (nextPagesBtns.length > 0) {
                    return {
                        areThereMore: true,
                        lastBtn:
                            nextPagesBtnsList[nextPagesBtnsList.length - 1]
                                .innerText,
                    };
                } else {
                    return { areThereMore: false };
                }
            });

            // nextPagesBtns[nextPagesBtns.length-1].innerText ----> getting last btn and check value for number (page) / empty string (>)

            ////////// trying to get results from next pages //////////////

            let nextPages = {};

            if (morePages.areThereMore) {
                let start = 10;
                let pageNum = 2;
                while (morePages.lastBtn.length == 0) {
                    const nextUrl = `https://de.indeed.com/Jobs?q=${job}&l=${city}&start=${start}`;
                    await page.goto(nextUrl, { waitUntil: "networkidle2" });
                    let jobsFoundOnSecondPage = await page.evaluate(() => {
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
                            jobArray[i].company = jobCompanyList[i].innerText;
                        }
                        return jobArray;
                    });
                    nextPages[pageNum] = jobsFoundOnSecondPage;

                    morePages = await page.evaluate(() => {
                        const nextPagesBtns = document.querySelectorAll(".pn");
                        const nextPagesBtnsList = [...nextPagesBtns];
                        return {
                            lastBtn:
                                nextPagesBtnsList[nextPagesBtnsList.length - 1]
                                    .innerText,
                        };
                    });

                    start = start + 10;
                    pageNum++;
                }
            }

            const result = {};
            result.jobsFound = jobsFound;
            result.nextPages = nextPages;

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
