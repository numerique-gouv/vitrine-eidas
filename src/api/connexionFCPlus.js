const connexionFCPlus = (config, requete, reponse) => {
  const { fabriqueSessionFCPlus, journal } = config;
  const { code } = requete.query;

  return fabriqueSessionFCPlus.nouvelleSession(code)
    .then((sessionFCPlus) => {
      requete.session.jwtSessionFCPlus = sessionFCPlus.jwt;
      requete.session.jetonAcces = sessionFCPlus.jetonAcces;
      return sessionFCPlus.enJSON();
    })
    .then(({ nonce, ...infosUtilisateur }) => {
      if (nonce !== requete.session.nonce) { throw new Error('nonce invalide'); }
      requete.session.infosUtilisateur = infosUtilisateur;
    })
    .then(() => reponse.render('redirectionNavigateur', { destination: '/' }))
    .catch((e) => {
      requete.session.infosUtilisateur = undefined;
      journal.consigne(`Échec authentification (${e.message})`);
      reponse.render('redirectionNavigateur', { destination: '/auth/fcplus/destructionSession' });
    });
};

module.exports = connexionFCPlus;
