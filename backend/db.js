const mongoose = require("mongoose");
const schema = require("./models");

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: process.env.AUTH_SOURCE,
    auth: { user: process.env.DB_USER, password: process.env.DB_PASSWORD },
});

mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connection succeeded"));

const Article = db.model("Article", schema.article);
const Brand = db.model("Brand", schema.brand);

const bulkInsert = (data) => {
    Article.insertMany(data, { ordered: false })
        .then((res) => {
            console.log("added new articles");
        })
        .catch((err) => {
            if (err.code == 11000) {
                console.log("no new articles added");
            } else {
                console.error(err);
            }
        });
};

module.exports = { Article, Brand, bulkInsert };
