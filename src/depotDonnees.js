const STATUTS = {
  STATUT_EN_COURS: 'enCours',
  STATUT_INITIAL: 'initial',
};

class DepotDonnees {
  constructor(donnees = {}) {
    this.donnees = donnees;
    this.donnees.statutRecuperationDocument ||= STATUTS.STATUT_INITIAL;
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
