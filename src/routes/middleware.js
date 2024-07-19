const Utilisateur = require('../modeles/utilisateur');

class Middleware {
  constructor(config) {
    this.adaptateurChiffrement = config.adaptateurChiffrement;
    this.secret = config.adaptateurEnvironnement.secretJetonSession();
  }

  renseigneUtilisateurCourant = (requete, _reponse, suite) => {
    try {
      requete.utilisateurCourant = new Utilisateur(requete.session.infosUtilisateur);
    } catch {
      requete.utilisateurCourant = undefined;
    }

    suite();
  };

  verifieTamponUnique = (requete, reponse, suite) => {
    if (requete.session.etat !== requete.query.state) {
      requete.session = null;
      reponse.render('redirectionNavigateur', { destination: '/' });
    } else {
      suite();
    }
  };
}

module.exports = Middleware;
