const express = require("express");
const app = express();
const compression = require("compression");
const csurf = require("csurf");
const cookieSession = require("cookie-session");
const path = require("path");

const {
    getJobtitleAndLink,
    getJobDescription,
} = require("../puppeteer-jobs-search");

require("events").EventEmitter.defaultMaxListeners = 15;

/////////////////////////////////////////

app.use(compression());

app.use(
    express.json({
        extended: false,
    })
);

const cookieSessionMiddleware = cookieSession({
    secret: `This is secret.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});
app.use(cookieSessionMiddleware);

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static(path.join(__dirname, "..", "client", "public")));

/////////////////////////////////////////

app.post("/indeed-search", (req, res) => {
    const { userInputJob, userInputCity } = req.body;
    let jobs = [];
    getJobtitleAndLink(userInputJob, userInputCity)
        .then((jobsFound) => {
            jobs = jobsFound;
            for (let i = 0; i < jobs.length; i++) {
                jobs[i].id = i + 1;
            }
            res.json({ jobs: jobs });
        })
        .catch((err) => {
            console.error("error in getJobtitleAndLink: ", err);
        });
});

app.get("/get-job-description/:link", (req, res) => {
    const { link } = req.params;
    console.log("link: ", link);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
