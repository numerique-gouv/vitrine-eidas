const urlOOTS = (adaptateurEnvironnement, requete) => {
  const { jetonAcces } = requete.session;
  return `${adaptateurEnvironnement.urlBaseOOTSFrance()}/requete/pieceJustificative?codeDemarche=00&codePays=FR&jetonAcces=${jetonAcces}&idRequeteur=${adaptateurEnvironnement.identifiantRequeteur()}`;
};

module.exports = urlOOTS;
