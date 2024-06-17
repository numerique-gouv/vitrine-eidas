class Utilisateur {
  constructor(donnees) {
    this.prenom = donnees.prenom;
    this.nomUsage = donnees.nomUsage;
    this.jwtSessionFCPlus = donnees.jwtSessionFCPlus;
  }

  afficheToi() {
    return `${this.prenom} ${this.nomUsage}`;
  }
}

module.exports = Utilisateur;
