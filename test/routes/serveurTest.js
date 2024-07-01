const OOTS_FRANCE = require('../../src/siteVitrine');
const MiddlewareFantaisie = require('../mocks/middleware');

const serveurTest = () => {
  let adaptateurChiffrement;
  let adaptateurEnvironnement;
  let adaptateurFranceConnectPlus;
  let fabriqueSessionFCPlus;
  let middleware;

  let serveur;

  const arrete = (suite) => {
    serveur.arreteEcoute(suite);
  };

  const initialise = (suite) => {
    adaptateurChiffrement = {
      cleHachage: () => '',
      dechiffreJWE: () => Promise.resolve(),
      genereJeton: () => Promise.resolve(),
      verifieJeton: () => Promise.resolve({}),
      verifieSignatureJWTDepuisJWKS: () => Promise.resolve({}),
    };

    adaptateurEnvironnement = {
      avecConnexionFCPlus: () => true,
      avecEnvoiCookieSurHTTP: () => true,
      avecMock: () => true,
      identifiantClient: () => '',
      secretJetonSession: () => 'secret',
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

    middleware = new MiddlewareFantaisie({});

    serveur = OOTS_FRANCE.creeServeur({
      adaptateurChiffrement,
      adaptateurEnvironnement,
      adaptateurFranceConnectPlus,
      fabriqueSessionFCPlus,
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
    initialise,
    middleware: () => middleware,
    port,
  };
};

module.exports = serveurTest;
