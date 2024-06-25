const { ErreurSessionFCPlusInexistante } = require('../erreurs');

class Utilisateur {
  constructor(donnees) {
    if (typeof donnees.jwtSessionFCPlus === 'undefined') { throw new ErreurSessionFCPlusInexistante(); }

    this.jwtSessionFCPlus = donnees.jwtSessionFCPlus;
    this.prenom = donnees.prenom;
    this.nomUsage = donnees.nomUsage;
  }

  afficheToi() {
    return `${this.prenom} ${this.nomUsage}`;
  }
}

module.exports = Utilisateur;
