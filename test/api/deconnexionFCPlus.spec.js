const deconnexionFCPlus = require('../../src/api/deconnexionFCPlus');

describe('Le requêteur de déconnexion FC+', () => {
  const requete = {};
  const reponse = {};

  beforeEach(() => {
    requete.session = {};
    reponse.redirect = () => Promise.resolve();
    reponse.end = () => Promise.resolve();
  });

  it('vide le cookie de session', () => {
    requete.session = { uneClef: 'une valeur' };

    deconnexionFCPlus(requete, reponse);
    expect(requete.session).toBe(null);
  });
});
