const DepotDonnees = require('../src/depotDonnees');
const StatutRecuperationDocument = require('../src/modeles/statutRecuperationDocument');

describe('Le dépôt de données', () => {
  it('initialise le dépot de données avec un statut de récupération de document initial', () => {
    const depot = new DepotDonnees();
    depot.statutRecuperationDocument()
      .then((statut) => expect(statut.estInitial()).toBe(true));
  });

  it('passe le statut de récupération de document à « en cours »', () => {
    const depot = new DepotDonnees({ statutRecuperationDocument: '' });
    return depot.demarreRecuperationDocument()
      .then(() => depot.statutRecuperationDocument())
      .then((statut) => expect(statut.estEnCours()).toBe(true));
  });

  it('passe le statut de récupération de document à « terminé »', () => {
    const depot = new DepotDonnees({
      statutRecuperationDocument: StatutRecuperationDocument.EN_COURS,
    });

    return depot.termineRecuperationDocument()
      .then(() => depot.statutRecuperationDocument())
      .then((statut) => expect(statut.estTermine()).toBe(true));
  });

  it('repasse le statut de récupération de document à « initial »', () => {
    const depot = new DepotDonnees({
      statutRecuperationDocument: StatutRecuperationDocument.EN_COURS,
    });

    return depot.reinitialiseRecuperationDocument()
      .then(() => depot.statutRecuperationDocument())
      .then((statut) => expect(statut.estInitial()).toBe(true));
  });
});
