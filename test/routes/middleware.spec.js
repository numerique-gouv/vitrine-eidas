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
      requete.session.etat = '12345';
      requete.query.state = '12345';
      const middleware = new Middleware(config);

      middleware.verifieTamponUnique(requete, reponse, suite);
    });

    describe('quand tampon communiqué différent', () => {
      beforeEach(() => {
        requete.session.etat = '12345';
        requete.query.state = 'oups';
      });

      it('redirige vers page accueil depuis navigateur', () => {
        expect.assertions(1);

        reponse.render = (_nomPageRedirection, { destination }) => expect(destination).toBe('/');

        const middleware = new Middleware(config);
        middleware.verifieTamponUnique(requete, reponse, () => { throw new Error("Tampon invalide – on n'aurait pas dû passer à la suite"); });
      });

      it('supprime cookie session', () => {
        expect.assertions(1);

        reponse.render = () => { expect(requete.session).toBe(null); };

        const middleware = new Middleware(config);
        middleware.verifieTamponUnique(requete, reponse);
      });
    });
  });
});
