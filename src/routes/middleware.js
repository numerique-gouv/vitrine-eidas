class Middleware {
  constructor(config) {
    this.adaptateurChiffrement = config.adaptateurChiffrement;
    this.secret = config.adaptateurEnvironnement.secretJetonSession();
  }

  renseigneUtilisateurCourant(requete, _reponse, suite) {
    return this.adaptateurChiffrement.verifieJeton(requete.session.jeton, this.secret)
      .then((infosUtilisateur) => { requete.utilisateurCourant = infosUtilisateur; })
      .catch(() => { requete.utilisateurCourant = undefined; })
      .then(() => suite());
  }

  verifieTamponUnique(requete, reponse, suite) {
    const valide = (tampon) => {
      if (tampon.etat !== requete.query.state) {
        requete.session = null;
        throw new Error('État invalide');
      }
    };

    return this.adaptateurChiffrement.verifieJeton(requete.session.jeton, this.secret)
      .then(valide)
      .then(suite)
      .catch(() => reponse.render('redirectionNavigateur', { destination: '/' }));
  }
}

module.exports = Middleware;
