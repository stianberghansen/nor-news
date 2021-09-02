const $ = require("cheerio");
const db = require("./db");

const Article = (
    id = isRequired("id"),
    headline = isRequired("headline"),
    url = isRequired("url"),
    brand = isRequired("brand")
) => {
    return {
        articleID: id,
        title: headline,
        url: url,
        brand: brand,
        datePosted: new Date(),
    };
};

isRequired = (argumentName) => {
    throw new Error(`${argumentName} is a required argument`);
};

async function parseHTML(html, brand) {
    let articles = [];
    switch (brand.name) {
        case "Dagbladet":
            $("article", html).each(function (i, item) {
                const headline = $("a", item)
                    .attr("aria-label")
                    .replace(/<\/?[^>]+(>|$)/g, "")
                    .replace(/\&nbsp;/g, " ");
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

parseUrl = (url, target) => {
    const arr = url.split("/");

    if (!targetValidation(target)) {
        console.log("Check target argument");
        return null;
    }

    for (const elem of arr) {
        if ((elem.length == target.length) & (elem.typeOf == target.type)) {
            return result;
        }
    }

    return null;
};

targetValidation = (target, validKeyNames) => {
    //const validKeyNames = ["length", "type"];
    return Object.keys(validKeyNames).every((elem) => target.includes(elem));
};

//const testURL =
//("https://www.dagbladet.no/sport/kommer-med-beklagelse---benekter-narkotikabruk/74141645?articleToken=7137029c8f6a5940e77314cb705b7ccd33e9c503924dd8c8079c4783794da4a0");
//parseUrl(testURL, { id: String() });

module.exports = parseHTML;
