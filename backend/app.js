// Load .env variables
require("dotenv").config({ path: __dirname + "/config/dev.env" });
process.send = process.send || function () {};

const cors = require("cors");
const express = require("express");
const cron = require("node-cron");
const app = express();
const db = require("./db");
const scraper = require("./scraper");

const PORT = process.env.PORT | 4000;

app.use(cors());
cron.schedule("* * * * *", () => {
    scraper.fetchNewArticles();
});

scraper.fetchNewArticles();

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

app.use("/", (req, res) => {
    res.json(Date());
});

const server = app.listen(PORT, () => {
    console.log("listening on " + PORT);
    process.send("ready");
});

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
});

process.on("SIGTERM", () => {
    console.info("SIGTERM signal received");
    console.info("Closing server");
    server.close((err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        db.closeConnection();
        console.log("Server stopped");
        process.exit(0);
    });
});
