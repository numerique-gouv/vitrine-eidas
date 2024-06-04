const avecConnexionFCPlus = () => process.env.AVEC_CONNEXION_FC_PLUS === 'true';

const avecEnvoiCookieSurHTTP = () => process.env.AVEC_ENVOI_COOKIE_SUR_HTTP === 'true';

const avecMock = () => process.env.AVEC_MOCK === 'true';

const clePriveeJWK = () => JSON.parse(atob(process.env.CLE_PRIVEE_JWK_EN_BASE64));

const fournisseurIdentiteSuggere = () => (process.env.AVEC_AUTHENTIFICATION_EIDAS === 'true' ? 'eidas-bridge' : '');

const identifiantClient = () => process.env.IDENTIFIANT_CLIENT_FCPLUS;

const parametresRequeteJeton = () => ({
  client_id: process.env.IDENTIFIANT_CLIENT_FCPLUS,
  client_secret: process.env.SECRET_CLIENT_FCPLUS,
  redirect_uri: process.env.URL_REDIRECTION_CONNEXION,
});

const secretJetonSession = () => new TextEncoder().encode(process.env.SECRET_JETON_SESSION);

const urlConfigurationOpenIdFCPlus = () => process.env.URL_CONFIGURATION_OPEN_ID_FCPLUS;

const urlRedirectionConnexion = () => process.env.URL_REDIRECTION_CONNEXION;

const urlRedirectionDeconnexion = () => process.env.URL_REDIRECTION_DECONNEXION;

module.exports = {
  avecEnvoiCookieSurHTTP,
  avecConnexionFCPlus,
  avecMock,
  clePriveeJWK,
  fournisseurIdentiteSuggere,
  identifiantClient,
  parametresRequeteJeton,
  secretJetonSession,
  urlConfigurationOpenIdFCPlus,
  urlRedirectionConnexion,
  urlRedirectionDeconnexion,
};
