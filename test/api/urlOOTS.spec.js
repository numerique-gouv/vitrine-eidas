const urlOOTS = require('../../src/api/urlOOTS');

describe("Le constructeur de l'URL de requête OOTS-France", () => {
  const adaptateurChiffrement = {};
  const adaptateurEnvironnement = {};
  const requete = {};

  beforeEach(() => {
    adaptateurEnvironnement.avecOOTS = () => true;
    adaptateurEnvironnement.urlBaseOOTSFrance = () => '';
    adaptateurEnvironnement.identifiantRequeteur = () => '';
    adaptateurChiffrement.genereJWT = () => Promise.resolve();
    requete.session = { infosUtilisateur: {} };
  });

  it('retourne un lien vers OOTS', () => {
    adaptateurEnvironnement.urlBaseOOTSFrance = () => 'http://example.com';
    urlOOTS(
      { adaptateurChiffrement, adaptateurEnvironnement },
      requete,
    ).then((url) => expect(url).toMatch(/^http:\/\/example\.com.*/));
  });

  it("contient l'identifiant de requeteur", () => {
    adaptateurEnvironnement.identifiantRequeteur = () => 'un-identifiant';
    urlOOTS(
      { adaptateurChiffrement, adaptateurEnvironnement },
      requete,
    ).then((url) => expect(url).toContain('idRequeteur=un-identifiant'));
  });

  it('contient le jeton utilisateur', () => {
    requete.session.infosUtilisateur = { prenom: 'Pierre', nom: 'Jax' };
    adaptateurChiffrement.genereJWT = (infosutilisateur) => {
      expect(infosutilisateur).toStrictEqual({ prenom: 'Pierre', nom: 'Jax' });
      return Promise.resolve('unJeton');
    };

    urlOOTS(
      { adaptateurChiffrement, adaptateurEnvironnement },
      requete,
    ).then((url) => expect(url).toContain('unJeton'));
  });
});
