const urlOOTS = (config, requete) => {
  const { adaptateurChiffrement, adaptateurEnvironnement } = config;
  const { infosUtilisateur } = requete.session;

  return adaptateurChiffrement.enJWEPourOOTS(infosUtilisateur)
    .then((jwe) => {
      const requeteur = adaptateurEnvironnement.identifiantRequeteur();
      const urlOOTSFrance = adaptateurEnvironnement.urlBaseOOTSFrance();
      return `${urlOOTSFrance}/requete/pieceJustificative?codeDemarche=00&codePays=FR&idRequeteur=${requeteur}&utilisateur=${jwe}&beneficiaire=${jwe}`;
    });
};

module.exports = urlOOTS;
