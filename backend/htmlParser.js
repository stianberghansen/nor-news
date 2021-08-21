const $ = require("cheerio");
const db = require("./db");

async function parseHTML(page, brand) {
    let html = await page.evaluate(() => document.body.innerHTML);
    let articles = [];
    switch (brand.name) {
        case "Dagbladet":
            $("article", html).each(function (i, item) {
                const headline = $("a", item)
                    .attr("aria-label")
                    .replace(/<\/?[^>]+(>|$)/g, "");
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
                $(".article-meta", item).remove();
                const headline = $(".titles", item)
                    .text()
                    .replace(/\n/g, " ")
                    .trim();
                const link = $("a", item).attr("href");
                const type = $(item).attr("data-paywall");
                const articleID = $(item).attr("data-drfront-id");

                if ((type == "true") | !headline | !link | !articleID) {
                    return null;
                } else {
                    let object = {
                        articleID: articleID,
                        title: headline.toString(),
                        url: link.toString(),
                        brand: "VG",
                        datePosted: new Date(),
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
