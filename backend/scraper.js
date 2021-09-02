const parseHTML = require("./htmlParser");
const db = require("./db");
const puppeteer = require("puppeteer");

const browserArgs = ["--disable-gpu", "--no-sandbox"];

fetchBrands = async () => {
    const brands = await db.Brand.find();
    return brands;
};

getWebsiteArticles = async (browser, brand) => {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await page.goto(brand.url);
    const html = await page.evaluate(() => document.body.innerHTML);
    const articles = await parseHTML(html, brand);
    await page.close();
    return articles;
};

fetchNewArticles = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: browserArgs,
    });

    const brands = await fetchBrands();

    for (const brand of brands) {
        try {
            const articles = await getWebsiteArticles(browser, brand);
            const result = db.bulkInsert(articles);
        } catch (e) {
            console.error(e);
        }
    }

    await browser.close();
};

module.exports = { fetchNewArticles };
