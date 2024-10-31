const express = require('express');

const urlOOTS = require('../api/urlOOTS');

const routesOOTS = (config) => {
  const { adaptateurEnvironnement, depotDonnees } = config;
  const routes = express.Router();

  routes.get('/document', (requete, reponse) => {
    if (adaptateurEnvironnement.avecOOTS()) {
      depotDonnees.demarreRecuperationDocument()
        .then(() => reponse.render('redirectionNavigateur', { destination: urlOOTS(adaptateurEnvironnement, requete) }));
    } else {
      reponse.status(501).send('Not Implemented Yet!');
    }
  });

  routes.post('/document', (requete, reponse) => {
    if (adaptateurEnvironnement.avecOOTS()) {
      depotDonnees.termineRecuperationDocument(Buffer.from(requete.body.document))
        .then(() => reponse.send());
    } else {
      reponse.status(501).send('Not Implemented Yet!');
    }
  });

  routes.get('/callback', (requete, reponse) => {
    reponse.render('redirectionNavigateur', { destination: '/' });
  });

  return routes;
};

module.exports = routesOOTS;
