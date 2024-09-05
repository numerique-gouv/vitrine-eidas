const avecEnvoiCookieSurHTTP = () => process.env.AVEC_ENVOI_COOKIE_SUR_HTTP === 'true';

const avecMock = () => process.env.AVEC_MOCK === 'true';

const avecOOTS = () => process.env.AVEC_OOTS === 'true';

const clePriveeJWK = () => JSON.parse(atob(process.env.CLE_PRIVEE_JWK_EN_BASE64));

const identifiantClient = () => process.env.IDENTIFIANT_CLIENT_FCPLUS;

const identifiantRequeteur = () => process.env.IDENTIFIANT_REQUETEUR;

const parametresRequeteJeton = () => ({
  client_id: process.env.IDENTIFIANT_CLIENT_FCPLUS,
  client_secret: process.env.SECRET_CLIENT_FCPLUS,
  redirect_uri: process.env.URL_REDIRECTION_CONNEXION,
});

const secretJetonSession = () => new TextEncoder().encode(process.env.SECRET_JETON_SESSION);

const urlConfigurationOpenIdFCPlus = () => process.env.URL_CONFIGURATION_OPEN_ID_FCPLUS;

const urlBaseOOTSFrance = () => process.env.URL_BASE_OOTS_FRANCE;

const urlRedirectionConnexion = () => process.env.URL_REDIRECTION_CONNEXION;

const urlRedirectionDeconnexion = () => process.env.URL_REDIRECTION_DECONNEXION;

module.exports = {
  avecEnvoiCookieSurHTTP,
  avecMock,
  avecOOTS,
  clePriveeJWK,
  identifiantClient,
  identifiantRequeteur,
  parametresRequeteJeton,
  secretJetonSession,
  urlConfigurationOpenIdFCPlus,
  urlBaseOOTSFrance,
  urlRedirectionConnexion,
  urlRedirectionDeconnexion,
};
