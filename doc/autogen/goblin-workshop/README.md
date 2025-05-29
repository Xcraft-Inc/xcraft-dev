# 📘 Documentation du module goblin-workshop

## Aperçu

Le module `goblin-workshop` est un framework complet pour la construction et la gestion d'entités dans l'écosystème Xcraft. Il fournit une infrastructure robuste pour définir des modèles de données, gérer leur cycle de vie, et faciliter les interactions entre différentes entités. Ce module est au cœur de la couche métier des applications Xcraft, offrant des fonctionnalités comme l'indexation, la persistance, la mise en cache, et la gestion des relations entre entités.

## Sommaire

- [Structure du module](#structure-du-module)
- [Fonctionnement global](#fonctionnement-global)
- [Exemples d'utilisation](#exemples-dutilisation)
- [Interactions avec d'autres modules](#interactions-avec-dautres-modules)
- [Configuration avancée](#configuration-avancée)
  - [Variables d'environnement](#variables-denvironnement)
- [Détails des sources](#détails-des-sources)
  - [Entity Builder](#entity-builder)
  - [Workitems](#workitems)
  - [Indexation et recherche](#indexation-et-recherche)
  - [Gestion des flux d'entités](#gestion-des-flux-dentités)
  - [Utilitaires](#utilitaires)
  - [Acteurs principaux](#acteurs-principaux)

## Structure du module

Le module `goblin-workshop` est organisé autour de plusieurs composants clés :

1. **Entity Builder** : Permet de définir et construire des entités avec leurs propriétés, références et valeurs.
2. **Workitems** : Fournit des abstractions pour créer des interfaces utilisateur liées aux entités.
3. **Indexation et recherche** : Gère l'indexation des entités pour permettre des recherches efficaces.
4. **Gestion des flux d'entités** : Gère le cycle de vie des entités (création, publication, archivage, etc.).
5. **Utilitaires** : Offre des outils pour manipuler les entités, générer des rapports, etc.

Le module expose plusieurs acteurs Goblin qui travaillent ensemble pour fournir ces fonctionnalités :

- `workshop` : Acteur principal qui coordonne les autres acteurs
- `entity-*` : Acteurs spécialisés pour différentes opérations sur les entités
- `*-workitem` : Acteurs pour la gestion des interfaces utilisateur
- `*-plugin` : Acteurs pour étendre les fonctionnalités des workitems

## Fonctionnement global

Le fonctionnement de `goblin-workshop` repose sur le concept d'entités et de leurs relations. Une entité est définie par :

- Un **type** unique (ex: `customer`, `order`, etc.)
- Des **propriétés** qui définissent les attributs de l'entité
- Des **références** vers d'autres entités
- Des **valeurs** qui sont des entités imbriquées

Le cycle de vie typique d'une entité est le suivant :

1. **Création** : Une entité est créée avec ses propriétés initiales
2. **Hydratation** : Les références et valeurs de l'entité sont chargées
3. **Indexation** : L'entité est indexée pour permettre des recherches
4. **Modification** : L'entité peut être modifiée via des quêtes
5. **Publication/Archivage** : L'entité peut changer d'état (brouillon, publié, archivé, etc.)

Le module fournit également un système de "workitems" qui permet de créer des interfaces utilisateur pour manipuler les entités. Ces workitems peuvent être de différents types :

- **Workitem** : Interface complète pour éditer une entité
- **Plugin** : Composant réutilisable pour afficher/éditer une collection d'entités
- **Search** : Interface de recherche pour trouver des entités
- **List** : Liste d'entités avec possibilité de filtrage et tri

## Exemples d'utilisation

### Définition d'une entité

```javascript
const {buildEntity} = require('goblin-workshop');

const entity = {
  type: 'customer',
  properties: {
    name: {type: 'string', defaultValue: ''},
    email: {type: 'string', defaultValue: ''},
    active: {type: 'bool', defaultValue: true},
  },
  references: {
    orders: 'order[]',  // Collection de références vers des entités 'order'
    mainAddress: 'address',  // Référence simple vers une entité 'address'
  },
  values: {
    contacts: 'contact[]',  // Collection de valeurs de type 'contact'
  },
  summaries: {
    info: {type: 'string', defaultValue: ''},
  },
  buildSummaries: function(quest, entity, peers) {
    return {
      info: `${entity.get('name')} (${entity.get('email')})`,
    };
  },
  indexer: function(quest, entity) {
    return {
      info: entity.get('meta.summaries.info'),
      name: entity.get('name'),
      email: entity.get('email'),
    };
  },
  onNew: function(quest, id, name, email) {
    return {
      id,
      name: name || '',
      email: email || '',
      active: true,
    };
  },
};

module.exports = {
  entity,
  service: buildEntity(entity),
};
```

### Utilisation d'un workitem pour éditer une entité

```javascript
const {buildWorkitem} = require('goblin-workshop');

const config = {
  type: 'customer',
  kind: 'workitem',
  onLoad: function*(quest, {entity}) {
    // Logique à exécuter lors du chargement de l'entité
    yield quest.me.change({
      path: 'loaded',
      newValue: true,
    });
  },
  onPublish: function*(quest) {
    // Logique à exécuter avant la publication de l'entité
    const entity = yield quest.me.getEntityState();
    if (!entity.get('email')) {
      return quest.cancel();  // Annule la publication si l'email est vide
    }
  },
};

module.exports = buildWorkitem(config);
```

### Création et manipulation d'une entité

```javascript
// Création d'une entité
const customer = await new Customer(this).create('customer@123', desktopId, {
  name: 'John Doe',
  email: 'john@example.com',
});

// Modification d'une propriété
await customer.change({
  path: 'name',
  newValue: 'Jane Doe',
});

// Ajout d'une référence
const order = await new Order(this).create('order@456', desktopId);
await customer.addToOrders({entityId: 'order@456'});

// Publication de l'entité
await customer.publishEntity();
```

### Utilisation de l'AggregateBuilder

```javascript
const {AggregateBuilder} = require('goblin-workshop');

// Création d'un builder pour manipuler des agrégats
const builder = new AggregateBuilder(quest, 'customer@123');

// Modification d'entités dans l'agrégat
builder
  .edit('customer@123')
  .patch({name: 'Jane Doe'})
  .edit('address@456')
  .patch({city: 'Paris'})
  .edit('customer@123')
  .add('contacts', {name: 'Personal', email: 'jane@example.com'})
  .remove('orders', 'order@789');

// Application des changements
await builder.apply(desktopId);
```

## Interactions avec d'autres modules

`goblin-workshop` interagit avec plusieurs autres modules de l'écosystème Xcraft :

- **[goblin-nabu](https://github.com/Xcraft-Inc/goblin-nabu)** : Pour la gestion des traductions dans les entités
- **[goblin-elasticsearch](https://github.com/Xcraft-Inc/goblin-elasticsearch)** : Pour l'indexation et la recherche d'entités
- **[goblin-rethink](https://github.com/Xcraft-Inc/goblin-rethink)** : Pour la persistance des entités
- **[goblin-desktop](https://github.com/Xcraft-Inc/goblin-desktop)** : Pour l'intégration des workitems dans l'interface utilisateur
- **[xcraft-core-goblin](https://github.com/Xcraft-Inc/xcraft-core-goblin)** : Pour la gestion des acteurs et des quêtes
- **[xcraft-core-shredder](https://github.com/Xcraft-Inc/xcraft-core-shredder)** : Pour la manipulation des données immuables

## Configuration avancée

Le module `goblin-workshop` peut être configuré via le fichier `config.js` :

| Option | Description | Type | Valeur par défaut |
|--------|-------------|------|------------------|
| `entityStorageProvider` | Service Goblin fournissant le stockage | string | `'goblin-rethink'` |
| `entityCheckerPolicy` | Politique de vérification des entités (`loose` ou `strict`) | string | `'loose'` |
| `mustExistPolicy` | Politique pour les entités qui doivent exister (`loose` ou `strict`) | string | `'loose'` |
| `entityStorageServicePoolSize` | Nombre d'instances de stockage disponibles dans le pool | number | `10` |
| `enableUndoEditFlow` | Active le flux d'édition avec annulation | boolean | `false` |
| `enableMultiLanguageIndex` | Active l'indexation multilingue | boolean | `false` |

### Variables d'environnement

Le module ne définit pas directement de variables d'environnement, mais il utilise les configurations fournies par `xcraft-core-etc`.

## Détails des sources

### Entity Builder

Le cœur du module est le système de construction d'entités, implémenté dans `lib/entity-builder.js`. Ce système permet de définir des entités avec leurs propriétés, références et valeurs, et de générer automatiquement les quêtes nécessaires pour manipuler ces entités.

#### Propriétés des entités

Les propriétés définissent les attributs d'une entité. Chaque propriété a un type et une valeur par défaut :

```javascript
properties: {
  name: {type: 'string', defaultValue: ''},
  age: {type: 'number', defaultValue: 0},
  active: {type: 'bool', defaultValue: true},
  category: {type: 'enum', values: ['A', 'B', 'C'], defaultValue: 'A'},
}
```

Les types supportés incluent :
- `string`, `number`, `bool`, `date`, `enum`, `translatable`, etc.

#### Références et valeurs

Les références pointent vers d'autres entités, tandis que les valeurs sont des entités imbriquées :

```javascript
references: {
  orders: 'order[]',  // Collection de références
  mainAddress: 'address',  // Référence simple
},
values: {
  contacts: 'contact[]',  // Collection de valeurs
  mainContact: 'contact',  // Valeur simple
}
```

La notation `[]` indique une collection, qui peut avoir une cardinalité spécifiée :
- `type[]` ou `type[0..n]` : Collection de 0 à n éléments
- `type[1..n]` : Collection d'au moins 1 élément
- `type[0..1]` : Élément optionnel

#### Méthodes générées

Pour chaque référence ou valeur, des méthodes sont générées automatiquement :

Pour les références :
- `addToX` : Ajoute une référence à la collection X
- `removeFromX` : Supprime une référence de la collection X
- `moveIntoX` : Déplace une référence dans la collection X
- `clearX` : Vide la collection X
- `setX` : Définit une référence simple X

Pour les valeurs :
- `addNewToX` : Crée et ajoute une nouvelle valeur à la collection X
- `addToX` : Ajoute une valeur existante à la collection X
- `removeFromX` : Supprime une valeur de la collection X
- `moveIntoX` : Déplace une valeur dans la collection X
- `clearX` : Vide la collection X
- `setNewX` : Crée et définit une nouvelle valeur simple X
- `setX` : Définit une valeur simple X

#### Cycle de vie des entités

Les entités ont un cycle de vie géré par plusieurs méthodes :

- `create` : Crée une nouvelle entité
- `hydrate` : Charge les références et valeurs de l'entité
- `persist` : Persiste l'entité dans le stockage
- `change` : Modifie une propriété de l'entité
- `apply` : Applique un patch à l'entité
- `submitEntity` : Soumet les modifications de l'entité
- `publishEntity` : Publie l'entité
- `archiveEntity` : Archive l'entité
- `trashEntity` : Met l'entité à la corbeille
- `rollbackEntity` : Annule les modifications de l'entité

### Workitems

Les workitems sont des abstractions pour créer des interfaces utilisateur liées aux entités. Ils sont implémentés dans `lib/workitems/`.

#### Types de workitems

- **Workitem** (`workitem.js`) : Interface complète pour éditer une entité
- **Plugin** (`plugin.js`) : Composant réutilisable pour afficher/éditer une collection d'entités
- **Search** (`search.js`) : Interface de recherche pour trouver des entités
- **List** (`list.js`) : Liste d'entités avec possibilité de filtrage et tri
- **Datagrid** (`datagrid.js`) : Grille de données pour afficher des entités

#### Configuration des workitems

Les workitems sont configurés via un objet de configuration :

```javascript
const config = {
  type: 'customer',  // Type d'entité
  kind: 'workitem',  // Type de workitem
  onLoad: function*(quest, {entity}) {
    // Logique à exécuter lors du chargement de l'entité
  },
  onPublish: function*(quest) {
    // Logique à exécuter avant la publication de l'entité
  },
  buttons: function*(quest, {buttons, mode, status}) {
    // Personnalisation des boutons du workitem
    return buttons;
  },
  hinters: {
    // Configuration des hinters pour les champs de recherche
    category: {
      onValidate: function*(quest, selection) {
        // Logique à exécuter lors de la validation d'une sélection
      },
    },
  },
};
```

#### Cycle de vie des workitems

Les workitems ont un cycle de vie géré par plusieurs méthodes :

- `create` : Crée un nouveau workitem
- `load-graph` : Charge le graphe d'entités associé au workitem
- `wait-loaded` : Attend que le workitem soit chargé
- `change-entity` : Change l'entité associée au workitem
- `close` : Ferme le workitem

### Indexation et recherche

Le module fournit un système d'indexation et de recherche d'entités, implémenté dans `lib/entity-indexer.js` et `lib/indexer/`.

#### Indexation des entités

Chaque entité peut définir une méthode `indexer` qui retourne les champs à indexer :

```javascript
indexer: function(quest, entity) {
  return {
    info: entity.get('meta.summaries.info'),
    name: entity.get('name'),
    email: entity.get('email'),
  };
}
```

Ces champs sont ensuite indexés dans Elasticsearch pour permettre des recherches efficaces.

#### Recherche d'entités

Le module fournit plusieurs acteurs pour la recherche d'entités :

- `entity-driller` : Permet de "forer" dans les entités pour récupérer des informations détaillées
- `hinter` : Fournit des suggestions de recherche basées sur les entités indexées

### Gestion des flux d'entités

Le module fournit plusieurs acteurs pour gérer le flux des entités :

- `entity-flow-updater` : Gère les changements d'état des entités (publication, archivage, etc.)
- `aggregate-updater` : Met à jour les agrégats d'entités
- `entity-cache-feeder` : Alimente le cache d'entités
- `cron-scheduler` : Planifie des tâches récurrentes sur les entités

#### États des entités

Les entités peuvent avoir différents états :

- `draft` : Brouillon
- `published` : Publié
- `archived` : Archivé
- `trashed` : À la corbeille
- `missing` : Manquant

#### Propagation des changements d'état

Lorsqu'une entité change d'état, ce changement peut être propagé à ses entités liées via `entity-flow-updater`.

### Utilitaires

Le module fournit plusieurs utilitaires pour manipuler les entités :

- `MarkdownBuilder` : Permet de construire des descriptions en Markdown pour les entités
- `AlertsBuilder` : Permet de construire des alertes pour les entités
- `AggregateBuilder` : Permet de construire des agrégats d'entités
- `FileOutput` : Permet d'exporter des entités vers des fichiers CSV ou JSON
- `SmartId` : Permet de manipuler les identifiants d'entités

#### Exportation d'entités

Le module permet d'exporter des entités vers des fichiers CSV ou JSON via les acteurs `entity-exporter` et `entity-exporter-worker`.

#### Importation d'entités

Le module permet d'importer des entités depuis des fichiers via les acteurs `entity-importer` et `entity-importer-worker`.

#### Réhydratation d'entités

Le module permet de réhydrater des entités via les acteurs `rehydrate-entities` et `rehydrate-entities-worker`.

#### Réindexation d'entités

Le module permet de réindexer des entités via les acteurs `reindex-entities` et `reindex-entities-worker`.

### Acteurs principaux

#### workshop

L'acteur principal qui coordonne les autres acteurs. Il fournit des méthodes pour initialiser le stockage, l'indexation, et gérer les entités.

**Méthodes principales :**
- `init` : Initialise le module
- `createEntity` : Crée une entité
- `initStorage` : Initialise le stockage
- `initIndexer` : Initialise l'indexation
- `reindexEntitiesFromStorage` : Réindexe les entités depuis le stockage

#### entity-builder

Fournit les fonctionnalités pour construire des entités avec leurs propriétés, références et valeurs.

**Méthodes principales :**
- `buildEntity` : Construit une entité
- `buildReferencesQuests` : Construit les quêtes pour les références
- `buildValuesQuests` : Construit les quêtes pour les valeurs

#### entity-cache-feeder

Alimente le cache d'entités.

**Méthodes principales :**
- `feedCache` : Alimente le cache avec une entité

#### entity-flow-updater

Gère les changements d'état des entités.

**Méthodes principales :**
- `changeEntityStatus` : Change l'état d'une entité
- `propagate` : Propage un changement d'état aux entités liées

#### aggregate-updater

Met à jour les agrégats d'entités.

**Méthodes principales :**
- `updateAggregate` : Met à jour un agrégat
- `applyChanges` : Applique des changements à un agrégat

#### entity-indexer

Gère l'indexation des entités.

**Méthodes principales :**
- `bulk` : Indexe un lot d'entités

#### entity-driller

Permet de "forer" dans les entités pour récupérer des informations détaillées.

**Méthodes principales :**
- `drillDown` : Récupère des entités détaillées
- `drillView` : Récupère des vues d'entités

#### cron-scheduler

Planifie des tâches récurrentes sur les entités.

**Méthodes principales :**
- `schedule` : Planifie une tâche
- `cancelSchedule` : Annule une tâche planifiée
- `doJob` : Exécute une tâche

Cette documentation a été mise à jour.