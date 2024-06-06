const connexionFCPlus = require('../../src/api/connexionFCPlus');

describe('Le requêteur de connexion FC+', () => {
  const adaptateurChiffrement = {};
  const adaptateurEnvironnement = {};
  const fabriqueSessionFCPlus = {};
  const config = { adaptateurChiffrement, adaptateurEnvironnement, fabriqueSessionFCPlus };
  const requete = {};
  const reponse = {};

  beforeEach(() => {
    adaptateurChiffrement.genereJeton = () => Promise.resolve();
    adaptateurChiffrement.verifieJeton = () => Promise.resolve({});
    adaptateurEnvironnement.secretJetonSession = () => '';
    fabriqueSessionFCPlus.nouvelleSession = () => Promise.resolve({
      enJSON: () => Promise.resolve({}),
    });
    requete.session = {};
    reponse.json = () => Promise.resolve();
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

  it('retourne une erreur HTTP 502 si le nonce retourné est différent du nonce en session', () => {
    expect.assertions(2);
    adaptateurChiffrement.verifieJeton = () => Promise.resolve({ nonce: 'unNonce' });

    requete.session.jeton = { nonce: 'abcde' };
    fabriqueSessionFCPlus.nouvelleSession = () => Promise.resolve({
      enJSON: () => Promise.resolve({ nonce: 'oups' }),
    });

    reponse.status = (status) => {
      expect(status).toBe(502);
      return reponse;
    };

    reponse.json = (message) => {
      try {
        expect(message.erreur).toBe('Échec authentification (nonce invalide)');
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return connexionFCPlus(config, 'unCode', requete, reponse);
  });
});
