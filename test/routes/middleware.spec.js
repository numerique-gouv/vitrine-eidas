const { ErreurJetonInvalide } = require('../../src/erreurs');
const Middleware = require('../../src/routes/middleware');

describe('Le middleware OOTS-France', () => {
  const adaptateurChiffrement = {};
  const adaptateurEnvironnement = {};
  const config = { adaptateurChiffrement, adaptateurEnvironnement };
  const reponse = {};
  let requete;

  beforeEach(() => {
    adaptateurEnvironnement.secretJetonSession = () => '';
    adaptateurChiffrement.verifieJeton = () => Promise.resolve();

    requete = { query: {}, session: { jeton: '' } };
    reponse.render = () => Promise.resolve();
  });

  it('vérifie le jeton stocké en session', (suite) => {
    requete.session.jeton = 'jeton';
    adaptateurEnvironnement.secretJetonSession = () => 'secret';
    adaptateurChiffrement.verifieJeton = (jeton, secret) => {
      try {
        expect(jeton).toBe('jeton');
        expect(secret).toBe('secret');

        return Promise.resolve();
      } catch (e) { return Promise.reject(e); }
    };

    const middleware = new Middleware(config);

    middleware.renseigneUtilisateurCourant(requete, null, suite)
      .catch(suite);
  });

  it("renseigne les infos de l'utilisateur courant dans la requête", (suite) => {
    adaptateurChiffrement.verifieJeton = () => Promise.resolve({
      prenom: 'Pierre',
      nomUsage: 'Jax',
    });

    const middleware = new Middleware(config);
    expect(requete.utilisateurCourant).toBeUndefined();

    middleware.renseigneUtilisateurCourant(requete, null, () => {
      try {
        const utilisateur = requete.utilisateurCourant;
        expect(utilisateur.prenom).toEqual('Pierre');
        expect(utilisateur.nomUsage).toEqual('Jax');
        suite();
      } catch (e) { suite(e); }
    })
      .catch(suite);
  });

  it("supprime les infos de l'utilisateur courant si le jeton est invalide", (suite) => {
    adaptateurChiffrement.verifieJeton = () => Promise.reject(new ErreurJetonInvalide('oups'));

    const middleware = new Middleware(config);
    middleware.renseigneUtilisateurCourant(requete, null, () => {
      expect(requete.utilisateurCourant).toBeUndefined();
      suite();
    })
      .catch(suite);
  });

  describe('sur demande de vérification du tampon unique', () => {
    it('assure que tampon communiqué identique à celui stocké en session avant de passer à la suite', (suite) => {
      expect.assertions(1);

      adaptateurChiffrement.verifieJeton = (jeton) => {
        try {
          expect(jeton).toBe('XXX');
          return Promise.resolve({ etat: '12345' });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      requete.session.jeton = 'XXX';
      requete.query.state = '12345';
      const middleware = new Middleware(config);

      middleware.verifieTamponUnique(requete, reponse, suite)
        .catch(suite);
    });

    it('redirige vers page accueil depuis navigateur si tampon communiqué différent', () => {
      reponse.render = (_nomPageRedirection, { destination }) => {
        try {
          expect(destination).toBe('/');
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      };

      adaptateurChiffrement.verifieJeton = () => Promise.resolve({ etat: 'oups' });
      requete.query.state = '12345';
      const middleware = new Middleware(config);

      return middleware.verifieTamponUnique(
        requete,
        reponse,
        () => Promise.reject(new Error("Tampon invalide – on n'aurait pas dû passer à la suite")),
      );
    });

    it('supprime cookie session si tampon communiqué différent', () => {
      adaptateurChiffrement.verifieJeton = () => Promise.resolve({ etat: 'oups' });
      requete.query.state = '12345';
      const middleware = new Middleware(config);

      requete.session.jeton = 'XXX';
      return middleware.verifieTamponUnique(requete, reponse)
        .then(() => expect(requete.session).toBe(null));
    });
  });
});
