<h1>nor-news</h1>

<p>This project aims at creating a gateway to the biggest Norwegian newspaper with direct links to their articles.</p>

## Built with

-   NodeJS
-   MongoDb
-   Cheerio
-   React

## Getting started

This project was created with `create-react-app`. Inside the frontent directory, start the front-end dev server with:

#### `npm start`

To start the nodejs server first edit the `.env.example` file with your db details and rename it to `.env`. Then start your database server, for an easier dev experience I recommend using the included `gdocker-copompose.yml` file. This includes mongo-express for easier db interaction. Finally, navigate to the backend directory and run:

#### `node app.js`

## Future updates

-   [ ] Parsing multi-line headlines
-   [ ] Adding additional news sources
-   [x] Updating schema and parsers with article IDs
-   [ ] Front-end parsing of news sources into individual components
