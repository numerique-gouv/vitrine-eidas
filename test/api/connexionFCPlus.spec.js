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
    sessionFCPlus.jetonAcces = '';
    sessionFCPlus.jwt = '';
    sessionFCPlus.enJSON = () => Promise.resolve({});
    fabriqueSessionFCPlus.nouvelleSession = () => Promise.resolve(sessionFCPlus);

    journal.consigne = () => {};
    requete.query = { code: 'unCode' };
    requete.session = {};
    reponse.render = () => Promise.resolve();
    reponse.status = () => reponse;
  });

  it('conserve les infos utilisateurs dans un cookie de session', () => {
    sessionFCPlus.enJSON = () => Promise.resolve({ uneClef: 'une valeur' });

    expect(requete.session.infosUtilisateur).toBeUndefined();
    return connexionFCPlus(config, requete, reponse)
      .then(() => expect(requete.session.infosUtilisateur).toEqual({ uneClef: 'une valeur' }));
  });

  it('conserve le JWT de session FC+ dans le cookie de session', () => {
    sessionFCPlus.jwt = 'abcdef';
    expect(requete.session.jwtSessionFCPlus).toBeUndefined();

    return connexionFCPlus(config, requete, reponse)
      .then(() => expect(requete.session.jwtSessionFCPlus).toBe('abcdef'));
  });

  it("conserve le jeton d'accès dans le cookie de session", () => {
    sessionFCPlus.jetonAcces = 'abcdef';
    expect(requete.session.jetonAcces).toBeUndefined();

    return connexionFCPlus(config, requete, reponse)
      .then(() => expect(requete.session.jetonAcces).toBe('abcdef'));
  });

  it('supprime les infos utilisateur déjà en session sur erreur récupération des infos', () => {
    sessionFCPlus.enJSON = () => Promise.reject(new Error('oups'));

    requete.session.infosUtilisateur = { uneClef: 'une valeur' };
    return connexionFCPlus(config, requete, reponse)
      .then(() => expect(requete.session.infosUtilisateur).toBeUndefined());
  });

  describe('quand nonce retourné diffère du nonce en session', () => {
    beforeEach(() => {
      requete.session.nonce = 'abcde';
      sessionFCPlus.enJSON = () => Promise.resolve({ nonce: 'oups' });
    });

    it("journalise l'erreur", () => {
      expect.assertions(1);

      journal.consigne = (entree) => { expect(entree).toBe('Échec authentification (nonce invalide)'); };

      return connexionFCPlus(config, requete, reponse);
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

      return connexionFCPlus(config, requete, reponse);
    });
  });
});
