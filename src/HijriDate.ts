import { dateFromJulianDay } from "./utils/dateFromJulianDay";
import { dateToJulianDay } from "./utils/dateToJulianDay";
import { findFirstIndexGreaterOrEqual } from "./utils/findFirstIndexGreaterOrEqual";
import { mod } from "./utils/mod";
import { tokenizeFormatStr } from "./utils/tokenizeFormatStr";

const KABISA_YEAR_REMAINDERS = [2, 5, 8, 10, 13, 16, 19, 21, 24, 27, 29];
/**
 * Cumulative days at the end of each month.
 */
const CUMULATIVE_MONTH_DAYS = [
  30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325,
];

/**
 * Cumulative days at the end of each year in a 30-year cycle.
 */
const CUMULATIVE_YEAR_DAYS = [
  354, 708, 1063, 1417, 1771, 2126, 2480, 2834, 3189, 3543, 3898, 4252, 4606,
  4961, 5315, 5669, 6024, 6378, 6732, 7087, 7441, 7796, 8150, 8504, 8859, 9213,
  9567, 9922, 10276, 10631,
];

/**
 * The base epoch for the Hijri calendar, represented as an Astronomical Julian Day (AJD).
 * The AJD value of 1948083.5 corresponds to July 25, 621 CE at midnight in the Gregorian calendar.
 */
const BASE_EPOCH_AJD = 1948083.5;

const BASE_EPOCH_DAY = 3;

/** Number of days in a 30 year cycle. */
const DAYS_IN_CYCLE = 10631;

/** Number of years in a cycle. */
const YEARS_IN_CYCLE = 30;

export class HijriDate {
  private year!: number;
  private month!: number;
  private date!: number;

  /**
   * Creates a new HijriDate instance.
   * Rolls over values that exceed their limits (e.g., month 12 becomes month 0 of the next year).
   * @param year - The Hijri year (1-9999).
   * @param month - The Hijri month (0-11).
   * @param date - The Hijri date (1-30).
   */
  constructor(year: number, month: number, date: number);
  /**
   * Creates a new HijriDate instance from a Gregorian Date object.
   * @param date - The Gregorian Date object to convert to Hijri.
   */
  constructor(date: Date);
  /**
   * Creates a new HijriDate instance by copying another HijriDate object.
   * @param date - The HijriDate object to copy.
   */
  constructor(date: HijriDate);
  /**
   * Creates a new HijriDate instance representing the current date.
   * If no arguments are provided, the constructor initializes the instance to the current date in the Hijri calendar.
   * This allows for easy creation of a HijriDate object that reflects the current date without needing to manually convert from the Gregorian calendar.
   */
  constructor();
  constructor(...args: unknown[]) {
    if (
      args.length === 3 &&
      typeof args[0] === "number" &&
      typeof args[1] === "number" &&
      typeof args[2] === "number"
    ) {
      const [year, month, date] = HijriDate.normalise(
        args[0],
        args[1],
        args[2],
      );

      this.year = year;
      this.month = month;
      this.date = date;
      return this;
    }

    if (args.length === 1 && args[0] instanceof Date) {
      return HijriDate.fromGregorian(args[0]);
    }

    if (args.length === 1 && args[0] instanceof HijriDate) {
      const date = args[0];
      return new HijriDate(date.year, date.month, date.date);
    }

    if (args.length === 0) {
      const date = new Date();
      return HijriDate.fromGregorian(date);
    }

    throw new Error("Invalid constructor arguments");
  }

  /**
   * Returns the number of days in a given month of a specific year in the Hijri calendar.
   * @param year - The Hijri year.
   * @param month - The Hijri month (0-11).
   * @returns The number of days in the specified month and year.
   */
  private static daysInMonth(year: number, month: number): number {
    if (month === 11 && HijriDate.isLeapYear(year)) return 30;
    return mod(month, 2) === 0 ? 30 : 29;
  }

  /**
   * Normalizes the year, month, and date values to ensure they are within valid ranges.
   * For example, if the month value exceeds 11, it rolls over to the next year.
   * If the date value exceeds the number of days in the month, it rolls over to the next month.
   * @param year - The Hijri year.
   * @param month - The Hijri month (0-11).
   * @param date - The Hijri date (1-30).
   * @returns A tuple containing the normalized year, month, and date.
   */
  private static normalise(
    year: number,
    month: number,
    date: number,
  ): [year: number, month: number, date: number] {
    let absoluteMonth = year * 12 + month;

    year = Math.floor(absoluteMonth / 12);
    month = mod(absoluteMonth, 12);

    while (date <= 0) {
      absoluteMonth -= 1;

      year = Math.floor(absoluteMonth / 12);
      month = mod(absoluteMonth, 12);

      date += HijriDate.daysInMonth(year, month);
    }

    let daysInMonth = HijriDate.daysInMonth(year, month);

    while (date > daysInMonth) {
      date -= daysInMonth;

      absoluteMonth += 1;

      year = Math.floor(absoluteMonth / 12);
      month = mod(absoluteMonth, 12);

      daysInMonth = HijriDate.daysInMonth(year, month);
    }

    return [year, month, date];
  }

