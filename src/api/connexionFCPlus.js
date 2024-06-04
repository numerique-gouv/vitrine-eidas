const { redirigeDepuisNavigateur, stockeDansCookieSession } = require('./utils');

const connexionFCPlus = (config, code, requete, reponse) => {
  const { adaptateurChiffrement, fabriqueSessionFCPlus } = config;

  requete.session.jeton = undefined;

  return fabriqueSessionFCPlus.nouvelleSession(code)
    .then((session) => session.enJSON())
    .then((infos) => stockeDansCookieSession(infos, adaptateurChiffrement, requete))
    .then(() => redirigeDepuisNavigateur('/', reponse))
    .catch((e) => reponse.status(502).json({ erreur: `Échec authentification (${e.message})` }));
};

module.exports = connexionFCPlus;
