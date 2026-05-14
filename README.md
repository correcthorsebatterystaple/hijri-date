# hijri-date-fatemi

A lightweight no dependency JavaScript/TypeScript date library for the **Fatemid Islamic Tabular Calendar**.

## Installation

```bash
npm install hijri-date-fatemi
```

```bash
pnpm add hijri-date-fatemi
```

```bash
yarn add hijri-date-fatemi
```

## Usage

```ts
import { HijriDate } from "hijri-date-fatemi";
```

### Create a Hijri date

```ts
// month is zero-based: 0 = Muharram, 11 = Dhu al-Hijjah
const h = new HijriDate(1447, 10, 27);

console.log(h.getYear()); // 1447
console.log(h.getMonth()); // 10
console.log(h.getDate()); // 27
```

### Convert from Gregorian Date

```ts
const gregorian = new Date("2026-05-13T00:00:00Z");
const hijri = new HijriDate(gregorian);

console.log(hijri.getYear()); // 1447
console.log(hijri.getMonth()); // 10
console.log(hijri.getDate()); // 27
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

### Compare Hijri dates with operators

`HijriDate` supports numeric comparison operators (`<`, `>`, `<=`, `>=`) through primitive conversion:

```ts
const a = new HijriDate(1447, 10, 27);
const b = new HijriDate(1447, 10, 28);

console.log(a < b); // true
console.log(a <= b); // true
console.log(b > a); // true
console.log(b >= a); // true
```

For equality, use `.equals()` to compare date values:

```ts
const x = new HijriDate(1447, 10, 27);
const y = new HijriDate(1447, 10, 27);

console.log(x.equals(y)); // true
console.log(x === y); // false (different instances)
```

### Mutating setters and normalization

Values are normalized automatically (overflow/underflow rolls across months and years):

```ts
const h = new HijriDate(1442, 11, 30); // Dhu al-Hijjah in a leap year

h.setMonth(12); // overflow month by 1 -> next year
console.log(h.getYear()); // 1443
console.log(h.getMonth()); // 0
console.log(h.getDate()); // 30

h.setDate(31); // overflow date by 1 in a 30-day month
console.log(h.getYear()); // 1443
console.log(h.getMonth()); // 1
console.log(h.getDate()); // 1
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
