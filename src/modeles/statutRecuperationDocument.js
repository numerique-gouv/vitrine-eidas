const STATUTS = {
  EN_COURS: 'enCours',
  INITIAL: 'initial',
};

class StatutRecuperationDocument {
  constructor(statut) {
    this.statut = statut || STATUTS.INITIAL;
  }

  deviensEnCours() {
    this.statut = STATUTS.EN_COURS;
  }

  estEnCours() {
    return this.statut === STATUTS.EN_COURS;
  }

  estInitial() {
    return this.statut === STATUTS.INITIAL;
  }
}

Object.assign(StatutRecuperationDocument, STATUTS);
StatutRecuperationDocument.enCours = () => new StatutRecuperationDocument(STATUTS.EN_COURS);

module.exports = StatutRecuperationDocument;
