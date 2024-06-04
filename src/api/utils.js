const redirigeDepuisNavigateur = (destination, reponse) => reponse.send(`
<!DOCTYPE html>
<html>
<head><meta http-equiv="refresh" content="0; url='${destination}'"></head>
<body></body>
</html>
`);

const stockeDansCookieSession = (infos, adaptateurChiffrement, requete) => adaptateurChiffrement
  .genereJeton(infos)
  .then((jwt) => { requete.session.jeton = jwt; });

module.exports = { redirigeDepuisNavigateur, stockeDansCookieSession };
