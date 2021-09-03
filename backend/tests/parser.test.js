const puppeteer = require("puppeteer");
const parseHTML = require("../htmlParser");
const mongoose = require("mongoose");
const Article = require("../db").Article;
const Brand = require("../db").Brand;

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

beforeEach((done) => {
    mongoose.connect(
        process.env.DB_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: process.env.AUTH_SOURCE,
            auth: {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
            },
        },
        () => done()
    );
});

afterAll(async () => {
    await browser.closeBrowser();
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done());
    });
});

describe("Test parser against all brands in db", () => {
    it("fetching and parsing websites of brands in db", async () => {
        //Fetch all brands w/urls from database
        const brands = await Brand.find();

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
                        url: expect
                            .toMatch(/`${brand.name}`/)
                            .toMatch(/https:/)
                            .toBe(/www/),
                        brand: expect.toEqual(brand.name),
                        datePosted: expect.any(Date),
                        title: expect.any(String).toBeGreaterThan,
                    })
                );
                expect(url.length).toBeGreaterThan(11);
            }
        }
    }, 15000);
});
