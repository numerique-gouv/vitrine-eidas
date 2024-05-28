const cookieSession = require('cookie-session');
const express = require('express');
const mustacheExpress = require('mustache-express');

const routesAuth = require('./routes/routesAuth');
const routesBase = require('./routes/routesBase');

const creeServeur = (config) => {
  const {
    adaptateurChiffrement,
    adaptateurEnvironnement,
    adaptateurFranceConnectPlus,
    fabriqueSessionFCPlus,
    middleware,
  } = config;
  let serveur;
  const app = express();

  app.set('trust proxy', 1);

  app.set('views', `${__dirname}/vues`);
  app.set('view engine', 'mustache');
  app.engine('mustache', mustacheExpress());

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
    fabriqueSessionFCPlus,
    middleware,
  }));

  app.use('/', routesBase({
    adaptateurEnvironnement,
    middleware,
  }));

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