  /**
   * Creates a new HijriDate instance from a Gregorian Date object.
   * @param date - The Gregorian Date object to convert to Hijri.
   * @returns A new HijriDate instance representing the equivalent date in the Hijri calendar.
   */
  private static fromGregorian(date: Date): HijriDate {
    return HijriDate.fromJulianDayNumber(dateToJulianDay(date));
  }

  /**
   * Creates a new HijriDate instance from an astronomical Julian Day Number (AJD).
   * @param ajd - The astronomical Julian Day Number to convert to a Hijri date.
   * @returns A new HijriDate instance representing the equivalent date in the Hijri calendar.
   */
  private static fromJulianDayNumber(ajd: number): HijriDate {
    let daysSinceEpoch = Math.floor(ajd - BASE_EPOCH_AJD);

    const completedThirtyYearCycles = Math.floor(
      daysSinceEpoch / DAYS_IN_CYCLE,
    );

    daysSinceEpoch -= completedThirtyYearCycles * DAYS_IN_CYCLE;

    const yearIndex = findFirstIndexGreaterOrEqual(
      CUMULATIVE_YEAR_DAYS,
      daysSinceEpoch,
    );

    const year = completedThirtyYearCycles * 30 + yearIndex;

    const dayOfYear =
      yearIndex > 0
        ? daysSinceEpoch - CUMULATIVE_YEAR_DAYS[yearIndex - 1]
        : daysSinceEpoch;

    const monthIndex = findFirstIndexGreaterOrEqual(
      CUMULATIVE_MONTH_DAYS,
      dayOfYear,
    );

    const month = monthIndex;

    const dayOfMonth =
      monthIndex > 0
        ? dayOfYear - CUMULATIVE_MONTH_DAYS[monthIndex - 1]
        : dayOfYear;

    return new HijriDate(year, month, dayOfMonth);
  }

  static SHORT_MONTH_NAMES = [
    "Moh",
    "Saf",
    "Rab-I",
    "Rab-II",
    "Jum-I",
    "Jum-II",
    "Raj",
    "Shab",
    "Ram",
    "Shaw",
    "Zil-Q",
    "Zil-H",
  ];

  static MONTH_NAMES = [
    "Moharram",
    "Safar",
    "Rabi I",
    "Rabi II",
    "Jumada I",
    "Jumada II",
    "Rajab",
    "Shaban",
    "Ramadan",
    "Shawwal",
    "Zil Qaad",
    "Zil Haj",
  ];

  static LONG_MONTH_NAMES = [
    "Shehre Moharram Al Haram",
    "Safar Al Muzaffar",
    "Rabi Al Awwal",
    "Rabi Al Aakhar",
    "Jumada Al Ula",
    "Jumada Al Ukhra",
    "Shere Rajab Al Asab",
    "Shaban Al Karim",
    "Shehre Ramadan Al Moazzam",
    "Shawwal Al Mukarram",
    "Zil Qa'dat Al Haraam",
    "Zil Hijjat Al Haraam",
  ];

  static SHORT_DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  static DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  /**
   * Formats a HijriDate instance into a string based on the provided format string.
   * The format string can contain the following tokens:
   * - "y": Year (1-4 digits)
   * - "m": Month (1-4 digits or month names)
   * - "d": Day (1-4 digits or day names)
   * - Any other characters in the format string are treated as literals and included in the output as-is.
   * For example, the format string "yyyy-mm-dd" would produce a date string in the format "1447-01-01", while the format string "dd mmm yyyy" would produce a date string like "01 Moh 2024".
   * @param formatStr - The format string specifying how to format the date.
   * @param date - The HijriDate instance to format.
   * @returns A string representation of the HijriDate instance formatted according to the provided format string.
   */
  static format(formatStr: string, date: HijriDate): string {
    const tokens = tokenizeFormatStr(formatStr);

    const parts: { [key: string]: { [length: number]: string } } = {
      year: {
        1: date.year.toString(),
        2: (date.year % 100).toString().padStart(2, "0"),
        4: date.year.toString().padStart(4, "0"),
      },
      month: {
        1: (date.month + 1).toString(),
        2: (date.month + 1).toString().padStart(2, "0"),
        3: HijriDate.SHORT_MONTH_NAMES[date.month],
        4: HijriDate.MONTH_NAMES[date.month],
        5: HijriDate.LONG_MONTH_NAMES[date.month],
      },
      day: {
        1: date.date.toString(),
        2: date.date.toString().padStart(2, "0"),
        3: HijriDate.SHORT_DAY_NAMES[date.getDay()],
        4: HijriDate.DAY_NAMES[date.getDay()],
      },
    };

    const dateStr = tokens
      .map((token) => {
        switch (token.type) {
          case "literal":
            return token.value;
          case "year":
            return parts.year[token.length];
          case "month":
            return parts[token.type][token.length];
          case "day":
            return parts[token.type][token.length];
        }
      })
      .filter((part): part is string => typeof part === "string")
      .join("");

    return dateStr;
  }

