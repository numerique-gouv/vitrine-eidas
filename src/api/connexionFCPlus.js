const { stockeDansCookieSession } = require('../routes/utils');

const connexionFCPlus = (config, code, requete, reponse) => {
  const { adaptateurChiffrement, adaptateurEnvironnement, fabriqueSessionFCPlus } = config;

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
      reponse.render('erreur', { descriptionErreur: `Échec authentification (${e.message})` });
    });
};

module.exports = connexionFCPlus;
