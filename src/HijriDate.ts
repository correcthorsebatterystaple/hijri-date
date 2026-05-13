import { dateFromJulianDay } from "./utils/dateFromJulianDay";
import { dateToJulianDay } from "./utils/dateToJulianDay";
import { isJulian } from "./utils/isJulian";

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
 * The AJD value of 1948083.5 corresponds to July 25, 621 CE in the Gregorian calendar.
 */
const BASE_EPOCH_AJD = 1948083.5;

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
  }

  /**
   * Returns the number of days in a given month of a specific year in the Hijri calendar.
   * @param year - The Hijri year.
   * @param month - The Hijri month (0-11).
   * @returns The number of days in the specified month and year.
   */
  private static daysInMonth(year: number, month: number): number {
    if (month === 11 && HijriDate.isLeapYear(year)) return 30;
    return month % 2 === 0 ? 30 : 29;
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
    year += Math.floor(month / 12);
    month %= 12;
    let daysInMonth = HijriDate.daysInMonth(year, month);
    while (date > daysInMonth) {
      date -= daysInMonth;
      month += 1;
      year += Math.floor(month / 12);
      month %= 12;
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
    var year,
      month,
      date,
      i = 0,
      left = Math.floor(ajd - 1948083.5),
      y30 = Math.floor(left / 10631.0);

    left -= y30 * 10631;
    while (left > CUMULATIVE_YEAR_DAYS[i]) {
      i += 1;
    }

    year = Math.round(y30 * 30.0 + i);
    if (i > 0) {
      left -= CUMULATIVE_YEAR_DAYS[i - 1];
    }
    i = 0;
    while (left > CUMULATIVE_MONTH_DAYS[i]) {
      i += 1;
    }
    month = Math.round(i);
    date =
      i > 0
        ? Math.round(left - CUMULATIVE_MONTH_DAYS[i - 1])
        : Math.round(left);

    return new HijriDate(year, month, date);
  }

  /**
   * Converts the HijriDate instance to a Gregorian Date object.
   */
  toGregorian(): Date {
    return dateFromJulianDay(this.toJulianDayNumber());
  }

  /**
   * Converts the HijriDate instance to an astronomical Julian Day Number (AJD).
   */
  private toJulianDayNumber(): number {
    let dayOfYear = CUMULATIVE_MONTH_DAYS[this.month] + this.date;
    if (this.month === 0) dayOfYear = this.date;

    const y30 = Math.floor(this.year / YEARS_IN_CYCLE);

    let ajd = BASE_EPOCH_AJD + y30 * DAYS_IN_CYCLE + dayOfYear;
    if (this.year % 30 !== 0) {
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
    return KABISA_YEAR_REMAINDERS.includes(year % 30);
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
   * @param year - The new year to set (1-9999).
   * @returns The current HijriDate instance with the updated year.
   */
  setYear(year: number): HijriDate {
    this.year = year;
    return this;
  }

  getDate(): number {
    return this.date;
  }

  getMonth(): number {
    return this.month;
  }

  getYear(): number {
    return this.year;
  }

  getDay(): number {
    throw new Error("Method not implemented.");
  }
}
