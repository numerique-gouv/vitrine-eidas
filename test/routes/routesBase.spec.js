const axios = require('axios');

const serveurTest = require('./serveurTest');
const { leveErreur } = require('./utils');
const Utilisateur = require('../../src/modeles/utilisateur');

describe('Le serveur des routes `/`', () => {
  const serveur = serveurTest();
  let port;

  beforeEach((suite) => serveur.initialise(() => {
    port = serveur.port();
    suite();
  }));

  afterEach((suite) => serveur.arrete(suite));

  describe('sur GET /', () => {
    it("affiche un bouton de connexion s'il n'y a pas d'utilisateur courant", () => (
      axios.get(`http://localhost:${port}/`)
        .then((reponse) => {
          expect(reponse.status).toBe(200);
          expect(reponse.data).toMatch(/<a class="bouton .*" href="\/auth\/fcplus\/creationSession.*">/);
        })
        .catch(leveErreur)));

    it("affiche prénom et nom de l'utilisateur courant s'il existe", () => {
      serveur.middleware().reinitialise({
        utilisateurCourant: new Utilisateur({
          jwtSessionFCPlus: 'abcdef',
          prenom: 'Sandra',
          nomUsage: 'Nicouette',
        }),
      });

      return axios.get(`http://localhost:${port}/`)
        .then((reponse) => {
          expect(reponse.status).toBe(200);
          expect(reponse.data).toContain('Sandra Nicouette');
        })
        .catch(leveErreur);
    });
  });
});
