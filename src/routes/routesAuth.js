const express = require('express');

const connexionFCPlus = require('../api/connexionFCPlus');
const deconnexionFCPlus = require('../api/deconnexionFCPlus');
const creationSessionFCPlus = require('../api/creationSessionFCPlus');
const destructionSessionFCPlus = require('../api/destructionSessionFCPlus');

const routesAuth = (config) => {
  const {
    adaptateurChiffrement,
    adaptateurEnvironnement,
    adaptateurFranceConnectPlus,
    fabriqueSessionFCPlus,
    journal,
    middleware,
  } = config;

  const routes = express.Router();

  routes.get('/cles_publiques', (_requete, reponse) => {
    const { kty, n, e } = adaptateurEnvironnement.clePriveeJWK();
    const idClePublique = adaptateurChiffrement.cleHachage(n);

    const clePubliqueDansJWKSet = {
      keys: [{
        kid: idClePublique,
        use: 'enc',
        kty,
        e,
        n,
      }],
    };

    reponse.set('Content-Type', 'application/json');
    reponse.status(200)
      .send(clePubliqueDansJWKSet);
  });

  routes.get('/fcplus/connexion', (requete, reponse) => {
    const { code, error, state } = requete.query;
    if (typeof error !== 'undefined') {
      requete.session = null;
      reponse.render('redirectionNavigateur', { destination: '/' });
    } else if (typeof state === 'undefined' || state === '') {
      reponse.status(400).json({ erreur: "Paramètre 'state' absent de la requête" });
    } else if (typeof code === 'undefined' || code === '') {
      reponse.status(400).json({ erreur: "Paramètre 'code' absent de la requête" });
    } else {
      const paramsRequete = new URLSearchParams(requete.query).toString();
      const destination = `/auth/fcplus/connexion_apres_redirection?${paramsRequete}`;
      reponse.render('redirectionNavigateur', { destination });
    }
  });

  routes.get(
    '/fcplus/connexion_apres_redirection',
    (...args) => middleware.verifieTamponUnique(...args),
    (requete, reponse) => {
      const { code } = requete.query;
      const adaptateurs = {
        adaptateurChiffrement,
        adaptateurEnvironnement,
        fabriqueSessionFCPlus,
        journal,
      };
      connexionFCPlus(adaptateurs, code, requete, reponse);
    },
  );

  routes.get('/fcplus/deconnexion', (requete, reponse) => (
    deconnexionFCPlus(requete, reponse)
  ));

  routes.get('/fcplus/destructionSession', (requete, reponse) => {
    destructionSessionFCPlus(
      {
        adaptateurChiffrement,
        adaptateurEnvironnement,
        adaptateurFranceConnectPlus,
      },
      requete,
      reponse,
    );
  });

  routes.get('/fcplus/creationSession', (requete, reponse) => {
    creationSessionFCPlus(
      {
        adaptateurChiffrement,
        adaptateurEnvironnement,
        adaptateurFranceConnectPlus,
      },
      requete,
      reponse,
    );
  });

  return routes;
};

module.exports = routesAuth;
