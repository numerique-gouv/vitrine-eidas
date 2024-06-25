const { ErreurSessionFCPlusInexistante } = require('../../src/erreurs');
const Utilisateur = require('../../src/modeles/utilisateur');

describe("L'utilisateur courant", () => {
  it("sait s'afficher", () => {
    const utilisateur = new Utilisateur({ prenom: 'Juliette', nomUsage: 'Haucourt', jwtSessionFCPlus: 'abcdef' });
    expect(utilisateur.afficheToi()).toBe('Juliette Haucourt');
  });

  it("vérifie qu'il est initialisé avec un jeton de session FC+", () => {
    expect.assertions(1);

    try {
      new Utilisateur({ prenom: 'Juliette', nomUsage: 'Haucourt' });
    } catch (e) {
      expect(e).toBeInstanceOf(ErreurSessionFCPlusInexistante);
    }
  });
});
