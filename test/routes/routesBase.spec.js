const axios = require('axios');

const serveurTest = require('./serveurTest');
const { leveErreur } = require('./utils');
const StatutRecuperationDocument = require('../../src/modeles/statutRecuperationDocument');
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

    describe('si utilisateur courant existant', () => {
      beforeEach(() => serveur.middleware().reinitialise({
        utilisateurCourant: new Utilisateur({
          jwtSessionFCPlus: 'abcdef',
          prenom: 'Sandra',
          nomUsage: 'Nicouette',
        }),
      }));

      it('affiche prénom et nom utilisateur courant', () => (
        axios.get(`http://localhost:${port}/`)
          .then((reponse) => {
            expect(reponse.status).toBe(200);
            expect(reponse.data).toContain('Sandra Nicouette');
          })
          .catch(leveErreur)));

      it("n'affiche pas le lien vers OOTS si feature flip désactivé", () => {
        serveur.adaptateurEnvironnement().urlBaseOOTSFrance = () => 'http://example.com';
        serveur.adaptateurEnvironnement().avecOOTS = () => false;
        return axios.get(`http://localhost:${port}/`)
          .then((reponse) => {
            expect(reponse.data).not.toMatch(/<a href="http:\/\/example\.com.*">/);
          })
          .catch(leveErreur);
      });

      it('affiche le statut du processus de récupération de document', () => {
        serveur.depotDonnees().statutRecuperationDocument = () => (
          Promise.resolve(StatutRecuperationDocument.enCours())
        );

        return axios.get(`http://localhost:${port}/`)
          .then((reponse) => {
            expect(reponse.data).toContain('Document en cours de récupération');
          })
          .catch(leveErreur);
      });

      it('affiche lorsque le document a été récupéré', () => {
        serveur.depotDonnees().statutRecuperationDocument = () => (
          Promise.resolve(StatutRecuperationDocument.termine())
        );

        return axios.get(`http://localhost:${port}/`)
          .then((reponse) => {
            expect(reponse.data).toContain('Document récupéré !');
          })
          .catch(leveErreur);
      });
    });
  });
});
