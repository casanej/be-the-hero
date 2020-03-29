const express = require('express');
const cors = require('cors')
const routes = require('./routes');

const app = express();

app.use(cors())
app.use(express.json());

app.use((request, response, next) => {
    console.log(`${request.method} ${request.headers.host}${request.url}`)
    next();
});
app.use(routes);

app.listen(3333);