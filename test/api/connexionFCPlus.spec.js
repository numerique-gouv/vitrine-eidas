const connexionFCPlus = require('../../src/api/connexionFCPlus');

describe('Le requêteur de connexion FC+', () => {
  const adaptateurChiffrement = {};
  const fabriqueSessionFCPlus = {};
  const journal = {};
  const config = {
    adaptateurChiffrement,
    fabriqueSessionFCPlus,
    journal,
  };
  const requete = {};
  const reponse = {};
  const sessionFCPlus = {};

  beforeEach(() => {
    adaptateurChiffrement.genereJeton = () => Promise.resolve();

    sessionFCPlus.jwt = '';
    sessionFCPlus.enJSON = () => Promise.resolve({});
    fabriqueSessionFCPlus.nouvelleSession = () => Promise.resolve(sessionFCPlus);

    journal.consigne = () => {};
    requete.session = {};
    reponse.render = () => Promise.resolve();
    reponse.status = () => reponse;
  });

  it('conserve les infos utilisateurs dans un cookie de session', () => {
    adaptateurChiffrement.genereJeton = () => Promise.resolve('XXX');

    expect(requete.session.jeton).toBeUndefined();
    return connexionFCPlus(config, 'unCode', requete, reponse)
      .then(() => expect(requete.session.jeton).toBe('XXX'));
  });

  it('conserve le JWT de session FC+ dans le cookie de session', () => {
    sessionFCPlus.jwt = 'abcdef';
    expect(requete.session.jwtSessionFCPlus).toBeUndefined();

    return connexionFCPlus(config, 'unCode', requete, reponse)
      .then(() => expect(requete.session.jwtSessionFCPlus).toBe('abcdef'));
  });

  it('supprime le jeton déjà en session sur erreur récupération infos', () => {
    sessionFCPlus.enJSON = () => Promise.reject(new Error('oups'));
    adaptateurChiffrement.genereJeton = () => Promise.resolve('abcdef');

    requete.session.jeton = 'unJeton';
    return connexionFCPlus(config, 'unCode', requete, reponse)
      .then(() => expect(requete.session.jeton).toBeUndefined());
  });

  describe('quand nonce retourné diffère du nonce en session', () => {
    beforeEach(() => {
      requete.session.nonce = 'abcde';
      sessionFCPlus.enJSON = () => Promise.resolve({ nonce: 'oups' });
    });

    it("journalise l'erreur", () => {
      expect.assertions(1);

      journal.consigne = (entree) => { expect(entree).toBe('Échec authentification (nonce invalide)'); };

      return connexionFCPlus(config, 'unCode', requete, reponse);
    });

    it('redirige vers la destruction de session FC+', () => {
      expect.assertions(2);

      reponse.render = (nomModelePage, { destination }) => {
        try {
          expect(nomModelePage).toBe('redirectionNavigateur');
          expect(destination).toBe('/auth/fcplus/destructionSession');
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      };

      return connexionFCPlus(config, 'unCode', requete, reponse);
    });
  });
});
