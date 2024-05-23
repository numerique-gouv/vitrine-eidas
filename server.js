const SiteVitrine = require('./src/siteVitrine');
const adaptateurChiffrement = require('./src/adaptateurs/adaptateurChiffrement');
const adaptateurEnvironnement = require('./src/adaptateurs/adaptateurEnvironnement');
const adaptateurFranceConnectPlus = require('./src/adaptateurs/adaptateurFranceConnectPlus');
const FabriqueSessionFCPlus = require('./src/modeles/fabriqueSessionFCPlus');
const Middleware = require('./src/routes/middleware');

const fabriqueSessionFCPlus = new FabriqueSessionFCPlus({
  adaptateurChiffrement,
  adaptateurFranceConnectPlus,
});
const middleware = new Middleware({ adaptateurChiffrement, adaptateurEnvironnement });

const serveur = SiteVitrine.creeServeur({
  adaptateurChiffrement,
  adaptateurEnvironnement,
  adaptateurFranceConnectPlus,
  fabriqueSessionFCPlus,
  middleware,
});

const port = process.env.PORT || 3000;

serveur.ecoute(port, () => {
  /* eslint-disable no-console */

  console.log(`Le site vitrine est démarré et écoute le port ${port} !…`);

  /* eslint-enable no-console */
});
