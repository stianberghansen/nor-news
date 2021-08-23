// Load .env variables
require("dotenv").config({ path: __dirname + "/config/dev.env" });

const cors = require("cors");
const express = require("express");
const cron = require("node-cron");
const app = express();
const db = require("./db");
const scraper = require("./scraper");

const PORT = process.env.PORT | 4000;

app.use(cors());
cron.schedule("* * * * *", () => {
    scraper.fetchBrands();
});

scraper.fetchBrands();

app.get("/articles", (req, res) => {
    db.Article.find()
        .sort({ datePosted: 1 })
        .limit(100)
        .then((latestArticles) => {
            res.json(latestArticles);
        })
        .catch((err) => {
            console.log(err);
        });
});

app.use("/", (req, res) => {
    res.json(Date());
});

app.listen(PORT, () => {
    console.log("listening on " + PORT);
});

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});
