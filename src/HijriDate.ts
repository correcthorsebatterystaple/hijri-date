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

  private static daysInMonth(year: number, month: number): number {
    if (month === 11 && HijriDate.isLeapYear(year)) return 30;
    return month % 2 === 0 ? 30 : 29;
  }

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

  private static fromGregorian(date: Date): HijriDate {
    return HijriDate.fromJulianDayNumber(dateToJulianDay(date));
  }

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

  private static isLeapYear(year: number): boolean {
    return KABISA_YEAR_REMAINDERS.includes(year % 30);
  }

  setDate(date: number): void {
    throw new Error("Method not implemented.");
  }

  setMonth(month: number): void {
    throw new Error("Method not implemented.");
  }

  setYear(year: number): void {
    throw new Error("Method not implemented.");
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
