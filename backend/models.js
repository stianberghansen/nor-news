const mongoose = require("mongoose");

const article = new mongoose.Schema({
    articleID: { type: "string", required: "true", unique: "true" },
    title: { type: "string", required: "true" },
    url: { type: "string", required: "true", unique: "true", dropDups: "true" },
    brand: { type: "string", required: "true" },
    datePosted: { type: "date", required: "true" },
});

const brand = new mongoose.Schema({
    name: {
        type: "string",
        required: "true",
        unique: "true",
    },
    url: { type: "string", required: "true", unique: "true" },
});

module.exports = { article, brand };
