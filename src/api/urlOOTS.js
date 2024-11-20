const urlOOTS = (adaptateurEnvironnement) => `${adaptateurEnvironnement.urlBaseOOTSFrance()}/requete/pieceJustificative?codeDemarche=00&codePays=FR&idRequeteur=${adaptateurEnvironnement.identifiantRequeteur()}`;

module.exports = urlOOTS;
