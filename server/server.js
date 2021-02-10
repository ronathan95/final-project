const express = require("express");
const app = express();
const compression = require("compression");
const csurf = require("csurf");
const cookieSession = require("cookie-session");
const path = require("path");

const {
    getJobtitleAndLink,
    getJobDescription,
    glassDoor,
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
    getJobtitleAndLink(userInputJob, userInputCity)
        .then(({ jobsFound }) => {
            res.json({ jobs: jobsFound });
        })
        .catch((err) => {
            console.error("error in getJobtitleAndLink: ", err);
        });
});

app.get("/get-job-description/:link", (req, res) => {
    const { link } = req.params;
    getJobDescription(link)
        .then((description) => {
            res.json({ description });
        })
        .catch((err) => {
            console.error("error in getJobDescription: ", err);
        });
});

app.get("/get-company-score/:company", (req, res) => {
    const { company } = req.params;
    glassDoor(company)
        .then((score) => {
            res.json({ score });
        })
        .catch((err) => {
            console.error("error in glassDoor: ", err);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
