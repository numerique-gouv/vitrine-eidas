const DepotDonnees = require('../src/depotDonnees');

describe('Le dépôt de données', () => {
  it('passe le statut de récupération de document à « en cours »', () => {
    const depot = new DepotDonnees({ statutRecuperationDocument: '' });
    return depot.demarreRecuperationDocument()
      .then(() => depot.statutRecuperationDocument())
      .then((statut) => expect(statut).toBe(DepotDonnees.STATUT_EN_COURS));
  });
});
