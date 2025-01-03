const { ErreurEchecAuthentification } = require('../../src/erreurs');
const SessionFCPlus = require('../../src/modeles/sessionFCPlus');

describe('Une session FranceConnect+', () => {
  const adaptateurChiffrement = {};
  const adaptateurFranceConnectPlus = {};
  const config = { adaptateurChiffrement, adaptateurFranceConnectPlus };

  beforeEach(() => {
    adaptateurChiffrement.dechiffreJWE = () => Promise.resolve('');
    adaptateurChiffrement.verifieSignatureJWTDepuisJWKS = () => Promise.resolve({});
    adaptateurFranceConnectPlus.recupereInfosUtilisateurChiffrees = () => Promise.resolve('');
    adaptateurFranceConnectPlus.recupereURLClefsPubliques = () => Promise.resolve('');
  });

  const nouvelleSession = ({
    jetonAcces = 'unJetonAcces',
    jwt = 'unJWT',
    nonce = '',
    urlClefsPubliques = 'uneURL',
  } = {}) => {
    const session = new SessionFCPlus(config);
    Object.assign(session, {
      jetonAcces, jwt, nonce, urlClefsPubliques,
    });

    return session;
  };

  describe('sur demande infos utilisateur déchiffrées', () => {
    it('récupère les infos', () => {
      adaptateurFranceConnectPlus.recupereInfosUtilisateurChiffrees = (jetonAcces) => {
        try {
          expect(jetonAcces).toBe('abcdef');
          return Promise.resolve('123');
        } catch (e) {
          return Promise.reject(e);
        }
      };

      adaptateurChiffrement.dechiffreJWE = (jwe) => {
        try {
          expect(jwe).toBe('123');
          return Promise.resolve('999');
        } catch (e) {
          return Promise.reject(e);
        }
      };

      const session = new SessionFCPlus(config, 'unCode');
      session.jetonAcces = 'abcdef';

      return session.infosUtilisateurDechiffrees()
        .then((jwt) => {
          expect(jwt).toBe('999');
        });
    });

    it("lève une erreur si le jeton d'accès n'est pas défini", () => {
      expect.assertions(2);

      const session = nouvelleSession({ jetonAcces: '' });
      expect(session.jetonAcces).toBeFalsy();

      return session.infosUtilisateurDechiffrees()
        .catch((e) => expect(e.message).toBe('Jeton accès non défini. La session a-t-elle bien été instanciée depuis la fabrique ?'));
    });
  });

  describe('sur demande description données', () => {
    it('vérifie la signature du JWT des infos utilisateur', () => {
      let signatureVerifiee = false;
      adaptateurChiffrement.verifieSignatureJWTDepuisJWKS = () => {
        signatureVerifiee = true;
        return Promise.resolve({});
      };

      const session = nouvelleSession();
      return session.enJSON()
        .then(() => expect(signatureVerifiee).toBe(true));
    });

    it('ajoute les infos utilisateur au cookie de session', () => {
      adaptateurFranceConnectPlus.recupereInfosUtilisateurChiffrees = () => Promise.resolve('aaa');
      adaptateurFranceConnectPlus.recupereURLClefsPubliques = () => Promise.resolve('http://example.com');
      adaptateurChiffrement.dechiffreJWE = (jwe) => Promise.resolve(jwe);
      adaptateurChiffrement.verifieSignatureJWTDepuisJWKS = (jwt, url) => {
        try {
          expect(jwt).toBe('aaa');
          expect(url).toBe('http://example.com');
          return Promise.resolve({ given_name: 'Anne', family_name: 'Durand', birthdate: '1972-11-25' });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      const session = nouvelleSession();
      return session.enJSON()
        .then((json) => {
          expect(json).toHaveProperty('prenom', 'Anne');
          expect(json).toHaveProperty('nomUsage', 'Durand');
          expect(json).toHaveProperty('dateNaissance', '1972-11-25');
        });
    });

    it('ajoute le nonce FC+ aux infos utilisateur', () => {
      const session = nouvelleSession({ nonce: 'abcde' });

      return session.enJSON()
        .then((json) => expect(json).toHaveProperty('nonce', 'abcde'));
    });

    it('lève une `ErreurEchecAuthentification` si une erreur est rencontrée', () => {
      expect.assertions(2);

      adaptateurFranceConnectPlus.recupereInfosUtilisateurChiffrees = () => Promise.reject(new Error('oups'));

      const session = nouvelleSession();

      return session.enJSON()
        .catch((e) => {
          expect(e).toBeInstanceOf(ErreurEchecAuthentification);
          expect(e.message).toBe('oups');
        });
    });

    it("lève une erreur si le JWT n'est pas défini", () => {
      expect.assertions(2);

      const session = nouvelleSession({ jwt: '' });
      expect(session.jwt).toBeFalsy();

      return session.enJSON()
        .catch((e) => expect(e.message).toBe('JWT non défini. La session a-t-elle bien été instanciée depuis la fabrique ?'));
    });
  });
});
