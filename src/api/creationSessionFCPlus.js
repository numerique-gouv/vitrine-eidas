const { stockeDansCookieSession } = require('../routes/utils');

const creationSessionFCPlus = (config, requete, reponse) => {
  const { adaptateurChiffrement, adaptateurEnvironnement, adaptateurFranceConnectPlus } = config;

  const identifiantClient = adaptateurEnvironnement.identifiantClient();
  const urlRedirectionConnexion = adaptateurEnvironnement.urlRedirectionConnexion();
  const etat = adaptateurChiffrement.cleHachage(`${Math.random()}`);
  const nonce = adaptateurChiffrement.cleHachage(`${Math.random()}`);
  const { contexteMock } = requete.query;
  const paramContexteMock = (adaptateurEnvironnement.avecMock() && contexteMock)
    ? `&contexte_mock=${contexteMock}`
    : '';

  const construisURL = () => adaptateurFranceConnectPlus.urlCreationSession()
    .then((url) => `${url}?scope=profile%20openid%20birthcountry%20birthplace&acr_values=eidas2&claims={%22id_token%22:{%22amr%22:{%22essential%22:true}}}&prompt=login%20consent&response_type=code&idp_hint=${adaptateurEnvironnement.fournisseurIdentiteSuggere()}&client_id=${identifiantClient}&redirect_uri=${urlRedirectionConnexion}&state=${etat}&nonce=${nonce}${paramContexteMock}`);

  return stockeDansCookieSession({ etat, nonce }, adaptateurChiffrement, requete)
    .then(construisURL)
    .then((url) => reponse.render('redirectionNavigateur', { destination: url }));
};

module.exports = creationSessionFCPlus;
