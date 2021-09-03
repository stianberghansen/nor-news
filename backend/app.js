// Load .env variables
require("dotenv").config({ path: __dirname + "/config/dev.env" });

// Setup process.send to accept function
process.send = process.send || function () {};

//Dependencies
const cors = require("cors");
const cron = require("node-cron");
const express = require("express");
const app = express();
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const rfs = require("rotating-file-stream");

// Module imports
const article = require("./db").Article;
const connectToDb = require("./db").createConnection;
const scraper = require("./scraper");

const PORT = process.env.PORT | 4000;

//Middleware
const accessLogStream = rfs.createStream("access.log", {
    interval: "7d",
    path: path.join(__dirname, "log"),
});
app.use(morgan("short", { stream: accessLogStream }));
app.use(cors());

// Scraper scheduler
cron.schedule("* * * * *", () => {
    scraper.fetchNewArticles();
});

app.get("/articles", (req, res) => {
    article
        .find()
        .sort({ datePosted: 1 })
        .limit(100)
        .then((latestArticles) => {
            res.json(latestArticles);
        })
        .catch((err) => {
            console.log(err);
        });
});

scraper.fetchNewArticles();

app.get("/healthcheck", (req, res) => {
    res.json(Date());
});

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const server = app.listen(PORT, () => {
    console.log("listening on " + PORT);
    connectToDb();
    process.send("ready");
});

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at: Promise", p, "reason:", reason);
    process.exit(1);
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

module.exports = server;
