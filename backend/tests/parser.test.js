const puppeteer = require("puppeteer");
const parseHTML = require("../htmlParser");
const db = require("../db");

const browserArgs = ["--disable-gpu", "--no-sandbox"];

class BrowserWrapper {
    async init() {
        this.browser = await puppeteer.launch({
            headless: true,
            args: browserArgs,
        });
    }

    async closeBrowser() {
        await this.browser.close();
    }

    async newPage() {
        this.page = await this.browser.newPage();
        return this.page;
    }

    async closePage() {
        await this.page.close();
    }

    async getHtml(url) {
        await this.page.goto(url);
        const html = await this.page.evaluate(() => document.body.innerHTML);
        return html;
    }
}

const browser = new BrowserWrapper();

beforeAll(async () => {
    await browser.init();
});

afterAll(async () => {
    await browser.closeBrowser();
    db.closeConnection();
});

describe("Test parser against all brands in db", () => {
    test("fetching and parsing websites of brands in db", async () => {
        //Fetch all brands w/urls from database
        const brands = await db.Brand.find();

        //Fetch all websites and parse html for all articles
        for (const brand of brands) {
            await browser.newPage();
            const html = await browser.getHtml(brand.url);
            await browser.closePage();
            const articles = await parseHTML(html, brand);
            expect(articles.length).toBeGreaterThan(25);
            for (const article of articles) {
                expect(article).toEqual(
                    expect.objectContaining({
                        articleID: expect.any(String),
                        url: expect.any(String),
                        brand: expect.any(String),
                        datePosted: expect.any(Date),
                        title: expect.any(String),
                    })
                );
            }
        }
    }, 15000);
});
