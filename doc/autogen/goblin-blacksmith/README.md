# 📘 Documentation du module goblin-blacksmith

## Aperçu

Le module `goblin-blacksmith` est un service de rendu backend pour les applications Xcraft. Il permet de générer des rendus HTML, CSS et PDF de composants React sans navigateur, en utilisant le rendu côté serveur. Ce module est particulièrement utile pour créer des exports statiques, des rapports PDF ou des prévisualisations de composants.

## Structure du module

- **Service principal** : Un goblin singleton qui gère les processus de rendu
- **Renderers** : Trois types de renderers supportés:
  - `component` : Pour le rendu de composants React individuels
  - `root` : Pour le rendu d'applications React complètes
  - `pdf` : Pour la génération de documents PDF
- **Child Process** : Le rendu s'effectue dans un processus Node.js séparé pour isoler l'environnement

## Fonctionnement global

1. Le service démarre un processus enfant dédié au rendu
2. Il utilise webpack pour construire un bundle spécifique au composant à rendre
3. Le processus enfant simule un environnement de navigateur (document, window, etc.)
4. Le rendu est effectué via React Server-Side Rendering et Aphrodite pour les styles
5. Le résultat (HTML/CSS ou PDF) est retourné au processus principal

Le module utilise un système de verrouillage pour éviter les conflits lors des rendus simultanés, ce qui est crucial pour maintenir la cohérence des sorties générées.

## Exemples d'utilisation

### Rendu d'un composant en HTML/CSS

```javascript
// Rendu d'un composant React en HTML et CSS
const {html, css} = await quest
  .create('blacksmith', {id: 'blacksmith@singleton'})
  .renderComponent({
    mainGoblin: 'laboratory',
    widgetPath: 'goblin-gadgets/widgets/button/widget',
    props: {text: 'Hello World', kind: 'primary'},
    labId: 'my-lab',
    state: {
      /* état Redux */
    },
  });

// Utilisation du HTML et CSS générés
console.log(html); // Markup HTML du bouton
console.log(css); // Styles CSS associés
```

### Génération d'un document PDF

```javascript
// Génération d'un document PDF
const result = await quest
  .create('blacksmith', {id: 'blacksmith@singleton'})
  .renderPDF({
    mainGoblin: 'laboratory',
    documentPath: 'goblin-documents/widgets/invoice/document',
    props: {invoiceId: '12345', customer: {name: 'ACME Corp'}},
    outputDir: '/path/to/output/directory',
  });
```

### Rendu d'un composant dans un fichier

```javascript
// Rendu d'un composant dans des fichiers HTML et CSS
const {htmlFilePath, cssFilePath} = await quest
  .create('blacksmith', {id: 'blacksmith@singleton'})
  .renderComponentToFile({
    mainGoblin: 'laboratory',
    widgetPath: 'goblin-gadgets/widgets/container/widget',
    props: {
      /* props du composant */
    },
    outputDir: '/path/to/output',
    outputName: 'my-component',
  });
```

## Interactions avec d'autres modules

- **[goblin-laboratory]** : Fournit le contexte React et les réducteurs Redux pour le rendu
- **[goblin-webpack]** : Utilisé pour construire les bundles des composants à rendre
- **[xcraft-core-etc]** : Gère la configuration du module
- **[xcraft-core-fs]** : Utilisé pour les opérations de fichiers
- **[xcraft-core-process]** : Gère les processus enfants pour le rendu
- **[xcraft-core-utils]** : Fournit les utilitaires de verrouillage pour éviter les conflits

## Configuration avancée

Le module peut être configuré via `xcraft-core-etc` avec les options suivantes:

- **outputDir** : Répertoire de sortie pour les rendus (par défaut: 'blacksmith')
- **renderers.component** : Liste des renderers de composants à construire
- **renderers.root** : Liste des renderers d'applications complètes à construire
- **renderers.pdf** : Liste des renderers PDF à construire

## Détails des sources

### `blacksmith.js`

Fichier principal qui expose les commandes Xcraft du module.

### `config.js`

Définit la configuration du module pour xcraft-core-etc, permettant de personnaliser les répertoires de sortie et les renderers disponibles.

### `eslint.config.js`

Configure ESLint pour le projet avec des règles spécifiques pour React, JSDoc et Babel, assurant la qualité et la cohérence du code.

### `lib/service.js`

Implémente le service goblin principal avec les quêtes suivantes:

- **startProcess** : Démarre un processus enfant pour le rendu
- **stopProcess** : Arrête un processus enfant
- **restartProcesses** : Redémarre tous les processus enfants
- **build** : Construit un bundle webpack pour un composant spécifique
- **renderComponent** : Effectue le rendu d'un composant React en HTML/CSS
- **renderPDF** : Génère un document PDF à partir d'un composant React
- **renderComponentToFile** : Effectue le rendu d'un composant et sauvegarde le résultat dans des fichiers

### `lib/child-renderer/index.js`

Point d'entrée du processus enfant qui reçoit les demandes de rendu et retourne les résultats.

### `lib/child-renderer/render.js`

Configure l'environnement global pour le rendu et expose la fonction `render` utilisée par le processus enfant.

### `lib/child-renderer/renderStatic.js`

Utilise Aphrodite et ReactDOMServer pour effectuer le rendu statique des composants React.

### `lib/child-renderer/setupGlobals.js`

Simule un environnement de navigateur en définissant des objets globaux comme `document`, `window` et `navigator`.

### `lib/child-renderer/store.js`

Configure le store Redux utilisé pour le rendu des composants qui nécessitent un état.

### `lib/child-renderer/renderers/component.js`

Renderer spécialisé pour les composants React individuels.

### `lib/child-renderer/renderers/root.js`

Renderer spécialisé pour les applications React complètes.

### `lib/child-renderer/renderers/pdf.js`

Renderer spécialisé pour la génération de documents PDF à l'aide de @react-pdf/renderer.

## Considérations techniques

- Le module utilise des verrous pour éviter les conflits lors des rendus simultanés
- Les processus enfants sont isolés pour éviter les fuites de mémoire
- Le module supporte le mode développement avec des options de débogage
- Les rendus PDF sont particulièrement gourmands en ressources et le processus est arrêté après chaque rendu

Ce module est essentiel pour les fonctionnalités d'export et d'impression dans les applications Xcraft, permettant de générer des représentations statiques de composants React sans nécessiter un navigateur.

_Cette documentation a été mise à jour automatiquement._

[goblin-laboratory]: https://github.com/Xcraft-Inc/goblin-laboratory
[goblin-webpack]: https://github.com/Xcraft-Inc/goblin-webpack
[xcraft-core-etc]: https://github.com/Xcraft-Inc/xcraft-core-etc
[xcraft-core-fs]: https://github.com/Xcraft-Inc/xcraft-core-fs
[xcraft-core-process]: https://github.com/Xcraft-Inc/xcraft-core-process
[xcraft-core-utils]: https://github.com/Xcraft-Inc/xcraft-core-utils
