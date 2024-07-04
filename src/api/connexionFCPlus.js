const { stockeDansCookieSession } = require('../routes/utils');

const connexionFCPlus = (config, code, requete, reponse) => {
  const {
    adaptateurChiffrement,
    adaptateurEnvironnement,
    fabriqueSessionFCPlus,
    journal,
  } = config;

  const secret = adaptateurEnvironnement.secretJetonSession();

  return fabriqueSessionFCPlus.nouvelleSession(code)
    .then((sessionFCPlus) => sessionFCPlus.enJSON())
    .then((infos) => adaptateurChiffrement.verifieJeton(requete.session.jeton, secret)
      .then(({ nonce }) => {
        if (infos.nonce !== nonce) { throw new Error('nonce invalide'); }
        return stockeDansCookieSession(infos, adaptateurChiffrement, requete);
      }))
    .then(() => reponse.render('redirectionNavigateur', { destination: '/' }))
    .catch((e) => {
      requete.session.jeton = undefined;
      journal.consigne(`Échec authentification (${e.message})`);
      reponse.render('redirectionNavigateur', { destination: '/auth/fcplus/destructionSession' });
    });
};

module.exports = connexionFCPlus;
