const crypto = require('crypto');
const jose = require('jose');

const adaptateurEnvironnement = require('./adaptateurEnvironnement');
const { ErreurJetonInvalide } = require('../erreurs');

const cleHachage = (chaine) => crypto.createHash('md5').update(chaine).digest('hex');

const dechiffreJWE = (jwe) => jose
  .importJWK(adaptateurEnvironnement.clePriveeJWK())
  .then((k) => jose.compactDecrypt(jwe, k))
  .then(({ plaintext }) => plaintext.toString());

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
  verifieSignatureJWTDepuisJWKS,
};
