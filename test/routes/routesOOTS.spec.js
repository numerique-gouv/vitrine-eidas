const axios = require('axios');

const serveurTest = require('./serveurTest');
const { leveErreur } = require('./utils');

describe('le serveur des routes `/oots/document`', () => {
  const serveur = serveurTest();
  let port;

  beforeEach((suite) => serveur.initialise(() => {
    port = serveur.port();
    suite();
  }));

  afterEach((suite) => serveur.arrete(suite));

  describe('sur GET /oots/document', () => {
    it('démarre le processus de récupération du document', () => {
      let depotDonneesAppele = false;

      serveur.depotDonnees().demarreRecuperationDocument = () => {
        depotDonneesAppele = true;
        return Promise.resolve();
      };

      return axios.get(`http://localhost:${port}/oots/document`)
        .then(() => expect(depotDonneesAppele).toBe(true))
        .catch(leveErreur);
    });

    it('redirige vers OOTS', () => {
      serveur.adaptateurEnvironnement().urlBaseOOTSFrance = () => 'http://example.com';

      return axios.get(`http://localhost:${port}/oots/document`)
        .then((reponse) => {
          expect(reponse.data).toContain('<meta http-equiv="refresh" content="0; url=\'http://example.com');
        })
        .catch(leveErreur);
    });

    it('lève une erreur 501 (not implemented) si la fonctionnalité est désactivée', () => {
      expect.assertions(2);
      serveur.adaptateurEnvironnement().avecOOTS = () => false;

      return axios.get(`http://localhost:${port}/oots/document`)
        .catch(({ response }) => {
          expect(response.status).toEqual(501);
          expect(response.data).toEqual('Not Implemented Yet!');
        });
    });
  });

  describe('sur POST /oots/document', () => {
    it('lève une erreur (501) not implemented si la fonctionnalité est désactivée', () => {
      expect.assertions(2);
      serveur.adaptateurEnvironnement().avecOOTS = () => false;

      return axios.post(`http://localhost:${port}/oots/document`)
        .catch(({ response }) => {
          expect(response.status).toEqual(501);
          expect(response.data).toEqual('Not Implemented Yet!');
        });
    });

    it('met à jour le statut de récupération du document', () => {
      let depotDonneesAppele = false;
      serveur.depotDonnees().termineRecuperationDocument = () => {
        depotDonneesAppele = true;
        return Promise.resolve();
      };

      return axios.post(`http://localhost:${port}/oots/document`)
        .then(() => expect(depotDonneesAppele).toBe(true))
        .catch(leveErreur);
    });
  });

  describe('sur GET /oots/callback', () => {
    it("redirige vers la page d'accueil", () => (
      axios.get(`http://localhost:${port}/oots/callback`)
        .then((reponse) => {
          expect(reponse.data).toContain('<meta http-equiv="refresh" content="0; url=\'/\'">');
        })
        .catch(leveErreur)
    ));
  });
});
