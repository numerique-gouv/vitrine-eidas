const urlOOTS = require('../../src/api/urlOOTS');

describe("Le constructeur de l'URL de requête OOTS-France", () => {
  const adaptateurChiffrement = {};
  const adaptateurEnvironnement = {};
  const requete = {};

  beforeEach(() => {
    adaptateurEnvironnement.avecOOTS = () => true;
    adaptateurEnvironnement.urlBaseOOTSFrance = () => '';
    adaptateurEnvironnement.identifiantRequeteur = () => '';
    adaptateurChiffrement.enJWEPourOOTS = () => Promise.resolve();
    requete.session = { infosUtilisateur: {} };
  });

  it('retourne un lien vers OOTS', () => {
    adaptateurEnvironnement.urlBaseOOTSFrance = () => 'http://example.com';
    return urlOOTS(
      { adaptateurChiffrement, adaptateurEnvironnement },
      requete,
    ).then((url) => expect(url).toMatch(/^http:\/\/example\.com.*/));
  });

  it("contient l'identifiant de requeteur", () => {
    adaptateurEnvironnement.identifiantRequeteur = () => 'un-identifiant';
    return urlOOTS(
      { adaptateurChiffrement, adaptateurEnvironnement },
      requete,
    ).then((url) => expect(url).toContain('idRequeteur=un-identifiant'));
  });

  it('contient le jeton utilisateur', () => {
    requete.session.infosUtilisateur = { prenom: 'Pierre', nom: 'Jax' };
    adaptateurChiffrement.enJWEPourOOTS = (infosutilisateur) => {
      expect(infosutilisateur).toStrictEqual({ prenom: 'Pierre', nom: 'Jax' });
      return Promise.resolve('unJeton');
    };

    return urlOOTS(
      { adaptateurChiffrement, adaptateurEnvironnement },
      requete,
    ).then((url) => {
      expect(url).toContain('beneficiaire=unJeton');
      expect(url).toContain('utilisateur=unJeton');
    });
  });
});
