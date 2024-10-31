const documentRecu = (depotDonnees, reponse) => depotDonnees
  .documentRecu()
  .then((document) => {
    reponse.set({ 'content-type': 'application/pdf; charset=utf-8' });
    reponse.send(document);
  });

module.exports = documentRecu;
