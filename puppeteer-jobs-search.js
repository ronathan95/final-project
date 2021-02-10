const puppeteerExtra = require("puppeteer-extra");
const pluginStealth = require("puppeteer-extra-plugin-stealth");

const sanitizeHtml = require("sanitize-html");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets");
}

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
        let jobsFound = {};
        let id = 1;
        const indeedUrl = `https://de.indeed.com/Jobs?q=${job}&l=${city}`;
        let browser;
        try {
            browser = await puppeteerConfig();
            const page = await browser.newPage();
            await page.waitFor(500);
            await page.goto(indeedUrl, { waitUntil: "networkidle2" });
            firstPageArray = await page.evaluate((id) => {
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
                    jobArray[i].id = id;
                    jobArray[i].company = jobCompanyList[i].innerText;
                    id++;
                }
                return {
                    jobArray,
                    lastId: id,
                };
            }, id);

            jobsFound[1] = firstPageArray.jobArray;
            id = firstPageArray.lastId;

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

            ////////// getting results from next pages //////////////

            if (morePages.areThereMore) {
                let start = 10;
                let pageNum = 2;
                while (morePages.lastBtn.length == 0) {
                    const nextUrl = `https://de.indeed.com/Jobs?q=${job}&l=${city}&start=${start}`;
                    await page.goto(nextUrl, { waitUntil: "networkidle2" });
                    let jobsFoundOnSecondPage = await page.evaluate((id) => {
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
                            jobArray[i].id = id;
                            jobArray[i].company = jobCompanyList[i].innerText;
                            id++;
                        }
                        return {
                            jobArray,
                            lastId: id,
                        };
                    }, id);
                    jobsFound[pageNum] = jobsFoundOnSecondPage.jobArray;
                    id = jobsFoundOnSecondPage.lastId;

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

            let result = {};
            result.jobsFound = jobsFound;

            await browser.close();
            resolve(result);
        } catch (error) {
            console.error("error in getJobtitleAndLink: ", error);
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
            console.error("error in getJobDescription: ", error);
            reject(error);
        }
    });
};

module.exports.glassDoor = function (company) {
    return new Promise(async (resolve, reject) => {
        let browser;
        const glassDoorUrl =
            "https://www.glassdoor.de/member/home/companies.htm";
        try {
            browser = await puppeteerConfig();
            const page = await browser.newPage();
            await page.waitFor(500);
            await page.goto(glassDoorUrl, { waitUntil: "networkidle2" });
            await page.click("#onetrust-accept-btn-handler");
            await page.type("#userEmail", secrets.GLASSDOOR_EMAIL);
            await page.type("#userPassword", secrets.GLASSDOOR_PW);
            await page.click(".gd-ui-button");
            await page.waitForNavigation();

            await page.setViewport({ width: 1000, height: 657 });
            await page.type(
                "#scBar .d-flex.col-6.p-0.search__SearchStyles__searchKeywordContainer input",
                company
            );
            await page.click(".gd-ui-button");
            await page.waitForNavigation();

            const score = await page.evaluate(() => {
                const scoreDiv = document.querySelector(
                    "#EIOverviewContainer > .css-ifw56c > .mt-std > .mb-md-md > .mr-xsm"
                );
                if (scoreDiv) {
                    return scoreDiv.innerText;
                } else {
                    return false;
                }
            });

            await browser.close();
            resolve(score);
        } catch (error) {
            console.error("error in getJobDescription: ", error);
            reject(error);
        }
    });
};
