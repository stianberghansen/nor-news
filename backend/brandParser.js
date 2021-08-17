const $ = require("cheerio");
const db = require("./db");

async function fetchAndParse(page, brand) {
    await page.reload();
    let html = await page.evaluate(() => document.body.innerHTML);
    switch (brand.name) {
        case "Dagbladet":
            let dbArticles = [];
            $("article", html).each(function (i, item) {
                let headline = $(".headline", item).text();
                let link = $("a", item).attr("href");
                let type = $(item).attr("data-label");

                if (!headline | !link | (type == "pluss") | (type == "video")) {
                    return null;
                } else {
                    const object = {
                        title: headline.toString(),
                        url: link.toString(),
                        brand: "Dagbladet",
                        datePosted: new Date(),
                    };
                    dbArticles.push(object);
                }
            });
            bulkInsert(dbArticles);
            dbArticles = [];
            break;
        case "VG":
            let vgArticles = [];
            $("article", html).each(function (i, item) {
                const headline = $(".headline", item).text();
                const link = $("a", item).attr("href");
                const type = $(item).attr("data-paywall");
                const datePosted = $("time", item).attr("datetime");

                if ((type == "true") | !datePosted | !headline) {
                    return null;
                } else {
                    let object = {
                        title: headline.toString(),
                        url: link.toString(),
                        brand: "VG",
                        datePosted: datePosted,
                    };
                    vgArticles.push(object);
                }
            });
            bulkInsert(vgArticles);
            vgArticles = [];
            break;
        default:
            console.log("No switch statement matching brand name");
    }
    html = {};
}

const bulkInsert = (data) => {
    db.Article.insertMany(data, { ordered: false })
        .then((res) => {
            console.log("added " + res + " new articles");
        })
        .catch((err) => {
            //console.error(err);
        });
};

module.exports = fetchAndParse;
