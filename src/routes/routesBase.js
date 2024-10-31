const express = require('express');

const documentRecu = require('../api/documentRecu');

const routesBase = (config) => {
  const {
    adaptateurEnvironnement,
    depotDonnees,
    middleware,
  } = config;

  const routes = express.Router();

  routes.get(
    '/',
    (...args) => middleware.renseigneUtilisateurCourant(...args),
    (requete, reponse) => {
      const infosUtilisateur = requete.utilisateurCourant;
      depotDonnees.statutRecuperationDocument()
        .then((statut) => reponse.render('accueil', {
          avecOOTS: adaptateurEnvironnement.avecOOTS(),
          infosUtilisateur,
          statut,
        }));
    },
  );

  routes.get('/documentRecu', (requete, reponse) => documentRecu(depotDonnees, reponse));

  return routes;
};

module.exports = routesBase;
