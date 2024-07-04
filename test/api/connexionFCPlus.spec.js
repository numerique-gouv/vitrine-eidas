const connexionFCPlus = require('../../src/api/connexionFCPlus');

describe('Le requêteur de connexion FC+', () => {
  const adaptateurChiffrement = {};
  const adaptateurEnvironnement = {};
  const fabriqueSessionFCPlus = {};
  const journal = {};
  const config = {
    adaptateurChiffrement,
    adaptateurEnvironnement,
    fabriqueSessionFCPlus,
    journal,
  };
  const requete = {};
  const reponse = {};

  beforeEach(() => {
    adaptateurChiffrement.genereJeton = () => Promise.resolve();
    adaptateurChiffrement.verifieJeton = () => Promise.resolve({});
    adaptateurEnvironnement.secretJetonSession = () => '';
    fabriqueSessionFCPlus.nouvelleSession = () => Promise.resolve({
      enJSON: () => Promise.resolve({}),
    });
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

  it('supprime le jeton déjà en session sur erreur récupération infos', () => {
    fabriqueSessionFCPlus.nouvelleSession = () => Promise.resolve({
      enJSON: () => Promise.reject(new Error('oups')),
    });
    adaptateurChiffrement.genereJeton = () => Promise.resolve('abcdef');

    requete.session.jeton = 'unJeton';
    return connexionFCPlus(config, 'unCode', requete, reponse)
      .then(() => expect(requete.session.jeton).toBeUndefined());
  });

  describe('quand nonce retourné diffère du nonce en session', () => {
    beforeEach(() => {
      adaptateurChiffrement.verifieJeton = () => Promise.resolve({ nonce: 'unNonce' });

      requete.session.jeton = { nonce: 'abcde' };
      fabriqueSessionFCPlus.nouvelleSession = () => Promise.resolve({
        enJSON: () => Promise.resolve({ nonce: 'oups' }),
      });
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
