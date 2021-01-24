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
        .then((data) => {
            getJobDescription(data.firstPageResults[0].link)
                .then((data) => {
                    console.log("data: ", data);
                })
                .catch((err) => {
                    console.error("error in getJobDescription: ", err);
                });
            // res.json({ jobTitlesArray });
        })
        .catch((err) => {
            console.error("error in getJobtitleAndLink: ", err);
        });
    // getJobtitle(userInputJob, userInputCity)
    //     .then(() => {
    //         console.log("done");
    //     })
    //     .catch((err) => {
    //         console.error("error in getJobtitle: ", err);
    //     });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
