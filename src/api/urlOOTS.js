const urlOOTS = (config, requete) => {
  const { adaptateurChiffrement, adaptateurEnvironnement } = config;
  const { infosUtilisateur } = requete.session;

  return adaptateurChiffrement.genereJWT(infosUtilisateur)
    .then((jeton) => {
      const requeteur = adaptateurEnvironnement.identifiantRequeteur();
      const urlOOTSFrance = adaptateurEnvironnement.urlBaseOOTSFrance();
      return `${urlOOTSFrance}/requete/pieceJustificative?codeDemarche=00&codePays=FR&idRequeteur=${requeteur}&utilisateur=${jeton}`;
    });
};

module.exports = urlOOTS;
