const port = process.env.PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');

const mongoDB = require('../db');
const router = require('./router');
const app = express();

// Set up middlewares
app.use(bodyParser.urlencoded({ extended: true })); // Enables getting data from POST
app.use(bodyParser.json());
app.use('/api/v1', router);

app.close = function () {
    mongoDB.disconnect();
    app.server.close();
}

app.start = function () {
    app.server = app.listen(port);
    console.log('turplan.no API live on port ' + port);
}

if (process.env.NODE_ENV === "dev") {
    mongoDB.connect().then(() => {
        app.start();
    });
}

// Export for testing
module.exports = { app };