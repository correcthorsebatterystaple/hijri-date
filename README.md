# hijri-date

A lightweight JavaScript/TypeScript date library for the **Fatemid Islamic Tabular Calendar**.

## Installation

```bash
npm install hijri-date
```

```bash
pnpm add hijri-date
```

```bash
yarn add hijri-date
```

## Usage

```ts
import { HijriDate } from "hijri-date";
```

### Create a Hijri date

```ts
// month is zero-based: 0 = Muharram, 11 = Dhu al-Hijjah
const h = new HijriDate(1447, 10, 27);

console.log(h.getYear());  // 1447
console.log(h.getMonth()); // 10
console.log(h.getDate());  // 27
```

### Convert from Gregorian Date

```ts
const gregorian = new Date("2026-05-13T00:00:00Z");
const hijri = new HijriDate(gregorian);

console.log(hijri.getYear());  // 1447
console.log(hijri.getMonth()); // 10
console.log(hijri.getDate());  // 27
```

### Convert to Gregorian Date

```ts
const hijri = new HijriDate(1442, 9, 1);
const gregorian = hijri.toGregorian();

console.log(gregorian.toISOString()); // 2021-05-12T00:00:00.000Z
```

### Date arithmetic

```ts
const h = new HijriDate(1442, 9, 1);

h.addDays(10);
h.addWeeks(2);
h.addMonths(1);
h.addYears(1);

h.minusDays(5);
h.minusWeeks(1);
h.minusMonths(2);
h.minusYears(1);
```

### Mutating setters and normalization

Values are normalized automatically (overflow/underflow rolls across months and years):

```ts
const h = new HijriDate(1442, 12, 31);

console.log(h.getYear());  // 1443
console.log(h.getMonth()); // 1
console.log(h.getDate());  // 1
```

## API

`HijriDate` supports:

- Constructors:
  - `new HijriDate(year, month, date)`
  - `new HijriDate(date: Date)`
  - `new HijriDate(date: HijriDate)`
  - `new HijriDate()` (current date)
- Getters: `getYear()`, `getMonth()`, `getDate()`, `getDay()`
- Setters: `setYear()`, `setMonth()`, `setDate()`
- Conversion: `toGregorian()`
- Leap year: `isLeapYear()`
- Math: `addDays()`, `addWeeks()`, `addMonths()`, `addYears()`, `minusDays()`, `minusWeeks()`, `minusMonths()`, `minusYears()`

## License

MIT
