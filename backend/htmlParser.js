const $ = require("cheerio");
const db = require("./db");

async function parseHTML(page, brand) {
    let html = await page.evaluate(() => document.body.innerHTML);
    let articles = [];
    switch (brand.name) {
        case "Dagbladet":
            $("article", html).each(function (i, item) {
                const headline = $(".headline", item).text();
                const link = $("a", item).attr("href");
                const type = $(item).attr("data-label");
                const articleID = link.split("/");

                if (!headline | !link | (type == "pluss") | (type == "video")) {
                    return null;
                } else {
                    const object = {
                        articleID: articleID[5],
                        title: headline.toString(),
                        url: link.toString(),
                        brand: "Dagbladet",
                        datePosted: new Date(),
                    };
                    articles.push(object);
                }
            });
            break;
        case "VG":
            $("article", html).each(function (i, item) {
                const headline = $(".headline", item).text();
                const link = $("a", item).attr("href");
                const type = $(item).attr("data-paywall");
                const datePosted = $("time", item).attr("datetime");
                const articleID = $(item).attr("data-drfront-id");

                if ((type == "true") | !datePosted | !headline) {
                    return null;
                } else {
                    let object = {
                        articleID: articleID,
                        title: headline.toString(),
                        url: link.toString(),
                        brand: "VG",
                        datePosted: datePosted,
                    };
                    articles.push(object);
                }
            });
            break;
        default:
            console.log("No switch statement matching brand name");
    }
    return articles;
}

module.exports = parseHTML;
