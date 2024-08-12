const urlOOTS = require('../../src/api/urlOOTS');

describe("Le constructeur de l'URL de requête OOTS-France", () => {
  const adaptateurEnvironnement = {};

  beforeEach(() => {
    adaptateurEnvironnement.avecOOTS = () => true;
    adaptateurEnvironnement.urlBaseOOTSFrance = () => '';
  });

  it('retourne un lien vers OOTS', () => {
    adaptateurEnvironnement.urlBaseOOTSFrance = () => 'http://example.com';
    const url = urlOOTS(adaptateurEnvironnement);

    expect(url).toMatch(/^http:\/\/example\.com.*/);
  });

  it('retourne `false` si feature flip désactivé', () => {
    adaptateurEnvironnement.avecOOTS = () => false;
    const url = urlOOTS(adaptateurEnvironnement);

    expect(url).toBe(false);
  });
});
