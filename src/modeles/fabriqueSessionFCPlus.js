const SessionFCPlus = require('./sessionFCPlus');

class FabriqueSessionFCPlus {
  constructor(config) {
    this.config = config;
    this.adaptateurChiffrement = config.adaptateurChiffrement;
    this.adaptateurFranceConnectPlus = config.adaptateurFranceConnectPlus;
  }

  peupleDonneesJetonAcces(code) {
    const conserveDansSession = (donnees) => {
      this.session.jetonAcces = donnees.access_token;

      return Promise.all([
        this.adaptateurChiffrement.dechiffreJWE(donnees.id_token),
        this.adaptateurFranceConnectPlus.recupereURLClefsPubliques(),
      ])
        .then(([jwt, url]) => {
          this.session.jwt = jwt;
          return this.adaptateurChiffrement.verifieSignatureJWTDepuisJWKS(jwt, url);
        })
        .then(({ nonce }) => { this.session.nonce = nonce; });
    };

    return this.adaptateurFranceConnectPlus.recupereDonneesJetonAcces(code)
      .then(conserveDansSession);
  }

  nouvelleSession(code) {
    this.session = new SessionFCPlus(this.config);
    return this.peupleDonneesJetonAcces(code)
      .then(() => this.session);
  }
}

module.exports = FabriqueSessionFCPlus;
