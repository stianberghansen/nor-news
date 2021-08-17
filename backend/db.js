const mongoose = require("mongoose");
const schema = require("./models");

mongoose.connect("mongodb://192.168.86.222:27017/newsScraper", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: "admin",
    auth: { user: "root", password: "pass12345" },
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("connection succeeded"));

const Article = db.model("Article", schema.article);
const Brand = db.model("Brand", schema.brand);

module.exports = { Article, Brand };
