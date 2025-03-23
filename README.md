# Poker API - Texas Hold'em

## Description
Cette API permet de rejoindre une partie de Texas Hold'em et de jouer le premier tour. Les joueurs peuvent s'inscrire, rejoindre une table et interagir avec des bots pour jouer une main selon les règles du poker. Elle est développée avec le framework NestJS et codée en TypeScript.

## Fonctionnalités
- Connexion à l'API.
- Affichage des tables disponibles.
- Rejoindre une table et jouer contre 2 bots.
- Lancer une partie avec mélange des cartes et distribution selon les règles du Texas Hold'em.
- Gestion automatique des petites et grandes blindes.
- Suivies de prises de décision par le joueurs => en cours de développement.
- Finalisation du tour et mise à jour des soldes => en cours de développement.

## Installation
```sh
# Cloner le repository
git clone git@github.com:Lola-Castan/poker-api.git
cd poker-api

# Installer les dépendances
npm install

# Lancer l'application en mode développement
npm run start:dev

# L'API sera accessible à http://localhost:3000
```

## Swagger
L'API est documentée avec Swagger pour faciliter les tests et l'exploration des endpoints.
Une fois le serveur lancé, la documentation Swagger est accessible à l'adresse suivante :

```sh
http://localhost:3000/api
```

## Exemples d'utilisation

### Récupérer la liste des tables
```sh
GET http://localhost:3000/tables
```

### Obtenir les détails d'une table
```sh
GET http://localhost:3000/tables/{id}
```

### Rejoindre une table
```sh
POST http://localhost:3000/tables/1/join HTTP/1.1
content-type: application/json

{
    "userId": 1
}
```

## Contributeurs
- [Maria IBRAGIMOVA](https://github.com/Mashoulya) - Développeuse
- [Lola CASTAN](https://github.com/Lola-Castan) - Développeuse