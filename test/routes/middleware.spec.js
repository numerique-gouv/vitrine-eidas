const Middleware = require('../../src/routes/middleware');

describe('Le middleware', () => {
  const reponse = {};
  let requete;

  beforeEach(() => {
    requete = { query: {}, session: { jeton: '' } };
    reponse.render = () => Promise.resolve();
  });

  it("renseigne les infos de l'utilisateur courant dans la requête", (suite) => {
    requete.session.infosUtilisateur = { prenom: 'Pierre', nomUsage: 'Jax' };

    const middleware = new Middleware();
    expect(requete.utilisateurCourant).toBeUndefined();

    middleware.renseigneUtilisateurCourant(requete, null, () => {
      try {
        const utilisateur = requete.utilisateurCourant;
        expect(utilisateur.prenom).toEqual('Pierre');
        expect(utilisateur.nomUsage).toEqual('Jax');
        suite();
      } catch (e) { suite(e); }
    });
  });

  it("supprime les infos de l'utilisateur courant si les données en session sont invalides", (suite) => {
    expect(requete.session.infosUtilisateur).toBeUndefined();

    const middleware = new Middleware();
    middleware.renseigneUtilisateurCourant(requete, null, () => {
      try {
        expect(requete.utilisateurCourant).toBeUndefined();
        suite();
      } catch (e) { suite(e); }
    });
  });

  describe('sur demande de vérification du tampon unique', () => {
    it('assure que tampon communiqué identique à celui stocké en session avant de passer à la suite', (suite) => {
      requete.session.etat = '12345';
      requete.query.state = '12345';
      const middleware = new Middleware();

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

        const middleware = new Middleware();
        middleware.verifieTamponUnique(requete, reponse, () => { throw new Error("Tampon invalide – on n'aurait pas dû passer à la suite"); });
      });

      it('supprime cookie session', () => {
        expect.assertions(1);

        reponse.render = () => { expect(requete.session).toBe(null); };

        const middleware = new Middleware();
        middleware.verifieTamponUnique(requete, reponse);
      });
    });
  });
});
