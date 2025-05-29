# 📘 Documentation du module xcraft-core-fs

## Aperçu

Le module `xcraft-core-fs` est une bibliothèque utilitaire qui étend les fonctionnalités du système de fichiers Node.js. Il fournit des méthodes simplifiées pour les opérations courantes sur les fichiers et répertoires, avec une gestion améliorée des erreurs et des fonctionnalités supplémentaires par rapport au module `fs` natif de Node.js.

## Sommaire

- [Aperçu](#aperçu)
- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Détails des sources](#détails-des-sources)
- [Remarques importantes](#remarques-importantes)

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

### Modification de contenu de fichiers

```javascript
const xFs = require('xcraft-core-fs');

// Remplacer toutes les occurrences de 'foo' par 'bar' dans un fichier
xFs.sed('/chemin/fichier.txt', /foo/g, 'bar');
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

### Méthodes détaillées

**`mkdir(location)`** - Crée un répertoire et tous les répertoires parents nécessaires (équivalent à `mkdir -p`).

**`cp(src, dest, regex)`** - Copie un fichier ou le contenu d'un répertoire.
- Si `src` est un fichier, `dest` doit être un chemin de fichier
- Si `src` est un répertoire, `dest` doit être un répertoire (son contenu sera copié)
- Le paramètre `regex` permet de filtrer les fichiers/répertoires à copier

**`mv(src, dest, regex)`** - Déplace un fichier ou le contenu d'un répertoire.
- Tente d'abord un déplacement rapide avec `rename`
- Si cela échoue (par exemple, entre systèmes de fichiers différents), effectue une copie suivie d'une suppression
- Le paramètre `regex` permet de filtrer les fichiers/répertoires à déplacer

**`rm(location)`** - Supprime un fichier ou un répertoire récursivement.

**`rmSymlinks(location)`** - Supprime uniquement les liens symboliques dans un répertoire, récursivement.

**`rmFiles(location)`** - Supprime uniquement les fichiers dans un répertoire, récursivement.

**`ls(location, regex)`** - Liste tous les éléments (fichiers et répertoires) dans un emplacement, avec filtrage optionnel.

**`lsdir(location, regex)`** - Liste uniquement les répertoires dans un emplacement, avec filtrage optionnel.

**`lsfile(location, regex)`** - Liste uniquement les fichiers dans un emplacement, avec filtrage optionnel.

**`lsall(location, followSymlink, filter)`** - Liste récursivement tous les fichiers et répertoires.
- `followSymlink` : si `true`, suit les liens symboliques
- `filter` : fonction de filtrage personnalisée qui reçoit le nom de l'élément et ses statistiques

**`canExecute(file)`** - Vérifie si un fichier est exécutable en examinant les bits de permission.

**`newerFiles(location, regex, mtime)`** - Vérifie si des fichiers sont plus récents qu'une date donnée.
- Retourne `true` dès qu'un fichier plus récent est trouvé
- Utile pour détecter les modifications depuis une certaine date

**`shasum(location, regex, sed, sha)`** - Calcule la somme de contrôle SHA-256 des fichiers.
- `regex` : filtre les fichiers à inclure dans le calcul
- `sed` : fonction pour modifier le contenu avant le calcul de la somme
- `sha` : objet hash existant (pour les appels récursifs)

**`sed(file, regex, newValue)`** - Remplace du texte dans un fichier.
- Ne modifie que les fichiers texte (détecte automatiquement les fichiers binaires)
- Retourne `true` si des modifications ont été effectuées, `false` sinon

## Remarques importantes

1. La plupart des fonctions sont synchrones, ce qui peut bloquer le thread principal si elles sont utilisées sur de grandes quantités de données.
2. Les fonctions de copie et de déplacement créent automatiquement les répertoires intermédiaires si nécessaire.
3. Le module expose directement l'instance `fse` (fs-extra) pour un accès aux fonctionnalités non couvertes par les méthodes personnalisées.
4. Les opérations par lot (`batch.cp` et `batch.mv`) permettent de traiter plusieurs fichiers avec une logique personnalisée via une fonction de rappel.
5. La fonction `shasum` est particulièrement utile pour vérifier l'intégrité d'un ensemble de fichiers ou détecter des modifications.

*Ce document est une mise à jour de la documentation précédente.*