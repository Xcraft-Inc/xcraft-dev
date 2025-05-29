# 📘 Documentation du module goblin-tradingpost

## Aperçu

Le module `goblin-tradingpost` est un service qui expose les quêtes des goblins via une API HTTP RESTful. Il permet de créer des points d'accès HTTP pour interagir avec les acteurs Goblin de l'écosystème Xcraft, facilitant ainsi l'intégration avec des systèmes externes ou des applications frontales.

## Structure du module

- **Service principal** : Un goblin qui gère un serveur HTTP basé sur Fastify
- **Builder d'API** : Utilitaire pour construire facilement des APIs exposant des goblins
- **Utilitaires de cryptographie** : Fonctions pour chiffrer/déchiffrer les données échangées
- **Utilitaires divers** : Fonctions pour manipuler les quêtes et les données

## Fonctionnement global

Le module fonctionne en deux parties principales :

1. **TradingPost Service** : Un goblin qui crée et gère un serveur HTTP Fastify, permettant d'exposer les quêtes d'autres goblins via des routes HTTP.
2. **API Builder** : Un utilitaire qui facilite la création d'APIs en exposant des goblins spécifiques avec des configurations personnalisées.

Le flux typique est le suivant :
1. Créer une instance du service TradingPost
2. Ajouter des APIs de goblin avec leurs configurations (routes, méthodes HTTP, schémas, etc.)
3. Démarrer le serveur
4. Les clients externes peuvent maintenant appeler les quêtes des goblins via HTTP

## Exemples d'utilisation

### Création d'une API simple

```javascript
// Créer une instance du service TradingPost
const tradingPost = await new Elf.Alone(this).create('tradingpost', {
  id: 'tradingpost',
  host: '127.0.0.1',
  port: 8080,
  exposeSwagger: true,
});

// Ajouter une API pour un goblin existant
await tradingPost.addGoblinApi({
  goblinId: 'my-goblin',
  apiKey: ['secret-key-123'],
  allowedCommands: {
    'get-data': {
      verb: 'GET',
      route: 'data/:id',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        type: 'object',
        properties: {
          result: { type: 'string' }
        }
      }
    }
  }
});

// Démarrer le serveur
const url = await tradingPost.start();
console.log(`API disponible à l'adresse: ${url}`);
```

### Utilisation du builder d'API

```javascript
const apiBuilder = require('goblin-tradingpost/builder/apiBuilder');

// Configuration de l'API
const config = {
  name: 'my-service',
  host: '127.0.0.1',
  port: 8081,
  apiKey: ['secret-key-456'],
  exposeSwagger: true,
  schemaBuilder: (buildParam) => ({
    'get-user': {
      verb: 'GET',
      route: 'users/:userId',
      params: buildParam({
        userId: { type: 'string' }
      })('userId'),
      response: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        }
      }
    }
  }),
  quests: {
    'get-user': function(quest, userId) {
      // Logique pour récupérer l'utilisateur
      return { id: userId, name: 'John Doe' };
    }
  }
};

// Créer l'API
const myApi = apiBuilder(config);
const apiInstance = await new Elf.Alone(this).create(myApi, {
  desktopId: 'desktop'
});
```

## Interactions avec d'autres modules

- **xcraft-core-goblin** : Utilisé pour créer et gérer les goblins
- **fastify** : Utilisé comme serveur HTTP sous-jacent
- **@fastify/swagger** : Pour générer la documentation OpenAPI
- **@fastify/swagger-ui** : Pour exposer l'interface utilisateur Swagger
- **@fastify/cors** : Pour gérer les requêtes cross-origin
- **enstore** : Pour gérer les flux de données

## Détails des sources

### `service.js`

Le cœur du module qui implémente le service TradingPost. Il gère :
- La création du serveur Fastify
- L'ajout/suppression d'APIs de goblin
- Le démarrage/arrêt du serveur
- La gestion des routes HTTP pour les quêtes exposées

Principales quêtes :
- `create` : Initialise le service avec un serveur Fastify
- `addGoblinApi` : Expose les quêtes d'un goblin via HTTP
- `removeGoblinApi` : Supprime l'exposition d'un goblin
- `start` : Démarre le serveur HTTP
- `close` : Arrête le serveur HTTP
- `restart` : Redémarre le serveur HTTP

### `apiBuilder.js`

Un utilitaire qui facilite la création d'APIs en exposant des goblins spécifiques. Il permet de :
- Définir les routes, méthodes HTTP et schémas pour les quêtes exposées
- Configurer l'authentification par clé API
- Exposer la documentation Swagger

### `crypto.js`

Fournit des fonctions pour chiffrer et déchiffrer les données échangées via l'API :
- `encryptStream` / `decryptStream` : Chiffre/déchiffre des flux de données
- `encryptText` / `decryptText` : Chiffre/déchiffre des chaînes de texte

Utilise l'algorithme AES-256-CBC avec un vecteur d'initialisation (IV) généré aléatoirement.

### `utils.js`

Contient des fonctions utilitaires pour :
- Lire les clés de chiffrement à partir d'un fichier
- Extraire les méthodes publiques d'un objet
- Transformer les noms de quêtes en noms de routes HTTP
- Parser des flux JSON

## Configuration avancée

- **Sécurité** : Possibilité de chiffrer les communications avec une clé de chiffrement
- **Documentation API** : Configuration de Swagger pour documenter l'API
- **CORS** : Configuration des règles de partage de ressources cross-origin
- **Authentification** : Utilisation de clés API pour sécuriser l'accès

## Exemple d'utilisation avec chiffrement

```javascript
// Créer une instance du service TradingPost
const tradingPost = await new Elf.Alone(this).create('tradingpost', {
  id: 'tradingpost-secure',
  host: '127.0.0.1',
  port: 8443,
});

// Ajouter une API sécurisée
await tradingPost.addGoblinApi({
  goblinId: 'sensitive-data-goblin',
  apiKey: ['very-secret-key'],
  secure: '/path/to/encryption-key.json',
  allowedCommands: {
    'get-sensitive-data': {
      verb: 'GET',
      route: 'sensitive/:id',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      }
    }
  }
});

// Démarrer le serveur
await tradingPost.start();
```