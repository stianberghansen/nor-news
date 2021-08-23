const $ = require("cheerio");
const db = require("./db");

const Article = (id, headline, url, brand) => {
    return {
        articleID: id,
        title: headline,
        url: url,
        brand: brand,
        datePosted: new Date(),
    };
};

async function parseHTML(html, brand) {
    let articles = [];
    switch (brand.name) {
        case "Dagbladet":
            $("article", html).each(function (i, item) {
                const headline = $("a", item)
                    .attr("aria-label")
                    .replace(/<\/?[^>]+(>|$)/g, "");
                const url = $("a", item).attr("href");
                const type = $(item).attr("data-label");
                const articleID = url.split("/");

                if (
                    !articleID[5] |
                    !headline |
                    !url |
                    (type == "pluss") |
                    (type == "video")
                ) {
                    return null;
                } else {
                    const object = Article(
                        articleID[5],
                        headline,
                        url,
                        "Dagbladet"
                    );
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
                const url = $("a", item).attr("href");
                const type = $(item).attr("data-paywall");
                const articleID = $(item).attr("data-drfront-id");

                if ((type == "true") | !headline | !url | !articleID) {
                    return null;
                } else {
                    const object = Article(articleID, headline, url, "VG");
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
