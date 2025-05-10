# 📘 Documentation du module xcraft-contrib-wpkg

## Aperçu

Le module `xcraft-contrib-wpkg` est une interface JavaScript pour le système de gestion de paquets WPKG (Windows Package Manager). Il fournit une API complète pour manipuler des paquets dérivés de Debian (.deb) dans l'écosystème Xcraft, permettant la création, l'installation, la mise à jour et la gestion de paquets logiciels. Bien que ces paquets utilisent l'extension .deb, ils ne suivent pas strictement le standard Debian.

## Structure du module

- **Wpkg** - Classe principale qui encapsule les fonctionnalités de gestion de paquets
- **WpkgBin** - Classe qui gère l'exécution des commandes WPKG en ligne de commande
- **MapLimit** - Classe utilitaire pour limiter la taille des caches en mémoire

## Fonctionnement global

Le module agit comme une couche d'abstraction au-dessus de l'outil en ligne de commande `wpkg_static`. Il permet de:

1. **Construire des paquets** à partir de sources
2. **Installer des paquets** dans un environnement cible
3. **Gérer des dépôts** de paquets (création d'index, synchronisation)
4. **Archiver des paquets** pour conserver différentes versions
5. **Interroger les informations** sur les paquets disponibles ou installés

Le module utilise un système d'archivage sophistiqué qui permet de conserver plusieurs versions d'un même paquet, tout en maintenant une version active dans le dépôt principal. Les versions archivées sont organisées par distribution et par paquet, avec un système d'indexation qui facilite leur récupération.

## Exemples d'utilisation

### Création d'un paquet

```javascript
const wpkg = require('xcraft-contrib-wpkg')(resp);
wpkg.build('/path/to/package', null, 'distribution-name', (err) => {
  if (!err) {
    console.log('Package built successfully');
  }
});
```

### Installation d'un paquet

```javascript
const wpkg = require('xcraft-contrib-wpkg')(resp);
wpkg.install(
  'package-name',
  'amd64',
  'distribution-name',
  null,
  false,
  (err) => {
    if (!err) {
      console.log('Package installed successfully');
    }
  }
);
```

### Vérification de la disponibilité d'un paquet

```javascript
const wpkg = require('xcraft-contrib-wpkg')(resp);
const isAvailable = yield wpkg.isPublished(
  'package-name',
  '1.0.0',
  'amd64',
  'distribution-name',
  null
);
if (isAvailable) {
  console.log('Package is available');
} else {
  console.log('Package is not available');
}
```

### Installation d'une version spécifique depuis les archives

```javascript
const wpkg = require('xcraft-contrib-wpkg')(resp);
yield wpkg.installFromArchive(
  'package-name',
  'amd64',
  'distribution-name',
  '1.2.3',
  null,
  false
);
console.log('Archived package version installed successfully');
```

## Interactions avec d'autres modules

- **[xcraft-core-fs]** - Utilisé pour les opérations sur le système de fichiers
- **[xcraft-contrib-pacman]** - Utilisé pour obtenir les chemins des dépôts et des racines cibles
- **[xcraft-core-platform]** - Utilisé pour déterminer l'architecture de la chaîne d'outils
- **wpkg-debversion** - Utilisé pour comparer les versions de paquets Debian
- **[xcraft-core-etc]** - Utilisé pour charger les configurations
- **[xcraft-core-process]** - Utilisé pour exécuter les commandes wpkg_static

## Configuration avancée

Le module utilise les configurations suivantes:

- **pkgDebRoot** - Chemin racine pour les dépôts de paquets
- **pkgTargetRoot** - Chemin racine pour l'installation des paquets
- **pkgToolchainRepository** - Nom du dépôt de la chaîne d'outils
- **wpkgTemp** - Répertoire temporaire pour les opérations WPKG
- **pkgIndex** - Nom du fichier d'index pour les dépôts

## Détails des sources

### `wpkg.js`

Ce fichier contient la classe principale `Wpkg` qui fournit l'API de haut niveau pour interagir avec le système de paquets. Les méthodes principales incluent:

- **build/buildSrc** - Construction de paquets standards ou sources
- **install/installByName/installFromArchive** - Installation de paquets
- **listIndexPackages** - Liste des paquets disponibles dans un dépôt
- **show** - Affichage des détails d'un paquet
- **isPublished** - Vérification de la disponibilité d'un paquet
- **syncRepository** - Synchronisation d'un dépôt avec ses archives
- **moveArchive** - Déplacement d'une version archivée vers un autre emplacement
- **getArchiveLatestVersion/listArchiveVersions** - Gestion des versions archivées

La classe implémente également un système de cache pour optimiser les performances des opérations fréquentes comme `show`:

```javascript
static #showCache = new MapLimit(100);
```

### `lib/bin.js`

Ce fichier contient la classe `WpkgBin` qui encapsule l'exécution des commandes WPKG en ligne de commande. Elle gère:

- L'exécution des commandes `wpkg_static` avec les arguments appropriés
- Le traitement des sorties de commande
- La mise en cache des résultats pour optimiser les performances

La classe utilise un cache statique pour les résultats des opérations d'indexation, ce qui améliore significativement les performances lors de requêtes répétées:

```javascript
static #indexCache = new MapLimit(20);
```

Les méthodes principales incluent:

- **\_runWpkg/\_run** - Exécution de commandes wpkg avec gestion des sorties
- **build/buildSrc** - Construction de paquets
- **install/remove** - Installation et suppression de paquets
- **createIndex** - Création d'index de dépôts
- **listIndexPackages** - Analyse des index de paquets

### `lib/mapLimit.js`

Une classe utilitaire simple qui étend `Map` pour limiter le nombre d'entrées. Elle est utilisée pour implémenter des caches à taille limitée dans le module.

Cette classe supprime automatiquement les entrées les plus anciennes lorsque la limite est atteinte, ce qui permet d'éviter une consommation excessive de mémoire tout en maintenant les performances des opérations fréquentes.

## Fonctionnalités avancées

### Système d'archivage

Le module implémente un système d'archivage sophistiqué qui permet de:

1. Conserver plusieurs versions d'un même paquet
2. Organiser les versions par distribution
3. Maintenir un index des versions disponibles
4. Récupérer facilement une version spécifique

Les archives sont organisées selon la structure:

```
/archives/distribution/package-name/version/package-name_version_arch.deb
```

Chaque répertoire de paquet contient également un fichier `index.json` qui répertorie toutes les versions disponibles et identifie la version la plus récente.

### Gestion des versions

Le module utilise `wpkg-debversion` pour comparer les versions de paquets selon les règles Debian. Cela permet de:

1. Déterminer quelle version est la plus récente
2. Archiver automatiquement les anciennes versions
3. Maintenir la version la plus récente dans le dépôt principal

### Génération de graphes de dépendances

Le module permet de générer des graphes de dépendances pour visualiser les relations entre les paquets:

```javascript
yield wpkg.graph(['package1', 'package2'], 'amd64', 'distribution-name');
console.log('Dependency graph generated');
```

_Cette documentation a été mise à jour automatiquement._

[xcraft-core-fs]: https://github.com/Xcraft-Inc/xcraft-core-fs
[xcraft-contrib-pacman]: https://github.com/Xcraft-Inc/xcraft-contrib-pacman
[xcraft-core-platform]: https://github.com/Xcraft-Inc/xcraft-core-platform
[xcraft-core-etc]: https://github.com/Xcraft-Inc/xcraft-core-etc
[xcraft-core-process]: https://github.com/Xcraft-Inc/xcraft-core-process
