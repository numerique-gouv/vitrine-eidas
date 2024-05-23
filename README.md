# vitrine-eidas

Un site vitrine pour montrer comment se passe l'authentification eIDAS

# Configuration de l'environnement de développement

Il est nécessaire en prérequis d'avoir installé [Git](https://git-scm.com/) et
[Docker](https://www.docker.com/).

Commencer par récupérer les sources du projet et aller dans le répertoire créé.

```sh
$ git clone https://github.com/numerique-gouv/vitrine-eidas && cd vitrine-eidas
```

Créer les fichiers `.env` et `.env.site` respectivement à partir des fichiers
`.env.template` et `.env.site.template`. Renseigner les diverses variables
d'environnement.

## Bouchon du fournisseur d'identité

La solution fournit un « faux serveur FranceConnect+ » qui permet de bouchonner
les appels au fournisseur d'identité et d'obtenir les informations utilisateur.
Le serveur est lancé dans le conteneur Docker `mock_fcplus` et est accessible
_via_ le port déclaré dans la variable d'environnement `PORT_MOCK_FCPLUS` dans
le fichier `.env`. Une fois le bouchon actif, la requête `GET
http://localhost:[PORT_MOCK_FCPLUS]` devrait renvoyer un JSON avec les divers
points d'accès et leur URL respective (depuis l'intérieur du conteneur du
serveur vitrine).

Pour que le serveur vitrine puisse communiquer avec ce bouchon, il faudra
renseigner dans le fichier `.env.site` la variable d'environnement
`URL_CONFIGURATION_OPEN_ID_FCPLUS` avec la valeur `http://mock_fcplus:4000` (le
port d'écoute du bouchon depuis l'intérieur du conteneur).

## Lancement du serveur vitrine

```sh
$ scripts/start.sh
```

Attendre l'affichage du message

```
web_1      | Le site vitrine est démarré et écoute le port [XXX] !…
```

Le serveur devrait être accessible depuis un navigateur à l'URL
`http://localhost:[PORT_SITE_VITRINE]` (avec comme valeur pour
`PORT_SITE_VITRINE` celle indiquée dans le fichier `.env`).

## Exécution de la suite de tests automatisés

Les tests peuvent être lancés depuis un conteneur Docker en exécutant le script
`scripts/tests.sh`. Les tests sont alors rejoués à chaque modification de
fichier du projet sur la machine hôte.
