const stockeDansCookieSession = (infos, adaptateurChiffrement, requete) => adaptateurChiffrement
  .genereJeton(infos)
  .then((jwt) => { requete.session.jeton = jwt; });

module.exports = { stockeDansCookieSession };
