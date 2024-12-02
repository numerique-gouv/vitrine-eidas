const express = require('express');

const urlOOTS = require('../api/urlOOTS');

const routesOOTS = (config) => {
  const { adaptateurEnvironnement, depotDonnees } = config;
  const routes = express.Router();

  routes.get('/document', (requete, reponse) => depotDonnees
    .demarreRecuperationDocument()
    .then(() => reponse.render('redirectionNavigateur', { destination: urlOOTS(adaptateurEnvironnement, requete) })));

  routes.post('/document', (requete, reponse) => depotDonnees
    .termineRecuperationDocument(Buffer.from(requete.body.document))
    .then(() => reponse.send()));

  routes.get('/callback', (requete, reponse) => {
    reponse.render('redirectionNavigateur', { destination: '/' });
  });

  return routes;
};

module.exports = routesOOTS;
