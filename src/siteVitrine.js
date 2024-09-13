const cookieSession = require('cookie-session');
const express = require('express');

const routesAuth = require('./routes/routesAuth');
const routesBase = require('./routes/routesBase');
const routesOOTS = require('./routes/routesOOTS');

const creeServeur = (config) => {
  const {
    adaptateurChiffrement,
    adaptateurEnvironnement,
    adaptateurFranceConnectPlus,
    depotDonnees,
    fabriqueSessionFCPlus,
    journal,
    middleware,
  } = config;
  let serveur;
  const app = express();

  app.set('trust proxy', 1);

  app.set('views', './src/vues');
  app.set('view engine', 'pug');

  app.use('/statique', express.static('public'));

  app.use(cookieSession({
    maxAge: 15 * 60 * 1000,
    name: 'session',
    sameSite: true,
    secret: adaptateurEnvironnement.secretJetonSession(),
    secure: !adaptateurEnvironnement.avecEnvoiCookieSurHTTP(),
  }));

  app.use('/auth', routesAuth({
    adaptateurChiffrement,
    adaptateurEnvironnement,
    adaptateurFranceConnectPlus,
    depotDonnees,
    fabriqueSessionFCPlus,
    journal,
    middleware,
  }));

  app.use('/oots', routesOOTS({ adaptateurEnvironnement, depotDonnees }));

  app.use('/', routesBase({ adaptateurEnvironnement, depotDonnees, middleware }));

  const arreteEcoute = (suite) => serveur.close(suite);

  const ecoute = (...args) => { serveur = app.listen(...args); };

  const port = () => serveur.address().port;

  return {
    arreteEcoute,
    ecoute,
    port,
  };
};

module.exports = { creeServeur };
