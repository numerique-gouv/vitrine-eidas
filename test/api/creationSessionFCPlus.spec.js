const creationSessionFCPlus = require('../../src/api/creationSessionFCPlus');

describe('Le requêteur de création de session FC+', () => {
  const adaptateurChiffrement = {};
  const adaptateurEnvironnement = {};
  const adaptateurFranceConnectPlus = {};
  const config = { adaptateurChiffrement, adaptateurEnvironnement, adaptateurFranceConnectPlus };
  const reponse = {};

  const requete = {};

  beforeEach(() => {
    adaptateurChiffrement.cleHachage = () => '';
    adaptateurChiffrement.genereJeton = () => Promise.resolve();
    adaptateurEnvironnement.fournisseurIdentiteSuggere = () => '';
    adaptateurEnvironnement.identifiantClient = () => '';
    adaptateurEnvironnement.urlRedirectionConnexion = () => '';
    adaptateurFranceConnectPlus.urlCreationSession = () => Promise.resolve('');
    requete.session = {};
    reponse.send = () => Promise.resolve();
  });

  it('redirige vers serveur France Connect Plus', () => {
    expect.assertions(1);
    adaptateurFranceConnectPlus.urlCreationSession = () => Promise.resolve('http://example.com');

    reponse.send = (url) => {
      try {
        expect(url).toContain('http://example.com?');
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return creationSessionFCPlus(config, requete, reponse);
  });

  it('ajoute des paramètres à la requête', () => {
    expect.assertions(6);

    reponse.send = (url) => {
      try {
        expect(url).toContain('scope=profile%20openid%20birthcountry%20birthplace');
        expect(url).toContain('acr_values=eidas2');
        expect(url).toContain('claims={%22id_token%22:{%22amr%22:{%22essential%22:true}}}');
        expect(url).toContain('prompt=login%20consent');
        expect(url).toContain('response_type=code');
        expect(url).toContain('idp_hint=');

        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return creationSessionFCPlus(config, requete, reponse);
  });

  it("ajoute l'identifiant client FC+ en paramètre", () => {
    expect.assertions(1);

    adaptateurEnvironnement.identifiantClient = () => '12345';

    reponse.send = (url) => {
      try {
        expect(url).toContain('client_id=12345');
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return creationSessionFCPlus(config, requete, reponse);
  });

  it("ajoute l'URL de redirection post-login en paramètre", () => {
    expect.assertions(1);

    adaptateurEnvironnement.urlRedirectionConnexion = () => 'http://example.com';

    reponse.send = (url) => {
      try {
        expect(url).toContain('redirect_uri=http://example.com');
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return creationSessionFCPlus(config, requete, reponse);
  });

  it('ajoute un état et un nonce en paramètres de la requête', () => {
    expect.assertions(2);
    let nbClesGenerees = 0;

    adaptateurChiffrement.cleHachage = () => {
      nbClesGenerees += 1;
      return `12345-${nbClesGenerees}`;
    };

    reponse.send = (url) => {
      try {
        expect(url).toContain('state=12345-1');
        expect(url).toContain('nonce=12345-2');
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return creationSessionFCPlus(config, requete, reponse);
  });

  it("génère un JWT à partir de la valeur de l'`etat` généré", () => {
    expect.assertions(1);

    adaptateurChiffrement.cleHachage = () => '12345';

    adaptateurChiffrement.genereJeton = ({ etat }) => {
      try {
        expect(etat).toBe('12345');
        return Promise.resolve();
      } catch (e) {
        return Promise.reject(e);
      }
    };

    return creationSessionFCPlus(config, requete, reponse);
  });

  it('stocke le JWT généré dans le cookie de session', () => {
    adaptateurChiffrement.genereJeton = () => Promise.resolve('XXX');

    expect(requete.session.jeton).toBeUndefined();
    return creationSessionFCPlus(config, requete, reponse)
      .then(() => expect(requete.session.jeton).toBe('XXX'));
  });

  describe('Si utilisation bridge eIDAS', () => {
    it('renseigne le paramètre `idp_hint` avec la valeur `eidas-bridge`', () => {
      expect.assertions(1);
      adaptateurEnvironnement.fournisseurIdentiteSuggere = () => 'eidas-bridge';

      reponse.send = (url) => {
        try {
          expect(url).toContain('idp_hint=eidas-bridge');
          return Promise.resolve();
        } catch (e) {
          return Promise.reject(e);
        }
      };

      return creationSessionFCPlus(config, requete, reponse);
    });
  });
});
