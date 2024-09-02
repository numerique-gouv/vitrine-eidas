const SiteVitrine = require('./src/siteVitrine');
const adaptateurChiffrement = require('./src/adaptateurs/adaptateurChiffrement');
const adaptateurEnvironnement = require('./src/adaptateurs/adaptateurEnvironnement');
const adaptateurFranceConnectPlus = require('./src/adaptateurs/adaptateurFranceConnectPlus');
const DepotDonnees = require('./src/depotDonnees');
const journal = require('./src/adaptateurs/journal');
const FabriqueSessionFCPlus = require('./src/modeles/fabriqueSessionFCPlus');
const Middleware = require('./src/routes/middleware');

const depotDonnees = new DepotDonnees();

const fabriqueSessionFCPlus = new FabriqueSessionFCPlus({
  adaptateurChiffrement,
  adaptateurFranceConnectPlus,
});
const middleware = new Middleware();

journal.active();

const serveur = SiteVitrine.creeServeur({
  adaptateurChiffrement,
  adaptateurEnvironnement,
  adaptateurFranceConnectPlus,
  depotDonnees,
  fabriqueSessionFCPlus,
  journal,
  middleware,
});

const port = process.env.PORT || 3000;

serveur.ecoute(port, () => {
  journal.consigne(`Le site vitrine est démarré et écoute le port ${port} !…`);
});
