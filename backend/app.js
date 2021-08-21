// Load .env variables
require("dotenv").config({ path: __dirname + "/config/dev.env" });

const puppeteer = require("puppeteer");
const $ = require("cheerio");
const cors = require("cors");
const express = require("express");
const cron = require("node-cron");
const app = express();
const db = require("./db");
const parseHTML = require("./htmlParser");

const PORT = process.env.PORT | 4000;

app.use(cors());
cron.schedule("* * * * *", () => {
    fetchBrands();
});

const browserArgs = ["--disable-gpu", "--no-sandbox"];

fetchBrands = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: browserArgs,
    });
    const brands = await db.Brand.find();

    for (const brand of brands) {
        await monitor(browser, brand);
    }

    await browser.close();
};

monitor = async (browser, brand) => {
    const page = await browser.newPage();
    await page.goto(brand.url);
    const articles = await parseHTML(page, brand);
    db.bulkInsert(articles);
    await page.close();
};

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

fetchBrands();

app.use("/", (req, res) => {
    res.json(Date());
});

app.listen(PORT, () => {
    console.log("listening on " + PORT);
});

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});
