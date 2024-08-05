const OOTS_FRANCE = require('../../src/siteVitrine');
const MiddlewareFantaisie = require('../mocks/middleware');

const serveurTest = () => {
  let adaptateurChiffrement;
  let adaptateurEnvironnement;
  let adaptateurFranceConnectPlus;
  let fabriqueSessionFCPlus;
  let journal;
  let middleware;

  let serveur;

  const arrete = (suite) => {
    serveur.arreteEcoute(suite);
  };

  const initialise = (suite) => {
    adaptateurChiffrement = {
      cleHachage: () => '',
      dechiffreJWE: () => Promise.resolve(),
      verifieSignatureJWTDepuisJWKS: () => Promise.resolve({}),
    };

    adaptateurEnvironnement = {
      avecEnvoiCookieSurHTTP: () => true,
      avecMock: () => true,
      avecOOTS: () => true,
      identifiantClient: () => '',
      secretJetonSession: () => 'secret',
      urlBaseOOTSFrance: () => '',
      urlRedirectionConnexion: () => '',
      urlRedirectionDeconnexion: () => '',
    };

    adaptateurFranceConnectPlus = {
      recupereDonneesJetonAcces: () => Promise.resolve({}),
      recupereInfosUtilisateurChiffrees: () => Promise.resolve(),
      recupereURLClefsPubliques: () => Promise.resolve(),
      urlCreationSession: () => Promise.resolve(''),
      urlDestructionSession: () => Promise.resolve(''),
    };

    fabriqueSessionFCPlus = {
      nouvelleSession: () => Promise.resolve({ enJSON: () => Promise.resolve({}) }),
    };

    journal = {
      consigne: () => {},
    };

    middleware = new MiddlewareFantaisie({});

    serveur = OOTS_FRANCE.creeServeur({
      adaptateurChiffrement,
      adaptateurEnvironnement,
      adaptateurFranceConnectPlus,
      fabriqueSessionFCPlus,
      journal,
      middleware,
    });

    serveur.ecoute(0, suite);
  };

  const port = () => serveur.port();

  return {
    adaptateurChiffrement: () => adaptateurChiffrement,
    adaptateurEnvironnement: () => adaptateurEnvironnement,
    adaptateurFranceConnectPlus: () => adaptateurFranceConnectPlus,
    arrete,
    fabriqueSessionFCPlus: () => fabriqueSessionFCPlus,
    journal: () => journal,
    initialise,
    middleware: () => middleware,
    port,
  };
};

module.exports = serveurTest;
