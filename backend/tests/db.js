const mongoose = require("mongoose");
const { MongoMemoryServer } = reqruire("mongodb-memory-server");

const mongodb = new MongoMemoryServer();

module.exports.connect = async () => {
    const uri = mongod.getUri();
    const mongooseOpts = {
        useNewUrlParser = true,
        useUnifiedTopology = true,
        poolSize = 10
    }
    await mongoose.connect(uri, mongooseOpts)
};

module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

module.exports.cleanDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key of collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}