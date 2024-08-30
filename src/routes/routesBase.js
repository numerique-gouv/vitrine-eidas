const express = require('express');

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
        avecOOTS: adaptateurEnvironnement.avecOOTS(),
      });
    },
  );

  return routes;
};

module.exports = routesBase;
