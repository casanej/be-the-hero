const express = require('express');

const ongController = require('./controllers/ong-controller');
const incidentController = require('./controllers/incident-controller');
const userControler = require('./controllers/user-controller');

const routes = express.Router();

routes.post('/user/login', userControler.create);

routes.get('/ongs', ongController.index);
routes.post('/ongs', ongController.create);

routes.get('/incidents/:ong?', incidentController.index);
routes.post('/incidents', incidentController.create);
routes.delete('/incidents/:id', incidentController.delete);

module.exports = routes;