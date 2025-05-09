# 📘 Documentation du module xcraft-core-etc

## Aperçu

Le module `xcraft-core-etc` est un gestionnaire de configuration pour l'écosystème Xcraft. Il permet de créer, lire, charger et sauvegarder des configurations pour différents modules du framework. Ce module est essentiel pour la gestion centralisée des paramètres de configuration dans une application Xcraft.

## Structure du module

- **Classe `Etc`** : Classe principale qui gère les configurations
- **Fonction `EtcManager`** : Factory pour obtenir une instance unique (singleton) de la classe `Etc`
- **Fichier de configuration ESLint** : Configuration ESLint par défaut pour les projets Xcraft

## Fonctionnement global

Le module fonctionne selon ces principes :

1. **Initialisation** : Création d'une instance unique de gestionnaire de configuration
2. **Stockage des configurations** :
   - Les configurations sont stockées dans un dossier `etc/` à la racine du projet
   - Chaque module a son propre sous-dossier avec un fichier `config.json`
3. **Configuration runtime** :
   - Les configurations temporaires sont stockées dans `var/run/`
   - Un fichier spécial `xcraftd.[PID]` contient les configurations runtime
4. **Cache** : Les configurations sont mises en cache pour optimiser les performances

Le module gère également le nettoyage des fichiers de configuration temporaires des processus qui ne sont plus en cours d'exécution.

## Exemples d'utilisation

### Initialisation du gestionnaire de configuration

```javascript
const etc = require('xcraft-core-etc')('/chemin/vers/racine/projet');
```

### Création d'une configuration par défaut pour un module

```javascript
const config = [
  {
    name: 'database.host',
    default: 'localhost'
  },
  {
    name: 'database.port',
    default: 5432
  }
];

etc.createDefault(config, 'mon-module');
```

### Chargement d'une configuration

```javascript
const config = etc.load('mon-module');
console.log(config.database.host); // 'localhost'
```

### Sauvegarde d'une configuration runtime

```javascript
etc.saveRun('mon-module', {
  temporaryFlag: true,
  sessionId: 'abc123'
});
```

## Interactions avec d'autres modules

- **xcraft-core-fs** : Utilisé pour les opérations sur le système de fichiers
- **xcraft-core-utils** : Utilisé pour la fusion des configurations
- **is-running** : Vérifie si un processus est en cours d'exécution
- **fs-extra** : Opérations avancées sur le système de fichiers
- **lodash/merge** : Fusion profonde d'objets

## Configuration avancée

Le module fournit également une configuration ESLint par défaut pour les projets Xcraft, qui inclut :

- Configuration recommandée d'ESLint
- Support pour React
- Support pour JSDoc
- Support pour Babel
- Configuration Prettier
- Règles personnalisées pour l'écosystème Xcraft

## Détails des sources

### `index.js`

Ce fichier contient la classe principale `Etc` et la fonction factory `EtcManager`. La classe `Etc` fournit les méthodes suivantes :

- **constructor(root, resp)** : Initialise le gestionnaire avec le chemin racine et un objet de réponse pour les logs
- **createDefault(config, moduleName, override)** : Crée un fichier de configuration par défaut pour un module
- **createAll(modulePath, filterRegex, overriders, appId)** : Crée des configurations pour tous les modules correspondant à un filtre
- **configureAll(modulePath, filterRegex, wizCallback)** : Configure tous les modules avec un assistant
- **read(packageName)** : Lit un fichier de configuration sans mise en cache
- **load(packageName, pid = 0)** : Charge une configuration avec mise en cache
- **saveRun(packageName, config)** : Sauvegarde une configuration runtime

La fonction `EtcManager` est une factory qui garantit qu'une seule instance de `Etc` existe à la fois.

### `eslint.config.js`

Ce fichier définit la configuration ESLint par défaut pour les projets Xcraft. Il configure :

- Le parser Babel pour le support de la syntaxe moderne et JSX
- Les plugins React, JSDoc et Babel
- Les règles personnalisées pour l'écosystème Xcraft
- Les paramètres pour React et JSDoc

Cette configuration est conçue pour être utilisée avec la nouvelle configuration flat d'ESLint et inclut les meilleures pratiques pour le développement JavaScript moderne.

*Ce document est une mise à jour de la documentation précédente.*