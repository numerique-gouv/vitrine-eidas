const { ErreurEchecAuthentification } = require('../erreurs');

const leveErreurParametreManquant = (messageParamManquant) => (
  `${messageParamManquant}. La session a-t-elle bien été instanciée depuis la fabrique ?`
);

class SessionFCPlus {
  constructor(config) {
    this.adaptateurChiffrement = config.adaptateurChiffrement;
    this.adaptateurFranceConnectPlus = config.adaptateurFranceConnectPlus;

    this.jetonAcces = undefined;
    this.jwt = undefined;
    this.nonce = undefined;
    this.urlClefsPubliques = undefined;
  }

  enJSON() {
    if (!this.jwt) {
      return Promise.reject(new Error(leveErreurParametreManquant('JWT non défini')));
    }

    if (!this.urlClefsPubliques) {
      return Promise.reject(new Error(leveErreurParametreManquant('URL clefs publiques non définie')));
    }

    return this.infosUtilisateurDechiffrees()
      .then((jwtInfosUtilisateur) => this.adaptateurChiffrement.verifieSignatureJWTDepuisJWKS(
        jwtInfosUtilisateur,
        this.urlClefsPubliques,
      ))
      .then((infosDechiffrees) => ({
        prenom: infosDechiffrees.given_name,
        nomUsage: infosDechiffrees.family_name,
        jwtSessionFCPlus: this.jwt,
        nonce: this.nonce,
      }))
      .catch((e) => Promise.reject(new ErreurEchecAuthentification(e.message)));
  }

  infosUtilisateurDechiffrees() {
    if (!this.jetonAcces) {
      return Promise.reject(new Error(leveErreurParametreManquant('Jeton accès non défini')));
    }

    return this.adaptateurFranceConnectPlus.recupereInfosUtilisateurChiffrees(this.jetonAcces)
      .then((jwe) => this.adaptateurChiffrement.dechiffreJWE(jwe));
  }
}

module.exports = SessionFCPlus;
