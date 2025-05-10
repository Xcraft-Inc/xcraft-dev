# 📘 Documentation du module xcraft-core-buslog

## Aperçu

Le module `xcraft-core-buslog` est un composant essentiel du framework Xcraft qui permet de rediriger les logs système vers le bus d'événements. Il sert de pont entre le système de journalisation (`xcraft-core-log`) et le bus de communication, permettant ainsi d'afficher les logs dans l'interface utilisateur ou de les traiter par d'autres composants du système.

## Structure du module

Le module est relativement simple et se compose principalement de :

- Une classe `BusLog` qui gère l'abonnement aux événements de log et leur redirection
- Des fonctions utilitaires pour gérer les modes de fonctionnement
- Un système de modes permettant d'activer/désactiver certaines fonctionnalités

## Fonctionnement global

1. Le module s'abonne aux différents niveaux de log (`verb`, `info`, `warn`, `err`, `dbg`) via le système de journalisation Xcraft
2. Lorsqu'un message de log est émis, il est intercepté et redirigé vers :
   - Le bus d'événements sous forme d'événement `widget.text.[niveau]` pour l'affichage dans l'interface
   - Le système de surveillance (`overwatch`) pour les erreurs et les messages spécifiquement marqués
3. Le module offre également une fonction de progression pour suivre l'avancement de tâches longues

## Exemples d'utilisation

### Initialisation du module

```javascript
const xLog = require('xcraft-core-log')('mon-module');
const resp = require('xcraft-core-transport')();
const busLog = require('xcraft-core-buslog')(xLog, resp);

// Maintenant les logs seront redirigés vers le bus d'événements
xLog.info("Message d'information");
xLog.err('Une erreur est survenue');
```

### Utilisation de la barre de progression

```javascript
const xLog = require('xcraft-core-log')('mon-module');
const resp = require('xcraft-core-transport')();
const busLog = require('xcraft-core-buslog')(xLog, resp);

// Afficher une progression dans l'interface
const totalItems = 100;
for (let i = 0; i < totalItems; i++) {
  busLog.progress('Traitement des données', i, totalItems);
  // Traitement...
}
```

### Configuration des modes

```javascript
const busLog = require('xcraft-core-buslog');

// Désactiver tous les modes
busLog.delModes(0);

// Activer uniquement le mode événement
busLog.addModes(busLog.modes.event);

// Activer tous les modes
busLog.addModes(0);
```

## Interactions avec d'autres modules

- **xcraft-core-log** : Source des messages de log à rediriger
- **xcraft-core-transport** : Utilisé pour envoyer les événements sur le bus
- **overwatch** : Reçoit les exceptions et erreurs pour surveillance
- **Widgets UI** : Reçoivent les événements `widget.text.*` et `widget.progress` pour affichage

## Détails des sources

### `index.js`

Ce fichier contient l'implémentation principale du module :

- **BusLog** : Classe principale qui gère l'abonnement aux logs et leur redirection

  - `_subscribe()` : S'abonne aux différents niveaux de log
  - `_unsubscribe()` : Se désabonne des événements de log
  - `log(mode, msg)` : Redirige un message de log vers le bus d'événements et/ou overwatch
  - `progress(topic, position, length)` : Envoie une information de progression sur le bus

- **Fonctions utilitaires** :

  - `addModes(modes)` : Active des modes spécifiques
  - `delModes(modes)` : Désactive des modes spécifiques
  - `getModes()` : Récupère les modes actuellement actifs

- **Constantes** :
  - `prefix` : Préfixe utilisé pour les événements (défini comme 'GreatHall')
  - `modesEnum` : Énumération des modes disponibles (event, overwatch)

### `eslint.config.js`

Ce fichier contient la configuration ESLint pour le module, définissant les règles de style de code et les plugins utilisés pour le développement.

## Modes de fonctionnement

Le module supporte deux modes principaux qui peuvent être combinés :

- **event** : Redirige les logs vers le bus d'événements pour affichage dans l'interface
- **overwatch** : Envoie les erreurs et exceptions au système de surveillance

Ces modes peuvent être activés/désactivés via les fonctions `addModes` et `delModes`.
