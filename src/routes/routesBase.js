const express = require('express');

const urlOOTS = require('../api/urlOOTS');

const routesBase = (config) => {
  const {
    adaptateurEnvironnement,
    middleware,
  } = config;

  const routes = express.Router();

  routes.get(
    '/',
    (...args) => middleware.renseigneUtilisateurCourant(...args),
    (requete, reponse) => {
      const infosUtilisateur = requete.utilisateurCourant;
      reponse.render('accueil', {
        infosUtilisateur,
        urlOOTS: urlOOTS(adaptateurEnvironnement, requete),
      });
    },
  );

  return routes;
};

module.exports = routesBase;
