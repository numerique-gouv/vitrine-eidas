const STATUTS = {
  EN_COURS: 'enCours',
  INITIAL: 'initial',
  TERMINE: 'termine',
};

class StatutRecuperationDocument {
  constructor(statut) {
    this.statut = statut || STATUTS.INITIAL;
  }

  estEnCours() {
    return this.statut === STATUTS.EN_COURS;
  }

  estInitial() {
    return this.statut === STATUTS.INITIAL;
  }

  estTermine() {
    return this.statut === STATUTS.TERMINE;
  }
}

Object.assign(StatutRecuperationDocument, STATUTS);
StatutRecuperationDocument.enCours = () => new StatutRecuperationDocument(STATUTS.EN_COURS);
StatutRecuperationDocument.termine = () => new StatutRecuperationDocument(STATUTS.TERMINE);

module.exports = StatutRecuperationDocument;
