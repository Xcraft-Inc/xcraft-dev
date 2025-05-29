# 📘 Documentation du module xcraft-core-etc

## Aperçu

Le module `xcraft-core-etc` est un gestionnaire de configuration pour l'écosystème Xcraft. Il permet de créer, lire, charger et sauvegarder des configurations pour différents modules du framework. Ce module est essentiel pour la gestion centralisée des paramètres de configuration dans une application Xcraft.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Détails des sources](#détails-des-sources)

## Structure du module

- **Classe `Etc`** : Classe principale qui gère les configurations
- **Fonction `EtcManager`** : Factory pour obtenir une instance unique (singleton) de la classe `Etc`

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
    default: 'localhost',
  },
  {
    name: 'database.port',
    default: 5432,
  },
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
  sessionId: 'abc123',
});
```

### Création de configurations pour plusieurs modules

```javascript
const overrides = {
  'module-a': {
    'option.enabled': true
  },
  'module-b': {
    'server.port': 8080
  }
};

etc.createAll('/path/to/modules', /^xcraft-/, overrides, 'myApp');
```

## Interactions avec d'autres modules

- **[xcraft-core-fs]** : Utilisé pour les opérations sur le système de fichiers
- **[xcraft-core-utils]** : Utilisé pour la fusion des configurations
- **is-running** : Vérifie si un processus est en cours d'exécution
- **fs-extra** : Opérations avancées sur le système de fichiers
- **lodash/merge** : Fusion profonde d'objets

## Détails des sources

### `index.js`

Ce fichier contient la classe principale `Etc` et la fonction factory `EtcManager`. La classe `Etc` fournit les méthodes suivantes :

#### Méthodes publiques

**`constructor(root, resp)`** - Initialise le gestionnaire avec le chemin racine et un objet de réponse pour les logs. Vérifie l'existence du dossier `etc/` et nettoie les fichiers de démon obsolètes.

**`createDefault(config, moduleName, override)`** - Crée un fichier de configuration par défaut pour un module spécifique. Prend en charge les valeurs par défaut et les surcharges.
- `config`: Définition de configuration au format Inquirer
- `moduleName`: Nom du module pour lequel créer la configuration
- `override`: Objet optionnel pour surcharger les valeurs par défaut

**`createAll(modulePath, filterRegex, overriders, appId)`** - Crée des configurations pour tous les modules correspondant à un filtre.
- `modulePath`: Chemin vers les modules
- `filterRegex`: Expression régulière pour filtrer les modules
- `overriders`: Objet ou tableau d'objets contenant les surcharges
- `appId`: Identifiant d'application optionnel pour les surcharges spécifiques

**`configureAll(modulePath, filterRegex, wizCallback)`** - Configure tous les modules avec un assistant.
- `modulePath`: Chemin vers les modules
- `filterRegex`: Expression régulière pour filtrer les modules
- `wizCallback`: Fonction de rappel pour l'assistant de configuration

**`read(packageName)`** - Lit un fichier de configuration sans mise en cache.
- `packageName`: Nom du package dont la configuration doit être lue

**`load(packageName, pid = 0)`** - Charge une configuration avec mise en cache.
- `packageName`: Nom du package dont la configuration doit être chargée
- `pid`: PID optionnel pour charger une configuration runtime spécifique

**`saveRun(packageName, config)`** - Sauvegarde une configuration runtime.
- `packageName`: Nom du package pour lequel sauvegarder la configuration
- `config`: Configuration à sauvegarder

#### Méthodes statiques

**`_writeConfigJSON(config, fileName)`** - Écrit un objet de configuration dans un fichier JSON, en transformant un objet plat en objet profond.

### `EtcManager`

La fonction `EtcManager` est une factory qui garantit qu'une seule instance de `Etc` existe à la fois. Elle prend en charge:

- La réutilisation d'une instance existante
- L'utilisation de `XCRAFT_ROOT` comme chemin racine par défaut
- La création d'une nouvelle instance si nécessaire

_Cette documentation a été mise à jour automatiquement._

[xcraft-core-fs]: https://github.com/Xcraft-Inc/xcraft-core-fs
[xcraft-core-utils]: https://github.com/Xcraft-Inc/xcraft-core-utils