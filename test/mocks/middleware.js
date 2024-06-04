class MiddlewareFantaisie {
  constructor(donnees) {
    this.reinitialise(donnees);
  }

  reinitialise({ utilisateurCourant }) {
    this.utilisateurCourant = utilisateurCourant;
  }

  renseigneUtilisateurCourant(requete, _reponse, suite) {
    requete.utilisateurCourant = this.utilisateurCourant;
    suite();
  }

  verifieTamponUnique = (_requete, _reponse, suite) => Promise.resolve().then(suite);
}

module.exports = MiddlewareFantaisie;
