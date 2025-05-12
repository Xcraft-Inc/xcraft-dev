# 📘 Documentation du module xcraft-axon

## Aperçu

xcraft-axon est un module de messagerie et de communication réseau de haut niveau implémenté en JavaScript pur. Il fournit différents patterns de communication (publish/subscribe, push/pull, request/reply) inspirés de ZeroMQ, mais avec une implémentation native Node.js. Ce module est une adaptation du projet Axon original, optimisé pour l'écosystème Xcraft.

## Structure du module

Le module est organisé autour de différents types de sockets qui implémentent des patterns de messagerie spécifiques :

- **PubSocket/SubSocket** : Pattern publish/subscribe pour la diffusion de messages
- **PushSocket/PullSocket** : Pattern push/pull pour la distribution de tâches
- **ReqSocket/RepSocket** : Pattern request/reply pour les communications RPC
- **PubEmitterSocket/SubEmitterSocket** : Variantes orientées événements des sockets pub/sub

Chaque type de socket est spécialisé pour un cas d'utilisation particulier et offre une API adaptée à son pattern de communication.

## Fonctionnement global

xcraft-axon fonctionne en établissant des connexions TCP entre les différents nœuds d'une application distribuée. Les messages sont sérialisés, compressés (via zlib par défaut) et transmis entre les sockets. Le module gère automatiquement :

- La reconnexion en cas de perte de connexion
- La mise en file d'attente des messages (avec contrôle de flux via HWM - High Water Mark)
- La distribution équilibrée des messages (round-robin)
- Le filtrage des messages par pattern (pour les sockets Sub)
- La gestion des erreurs réseau

## Exemples d'utilisation

### Pattern Publish/Subscribe

```javascript
// Côté publisher
const axon = require('xcraft-axon');
const pub = axon.socket('pub');
pub.bind(3000);
pub.send('topic', 'message payload');

// Côté subscriber
const axon = require('xcraft-axon');
const sub = axon.socket('sub');
sub.connect(3000);
sub.on('message', function(topic, payload) {
  console.log('Received:', topic, payload);
});
```

### Pattern Request/Reply

```javascript
// Côté serveur (reply)
const axon = require('xcraft-axon');
const rep = axon.socket('rep');
rep.bind(4000);
rep.on('message', function(request, reply) {
  // Traitement de la requête
  reply('response to ' + request);
});

// Côté client (request)
const axon = require('xcraft-axon');
const req = axon.socket('req');
req.connect(4000);
req.send('request', function(response) {
  console.log('Got response:', response);
});
```

### Pattern Push/Pull (distribution de tâches)

```javascript
// Côté distributeur (push)
const axon = require('xcraft-axon');
const push = axon.socket('push');
push.bind(5000);
push.send({ task: 'process-data', data: {...} });

// Côté worker (pull)
const axon = require('xcraft-axon');
const pull = axon.socket('pull');
pull.connect(5000);
pull.on('message', function(task) {
  // Traitement de la tâche
  console.log('Processing task:', task);
});
```

## Interactions avec d'autres modules

xcraft-axon interagit principalement avec :

- **xcraft-amp** et **xcraft-amp-message** : Pour la sérialisation des messages
- **xcraft-core-transport** : Pour la gestion du cache et des patterns de routage
- **debug** : Pour la journalisation détaillée des opérations
- **fs-extra** : Pour la gestion des sockets Unix

Ce module est une composante fondamentale de l'infrastructure de communication de Xcraft, permettant aux différents services et composants de communiquer efficacement.

## Configuration avancée

Les sockets peuvent être configurés avec diverses options :

- **hwm** (High Water Mark) : Limite de la file d'attente des messages (défaut: Infinity)
- **identity** : Identifiant unique du socket (défaut: PID du processus)
- **retry timeout** : Délai avant tentative de reconnexion (défaut: 100ms)
- **retry max timeout** : Délai maximum entre les tentatives (défaut: 5000ms)
- **socket timeout** : Timeout des sockets (défaut: 0, pas de timeout)
- **disable zlib** : Désactive la compression des messages (défaut: false)
- **tls** : Options pour les connexions TLS sécurisées
- **tcp connect keep-alive** et **tcp onconnect keep-alive** : Configuration du keep-alive TCP

## Détails des sources

### `lib/index.js`

Exporte les différents types de sockets et fournit la fonction `socket()` pour créer une instance du type approprié.

### `lib/sockets/sock.js`

Implémente la classe de base `Socket` dont héritent tous les types de sockets. Gère les connexions TCP/TLS, les erreurs réseau, la compression/décompression et les événements de base.

### `lib/sockets/pub.js` et `lib/sockets/sub.js`

Implémentent le pattern publish/subscribe. Le `PubSocket` diffuse des messages à tous les abonnés connectés, tandis que le `SubSocket` filtre les messages entrants selon des patterns d'abonnement.

### `lib/sockets/push.js` et `lib/sockets/pull.js`

Implémentent le pattern push/pull pour la distribution de tâches. Le `PushSocket` distribue les messages en round-robin entre les workers connectés, tandis que le `PullSocket` reçoit les tâches à traiter.

### `lib/sockets/req.js` et `lib/sockets/rep.js`

Implémentent le pattern request/reply pour les communications RPC. Le `ReqSocket` envoie des requêtes et attend les réponses, tandis que le `RepSocket` traite les requêtes et renvoie des réponses.

### `lib/sockets/pub-emitter.js` et `lib/sockets/sub-emitter.js`

Fournissent une API orientée événements au-dessus des sockets pub/sub standard, permettant d'utiliser des patterns comme `emit()` et `on()`.

### `lib/plugins/queue.js`

Plugin qui ajoute une file d'attente aux sockets, permettant de mettre en buffer les messages lorsque les connexions ne sont pas disponibles.

### `lib/plugins/round-robin.js`

Plugin qui implémente la distribution round-robin des messages entre plusieurs connexions.

### `lib/perf-stream.js`

Stream de transformation qui mesure les performances des communications en enregistrant les timestamps des messages.

Ce module est une pièce essentielle de l'infrastructure de communication de Xcraft, fournissant des patterns de messagerie robustes et flexibles pour les applications distribuées.

*Cette documentation a été mise à jour en fonction du code source actuel.*