class Utilisateur {
  constructor(donnees) {
    this.prenom = donnees.prenom;
    this.nomUsage = donnees.nomUsage;
  }

  afficheToi() {
    return `${this.prenom} ${this.nomUsage}`;
  }
}

module.exports = Utilisateur;
