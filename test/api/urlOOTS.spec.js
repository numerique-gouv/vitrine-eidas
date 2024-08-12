const urlOOTS = require('../../src/api/urlOOTS');

describe("Le constructeur de l'URL de requête OOTS-France", () => {
  const adaptateurEnvironnement = {};
  const requete = {};

  beforeEach(() => {
    adaptateurEnvironnement.avecOOTS = () => true;
    adaptateurEnvironnement.urlBaseOOTSFrance = () => '';
    requete.session = {};
  });

  it('retourne un lien vers OOTS', () => {
    adaptateurEnvironnement.urlBaseOOTSFrance = () => 'http://example.com';
    const url = urlOOTS(adaptateurEnvironnement, requete);

    expect(url).toMatch(/^http:\/\/example\.com.*/);
  });

  it('retourne `false` si feature flip désactivé', () => {
    adaptateurEnvironnement.avecOOTS = () => false;
    const url = urlOOTS(adaptateurEnvironnement, requete);

    expect(url).toBe(false);
  });

  it('injecte jeton accès conservé dans cookie session', () => {
    requete.session.jetonAcces = 'abcdef';
    const url = urlOOTS(adaptateurEnvironnement, requete);

    expect(url).toContain('jetonAcces=abcdef');
  });
});
