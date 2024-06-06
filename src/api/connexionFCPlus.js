const { stockeDansCookieSession } = require('../routes/utils');

const connexionFCPlus = (config, code, requete, reponse) => {
  const { adaptateurChiffrement, fabriqueSessionFCPlus } = config;

  requete.session.jeton = undefined;

  return fabriqueSessionFCPlus.nouvelleSession(code)
    .then((session) => session.enJSON())
    .then((infos) => stockeDansCookieSession(infos, adaptateurChiffrement, requete))
    .then(() => reponse.render('redirectionNavigateur', { destination: '/' }))
    .catch((e) => reponse.status(502).json({ erreur: `Échec authentification (${e.message})` }));
};

module.exports = connexionFCPlus;