  format(formatStr: string): string {
    return HijriDate.format(formatStr, this);
  }

  /**
   * Converts the HijriDate instance to a Gregorian Date object.
   */
  toGregorian(): Date {
    const ajd = this.toJulianDayNumber();
    return dateFromJulianDay(ajd);
  }

  private dayOfYear(): number {
    if (this.month === 0) return this.date;
    return CUMULATIVE_MONTH_DAYS[this.month - 1] + this.date;
  }

  /**
   * Converts the HijriDate instance to an astronomical Julian Day Number (AJD).
   */
  private toJulianDayNumber(): number {
    const y30 = Math.floor(this.year / YEARS_IN_CYCLE);

    let ajd = BASE_EPOCH_AJD + y30 * DAYS_IN_CYCLE + this.dayOfYear();
    if (mod(this.year, 30) !== 0) {
      ajd += CUMULATIVE_YEAR_DAYS[this.year - y30 * 30 - 1];
    }
    return ajd;
  }

  /**
   * Determines if a given year in the Hijri calendar is a leap year.
   * @param year - The Hijri year to check.
   * @returns True if the year is a leap year, false otherwise.
   */
  private static isLeapYear(year: number): boolean {
    return KABISA_YEAR_REMAINDERS.includes(mod(year, 30));
  }

  /**
   * Determines if the year of the current HijriDate instance is a leap year.
   * @returns True if the year is a leap year, false otherwise.
   */
  isLeapYear(): boolean {
    return HijriDate.isLeapYear(this.year);
  }

  /**
   * Sets the date of the current HijriDate instance, normalizing the month and year if necessary.
   * If the provided date exceeds the number of days in the current month, it rolls over to the next month.
   * @param date_ - The new date to set (1-30).
   * @returns The current HijriDate instance with the updated date.
   */
  setDate(date_: number): HijriDate {
    const [year, month, date] = HijriDate.normalise(
      this.year,
      this.month,
      date_,
    );

    this.year = year;
    this.month = month;
    this.date = date;

    return this;
  }

  /**
   * Sets the month of the current HijriDate instance, normalizing the year if necessary.
   * If the provided month exceeds 11, it rolls over to the next year.
   * @param month_ - The new month to set (0-11).
   * @returns The current HijriDate instance with the updated month.
   */
  setMonth(month_: number): HijriDate {
    const [year, month, date] = HijriDate.normalise(
      this.year,
      month_,
      this.date,
    );

    this.year = year;
    this.month = month;
    this.date = date;

    return this;
  }

  /**
   * Sets the year of the current HijriDate instance.
   * @param year - The new year to set.
   * @returns The current HijriDate instance with the updated year.
   */
  setYear(year_: number): HijriDate {
    const [year, month, date] = HijriDate.normalise(
      year_,
      this.month,
      this.date,
    );

    this.year = year;
    this.month = month;
    this.date = date;

    return this;
  }

  /**
   * Gets the date of the current HijriDate instance.
   * @returns The date (day of the month) of the current Hijri date.
   */
  getDate(): number {
    return this.date;
  }

  /**
   * Gets the month of the current HijriDate instance.
   * @returns The month of the current Hijri date (0-11).
   */
  getMonth(): number {
    return this.month;
  }

  /**
   * Gets the year of the current HijriDate instance.
   * @returns The year of the current Hijri date.
   */
  getYear(): number {
    return this.year;
  }

  /**
   * Calculates the day of the week for the current HijriDate instance.
   * Ranges from 0 (Sunday) to 6 (Saturday).
   * @returns The day of the week corresponding to the current Hijri date.
   */
  getDay(): number {
    const ajd = this.toJulianDayNumber();
    return mod(Math.floor(ajd + 1.5), 7);
  }

  /**
   * Adds a specified number of days to the current HijriDate instance
   * @param days - The number of days to add.
   * @returns The current HijriDate instance with the updated date.
   */
  addDays(days: number): HijriDate {
    return this.setDate(this.date + days);
  }

  /**
   * Adds a specified number of weeks to the current HijriDate instance
   * @param weeks - The number of weeks to add.
   * @returns The current HijriDate instance with the updated date.
   */
  addWeeks(weeks: number): HijriDate {
    return this.setDate(this.date + weeks * 7);
  }

