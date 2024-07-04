const axios = require('axios');

const { leveErreur } = require('./utils');
const serveurTest = require('./serveurTest');
const Utilisateur = require('../../src/modeles/utilisateur');

describe('Le serveur des routes `/auth`', () => {
  const serveur = serveurTest();
  let port;

  beforeEach((suite) => serveur.initialise(() => {
    port = serveur.port();
    suite();
  }));

  afterEach((suite) => serveur.arrete(suite));

  describe('sur GET /auth/cles_publiques', () => {
    it('retourne les clés de chiffrement au format JSON Web Key Set', () => {
      serveur.adaptateurEnvironnement().clePriveeJWK = () => ({ e: 'AQAB', n: '503as-2qay5...', kty: 'RSA' });
      serveur.adaptateurChiffrement().cleHachage = (chaine) => `hash de ${chaine}`;

      return axios.get(`http://localhost:${port}/auth/cles_publiques`)
        .then((reponse) => {
          expect(reponse.status).toEqual(200);
          expect(reponse.data).toEqual({
            keys: [{
              kid: 'hash de 503as-2qay5...',
              kty: 'RSA',
              use: 'enc',
              e: 'AQAB',
              n: '503as-2qay5...',
            }],
          });
        })
        .catch(leveErreur);
    });
  });

  describe('sur GET /auth/fcplus/connexion', () => {
    it("redirige vers la page d'accueil si le paramètre `error` est présent", () => axios
      .get(`http://localhost:${port}/auth/fcplus/connexion?error=boum`)
      .then((reponse) => expect(reponse.data).toContain('<meta http-equiv="refresh" content="0; url=\'/\'">'))
      .catch(leveErreur));

    it('réinitialise le cookie de session', () => axios
      .get(`http://localhost:${port}/auth/fcplus/connexion?error=boum&error_description=oups`)
      .then((reponse) => {
        expect(reponse.headers).toHaveProperty('set-cookie');
        const valeurEnteteSetCookie = reponse
          .headers['set-cookie']
          .find((h) => h.match(/session=;/));
        expect(valeurEnteteSetCookie).toContain('session=;');
      }));

    it("sert une erreur HTTP 400 (Bad Request) si le paramètre 'code' est manquant", () => {
      expect.assertions(2);

      return axios.get(`http://localhost:${port}/auth/fcplus/connexion?state=unState`)
        .catch(({ response }) => {
          expect(response.status).toBe(400);
          expect(response.data).toEqual({ erreur: "Paramètre 'code' absent de la requête" });
        });
    });

    it("sert une erreur HTTP 400 (Bad Request) si le paramètre 'state' est manquant", () => {
      expect.assertions(2);

      return axios.get(`http://localhost:${port}/auth/fcplus/connexion?code=unCode`)
        .catch(({ response }) => {
          expect(response.status).toBe(400);
          expect(response.data).toEqual({ erreur: "Paramètre 'state' absent de la requête" });
        });
    });

    describe('lorsque les paramètres `code` et `state` sont présents', () => {
      it('redirige vers `/auth/fcplus/connexion_apres_redirection', () => axios
        .get(`http://localhost:${port}/auth/fcplus/connexion?state=unState&code=unCode`)
        .then((reponse) => expect(reponse.data).toContain('<meta http-equiv="refresh" content="0; url=\'/auth/fcplus/connexion_apres_redirection'))
        .catch(leveErreur));

      it('transmet les paramètres reçus dans la requête', () => axios
        .get(`http://localhost:${port}/auth/fcplus/connexion?state=unState&code=unCode`)
        .then((reponse) => expect(reponse.data).toContain('?state=unState&code=unCode'))
        .catch(leveErreur));
    });
  });

  describe('sur GET /auth/fcplus/connexion_apres_redirection', () => {
    describe('lorsque les paramètres `code` et `state` sont présents', () => {
      it('appelle le middleware pour vérifier le tampon communiqué par FC+', () => {
        let middlewareAppele = false;
        serveur.middleware().verifieTamponUnique = (_requete, _reponse, suite) => Promise.resolve()
          .then(() => { middlewareAppele = true; })
          .then(suite);

        return axios.get(`http://localhost:${port}/auth/fcplus/connexion_apres_redirection?state=unState&code=unCode`)
          .then(() => expect(middlewareAppele).toBe(true))
          .catch(leveErreur);
      });

      it('redirige vers page accueil depuis navigateur', () => (
        axios.get(`http://localhost:${port}/auth/fcplus/connexion_apres_redirection?state=unState&code=unCode`)
          .then((reponse) => expect(reponse.data).toContain('<meta http-equiv="refresh" content="0; url=\'/\'">'))
          .catch(leveErreur)
      ));

      it('stocke les infos dans un cookie sans attribut `Secure` si autorisé avant la redirection', () => {
        serveur.adaptateurEnvironnement().avecEnvoiCookieSurHTTP = () => true;
        return axios({
          method: 'get',
          url: `http://localhost:${port}/auth/fcplus/connexion_apres_redirection?state=unState&code=unCode`,
          maxRedirects: 0,
        })
          .catch(({ response }) => {
            expect(response.status).toBe(302);
            expect(response.headers).toHaveProperty('set-cookie');
            const valeurEnteteSetCookie = response
              .headers['set-cookie']
              .find((h) => h.match(/session=/));
            expect(valeurEnteteSetCookie).not.toContain('secure');
          })
          .catch(leveErreur);
      });

      it("redirige vers la destruction de session FranceConnect+ quand l'authentification échoue", () => {
        serveur.fabriqueSessionFCPlus().nouvelleSession = () => Promise.resolve({
          enJSON: () => Promise.reject(new Error('Oups')),
        });

        return axios.get(`http://localhost:${port}/auth/fcplus/connexion_apres_redirection?code=unCode&state=unState`)
          .then((reponse) => expect(reponse.data).toContain('<meta http-equiv="refresh" content="0; url=\'/auth/fcplus/destructionSession\'">'))
          .catch(leveErreur);
      });
    });
  });

  describe('sur GET /auth/fcplus/deconnexion', () => {
    it('redirige vers page accueil', () => (
      axios.get(`http://localhost:${port}/auth/fcplus/deconnexion`)
        .then((reponse) => expect(reponse.request.path).toBe('/'))
        .catch(leveErreur)
    ));
  });

  describe('sur GET /auth/fcplus/destructionSession', () => {
    it("appelle le middleware pour renseigner les infos de l'utilisateur courant", () => {
      serveur.middleware().reinitialise({
        utilisateurCourant: new Utilisateur({ prenom: 'Jean', nomUsage: 'Max', jwtSessionFCPlus: 'abcdef' }),
      });

      serveur.adaptateurFranceConnectPlus().urlDestructionSession = () => Promise.resolve(`http://localhost:${port}`);

      return axios.get(`http://localhost:${port}/auth/fcplus/destructionSession`)
        .then((reponse) => expect(reponse.request.path).toContain('id_token_hint=abcdef'))
        .catch(leveErreur);
    });
  });

  describe('sur GET /auth/fcplus/creationSession', () => {
    it("redirige vers l'URL (FC+) de création de session depuis navigateur", () => (
      axios.get(`http://localhost:${port}/auth/fcplus/creationSession`)
        .then((reponse) => expect(reponse.data).toMatch(/<meta http-equiv="refresh" content="0; url='.*'">/))
        .catch(leveErreur)
    ));
  });
});
