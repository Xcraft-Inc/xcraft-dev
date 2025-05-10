# 📘 Documentation du module xcraft-contrib-peon

## Aperçu

Le module `xcraft-contrib-peon` est un système de travail (worker) backend pour l'écosystème Xcraft. Il fournit une infrastructure permettant d'exécuter diverses tâches de construction, de configuration et de déploiement de paquets logiciels. Son nom "peon" fait référence à un travailleur qui exécute des tâches spécifiques.

## Structure du module

Le module est organisé en plusieurs parties clés :

- **Backends** : Implémentations spécifiques pour différents types de tâches (bin, src)
- **Lib** : Bibliothèques utilitaires et fonctions de base
- **Outils d'interprétation** : Pour exécuter des scripts et des commandes
- **Utilitaires de gestion de chemins** : Pour manipuler les fichiers et répertoires

Le module expose différents backends qui peuvent être utilisés pour diverses tâches comme la compilation, la configuration, la copie de fichiers, etc.

## Fonctionnement global

Le module `xcraft-contrib-peon` agit comme un orchestrateur de tâches qui :

1. **Récupère des ressources** : Télécharge ou clone des fichiers depuis différentes sources (HTTP, FTP, Git)
2. **Prépare l'environnement** : Configure les variables d'environnement et les placeholders
3. **Exécute des actions** : Compile, configure, déplace ou copie des fichiers
4. **Applique des correctifs** : Corrige les chemins d'exécution (rpath) pour les bibliothèques dynamiques
5. **Déploie les résultats** : Installe les fichiers dans les emplacements cibles

Le module utilise un système de "backends" pour supporter différents types d'opérations. Chaque backend est spécialisé dans un type de tâche particulier.

## Exemples d'utilisation

### Téléchargement et extraction d'un paquet

```javascript
const peon = require('xcraft-contrib-peon');

// Utilisation du backend bin/configure
peon.bin.configure(
  {
    uri: 'https://example.com/package.tar.gz',
    out: 'package.tar.gz',
  },
  '/path/to/root',
  '/path/to/share',
  {
    env: process.env,
    args: {
      all: ['--prefix=/usr/local'],
    },
  },
  resp
);
```

### Compilation d'un paquet source

```javascript
const peon = require('xcraft-contrib-peon');

// Utilisation du backend src/make
peon.src.make(
  {
    uri: 'https://github.com/example/project.git',
    ref: 'main',
  },
  '/path/to/root',
  '/path/to/share',
  {
    env: process.env,
    args: {
      all: ['-j4'],
      install: ['install'],
    },
  },
  resp
);
```

## Interactions avec d'autres modules

`xcraft-contrib-peon` interagit avec plusieurs autres modules de l'écosystème Xcraft :

- **[xcraft-core-fs]** : Pour les opérations sur le système de fichiers
- **[xcraft-core-extract]** : Pour extraire des archives
- **[xcraft-core-process]** : Pour exécuter des processus
- **[xcraft-core-subst]** : Pour la substitution et le montage temporaire
- **[xcraft-core-scm]** : Pour les opérations de gestion de code source
- **[xcraft-contrib-pacman]** : Pour la gestion des paquets
- **[xcraft-core-platform]** : Pour la détection de la plateforme
- **[xcraft-core-placeholder]** : Pour la gestion des variables d'environnement

## Configuration avancée

Le module peut être configuré via les options suivantes :

- **PEON_DEBUG_PKG** : Variable d'environnement pour déboguer un paquet spécifique
- **PEON_NORPATH** : Désactive la correction des chemins rpath
- **PEON_UNIX_PATH** : Force l'utilisation des chemins de style UNIX

## Détails des sources

### `index.js`

Ce fichier est le point d'entrée du module. Il charge dynamiquement tous les backends disponibles dans le répertoire `backends` et les expose sous forme d'objet structuré. Les backends sont organisés par type (bin, src) et par commande.

### `lib/base.js`

Fournit les fonctions de base pour les backends :

- `onlyInstall` : Exécute uniquement l'étape d'installation
- `onlyBuild` : Exécute uniquement l'étape de compilation
- `always` : Exécute à la fois l'installation et l'empaquetage

