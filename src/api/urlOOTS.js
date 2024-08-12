const urlOOTS = (adaptateurEnvironnement) => {
  const urlOOTSRequete = `${adaptateurEnvironnement.urlBaseOOTSFrance()}/requete/pieceJustificative?codeDemarche=00&codePays=FR`;
  return adaptateurEnvironnement.avecOOTS() && urlOOTSRequete;
};

module.exports = urlOOTS;
