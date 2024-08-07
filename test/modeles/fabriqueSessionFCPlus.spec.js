const FabriqueSessionFCPlus = require('../../src/modeles/fabriqueSessionFCPlus');

describe('La fabrique de session FC+', () => {
  const adaptateurChiffrement = {};
  const adaptateurFranceConnectPlus = {};
  const config = { adaptateurChiffrement, adaptateurFranceConnectPlus };

  beforeEach(() => {
    adaptateurChiffrement.dechiffreJWE = () => Promise.resolve('');
    adaptateurChiffrement.verifieSignatureJWTDepuisJWKS = () => Promise.resolve({});
    adaptateurFranceConnectPlus.recupereDonneesJetonAcces = () => Promise.resolve({});
    adaptateurFranceConnectPlus.recupereURLClefsPubliques = () => Promise.resolve('');
  });

  it("conserve le jeton d'accès", () => {
    adaptateurFranceConnectPlus.recupereDonneesJetonAcces = (code) => {
      try {
        expect(code).toBe('unCode');
        return Promise.resolve({ access_token: 'abcdef' });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    const fabrique = new FabriqueSessionFCPlus(config);
    return fabrique.nouvelleSession('unCode')
      .then((session) => expect(session.jetonAcces).toBe('abcdef'));
  });

  it('conserve le JWT de la session FC+', () => {
    adaptateurFranceConnectPlus.recupereDonneesJetonAcces = () => Promise.resolve({ id_token: '123' });
    adaptateurChiffrement.dechiffreJWE = (jwe) => {
      try {
        expect(jwe).toBe('123');
        return Promise.resolve('999');
      } catch (e) {
        return Promise.reject(e);
      }
    };

    const fabrique = new FabriqueSessionFCPlus(config);
    return fabrique.nouvelleSession('unCode')
      .then((session) => expect(session.jwt).toBe('999'));
  });

  it('conserve le nonce contenu dans le JWT', () => {
    adaptateurChiffrement.dechiffreJWE = () => Promise.resolve('999');
    adaptateurChiffrement.verifieSignatureJWTDepuisJWKS = (jwt) => {
      try {
        expect(jwt).toBe('999');
        return Promise.resolve({ nonce: 'abc' });
      } catch (e) {
        return Promise.reject(e);
      }
    };

    const fabrique = new FabriqueSessionFCPlus(config);
    return fabrique.nouvelleSession('unCode')
      .then((session) => expect(session.nonce).toBe('abc'));
  });
});
