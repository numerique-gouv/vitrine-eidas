const express = require('express');

const urlOOTS = require('../api/urlOOTS');

const routesOOTS = (config) => {
  const { adaptateurEnvironnement } = config;
  const routes = express.Router();

  routes.get('/document', (requete, reponse) => {
    if (adaptateurEnvironnement.avecOOTS()) {
      reponse.render('redirectionNavigateur', { destination: urlOOTS(adaptateurEnvironnement, requete) });
    } else {
      reponse.status(501).send('Not Implemented Yet!');
    }
  });

  return routes;
};

module.exports = routesOOTS;
