# 📘 Documentation du module xcraft-core-server

## Aperçu

Le module `xcraft-core-server` est un composant fondamental de l'écosystème Xcraft qui fournit les fonctionnalités de base pour démarrer et gérer un serveur Xcraft. Il s'occupe du démarrage du bus de communication, de la découverte et du chargement des modules, et de la gestion du cycle de vie du serveur.

## Structure du module

- **boot.js** : Gère le démarrage du serveur, la découverte et le chargement des modules
- **server.js** : Point d'entrée principal qui initialise le serveur et configure les gestionnaires d'événements
- **motd.js** : Génère des messages aléatoires "Message of the Day" (inspirés de Warcraft II)
- **index.js** : Expose les fonctions pour exécuter le serveur comme un démon ou comme une bibliothèque

## Fonctionnement global

Le serveur Xcraft fonctionne comme un orchestrateur central qui:

1. Démarre un bus de communication (via `xcraft-core-bus`)
2. Découvre et charge automatiquement les modules Xcraft disponibles
3. Établit les connexions entre les clients et le serveur
4. Gère le cycle de vie des composants et des acteurs
5. Fournit des mécanismes pour l'arrêt propre du système

Le serveur peut être exécuté soit comme un démon (processus indépendant), soit comme une bibliothèque intégrée dans une application.

## Exemples d'utilisation

### Démarrer le serveur comme un démon

```javascript
const server = require('xcraft-core-server');
const options = {
  logs: '/path/to/logs',
  response: (err) => {
    if (err) {
      console.error('Erreur lors du démarrage du serveur:', err);
    } else {
      console.log('Serveur démarré avec succès');
    }
  },
};

const daemon = server.runAsDaemon(options);
```

### Démarrer le serveur comme une bibliothèque

```javascript
const server = require('xcraft-core-server').runAsLib();

server.start((err) => {
  if (err) {
    console.error('Erreur lors du démarrage du serveur:', err);
    return;
  }
  console.log('Serveur démarré avec succès');
});
```

## Interactions avec d'autres modules

Le module `xcraft-core-server` interagit avec plusieurs autres modules Xcraft:

- **[xcraft-core-bus]** : Pour la communication entre les composants
- **[xcraft-core-busclient]** : Pour établir des connexions client au bus
- **[xcraft-core-log]** : Pour la journalisation
- **[xcraft-core-etc]** : Pour charger les configurations
- **[xcraft-core-fs]** : Pour les opérations sur le système de fichiers
- **[xcraft-core-utils]** : Pour diverses fonctions utilitaires
- **[xcraft-core-env]** : Pour la gestion de l'environnement de développement
- **[xcraft-core-transport]** : Pour le transport des messages entre les composants

## Configuration avancée

Le module peut être configuré via le fichier `config.js` avec les options suivantes:

- **userModulesPath** : Chemin vers les modules utilisateur
- **userModulesFilter** : Expression régulière pour filtrer les modules utilisateur (par défaut: `^goblin-`)
- **userModulesBlacklist** : Expression régulière pour exclure certains modules
- **useDevroot** : Active le support de l'environnement devroot (toolchain)
- **modules** : Liste restreinte de modules à charger (vide pour tous)

## Détails des sources

### `index.js`

Ce fichier expose deux méthodes principales pour démarrer le serveur:

- `runAsDaemon(options)` : Démarre le serveur comme un processus démon indépendant
- `runAsLib()` : Démarre le serveur comme une bibliothèque intégrée

### `lib/boot.js`

Ce fichier est responsable du démarrage du serveur Xcraft. Il:

1. Configure l'environnement (locale, variables d'environnement)
2. Découvre les modules disponibles dans les répertoires `node_modules`
3. Filtre les modules selon les configurations (blacklist, whitelist)
4. Charge les modules et leurs dépendances
5. Démarre le bus de communication

La fonction `start` initialise le serveur et charge les modules, tandis que `stop` arrête proprement le bus et les connexions client.

### `lib/server.js`

Point d'entrée principal qui:

1. Configure la journalisation
2. Initialise les gestionnaires d'événements pour le bus de communication
3. Gère les connexions/déconnexions des clients
4. Implémente le mécanisme de heartbeat pour maintenir les connexions actives
5. Gère l'arrêt propre du serveur (via SIGINT et SIGTERM)

### `lib/motd.js`

Module amusant qui génère des "Messages of the Day" inspirés de Warcraft II. Il contient une collection de citations pour différentes unités des factions "Human Alliance" et "Orcish Horde", et fournit une méthode `get()` qui retourne un message aléatoire.

### `config.js`

Définit la configuration du module avec des options pour:

- Spécifier le chemin des modules utilisateur
- Filtrer les modules à charger
- Exclure certains modules
- Activer l'environnement de développement
- Restreindre la liste des modules à charger

### `eslint.config.js`

Configuration ESLint pour le projet, définissant les règles de style de code et les plugins utilisés (React, JSDoc, Babel). Ce fichier configure l'environnement de développement pour maintenir une qualité de code cohérente.

## Gestion des événements et communication

Le serveur implémente plusieurs gestionnaires d'événements:

- **ErrorHandler** : Gère les erreurs et les transmet aux clients concernés
- **ShutdownHandler** : Gère l'arrêt propre du serveur
- **AutoconnectHandler** : Gère les connexions automatiques des clients
- **DisconnectHandler** : Gère les déconnexions des clients
- **MotdHandler** : Envoie un "Message of the Day" aux clients qui se connectent
- **BroadcastHandler** : Gère la diffusion des messages à tous les clients

Le serveur utilise un mécanisme de heartbeat pour maintenir les connexions actives et détecter les clients déconnectés.

_Cette documentation a été mise à jour automatiquement._

[xcraft-core-bus]: https://github.com/Xcraft-Inc/xcraft-core-bus
[xcraft-core-busclient]: https://github.com/Xcraft-Inc/xcraft-core-busclient
[xcraft-core-log]: https://github.com/Xcraft-Inc/xcraft-core-log
[xcraft-core-etc]: https://github.com/Xcraft-Inc/xcraft-core-etc
[xcraft-core-fs]: https://github.com/Xcraft-Inc/xcraft-core-fs
[xcraft-core-utils]: https://github.com/Xcraft-Inc/xcraft-core-utils
[xcraft-core-env]: https://github.com/Xcraft-Inc/xcraft-core-env
[xcraft-core-transport]: https://github.com/Xcraft-Inc/xcraft-core-transport
