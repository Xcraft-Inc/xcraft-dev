# 📘 Documentation du module xcraft-core-fs

## Aperçu

Le module `xcraft-core-fs` est une bibliothèque utilitaire qui étend les fonctionnalités du système de fichiers Node.js. Il fournit des méthodes simplifiées pour les opérations courantes sur les fichiers et répertoires, avec une gestion améliorée des erreurs et des fonctionnalités supplémentaires par rapport au module `fs` natif de Node.js.

## Structure du module

Le module est organisé autour d'un ensemble de fonctions utilitaires qui encapsulent et étendent les fonctionnalités de `fs-extra` :

- **Opérations de base** : mkdir, cp, mv, rm
- **Opérations par lot** : batch.cp, batch.mv
- **Listage de fichiers/répertoires** : ls, lsdir, lsfile, lsall
- **Vérifications et manipulations** : canExecute, newerFiles, shasum, sed
- **Suppression spécifique** : rmSymlinks, rmFiles

## Fonctionnement global

Le module utilise `fs-extra` comme base et ajoute des fonctionnalités supplémentaires pour faciliter les opérations sur le système de fichiers dans l'écosystème Xcraft. Il gère automatiquement la création de répertoires intermédiaires, la copie récursive, et offre des fonctionnalités avancées comme le filtrage par expressions régulières et le calcul de sommes de contrôle.

## Exemples d'utilisation

### Copie de fichiers avec filtrage

```javascript
const xFs = require('xcraft-core-fs');

// Copier tous les fichiers JavaScript d'un répertoire à un autre
xFs.cp('/chemin/source', '/chemin/destination', /\.js$/);
```

### Déplacement de fichiers

```javascript
const xFs = require('xcraft-core-fs');

// Déplacer un fichier
xFs.mv('/chemin/source/fichier.txt', '/chemin/destination/fichier.txt');

// Déplacer le contenu d'un répertoire
xFs.mv('/chemin/source', '/chemin/destination');
```

### Listage récursif de fichiers

```javascript
const xFs = require('xcraft-core-fs');

// Lister tous les fichiers et répertoires récursivement
const allFiles = xFs.lsall('/chemin/source');

// Lister avec filtre personnalisé
const jsFiles = xFs.lsall('/chemin/source', false, (item, stat) => {
  return stat && stat.isFile() && item.endsWith('.js');
});
```

### Calcul de somme de contrôle (SHA-256)

```javascript
const xFs = require('xcraft-core-fs');

// Calculer le SHA-256 de tous les fichiers d'un répertoire
const checksum = xFs.shasum('/chemin/source');

// Avec filtrage par regex
const jsChecksum = xFs.shasum('/chemin/source', /\.js$/);
```

## Interactions avec d'autres modules

Ce module est une bibliothèque de base dans l'écosystème Xcraft et est utilisé par de nombreux autres modules qui ont besoin d'interagir avec le système de fichiers. Il n'a pas de dépendances directes avec d'autres modules Xcraft, ce qui en fait un module fondamental et autonome.

## Détails des sources

### `index.js`

Ce fichier contient toutes les fonctions utilitaires du module. Voici les principales fonctionnalités :

#### Fonctions de manipulation de fichiers

- **mkdir(location)** : Crée un répertoire et tous les répertoires parents nécessaires.
- **cp(src, dest, regex)** : Copie un fichier ou le contenu d'un répertoire, avec filtrage optionnel.
- **mv(src, dest, regex)** : Déplace un fichier ou le contenu d'un répertoire, avec filtrage optionnel.
- **rm(location)** : Supprime un fichier ou un répertoire.
- **rmSymlinks(location)** : Supprime uniquement les liens symboliques dans un répertoire.
- **rmFiles(location)** : Supprime uniquement les fichiers dans un répertoire.

#### Fonctions de listage

- **ls(location, regex)** : Liste les fichiers et répertoires dans un emplacement.
- **lsdir(location, regex)** : Liste uniquement les répertoires.
- **lsfile(location, regex)** : Liste uniquement les fichiers.
- **lsall(location, followSymlink, filter)** : Liste récursivement tous les fichiers et répertoires.

#### Fonctions utilitaires

- **canExecute(file)** : Vérifie si un fichier est exécutable.
- **newerFiles(location, regex, mtime)** : Vérifie si des fichiers sont plus récents qu'une date donnée.
- **shasum(location, regex, sed, sha)** : Calcule la somme de contrôle SHA-256 des fichiers.
- **sed(file, regex, newValue)** : Remplace du texte dans un fichier (similaire à la commande sed).

#### Opérations par lot

- **batch.cp(cb, location)** : Copie des fichiers en utilisant une fonction de rappel pour déterminer les noms de destination.
- **batch.mv(cb, location)** : Déplace des fichiers en utilisant une fonction de rappel pour déterminer les noms de destination.

### `eslint.config.js`

Ce fichier configure ESLint pour le projet, définissant les règles de style de code et les plugins utilisés pour le développement du module. Il utilise la nouvelle configuration plate d'ESLint avec des plugins pour React, JSDoc et Babel.

### `package.json`

Définit les métadonnées du module, ses dépendances et les scripts disponibles. Les principales dépendances sont :

- **fs-extra** : Extension du module fs natif de Node.js avec des fonctionnalités supplémentaires.
- **isbinaryfile** : Utilisé pour détecter si un fichier est binaire (pour la fonction `sed`).

## Remarques importantes

1. La plupart des fonctions sont synchrones, ce qui peut bloquer le thread principal si elles sont utilisées sur de grandes quantités de données.
2. Les fonctions de copie et de déplacement créent automatiquement les répertoires intermédiaires si nécessaire.
3. Le module expose directement l'instance `fse` (fs-extra) pour un accès aux fonctionnalités non couvertes par les méthodes personnalisées.

*Ce document est une mise à jour de la documentation précédente.*