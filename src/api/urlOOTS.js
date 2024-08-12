const urlOOTS = (adaptateurEnvironnement, requete) => {
  const { jetonAcces } = requete.session;
  const urlOOTSRequete = `${adaptateurEnvironnement.urlBaseOOTSFrance()}/requete/pieceJustificative?codeDemarche=00&codePays=FR&jetonAcces=${jetonAcces}`;
  return adaptateurEnvironnement.avecOOTS() && urlOOTSRequete;
};

module.exports = urlOOTS;
