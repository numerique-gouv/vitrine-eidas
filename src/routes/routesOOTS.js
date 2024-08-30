const express = require('express');

const urlOOTS = require('../api/urlOOTS');

const routesOOTS = (config) => {
  const { adaptateurEnvironnement } = config;
  const routes = express.Router();

  routes.get('/document', (requete, reponse) => {
    reponse.render('redirectionNavigateur', { destination: urlOOTS(adaptateurEnvironnement, requete) });
  });

  return routes;
};

module.exports = routesOOTS;
