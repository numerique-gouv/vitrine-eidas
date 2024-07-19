const { stockeDansCookieSession } = require('../routes/utils');

const connexionFCPlus = (config, code, requete, reponse) => {
  const {
    adaptateurChiffrement,
    fabriqueSessionFCPlus,
    journal,
  } = config;

  return fabriqueSessionFCPlus.nouvelleSession(code)
    .then((sessionFCPlus) => {
      requete.session.jwtSessionFCPlus = sessionFCPlus.jwt;
      return sessionFCPlus.enJSON();
    })
    .then((infos) => {
      if (infos.nonce !== requete.session.nonce) { throw new Error('nonce invalide'); }
      return stockeDansCookieSession(infos, adaptateurChiffrement, requete);
    })
    .then(() => reponse.render('redirectionNavigateur', { destination: '/' }))
    .catch((e) => {
      requete.session.jeton = undefined;
      journal.consigne(`Échec authentification (${e.message})`);
      reponse.render('redirectionNavigateur', { destination: '/auth/fcplus/destructionSession' });
    });
};

module.exports = connexionFCPlus;
