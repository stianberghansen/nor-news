const mongoose = require("mongoose");
const schema = require("./models");

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: process.env.AUTH_SOURCE,
    auth: { user: process.env.DB_USER, password: process.env.DB_PASSWORD },
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("connection succeeded"));

const Article = db.model("Article", schema.article);
const Brand = db.model("Brand", schema.brand);

module.exports = { Article, Brand };
