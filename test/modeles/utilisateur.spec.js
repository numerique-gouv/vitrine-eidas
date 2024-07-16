const { ErreurDonneeManquante } = require('../../src/erreurs');
const Utilisateur = require('../../src/modeles/utilisateur');

describe("L'utilisateur courant", () => {
  it("sait s'afficher", () => {
    const utilisateur = new Utilisateur({ prenom: 'Juliette', nomUsage: 'Haucourt' });
    expect(utilisateur.afficheToi()).toBe('Juliette Haucourt');
  });

  it("vérifie qu'il est initialisé avec un nom d'usage et un prénom", () => {
    expect.assertions(1);

    try {
      new Utilisateur({});
    } catch (e) {
      expect(e).toBeInstanceOf(ErreurDonneeManquante);
    }
  });
});
