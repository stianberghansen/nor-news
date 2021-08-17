//Load .env variables
require("dotenv").config();

const puppeteer = require("puppeteer");
const $ = require("cheerio");
const cors = require("cors");
const express = require("express");
const cron = require("node-cron");
const app = express();
const db = require("./db");
const fetchAndParse = require("./brandParser");

const PORT = 4000;
const TIMEOUT = 1000 * 1000;

app.use(cors());
cron.schedule("* * * * *", () => {
    fetchBrands();
});

fetchBrands = () => {
    db.Brand.find().then((brand) => {
        for (const b of brand) {
            monitor(b);
        }
    });
};

async function configureBrowser(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

async function monitor(brand) {
    let page = await configureBrowser(brand.url);
    fetchAndParse(page, brand);
}

app.get("/articles", (req, res) => {
    db.Article.find()
        .sort({ datePosted: -1 })
        .limit(100)
        .then((latestArticles) => {
            res.json(latestArticles);
        })
        .catch((err) => {
            console.log(err);
        });
});

fetchBrands();

app.use("/", (req, res) => {
    res.json(Date());
});

app.listen(PORT, () => {
    console.log("listening on " + PORT);
});
