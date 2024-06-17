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
      const avecConnexionEIDAS = process.env.AVEC_AUTHENTIFICATION_EIDAS === 'true';
      const infosUtilisateur = requete.utilisateurCourant;
      const avecConnexionFCPlus = adaptateurEnvironnement.avecConnexionFCPlus();
      reponse.render('accueil', {
        infosUtilisateur,
        avecConnexionFCPlus,
        avecConnexionEIDAS,
      });
    },
  );

  return routes;
};

module.exports = routesBase;
