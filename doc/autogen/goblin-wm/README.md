# 📘 Documentation du module goblin-wm

## Aperçu

Le module `goblin-wm` est un gestionnaire de fenêtres pour Electron dans l'écosystème Xcraft. Il permet de créer, gérer et manipuler des fenêtres d'application, tout en facilitant la communication entre le backend Node.js et le frontend Electron via différents canaux (WebSocket ou IPC).

## Structure du module

- **Service principal** : Gère la création et le cycle de vie des fenêtres
- **Canaux de communication** : Supporte deux modes de communication (WebSocket et IPC)
- **Gestion d'état** : Synchronise l'état entre le backend et le frontend
- **Gestion des événements** : Traite les événements de fenêtre et les raccourcis clavier

## Fonctionnement global

Le module `goblin-wm` crée des fenêtres Electron et établit un canal de communication bidirectionnel entre le backend Node.js et le frontend Electron. Il permet de :

1. Créer des fenêtres avec des options personnalisées
2. Gérer l'état des fenêtres (position, taille, maximisation, etc.)
3. Synchroniser les données entre le backend et le frontend via des flux (feeds)
4. Dispatcher des actions vers le frontend
5. Exécuter des commandes du frontend vers le backend
6. Gérer les raccourcis clavier et les événements de fenêtre

## Exemples d'utilisation

### Création d'une fenêtre

```javascript
const wmAPI = await new Elf.Alone(this);
const windowId = await wmAPI.create({
  desktopId: 'desktop@main',
  labId: 'lab@main',
  feeds: ['desktop', 'laboratory'],
  clientSessionId: 'session@123',
  userId: 'user@123',
  url: 'file://app/index.html',
  options: {
    width: 800,
    height: 600,
    title: 'Mon Application',
    frame: false
  }
});
```

### Navigation dans une fenêtre

```javascript
const wmAPI = new Elf.Alone(this);
await wmAPI.nav({route: '/dashboard'});
```

### Envoi d'une action au frontend

```javascript
const wmAPI = new Elf.Alone(this);
await wmAPI.dispatch({
  type: 'SET_THEME',
  theme: 'dark'
});
```

## Interactions avec d'autres modules

- **xcraft-core-host** : Utilise les fonctionnalités de base pour la gestion des fenêtres
- **xcraft-core-transport** : Gère la communication entre le backend et le frontend
- **xcraft-core-goblin** : Fournit l'infrastructure pour les services Goblin
- **goblin-laboratory** : Fournit les canaux de communication (WebSocketChannel, ElectronChannel)
- **xcraft-core-busclient** : Permet la communication entre les différents services

## Configuration avancée

Le module peut être configuré via le fichier `config.js` avec les options suivantes :

- **windowOptions** : Options par défaut pour les fenêtres Electron
- **splashWindowOptions** : Options pour l'écran de démarrage
- **vibrancyOptions** : Options pour les effets de transparence
- **titlebar** : Nom du widget de barre de titre personnalisée
- **disableSplash** : Désactive l'écran de démarrage
- **splashDelay** : Délai à appliquer après l'apparition de la première fenêtre
- **closable** : Contrôle si les fenêtres peuvent être fermées

## Détails des sources

### `service.js`

Ce fichier contient l'implémentation principale du service de gestion des fenêtres. Il définit toutes les quêtes (commandes) disponibles pour créer et manipuler les fenêtres Electron.

Les principales fonctionnalités incluent :
- Création de fenêtres avec des options personnalisées
- Gestion de l'état des fenêtres (position, taille, etc.)
- Communication bidirectionnelle entre le backend et le frontend
- Gestion des événements de fenêtre (redimensionnement, déplacement, etc.)
- Gestion des raccourcis clavier
- Support pour les modes de communication IPC et WebSocket

### `wm.js`

Fichier principal qui exporte les commandes Xcraft du module.

### `config.js`

Définit les options de configuration disponibles pour le module, notamment :
- Options pour les fenêtres Electron
- Configuration de l'écran de démarrage
- Options pour la barre de titre personnalisée
- Paramètres de comportement des fenêtres

## Fonctionnalités avancées

### Gestion des raccourcis clavier

```javascript
await wmAPI.addShortcuts([
  {
    keys: 'Ctrl+F',
    action: 'search-requested'  // Émet un événement
  },
  {
    keys: 'Ctrl+S',
    action: {
      goblinId: 'document@main',
      questName: 'save',
      args: {force: true}
    }
  }
]);
```

### Capture d'écran et impression PDF

```javascript
// Capture d'écran
const image = await wmAPI.capturePage({
  x: 0,
  y: 0,
  width: 800,
  height: 600
});

// Impression en PDF
const pdfData = await wmAPI.printToPdf({
  marginsType: 0,
  printBackground: true,
  landscape: false
});
```

### Intégration avec le système d'exploitation

```javascript
// Intégration avec la barre des tâches Windows
await wmAPI.tryAdaptTaskbarToMonolithEnvironment({
  appUserModelID: 'com.example.app',
  appDisplayName: 'Mon Application',
  unpinnable: false
});

// Création d'une icône dans la zone de notification
await wmAPI.setTray({
  title: 'Mon Application',
  tooltip: 'Cliquez pour ouvrir',
  iconPath: '/path/to/icon.png',
  menu: [
    {label: 'Ouvrir', eventName: 'open'},
    {label: 'Quitter', eventName: 'quit'}
  ]
});
```

---

*Ce document est une mise à jour de la documentation du module goblin-wm.*