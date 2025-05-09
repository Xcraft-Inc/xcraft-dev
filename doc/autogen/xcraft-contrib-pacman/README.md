# 📘 Documentation du module xcraft-contrib-pacman

## Aperçu

Le module `xcraft-contrib-pacman` est un gestionnaire de paquets complet pour l'écosystème Xcraft. Il permet de créer, construire, installer, publier et gérer des paquets logiciels dans différentes distributions et architectures. Ce module s'appuie sur WPKG (Windows Package Manager) pour la gestion des paquets et fournit une interface complète pour manipuler le cycle de vie des paquets.

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
zog pacman.install --packageRefs=my-package --version=1.0.0
```

### Publier un paquet

```bash
zog pacman.publish --packageRefs=my-package --outputRepository=/path/to/repo
```

### Opération complète (make, build, install)

```bash
zog pacman.full --packageRefs=my-package
```

### Vérifier les dépendances d'un paquet

```bash
zog pacman.bom --packageRef=my-package
```

## Interactions avec d'autres modules

- **xcraft-core-etc** : Pour la configuration
- **xcraft-core-fs** : Pour les opérations sur le système de fichiers
- **xcraft-core-platform** : Pour la détection de la plateforme
- **xcraft-contrib-wpkg** : Pour les opérations WPKG sous-jacentes
- **xcraft-contrib-peon** : Pour les opérations de construction
- **xcraft-core-wizard** : Pour l'interface d'édition interactive
- **xcraft-core-env** : Pour la gestion des environnements
- **xcraft-core-placeholder** : Pour l'injection de variables dans les templates

## Configuration avancée

Le module peut être configuré via le fichier `config.js` :

- **architectures** : Liste des architectures supportées (mswindows-i386, linux-amd64, darwin-amd64, etc.)
- **pkgCfgFileName** : Nom du fichier de configuration pour les définitions WPKG (par défaut: config.yaml)
- **pkgScript** : Nom du modèle pour les scripts WPKG
- **pkgMakeall** : Nom du script make all
- **pkgWPKG** : Répertoire pour les paquets WPKG
- **pkgToolchainRepository** : Chemin du dépôt de la chaîne d'outils
- **pkgIndex** : Fichier d'index pour les dépôts WPKG
- **wpkgTemp** : Répertoire temporaire pour WPKG
- **stamps** : Emplacement pour les tampons de construction
- **http.enabled** : Activer le serveur HTTP pour les dépôts WPKG
- **http.port** : Port du serveur HTTP
- **http.hostname** : Nom d'hôte du serveur HTTP

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

### `lib/def.js`

Ce module gère les définitions de paquets au format YAML. Il fournit des fonctions pour :

- `loadAll` : Charger toutes les définitions d'un paquet
- `getBasePackageDef` : Obtenir la définition de base d'un paquet
- `load` : Charger une définition de paquet
- `update` : Mettre à jour une définition de paquet
- `save` : Sauvegarder une définition de paquet
- `removeUnstage` : Supprimer les modifications non validées
- `bumpPackageVersion` : Incrémenter la version d'un paquet

### `lib/build.js`

Responsable de la compilation des paquets source. Il gère :

- La résolution des dépendances de construction
- L'installation des dépendances nécessaires
- La compilation des sources
- La publication des paquets construits

La méthode principale `package` orchestre tout le processus de construction.

### `lib/install.js`

Gère l'installation des paquets dans un environnement cible. Fonctionnalités :

- `package` : Installation d'un paquet
- `packageArchive` : Installation à partir d'une archive
- `externalPackage` : Installation d'un paquet externe
- `status` : Vérification de l'état d'installation

### `lib/publish.js`

Responsable de la publication des paquets dans des dépôts. Fonctionnalités :

- `add` : Ajout d'un paquet à un dépôt
- `remove` : Suppression d'un paquet d'un dépôt
- `removeAll` : Suppression de plusieurs paquets d'un dépôt
- `status` : Vérification de l'état de publication
- `getNewVersionIfArchived` : Vérification si une nouvelle version est nécessaire

### `lib/admindir.js`

Gère les répertoires d'administration WPKG. Fonctionnalités :

- `addSource` : Ajout d'une source à un répertoire d'administration
- `delSource` : Suppression d'une source d'un répertoire d'administration
- `registerHooks` : Enregistrement des hooks
- `create` : Création d'un répertoire d'administration

### `lib/wpkgHttp.js`

Implémente un serveur HTTP pour accéder aux dépôts WPKG. Caractéristiques :

- Exposition des dépôts via HTTP
- Gestion des routes pour différentes distributions
- Actualisation automatique des dépôts
- Redirection pour les distributions spécifiques

### `lib/utils.js`

Fournit des fonctions utilitaires pour le module :

- `checkArch` : Vérification de la compatibilité des architectures
- `parsePkgRef` : Analyse des références de paquets
- `checkOsSupport` : Vérification de la compatibilité du système d'exploitation
- `injectThisPh` : Injection de placeholders
- `flatten` : Aplatissement d'objets
- `getDistributions` : Obtention de la liste des distributions
- `errorReporting` : Rapport d'erreurs
- `makeGetObj` : Création d'un objet get

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

_Mise à jour de la documentation_