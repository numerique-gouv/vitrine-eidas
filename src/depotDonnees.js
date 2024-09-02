const STATUTS = {
  STATUT_EN_COURS: 'enCours',
};

class DepotDonnees {
  constructor(donnees = {}) {
    this.donnees = donnees;
  }

  demarreRecuperationDocument() {
    this.donnees.statutRecuperationDocument = STATUTS.STATUT_EN_COURS;
    return Promise.resolve();
  }

  statutRecuperationDocument() {
    return Promise.resolve(this.donnees.statutRecuperationDocument);
  }
}

Object.assign(DepotDonnees, STATUTS);
module.exports = DepotDonnees;
