const urlOOTS = require('../../src/api/urlOOTS');

describe("Le constructeur de l'URL de requête OOTS-France", () => {
  const adaptateurEnvironnement = {};

  beforeEach(() => {
    adaptateurEnvironnement.avecOOTS = () => true;
    adaptateurEnvironnement.urlBaseOOTSFrance = () => '';
    adaptateurEnvironnement.identifiantRequeteur = () => '';
  });

  it('retourne un lien vers OOTS', () => {
    adaptateurEnvironnement.urlBaseOOTSFrance = () => 'http://example.com';
    const url = urlOOTS(adaptateurEnvironnement);

    expect(url).toMatch(/^http:\/\/example\.com.*/);
  });

  it("contient l'identifiant de requeteur", () => {
    adaptateurEnvironnement.identifiantRequeteur = () => 'un-identifiant';
    const url = urlOOTS(adaptateurEnvironnement);

    expect(url).toContain('idRequeteur=un-identifiant');
  });
});
