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
      const urlOOTSRequete = `${adaptateurEnvironnement.urlBaseOOTSFrance()}/requete/pieceJustificative?nomDestinataire=AP_FR_01&codeDemarche=00&idTypeJustificatif=12345`;
      const urlOOTS = adaptateurEnvironnement.avecOOTS() && urlOOTSRequete;
      reponse.render('accueil', { infosUtilisateur, urlOOTS });
    },
  );

  return routes;
};

module.exports = routesBase;
