const StatutRecuperationDocument = require('./modeles/statutRecuperationDocument');

class DepotDonnees {
  constructor(donnees = {}) {
    this.donnees = donnees;
    this.donnees.statutRecuperationDocument ||= StatutRecuperationDocument.INITIAL;
  }

  demarreRecuperationDocument() {
    this.donnees.statutRecuperationDocument = StatutRecuperationDocument.EN_COURS;
    return Promise.resolve();
  }

  statutRecuperationDocument() {
    return Promise.resolve(new StatutRecuperationDocument(this.donnees.statutRecuperationDocument));
  }
}

module.exports = DepotDonnees;
