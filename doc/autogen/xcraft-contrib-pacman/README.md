# 📘 Documentation du module xcraft-contrib-pacman

## Aperçu

Le module `xcraft-contrib-pacman` est un gestionnaire de paquets complet pour l'écosystème Xcraft. Il permet de créer, construire, installer, publier et gérer des paquets logiciels dans différentes distributions et architectures. Ce module s'appuie sur WPKG (Windows Package Manager) pour la gestion des paquets et fournit une interface complète pour manipuler le cycle de vie des paquets.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Configuration avancée](#configuration-avancée)
- [Variables d'environnement](#variables-denvironnement)
- [Détails des sources](#détails-des-sources)

## Structure du module

Le module est organisé en plusieurs composants principaux :

- **Commandes principales** (`pacman.js`) : Interface de commande pour toutes les opérations de gestion de paquets
- **Définition de paquets** (`lib/def.js`) : Gestion des définitions de paquets au format YAML
- **Construction** (`lib/build.js`) : Compilation des paquets source
- **Installation** (`lib/install.js`) : Installation des paquets dans un environnement cible
- **Publication** (`lib/publish.js`) : Publication des paquets dans des dépôts
- **Génération de fichiers** (`lib/file/`) : Création des fichiers de contrôle, changelog, copyright, etc.
- **Utilitaires** (`lib/utils.js`) : Fonctions utilitaires communes
- **Serveur HTTP** (`lib/wpkgHttp.js`) : Serveur pour accéder aux dépôts via HTTP
- **Administration** (`lib/admindir.js`) : Gestion des répertoires d'administration WPKG

## Fonctionnement global

Le flux de travail typique avec pacman est le suivant :

1. **Définition du paquet** : Création ou édition d'un fichier de configuration YAML décrivant le paquet
2. **Make** : Génération des fichiers de contrôle et préparation du paquet
3. **Build** : Compilation des sources (pour les paquets source)
4. **Install** : Installation du paquet dans l'environnement cible
5. **Publish** : Publication du paquet dans un dépôt pour le partager

Le module gère également les dépendances entre paquets, permettant de construire automatiquement les dépendances nécessaires lors de la construction d'un paquet. Il prend en charge différents types de dépendances :

- **Dépendances d'installation** : Nécessaires pour exécuter le paquet
- **Dépendances de construction** : Nécessaires pour compiler le paquet
- **Dépendances de make** : Nécessaires pour générer les fichiers de contrôle

### Gestion des versions et des hachages

Le système maintient automatiquement les références (`$ref`) et les hachages (`$hash`) des sources pour garantir la reproductibilité des builds. Lorsqu'un paquet est construit, ces informations sont mises à jour dans la définition du paquet.

### Système de tampons (stamps)

Pour optimiser les performances, pacman utilise un système de tampons qui permet d'éviter de reconstruire des paquets inchangés. Les tampons sont stockés dans le répertoire spécifié par la configuration `stamps`.

## Exemples d'utilisation

### Créer un nouveau paquet

```bash
zog pacman.edit my-package
```

Cette commande lance un assistant interactif pour créer ou modifier la définition d'un paquet.

### Construire un paquet

```bash
# Générer les fichiers de contrôle
zog pacman.make my-package

# Compiler le paquet source
zog pacman.build my-package
```

### Installer un paquet

```bash
# Installation simple
zog pacman.install my-package

# Installation avec une version spécifique
zog pacman.install my-package --version=1.0.0
```

### Publier un paquet

```bash
zog pacman.publish my-package /path/to/repo
```

### Opération complète (make, build, install)

```bash
zog pacman.full my-package
```

### Vérifier les dépendances d'un paquet

```bash
zog pacman.bom my-package
```

### Vérifier les versions disponibles d'un paquet

```bash
zog pacman.version my-package
```

### Générer un graphe de dépendances

```bash
zog pacman.graph my-package
```

## Interactions avec d'autres modules

- **[xcraft-core-etc]** : Pour la configuration
- **[xcraft-core-fs]** : Pour les opérations sur le système de fichiers
- **[xcraft-core-platform]** : Pour la détection de la plateforme
- **[xcraft-contrib-wpkg]** : Pour les opérations WPKG sous-jacentes
- **[xcraft-contrib-peon]** : Pour les opérations de construction
- **[xcraft-core-wizard]** : Pour l'interface d'édition interactive
- **[xcraft-core-env]** : Pour la gestion des environnements
- **[xcraft-core-placeholder]** : Pour l'injection de variables dans les templates
- **[goblin-overwatch]** : Pour la gestion des erreurs et le reporting

## Configuration avancée

Le module peut être configuré via le fichier `config.js` :

| Option | Description | Type | Valeur par défaut |
|--------|-------------|------|------------------|
| architectures | Liste des architectures supportées | Array | mswindows-i386, mswindows-amd64, linux-i386, linux-amd64, linux-aarch64, darwin-i386, darwin-amd64, darwin-aarch64, solaris-i386, solaris-amd64, freebsd-i386, freebsd-amd64 |
| pkgCfgFileName | Nom du fichier de configuration pour les définitions WPKG | String | config.yaml |
| pkgScript | Nom du modèle pour les scripts WPKG | String | script |
| pkgMakeall | Nom du script make all | String | makeall |
| pkgWPKG | Répertoire pour les paquets WPKG | String | WPKG |
| pkgToolchainRepository | Chemin du dépôt de la chaîne d'outils | String | toolchain/ |
| pkgIndex | Fichier d'index pour les dépôts WPKG | String | index.tar.gz |
| wpkgTemp | Répertoire temporaire pour WPKG | String | ./var/tmp/ |
| stamps | Emplacement pour les tampons de construction | String | ./var/xcraft-contrib-pacman/ |
| http.enabled | Activer le serveur HTTP pour les dépôts WPKG | Boolean | true |
| http.port | Port du serveur HTTP | Number | 12321 |
| http.hostname | Nom d'hôte du serveur HTTP | String | 0.0.0.0 |

### Variables d'environnement

| Variable | Description | Exemple | Valeur par défaut |
|----------|-------------|---------|------------------|
| PEON_DEBUG_PKG | Définit le paquet en mode débogage pour zeroBuild | PEON_DEBUG_PKG=my-package | - |

## Détails des sources

### `pacman.js`

Ce fichier est le point d'entrée principal du module. Il définit toutes les commandes disponibles pour manipuler les paquets :

- `list` : Liste tous les paquets disponibles à partir des définitions
- `listStatus` : Liste l'état des paquets installés
- `listCheck` : Vérifie les versions des paquets installés par rapport aux définitions
- `search` : Recherche des fichiers dans les paquets installés
- `unlock` : Supprime le verrou de la base de données
- `edit` : Crée ou modifie un paquet
- `make` : Génère les fichiers de contrôle pour WPKG
- `install` : Installe un paquet
- `reinstall` : Réinstalle un paquet
- `upgrade` : Met à jour les paquets
- `status` : Vérifie l'état d'un paquet
- `show` : Affiche les informations d'un paquet
- `bom` : Affiche la liste des matériaux (Bill of Materials) d'un paquet
- `build` : Compile un paquet source
- `zeroBuild` : Prépare un paquet pour la construction sans démarrer la construction
- `full` : Effectue make, build et install en une seule opération
- `publish` : Publie un paquet dans un dépôt
- `unpublish` : Dépublie un paquet
- `remove` : Supprime un paquet
- `removeAll` : Supprime tous les paquets
- `autoremove` : Supprime automatiquement les paquets implicites
- `clean` : Supprime les fichiers temporaires
- `addSource` : Ajoute une nouvelle source à un répertoire cible
- `delSource` : Supprime une source d'un répertoire cible
- `syncRepository` : Synchronise les dépôts d'archives
- `graph` : Génère le graphe de dépendances pour un ou plusieurs paquets
- `version` : Lit et teste la version d'un ou plusieurs paquets
- `refrhash` : Actualise les entrées $hash des définitions
- `gitMergeDefinitions` : Fusionne les définitions de paquets avec les versions appropriées

#### Méthodes publiques

**`extractPackages(packageRefs, distribution, resp, withMake = false, _pkgs = [])`** - Extrait les références de paquets à partir d'une chaîne et résout les dépendances. Prend en charge le motif `@deps` pour inclure les dépendances d'un paquet.

**`wrapOverwatch(func, msg, resp, next)`** - Enveloppe une fonction avec la gestion des erreurs d'Overwatch.

**`list(msg, resp)`** - Liste tous les paquets disponibles à partir des définitions.

**`listStatus(msg, resp, next)`** - Liste l'état des paquets installés.

**`listCheck(msg, resp, next)`** - Vérifie les versions des paquets installés par rapport aux définitions.

**`search(msg, resp, next)`** - Recherche des fichiers dans les paquets installés.

**`unlock(msg, resp, next)`** - Supprime le verrou de la base de données.

**`edit(msg, resp)`** - Crée ou modifie un paquet via un assistant interactif.

**`make(msg, resp, next)`** - Génère les fichiers de contrôle pour WPKG.

**`install(msg, resp)`** - Installe un paquet.

**`reinstall(msg, resp)`** - Réinstalle un paquet.

**`upgrade(msg, resp, next)`** - Met à jour les paquets.

**`status(msg, resp)`** - Vérifie l'état d'un paquet (installé et/ou publié).

**`show(msg, resp, next)`** - Affiche les informations détaillées d'un paquet.

**`bom(msg, resp, next)`** - Affiche la liste des matériaux (Bill of Materials) d'un paquet.

**`build(msg, resp)`** - Compile un paquet source.

**`zeroBuild(msg, resp)`** - Prépare un paquet pour la construction sans démarrer la construction.

**`full(msg, resp)`** - Effectue make, build et install en une seule opération.

**`remove(msg, resp)`** - Supprime un paquet.

**`removeAll(msg, resp, next)`** - Supprime tous les paquets d'une distribution.

**`autoremove(msg, resp)`** - Supprime automatiquement les paquets implicites.

**`clean(msg, resp)`** - Supprime les fichiers temporaires.

**`publish(msg, resp)`** - Publie un paquet dans un dépôt.

**`unpublish(msg, resp)`** - Dépublie un paquet.

**`addSource(msg, resp)`** - Ajoute une nouvelle source à un répertoire cible.

**`delSource(msg, resp)`** - Supprime une source d'un répertoire cible.

**`syncRepository(msg, resp)`** - Synchronise les dépôts d'archives.

**`graph(msg, resp)`** - Génère le graphe de dépendances pour un ou plusieurs paquets.

**`version(msg, resp)`** - Lit et teste la version d'un ou plusieurs paquets.

**`refrhash(msg, resp, next)`** - Actualise les entrées $hash des définitions.

**`gitMergeDefinitions(msg, resp, next)`** - Fusionne les définitions de paquets avec les versions appropriées.

### `lib/def.js`

Ce module gère les définitions de paquets au format YAML. Il fournit des fonctions pour :

#### Méthodes publiques

**`loadAll(packageName, props, resp)`** - Charge toutes les définitions d'un paquet pour toutes les distributions.

**`getBasePackageDef(packageName, resp)`** - Obtient la définition de base d'un paquet.

**`load(packageName, props, resp, distribution)`** - Charge une définition de paquet pour une distribution spécifique.

**`update(packageName, props, resp, distribution)`** - Met à jour une définition de paquet.

**`save(packageDef, pkgConfig, resp)`** - Sauvegarde une définition de paquet.

**`removeUnstage(packageDef, resp)`** - Supprime les modifications non validées.

**`bumpPackageVersion(version)`** - Incrémente la version d'un paquet.

### `lib/build.js`

Responsable de la compilation des paquets source. Il gère :

- La résolution des dépendances de construction
- L'installation des dépendances nécessaires
- La compilation des sources
- La publication des paquets construits

#### Méthodes publiques

**`package(packageRef, distribution, next)`** - Orchestre tout le processus de construction d'un paquet.

### `lib/install.js`

Gère l'installation des paquets dans un environnement cible.

#### Méthodes publiques

**`package(packageRef, distribution, prodRoot, reinstall, next)`** - Installation d'un paquet.

**`packageArchive(packageRef, version, distribution, prodRoot, reinstall, next)`** - Installation à partir d'une archive.

**`externalPackage(packageRef, distribution, prodRoot, reinstall, next)`** - Installation d'un paquet externe.

**`status(packageRef, distribution, next)`** - Vérification de l'état d'installation.

### `lib/publish.js`

Responsable de la publication des paquets dans des dépôts.

#### Méthodes publiques

**`add(packageRef, inputRepository, outputRepository, distribution, next)`** - Ajout d'un paquet à un dépôt.

**`remove(packageRef, repository, distribution, updateIndex, next)`** - Suppression d'un paquet d'un dépôt.

**`removeAll(packageList, repository, distribution, next)`** - Suppression de plusieurs paquets d'un dépôt.

**`status(packageRef, distribution, repositoryPath, next)`** - Vérification de l'état de publication.

**`getNewVersionIfArchived(packageRef, version, distribution, targetDistribution)`** - Vérification si une nouvelle version est nécessaire.

### `lib/admindir.js`

Gère les répertoires d'administration WPKG.

#### Méthodes publiques

**`addSource(uri, arch, distribution, location, components, next)`** - Ajout d'une source à un répertoire d'administration.

**`delSource(uri, arch, distribution, location, components, next)`** - Suppression d'une source d'un répertoire d'administration.

**`registerHooks(arch, distribution, next)`** - Enregistrement des hooks.

**`create(packageRef, targetRoot, distribution, next)`** - Création d'un répertoire d'administration.

### `lib/make.js`

Ce module est responsable de la génération des fichiers de contrôle et de la préparation des paquets pour WPKG.

#### Méthodes publiques

**`package(packageName, arch, defProps, outputRepository, distribution)`** - Génère la structure complète du paquet.

**`injectHash(packageName, hash, distribution = null)`** - Met à jour le hachage d'un paquet.

### `lib/wpkgHttp.js`

Implémente un serveur HTTP pour accéder aux dépôts WPKG.

#### Méthodes publiques

**`serve()`** - Démarre le serveur HTTP.

**`dispose(next)`** - Arrête le serveur HTTP.

### `lib/utils.js`

Fournit des fonctions utilitaires pour le module.

#### Méthodes publiques

**`checkArch(arch)`** - Vérification de la compatibilité des architectures.

**`parsePkgRef(packageRef)`** - Analyse des références de paquets.

**`checkOsSupport(packageName, packageArch, packageDef, arch)`** - Vérification de la compatibilité du système d'exploitation.

**`injectThisPh(packageDef, data)`** - Injection de placeholders.

**`flatten(object)`** - Aplatissement d'objets.

**`getDistributions(packageDef)`** - Obtention de la liste des distributions.

**`errorReporting(resp)`** - Rapport d'erreurs.

**`makeGetObj(packageDef)`** - Création d'un objet get.

### `lib/file/*.js`

Ces fichiers sont responsables de la génération des différents fichiers nécessaires pour un paquet WPKG :

- `control.js` : Génère les fichiers de contrôle
- `changelog.js` : Génère les fichiers de changelog
- `copyright.js` : Génère les fichiers de copyright
- `cmakelists.js` : Génère les fichiers CMakeLists.txt
- `etc.js` : Génère les fichiers de configuration

### `wizard.js`

Ce fichier définit l'assistant interactif pour la création et la modification de paquets. Il contient les définitions des questions pour :

- Informations générales du paquet (nom, version, architecture, etc.)
- Dépendances (installation, construction, make)
- Configuration des données (URI, type, règles, etc.)
- Variables d'environnement
- Options de téléchargement vers le serveur chest

_Cette documentation a été mise à jour._

[xcraft-core-etc]: https://github.com/Xcraft-Inc/xcraft-core-etc
[xcraft-core-fs]: https://github.com/Xcraft-Inc/xcraft-core-fs
[xcraft-core-platform]: https://github.com/Xcraft-Inc/xcraft-core-platform
[xcraft-contrib-wpkg]: https://github.com/Xcraft-Inc/xcraft-contrib-wpkg
[xcraft-contrib-peon]: https://github.com/Xcraft-Inc/xcraft-contrib-peon
[xcraft-core-wizard]: https://github.com/Xcraft-Inc/xcraft-core-wizard
[xcraft-core-env]: https://github.com/Xcraft-Inc/xcraft-core-env
[xcraft-core-placeholder]: https://github.com/Xcraft-Inc/xcraft-core-placeholder
[goblin-overwatch]: https://github.com/Xcraft-Inc/goblin-overwatch