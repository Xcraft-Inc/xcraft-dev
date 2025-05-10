# 📘 Documentation du module goblin-builder

## Aperçu

Le module `goblin-builder` est un outil de construction et de packaging pour les applications Xcraft. Il permet de générer différents types de packages pour diverses plateformes (Windows, Linux, macOS) et formats (Electron, Debian, Node.js, Web, Blitz). Ce module transforme une application Xcraft en un produit déployable en gérant les dépendances, les ressources et les configurations spécifiques à chaque plateforme.

## Structure du module

Le module est organisé autour de plusieurs constructeurs spécialisés, chacun exposé via une commande Xcraft :

- **electronify.js** (`app-builder`) : Crée des applications Electron pour Windows, Linux et macOS
- **debify.js** (`deb-builder`) : Génère des packages Debian pour Linux
- **nodify.js** (`node-builder`) : Crée des applications Node.js autonomes
- **webify.js** (`web-builder`) : Construit des applications web
- **blitzify.js** (`blitz-builder`) : Crée des applications web exécutables dans un conteneur WebAssembly

Tous ces constructeurs héritent d'une classe de base `Builder` qui fournit les fonctionnalités communes.

## Fonctionnement global

Le processus de construction suit généralement ces étapes :

1. **Initialisation** : Analyse du fichier `app.json` et des dépendances
2. **Préparation des assets** : Copie des ressources et des fichiers nécessaires
3. **Webpack** : Compilation des sources JavaScript (si nécessaire)
4. **Installation des dépendances** : Via npm
5. **Blacksmith** : Génération de rendus côté serveur (si configuré)
6. **Packaging** : Création du package final selon le format cible

Chaque constructeur spécialise ce flux de travail pour son format cible spécifique.

## Exemples d'utilisation

### Construction d'une application Electron

```javascript
// Via la ligne de commande Xcraft
await quest.cmd('electronify.build', {
  appId: 'my-app',
  output: '/path/to/output',
});

// Avec des options avancées
await quest.cmd('electronify.build-opts', {
  appId: 'my-app',
  variantId: 'pro',
  appDir: '/path/to/app',
  libDir: '/path/to/lib',
  output: '/path/to/output',
  release: true,
  arch: 'x64',
  compression: 'maximum',
});
```

### Construction d'un package Debian

```javascript
await quest.cmd('debify.build', {
  appId: 'my-app',
  output: '/path/to/output',
});
```

### Construction d'une application Node.js

```javascript
await quest.cmd('nodify.build', {
  appId: 'my-app',
  output: '/path/to/output',
});
```

### Construction d'une application Blitz

```javascript
await quest.cmd('blitzify.build', {
  appId: 'my-app',
  output: '/path/to/output',
});
```

## Interactions avec d'autres modules

- **[goblin-webpack]** : Utilisé pour la compilation des sources JavaScript
- **[goblin-blacksmith]** : Utilisé pour la génération de rendus côté serveur
- **[xcraft-core-host]** : Utilisé comme point d'entrée pour les applications générées
- **[xcraft-core-fs]** : Utilisé pour les opérations sur le système de fichiers
- **[xcraft-core-etc]** : Utilisé pour charger les configurations
- **[xcraft-core-process]** : Utilisé pour exécuter des processus externes

## Configuration avancée

Le module `goblin-builder` peut être configuré via le fichier `app.json` de l'application :

- **appId** : Identifiant de l'application
- **productName** : Nom du produit
- **description** : Description de l'application
- **versionFrom** : Module à partir duquel extraire la version
- **goblinEntryPoint** : Point d'entrée goblin (par défaut : 'laboratory')
- **mainGoblinModule** : Module goblin principal
- **fileAssociations** : Associations de fichiers pour l'application
- **protocols** : Protocoles URL gérés par l'application
- **build** : Options spécifiques à electron-builder
- **debify** : Options spécifiques à node-deb
- **excludeResources** : Ressources à exclure du package
- **unpackedResources** : Ressources à ne pas inclure dans l'archive ASAR
- **extraBuilds** : Builds supplémentaires à effectuer
- **blitzify** : Options spécifiques pour le builder Blitz (comme clientId)

## Détails des sources

### `builder.js`

Classe de base pour tous les constructeurs. Elle fournit les fonctionnalités communes :

- Analyse du fichier `app.json`
- Extraction des dépendances
- Préparation des assets
- Installation des dépendances
- Nettoyage des fichiers temporaires

```javascript
const builder = new Builder(quest, {
  outDir: '/path/to/output',
  appId: 'my-app',
  variantId: 'pro',
  appDir: '/path/to/app',
  libDir: '/path/to/lib',
});
await builder.run();
```

### `app-builder.js`

Constructeur spécialisé pour les applications Electron. Il gère :

- La configuration d'electron-builder
- La signature des exécutables (Windows)
- La génération de packages pour Windows, Linux et macOS
- La gestion des associations de fichiers

### `deb-builder.js`

Constructeur spécialisé pour les packages Debian. Il gère :

- La configuration de node-deb
- La génération de scripts post-installation
- La gestion des dépendances Debian

### `node-builder.js`

Constructeur spécialisé pour les applications Node.js autonomes. Il gère :

- La création d'une structure de projet Node.js
- L'installation des dépendances de production uniquement
- La copie des ressources nécessaires

### `web-builder.js`

Constructeur spécialisé pour les applications web. Il gère :

- La configuration de webpack pour le web
- La génération des fichiers statiques

### `blitz-builder.js`

Constructeur spécialisé pour les applications Blitz (WebAssembly). Il gère :

- La création d'un snapshot de l'application Node.js
- La génération des fichiers HTML/JS nécessaires pour le conteneur WebContainer
- Le découpage du snapshot en chunks pour optimiser le chargement
- L'intégration avec l'API WebContainer pour exécuter l'application dans le navigateur

### `service.js`

Définit les commandes Xcraft exposées par le module :

- `build` : Construction avec les paramètres par défaut
- `build-release` : Construction en mode release
- `build-opts` : Construction avec des options personnalisées

### `get-year-week-number.js`

Utilitaire pour générer des numéros de build basés sur l'année et la semaine, utilisé principalement pour les versions Windows.

### `blitz/snapshot.js`

Utilitaire pour créer un snapshot d'une application Node.js, utilisé par le constructeur Blitz. Il parcourt récursivement le système de fichiers et sérialise la structure en utilisant msgpackr.

### `eslint.config.js`

Configuration ESLint pour le projet, utilisant le nouveau format de configuration plat d'ESLint. Il configure les règles pour JavaScript et React.

_Cette documentation a été mise à jour automatiquement._

[goblin-webpack]: https://github.com/Xcraft-Inc/goblin-webpack
[goblin-blacksmith]: https://github.com/Xcraft-Inc/goblin-blacksmith
[xcraft-core-host]: https://github.com/Xcraft-Inc/xcraft-core-host
[xcraft-core-fs]: https://github.com/Xcraft-Inc/xcraft-core-fs
[xcraft-core-etc]: https://github.com/Xcraft-Inc/xcraft-core-etc
[xcraft-core-process]: https://github.com/Xcraft-Inc/xcraft-core-process