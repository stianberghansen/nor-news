const server = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");

beforeEach((done) => {
    mongoose.connect(
        process.env.DB_URL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            authSource: process.env.AUTH_SOURCE,
            auth: {
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
            },
        },
        () => done()
    );
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done());
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    await server.close();
    console.log("done");
});

test("responds with json", async () => {
    await request(server)
        .get("/healthcheck")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((res) => {
            expect(res.body.length).toBeGreaterThan(30);
            expect(res.body.length).toBeLessThan(65);
        });
});
