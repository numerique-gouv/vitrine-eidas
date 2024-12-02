const protegeRouteAvecOOTS = (adaptateurEnvironnement) => (
  (_requete, reponse, suite) => (
    adaptateurEnvironnement.avecOOTS()
      ? suite()
      : reponse.status(501).send('Not Implemented Yet!')
  )
);

module.exports = { protegeRouteAvecOOTS };
