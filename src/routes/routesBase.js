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
      const urlOOTSRequete = `${adaptateurEnvironnement.urlBaseOOTSFrance()}/requete/pieceJustificative?codeDemarche=00&&codePays=FR`;
      const urlOOTS = adaptateurEnvironnement.avecOOTS() && urlOOTSRequete;
      reponse.render('accueil', { infosUtilisateur, urlOOTS });
    },
  );

  return routes;
};

module.exports = routesBase;
