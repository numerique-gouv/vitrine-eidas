const destructionSessionFCPlus = (config, requete, reponse) => {
  const {
    adaptateurChiffrement,
    adaptateurEnvironnement,
    adaptateurFranceConnectPlus,
  } = config;

  const { jwtSessionFCPlus } = requete.session;
  if (!jwtSessionFCPlus) { return reponse.redirect('/auth/fcplus/deconnexion'); }

  const etat = adaptateurChiffrement.cleHachage(`${Math.random()}`);
  const urlRedirectionDeconnexion = adaptateurEnvironnement.urlRedirectionDeconnexion();

  return adaptateurFranceConnectPlus.urlDestructionSession()
    .then((url) => reponse.redirect(
      `${url}?id_token_hint=${jwtSessionFCPlus}&state=${etat}&post_logout_redirect_uri=${urlRedirectionDeconnexion}`,
    ));
};

module.exports = destructionSessionFCPlus;
