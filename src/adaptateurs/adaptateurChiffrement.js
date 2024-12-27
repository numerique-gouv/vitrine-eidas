const axios = require('axios');
const crypto = require('crypto');
const jose = require('jose');

const adaptateurEnvironnement = require('./adaptateurEnvironnement');
const { ErreurJetonInvalide } = require('../erreurs');

const cleHachage = (chaine) => crypto.createHash('md5').update(chaine).digest('hex');

const dechiffreJWE = (jwe) => jose
  .importJWK(adaptateurEnvironnement.clePriveeJWK())
  .then((k) => jose.compactDecrypt(jwe, k))
  .then(({ plaintext }) => plaintext.toString());

const enJWEPourOOTS = (infos) => {
  const cleChiffrementOOTS = () => (
    axios.get(`${adaptateurEnvironnement.urlBaseOOTSFrance()}/auth/cles_publiques`)
      .then((reponse) => reponse.data.keys.find((k) => k.use === 'enc'))
  );

  const enJWE = (cleChiffrement, infosAChiffrer) => {
    const genereJWT = (infosASigner) => {
      const headerJWT = {
        alg: 'RS256',
      };

      return jose.importJWK(adaptateurEnvironnement.clePriveeJWK())
        .then((clePrivee) => new jose.SignJWT(infosASigner)
          .setProtectedHeader(headerJWT)
          .sign(clePrivee));
    };

    const headerJWE = {
      alg: 'RSA-OAEP',
      enc: 'A256GCM',
      cty: 'JWT',
      iss: adaptateurEnvironnement.urlBaseSiteVitrine(),
      aud: adaptateurEnvironnement.urlBaseOOTSFrance(),
    };

    return Promise.all([jose.importJWK(cleChiffrement), genereJWT(infosAChiffrer)])
      .then(([cle, jwt]) => new jose.CompactEncrypt(new TextEncoder().encode(jwt))
        .setProtectedHeader(headerJWE)
        .encrypt(cle));
  };

  return cleChiffrementOOTS()
    .then((cle) => enJWE(cle, infos));
};

const verifieSignatureJWTDepuisJWKS = (jwt, urlJWKS) => {
  const verifieJeton = (jeton, secret) => {
    if (typeof jeton === 'undefined') {
      return Promise.resolve();
    }

    return jose.jwtVerify(jeton, secret)
      .then(({ payload }) => payload)
      .catch((e) => Promise.reject(new ErreurJetonInvalide(e)));
  };

  const jwks = jose.createRemoteJWKSet(new URL(urlJWKS));
  return verifieJeton(jwt, jwks);
};

module.exports = {
  cleHachage,
  dechiffreJWE,
  enJWEPourOOTS,
  verifieSignatureJWTDepuisJWKS,
};
