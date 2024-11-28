const express = require('express');
const urlOOTS = require('../api/urlOOTS');

const routesOOTS = (config) => {
  const { adaptateurChiffrement, adaptateurEnvironnement, depotDonnees } = config;
  const routes = express.Router();

  routes.get('/document', (requete, reponse) => (
    depotDonnees
      .demarreRecuperationDocument()
      .then(() => urlOOTS({ adaptateurEnvironnement, adaptateurChiffrement }, requete))
      .then((destination) => reponse.render('redirectionNavigateur', { destination }))
  ));

  routes.post('/document', (requete, reponse) => (
    depotDonnees
      .termineRecuperationDocument(Buffer.from(requete.body.document))
      .then(() => reponse.send())
  ));

  routes.get('/callback', (requete, reponse) => {
    reponse.render('redirectionNavigateur', { destination: '/' });
  });

  return routes;
};

module.exports = routesOOTS;
