const DepotDonnees = require('../src/depotDonnees');

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
});
