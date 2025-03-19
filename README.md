# Poker API - Texas Hold'em

## Description
Cette API permet de rejoindre une partie de Texas Hold'em et de jouer le premier tour. Les joueurs peuvent s'inscrire, rejoindre une table et interagir avec des bots pour jouer une main selon les règles du poker. Elle est développée avec le framework NestJS et codée en TypeScript.

## Fonctionnalités
- Création de compte avec un solde initial de 1000 compotes.
- Connexion à l'API.
- Affichage des tables disponibles.
- Rejoindre une table et jouer contre 2 bots.
- Lancer une partie avec mélange des cartes et distribution selon les règles du Texas Hold'em.
- Gestion automatique des petites et grandes blindes.
- Suivies de prises de décision par le joueurs (détailler actions possibles).
- Finalisation du tour et mise à jour des soldes.

## Installation
```sh
# Cloner le repository
git clone git@github.com:Lola-Castan/poker-api.git
cd poker-api

# Installer les dépendances
npm install

# Configurer les variables d'environnement (exemple : .env)

# Lancer l'application en mode développement
npm run start:dev

# L'API sera accessible à http://localhost:3000
```

## Endpoints principaux
| Méthode | Endpoint                | Description |
|---------|---------------------    |-------------|
| POST    | `/user/......`          | Créer un compte |
| POST    | `/user/.....`           | Se connecter |
| GET     | `/tables`               | Lister les tables disponibles |
| POST    | `/tables/:tableId/join` | Rejoindre une table |
| POST    | `/game/:tableId/......` | Jouer une action (suivre, relancer, se coucher) |

## Exemple d'utilisation


## Contributeurs
- **Maria IBRAGIMOVA** - Développement
- **Lola CASTAN** - Développement