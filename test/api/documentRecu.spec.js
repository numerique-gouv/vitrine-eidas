const documentRecu = require('../../src/api/documentRecu');

describe('Le requêteur du document reçu', () => {
  const depotDonnees = {};
  const reponse = {};

  beforeEach(() => {
    depotDonnees.documentRecu = () => Promise.resolve(Buffer.from(''));
    reponse.set = () => {};
    reponse.send = () => {};
  });

  it('demande le document au dépôt de donnés', () => {
    let depotDonneesAppele = false;
    depotDonnees.documentRecu = () => {
      depotDonneesAppele = true;
      return Promise.resolve(Buffer.from(''));
    };

    return documentRecu(depotDonnees, reponse)
      .then(() => expect(depotDonneesAppele).toBe(true));
  });

  it('renvoie le document reçu', () => {
    expect.assertions(1);

    depotDonnees.documentRecu = () => Promise.resolve(Buffer.from('Un document'));
    reponse.send = (document) => expect(document.toString()).toBe('Un document');

    return documentRecu(depotDonnees, reponse);
  });
});
