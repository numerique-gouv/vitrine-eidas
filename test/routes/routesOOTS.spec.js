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
    it('redirige vers OOTS', () => {
      serveur.adaptateurEnvironnement().urlBaseOOTSFrance = () => 'http://example.com';

      return axios.get(`http://localhost:${port}/oots/document`)
        .then((reponse) => {
          expect(reponse.data).toContain('<meta http-equiv="refresh" content="0; url=\'http://example.com');
        })
        .catch(leveErreur);
    });
  });
});
