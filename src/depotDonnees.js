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

  reinitialiseRecuperationDocument() {
    this.donnees.statutRecuperationDocument = StatutRecuperationDocument.INITIAL;
    return Promise.resolve();
  }

  statutRecuperationDocument() {
    return Promise.resolve(new StatutRecuperationDocument(this.donnees.statutRecuperationDocument));
  }

  termineRecuperationDocument() {
    this.donnees.statutRecuperationDocument = StatutRecuperationDocument.TERMINE;
    return Promise.resolve();
  }
}

module.exports = DepotDonnees;
