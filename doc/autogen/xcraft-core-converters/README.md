# 📘 Documentation du module xcraft-core-converters

## Aperçu

Le module `xcraft-core-converters` est une bibliothèque complète de conversion de données pour l'écosystème Xcraft. Il fournit un ensemble de convertisseurs spécialisés permettant de transformer des valeurs entre leur format canonique (interne), leur format d'affichage (pour l'UI) et leur format d'édition (saisie utilisateur). Cette bibliothèque est essentielle pour assurer la cohérence des données à travers l'application.

## Structure du module

Le module est organisé en plusieurs convertisseurs spécialisés, chacun dédié à un type de données spécifique :

- **Types de base** : `bool`, `number`, `integer`, `double`, `percent`
- **Dates et temps** : `date`, `time`, `datetime`, `delay`, `calendar`
- **Mesures** : `price`, `weight`, `length`, `pixel`, `volume`
- **Périodes** : `month`, `dow` (jour de la semaine), `quarter`, `semester`, `year-week`, `year-month`, `year-quarter`, `year-semester`
- **Autres** : `color`, `reference`, `field-type-checker`

Chaque convertisseur expose généralement les fonctions suivantes :

- `check()` - Vérifie si une valeur est au format canonique valide
- `getDisplayed()` - Convertit une valeur canonique en format d'affichage
- `parseEdited()` - Analyse une valeur éditée et la convertit en format canonique

## Fonctionnement global

Le module fonctionne sur le principe de conversion bidirectionnelle entre trois formats principaux :

1. **Format canonique** : Le format interne utilisé pour stocker les données (ex: `2023-01-15` pour une date)
2. **Format d'affichage** : Le format lisible par l'utilisateur (ex: `15.01.2023` pour une date)
3. **Format d'édition** : Le format accepté lors de la saisie utilisateur (ex: `15 1 23` pour une date)

La fonction centrale `getConverter(type)` permet d'obtenir le convertisseur approprié pour un type donné.

## Exemples d'utilisation

### Conversion de date

```javascript
const DateConverters = require('xcraft-core-converters/lib/date.js');

// Vérifier si une valeur est une date canonique valide
DateConverters.check('2023-01-15'); // true

// Convertir une date canonique en format d'affichage
DateConverters.getDisplayed('2023-01-15'); // '15.01.2023'
DateConverters.getDisplayed('2023-01-15', 'dMy'); // '15 janvier 2023'

// Analyser une date éditée
const result = DateConverters.parseEdited('15 1 23');
console.log(result.value); // '2023-01-15'
console.log(result.error); // null

// Manipuler des dates
const nextMonth = DateConverters.addMonths('2023-01-15', 1); // '2023-02-15'
const lastWeek = DateConverters.addDays('2023-01-15', -7); // '2023-01-08'
```

### Conversion de prix

```javascript
const PriceConverters = require('xcraft-core-converters/lib/price.js');

// Convertir un prix canonique en format d'affichage
PriceConverters.getDisplayed('1234.5'); // "1 234.50"
PriceConverters.getDisplayed('1234567.89', 'p-1M'); // "1.23 M"

// Analyser un prix édité
const result = PriceConverters.parseEdited("1'234.5");
console.log(result.value); // '1234.5'
console.log(result.error); // null

// Incrémenter un prix édité
const incResult = PriceConverters.incEdited('54.1', 0, 1, 5, 0, 100);
console.log(incResult.edited); // '59.10'
```

### Conversion de couleur

```javascript
const ColorConverters = require('xcraft-core-converters/lib/color.js');

// Convertir une couleur en format RGB
ColorConverters.toRGB('HSL(120,100,100)'); // '#00FF00'
ColorConverters.toRGB('CMYK(100,0,100,0)'); // '#00FF00'

// Analyser une couleur éditée
const result = ColorConverters.parseEdited('rgb(0,128,255)');
console.log(result.value); // '#0080FF'

// Manipuler des couleurs
const darkRed = ColorConverters.changeColor('#FF0000', 0, 1, 0.5); // '#800000'
const blended = ColorConverters.slide('#224466', '#446688', 0.5); // '#335577'
```

### Utilisation du nouveau module calendar

```javascript
const CalendarConverters = require('xcraft-core-converters/lib/calendar.js');

// Convertir une date en format planner
const plannerDate = CalendarConverters.toPlannerDate('2023-01-15T12:00:00Z'); // '2023-01-15'

// Convertir une date avec fuseau horaire
const zonedDate = CalendarConverters.addTimezone('2023-01-15T12:00:00', 'Europe/Paris');
console.log(zonedDate); // '2023-01-15T12:00:00[Europe/Paris]'

// Obtenir la date actuelle avec fuseau horaire
const now = CalendarConverters.nowZonedDateTimeISO();
```

## Interactions avec d'autres modules

Ce module est utilisé par de nombreux composants de l'écosystème Xcraft, notamment :

- **[goblin-laboratory]** : Pour la conversion des données dans les widgets
- **[goblin-desktop]** : Pour l'affichage et l'édition des données dans l'interface utilisateur
- **[goblin-nabu]** : Pour l'internationalisation des valeurs affichées

## Configuration avancée

Le module ne nécessite pas de configuration particulière, mais certains convertisseurs acceptent des paramètres pour personnaliser leur comportement :

- Format d'affichage (par exemple, format court ou long pour les dates)
- Unités de mesure préférées (par exemple, kg ou g pour les poids)
- Valeurs minimales et maximales pour la validation

## Détails des sources

### `converters.js`

Ce fichier central expose la fonction `getConverter(type)` qui permet d'obtenir le convertisseur approprié pour un type donné. Il importe tous les convertisseurs spécifiques et les expose via un objet `typeConverters`.

### `bool.js`

Convertisseur pour les valeurs booléennes.

- `check(canonical)` : Vérifie si la valeur est un booléen
- `getDisplayed(canonicalBool, format)` : Convertit un booléen en "Oui"/"Non" ou "True"/"False" selon le format

### `calendar.js`

Nouveau convertisseur pour la gestion avancée des dates avec fuseaux horaires.

```javascript
// Exemple d'utilisation
const plainDate = CalendarConverters.plainDateISO(new Date()); // '2023-01-15'
const plainTime = CalendarConverters.plainTimeISO(new Date()); // '14:30:45.123'
const zonedDateTime = CalendarConverters.addTimezone('2023-01-15T14:30:00', 'Europe/Paris');
// zonedDateTime = '2023-01-15T14:30:00[Europe/Paris]'
```

### `color.js`

Convertisseur pour les couleurs, supportant les formats RGB, CMYK, HSL et niveaux de gris.

```javascript
// Exemple d'utilisation
const color = '#FF0000';
const luminance = ColorConverters.getLuminance(color); // 0.2126
const analysis = ColorConverters.analysisFromCanonical(color);
// analysis contient {mode: 'RGB', r: 255, g: 0, b: 0, c: 0, m: 100, y: 100, k: 0, h: 0, s: 100, l: 100, n: 67}
```

### `date.js`

Convertisseur pour les dates, avec de nombreuses fonctions de manipulation.

```javascript
// Exemple d'utilisation avancée
const today = DateConverters.getNowCanonical();
const endOfMonth = DateConverters.moveAtEndingOfMonth(today);
const periodDesc = DateConverters.getPeriodDescription(
  '2023-01-01',
  '2023-12-31'
); // '2023'
```

### `datetime.js`

Convertisseur pour les dates et heures combinées.

```javascript
// Exemple d'utilisation
const now = DateTimeConverters.getNowCanonical();
const displayed = DateTimeConverters.getDisplayed(now); // ex: '15.01.2023 14:30'
const delta = DateTimeConverters.getDisplayedDelta(
  '2023-01-15T12:00:00.000Z',
  now
); // ex: 'Il y a 2 heures'
```

### `delay.js`

Convertisseur pour les délais au format cron.

```javascript
// Exemple d'utilisation
const delay = '* * 4 * * * *';
const displayed = DelayConverters.getDisplayed(delay); // '4h'
const parsed = DelayConverters.parseEdited('4h');
// parsed.value = '* * 4 * * * *'
```

### `integer.js` et `number.js`

Convertisseurs pour les nombres entiers et à virgule flottante.

```javascript
// Exemple d'utilisation
const displayed = NumberConverters.getDisplayed(1234.567, 2); // "1'234.57"
const parsed = NumberConverters.parseEdited("1'234.5");
// parsed.value = 1234.5
```

### `length.js`, `pixel.js`, `volume.js`, `weight.js`

Convertisseurs pour différentes unités de mesure.

```javascript
// Exemple d'utilisation pour les longueurs
const meters = LengthConverters.convertLength('120', 'cm', 'm'); // '1.2'
const displayed = LengthConverters.getDisplayed('1.2', 'cm'); // '120cm'

// Exemple pour les volumes
const volume = VolumeConverters.getDisplayed('0.12 0.13 1.4', 'cm'); // '12 × 13 × 140 cm'
const iata = VolumeConverters.getDisplayedIATA('1 1 1', 5000, 'kg'); // '200kg'
```

### `price.js`

Convertisseur spécialisé pour les prix.

```javascript
// Exemple d'utilisation avancée
const sortable = PriceConverters.getSortable(1234.56); // '0000123456'
const formatted = PriceConverters.getDisplayed(1234567.89, 'p-1M'); // "1.23 M"
```

### `time.js`

Convertisseur pour les heures.

```javascript
// Exemple d'utilisation
const now = TimeConverters.getNowCanonical();
const later = TimeConverters.addHours(now, 2);
const period = TimeConverters.getPeriodDescription(now, later); // ex: '14:30 → 16:30'
```

### Autres convertisseurs

Le module inclut également des convertisseurs pour les périodes temporelles comme les jours de la semaine, mois, trimestres, etc.

```javascript
// Exemple pour les mois
const monthName = MonthConverters.getDisplayed(3, 'long'); // 'Mars'

// Exemple pour les trimestres
const quarterName = QuarterConverters.getDisplayed(2); // 'Q2'

// Exemple pour les années-semaines
const yearWeek = YearWeekConverters.getDisplayed('2023-15', 'short'); // '15.23'
```

_Cette documentation a été mise à jour automatiquement._

[goblin-laboratory]: https://github.com/Xcraft-Inc/goblin-laboratory
[goblin-desktop]: https://github.com/Xcraft-Inc/goblin-desktop
[goblin-nabu]: https://github.com/Xcraft-Inc/goblin-nabu