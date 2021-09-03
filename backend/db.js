const mongoose = require("mongoose");
const schema = require("./models");

createConnection = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: process.env.AUTH_SOURCE,
        auth: { user: process.env.DB_USER, password: process.env.DB_PASSWORD },
    });
};

mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("Database connection established"));

const Article = db.model("Article", schema.article);
const Brand = db.model("Brand", schema.brand);

closeConnection = () => {
    mongoose.connection.close(() => {
        console.log("Database connection closed");
    });
};

bulkInsert = (data) => {
    return new Promise((resolve, reject) => {
        try {
            Article.insertMany(data, { ordered: false }, function (err, res) {
                if (err.writeErrors) {
                    if (err.code != 11000) {
                        reject(err);
                    }
                }
                resolve(true);
            });
        } catch (err) {
            throw new Error("No data passed", { cause: err });
        }
    });
};

module.exports = {
    Article,
    Brand,
    bulkInsert,
    createConnection,
    closeConnection,
};
