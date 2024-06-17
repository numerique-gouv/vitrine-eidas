const Utilisateur = require('../../src/modeles/utilisateur');

describe("L'utilisateur courant", () => {
  it("sait s'afficher", () => {
    const utilisateur = new Utilisateur({ prenom: 'Juliette', nomUsage: 'Haucourt' });
    expect(utilisateur.afficheToi()).toBe('Juliette Haucourt');
  });
});
