const creationSessionFCPlus = require('../../src/api/creationSessionFCPlus');

const prepareVerificationPresenceElement = (element, reponse) => {
  reponse.render = (_nomPageRedirection, { destination }) => {
    try {
      expect(destination).toContain(element);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  };
};

describe('Le requêteur de création de session FC+', () => {
  const adaptateurChiffrement = {};
  const adaptateurEnvironnement = {};
  const adaptateurFranceConnectPlus = {};
  const config = { adaptateurChiffrement, adaptateurEnvironnement, adaptateurFranceConnectPlus };
  const reponse = {};
  const requete = {};

  beforeEach(() => {
    adaptateurChiffrement.cleHachage = () => '';
    adaptateurEnvironnement.avecMock = () => false;
    adaptateurEnvironnement.identifiantClient = () => '';
    adaptateurEnvironnement.urlRedirectionConnexion = () => '';
    adaptateurFranceConnectPlus.urlCreationSession = () => Promise.resolve('');
    requete.query = {};
    requete.session = {};
    reponse.render = () => Promise.resolve();
  });

  it('redirige vers serveur France Connect Plus', () => {
    expect.assertions(1);
    adaptateurFranceConnectPlus.urlCreationSession = () => Promise.resolve('http://example.com');

    prepareVerificationPresenceElement('http://example.com?', reponse);
    return creationSessionFCPlus(config, requete, reponse);
  });

  const verifiePresenceParametreEnDur = (param) => it(`ajoute le paramètre ${param} à la requête`, () => {
    expect.assertions(1);
    prepareVerificationPresenceElement(param, reponse);
    return creationSessionFCPlus(config, requete, reponse);
  });

  [
    'scope=profile%20openid%20birthcountry%20birthplace',
    'acr_values=eidas2',
    'claims={%22id_token%22:{%22amr%22:{%22essential%22:true}}}',
    'prompt=login%20consent',
    'response_type=code',
    'idp_hint=',
  ].forEach(verifiePresenceParametreEnDur);

  it("ajoute l'identifiant client FC+ en paramètre", () => {
    expect.assertions(1);
    adaptateurEnvironnement.identifiantClient = () => '12345';

    prepareVerificationPresenceElement('client_id=12345', reponse);
    return creationSessionFCPlus(config, requete, reponse);
  });

  it("ajoute l'URL de redirection post-login en paramètre", () => {
    expect.assertions(1);
    adaptateurEnvironnement.urlRedirectionConnexion = () => 'http://example.com';

    prepareVerificationPresenceElement('redirect_uri=http://example.com', reponse);
    return creationSessionFCPlus(config, requete, reponse);
  });

  it('ajoute un état en paramètre de la requête', () => {
    expect.assertions(1);
    adaptateurChiffrement.cleHachage = () => '12345';

    prepareVerificationPresenceElement('state=12345', reponse);
    return creationSessionFCPlus(config, requete, reponse);
  });

  it('ajoute un nonce en paramètre de la requête', () => {
    expect.assertions(1);
    adaptateurChiffrement.cleHachage = () => '12345';

    prepareVerificationPresenceElement('nonce=12345', reponse);
    return creationSessionFCPlus(config, requete, reponse);
  });

  it('conserve les valeurs générées pour `etat` et `nonce` dans le cookie de session', () => {
    let nbAppelsCleHachage = 0;
    adaptateurChiffrement.cleHachage = () => { nbAppelsCleHachage += 1; return `12345-${nbAppelsCleHachage}`; };

    expect(requete.session.etat).toBeUndefined();
    expect(requete.session.nonce).toBeUndefined();
    return creationSessionFCPlus(config, requete, reponse)
      .then(() => expect(requete.session).toEqual({ etat: '12345-1', nonce: '12345-2' }));
  });

  describe('Si utilisation bridge eIDAS', () => {
    it('renseigne le paramètre `idp_hint` avec la valeur `eidas-bridge`', () => {
      expect.assertions(1);
      requete.query.eidas = '';

      prepareVerificationPresenceElement('idp_hint=eidas-bridge', reponse);
      return creationSessionFCPlus(config, requete, reponse);
    });
  });

  describe('Si utilisation serveur mock FC+', () => {
    it('renseigne le paramètre `contexte_mock` avec la bonne valeur', () => {
      expect.assertions(1);
      adaptateurEnvironnement.avecMock = () => true;

      requete.query.contexteMock = 'unContexte';
      prepareVerificationPresenceElement('contexte_mock=unContexte', reponse);
      return creationSessionFCPlus(config, requete, reponse);
    });
  });
});