Ces fonctions gèrent le cycle de vie complet d'une opération, y compris la préparation, l'exécution et le nettoyage.

### `lib/interpreter.js`

Fournit un interpréteur pour exécuter des scripts shell ou JavaScript dans un environnement contrôlé. Il supporte deux modes :

- `sh` : Exécute des commandes shell
- `vm` : Exécute du code JavaScript dans une machine virtuelle

### `lib/utils.js`

Contient des utilitaires pour :

- Télécharger des ressources depuis différentes sources (HTTP, FTP, Git)
- Extraire des archives
- Corriger les chemins d'exécution (rpath) pour les bibliothèques dynamiques
- Renommer des fichiers pour la compatibilité avec WPKG
- Générer des scripts de débogage

### `lib/cmds/cmds.js`

Expose des commandes utilitaires pour les scripts, comme :

- `cd`, `mv`, `cp`, `rm`, `ln`, `mkdir` : Opérations sur le système de fichiers
- `unzip` : Extraction d'archives
- `sed` : Modification de fichiers texte
- `cmd` : Exécution de commandes Xcraft
- `exec` : Exécution de programmes externes
- `rpath` : Correction des chemins d'exécution pour les bibliothèques

### `backends/bin/configure.js`

Backend pour configurer des paquets binaires. Il exécute des scripts de configuration dans l'environnement cible.

### `backends/bin/copy.js`

Backend pour copier des fichiers ou répertoires vers une destination cible.

### `backends/bin/exec.js`

Backend pour exécuter des programmes binaires avec des arguments spécifiques.

### `backends/bin/meta.js`

Backend pour gérer des méta-paquets (paquets qui ne contiennent pas de fichiers mais dépendent d'autres paquets).

### `backends/bin/move.js`

Backend pour déplacer des fichiers ou répertoires vers une destination cible.

### `backends/src/make.js`

Backend pour compiler des paquets source en utilisant le système de build Make.

### `backends/src/msbuild-core.js` et `backends/src/msbuild-full.js`

Backends pour compiler des projets .NET en utilisant MSBuild ou dotnet build.

### `backends/src/script.js`

Backend pour exécuter des scripts personnalisés lors de la compilation de paquets source.

### `backends/src/test/vstest.js` et `backends/src/test/xunit.js`

Backends pour exécuter des tests unitaires sur des projets .NET en utilisant VSTest ou xUnit.

### `eslint.config.js`

Configuration ESLint pour le projet, définissant les règles de style de code et les plugins utilisés (React, JSDoc, Babel).

## Fonctionnalités avancées

### Correction des chemins d'exécution (rpath)

Le module inclut des fonctionnalités avancées pour corriger les chemins d'exécution des bibliothèques dynamiques sur différentes plateformes :

- **Linux** : Utilise `patchelf` pour modifier les chemins RPATH
- **macOS** : Utilise `install_name_tool` pour modifier les chemins d'ID et de référence

### Gestion des environnements de débogage

Le module peut générer des scripts d'environnement de débogage pour faciliter le débogage des paquets source :

- Crée des scripts shell et batch avec toutes les variables d'environnement nécessaires
- Inclut des informations sur les commandes de configuration et de compilation

### Support multi-plateforme

Le module est conçu pour fonctionner sur différentes plateformes :

- **Windows** : Support pour MSBuild et les spécificités Windows
- **Linux** : Support pour Make et les outils GNU
- **macOS** : Support pour les outils spécifiques à macOS

_Cette documentation a été mise à jour automatiquement._

[xcraft-core-fs]: https://github.com/Xcraft-Inc/xcraft-core-fs
[xcraft-core-extract]: https://github.com/Xcraft-Inc/xcraft-core-extract
[xcraft-core-process]: https://github.com/Xcraft-Inc/xcraft-core-process
[xcraft-core-subst]: https://github.com/Xcraft-Inc/xcraft-core-subst
[xcraft-core-scm]: https://github.com/Xcraft-Inc/xcraft-core-scm
[xcraft-contrib-pacman]: https://github.com/Xcraft-Inc/xcraft-contrib-pacman
[xcraft-core-platform]: https://github.com/Xcraft-Inc/xcraft-core-platform
[xcraft-core-placeholder]: https://github.com/Xcraft-Inc/xcraft-core-placeholder
