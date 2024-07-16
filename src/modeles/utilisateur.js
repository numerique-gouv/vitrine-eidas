const { ErreurDonneeManquante } = require('../erreurs');

class Utilisateur {
  constructor(donnees) {
    if (typeof donnees.prenom === 'undefined' && typeof donnees.nomUsage === 'undefined') {
      throw new ErreurDonneeManquante("Prénom et nom d'usage obligatoires pour instancier un utilisateur");
    }

    this.prenom = donnees.prenom;
    this.nomUsage = donnees.nomUsage;
  }

  afficheToi() {
    return `${this.prenom} ${this.nomUsage}`;
  }
}

module.exports = Utilisateur;