  /**
   * Adds a specified number of months to the current HijriDate instance
   * @param months - The number of months to add.
   * @returns The current HijriDate instance with the updated date
   */
  addMonths(months: number): HijriDate {
    return this.setMonth(this.month + months);
  }

  /**
   * Adds a specified number of years to the current HijriDate instance
   * @param years - The number of years to add.
   * @returns The current HijriDate instance with the updated date
   */
  addYears(years: number): HijriDate {
    return this.setYear(this.year + years);
  }

  /**
   * Subtracts a specified number of days from the current HijriDate instance
   * @param days - The number of days to subtract.
   * @returns The current HijriDate instance with the updated date.
   */
  minusDays(days: number): HijriDate {
    return this.setDate(this.date - days);
  }

  /**
   * Subtracts a specified number of weeks from the current HijriDate instance
   * @param weeks - The number of weeks to subtract.
   * @returns The current HijriDate instance with the updated date.
   */
  minusWeeks(weeks: number): HijriDate {
    return this.setDate(this.date - weeks * 7);
  }

  /**
   * Subtracts a specified number of months from the current HijriDate instance
   * @param months - The number of months to subtract.
   * @returns The current HijriDate instance with the updated date
   */
  minusMonths(months: number): HijriDate {
    return this.setMonth(this.month - months);
  }

  /**
   * Subtracts a specified number of years from the current HijriDate instance
   * @param years - The number of years to subtract.
   * @returns The current HijriDate instance with the updated date
   */
  minusYears(years: number): HijriDate {
    return this.setYear(this.year - years);
  }

  /**
   * Determines if the current HijriDate instance is equal to another HijriDate instance.
   * Two HijriDate instances are considered equal if they have the same year, month, and date.
   * @param other - The other HijriDate instance to compare with.
   * @returns True if the two HijriDate instances are equal, false otherwise.
   */
  equals(other: unknown): boolean {
    return (
      other instanceof HijriDate &&
      this.year === other.year &&
      this.month === other.month &&
      this.date === other.date
    );
  }

  /**
   * Returns a string representation of the current HijriDate instance in the format "YYYY-MM-DD".
   */
  toString(): string {
    const dateStr = this.date.toString().padStart(2, "0");
    const monthStr = (this.month + 1).toString().padStart(2, "0");
    const yearStr = this.year.toString().padStart(4, "0");

    return `${yearStr}-${monthStr}-${dateStr}`;
  }

  /**
   * Returns the astronomical Julian Day Number (AJD) representation of the current HijriDate instance.
   * This allows for easy comparison and arithmetic operations with other date representations.
   */
  valueOf(): number {
    return this.toJulianDayNumber();
  }

  /**
   * Defines how the HijriDate instance should be converted to a primitive value (number or string) based on the context in which it is used.
   */
  [Symbol.toPrimitive](hint: string): number | string {
    if (hint === "number") {
      return this.valueOf();
    }

    return this.toString();
  }

  /**
   * Returns the number of  days in the month of the current HijriDate instance.
   * This is useful for validating date inputs and performing date calculations that depend on the length of the month.
   * @returns The number of days in the month of the current HijriDate instance.
   */
  daysInMonth(): number {
    return HijriDate.daysInMonth(this.year, this.month);
  }

  /**
   * Returns the start and end dates of the week for the current HijriDate instance.
   * @returns A tuple containing the start and end dates of the week, where the start date is the Sunday of that week and the end date is the Saturday of that week.
   */
  getWeekBoundaries(): [start: HijriDate, end: HijriDate] {
    const dayOfWeek = this.getDay();
    const start = new HijriDate(this).minusDays(dayOfWeek);
    const end = new HijriDate(this).addDays(6 - dayOfWeek);

    return [start, end];
  }

  /**
   * Returns the start and end dates of the month for the current HijriDate instance.
   * @returns A tuple containing the start and end dates of the month, where the start date is the first day of the month and the end date is the last day of the month.
   */
  getMonthBoundaries(): [start: HijriDate, end: HijriDate] {
    const start = new HijriDate(this.year, this.month, 1);
    const end = new HijriDate(this.year, this.month, this.daysInMonth());

    return [start, end];
  }

  /**
   * Calculates the difference in days between the current HijriDate instance and another HijriDate instance.
   * @param other - The other HijriDate instance to compare with.
   * @returns The number of days between the two HijriDate instances. A positive value indicates that the current instance is later than the other instance, while a negative value indicates that it is earlier.
   */
  diff(other: HijriDate): number {
    return this.valueOf() - other.valueOf();
  }

  /**
   * Creates a new HijriDate instance that is a copy of the current instance.
   * This is useful for creating a new date object that can be modified without affecting the original instance.
   * @returns A new HijriDate instance with the same year, month, and date as the current instance.
   */
  clone(): HijriDate {
    return new HijriDate(this);
  }
}
