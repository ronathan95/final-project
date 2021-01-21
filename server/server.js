const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

const { getJobtitle } = require("../puppeteer-jobs-search");

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("/test", (req, res) => {
    getJobtitle()
        .then(() => {
            console.log("check your screenshot");
        })
        .catch((err) => {
            console.error("error in getJobtitle: ", err);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
