import { utcDate } from "./utcDate";

export function dateFromJulianDay(ajd: number): Date {
  const shiftedJulianDay = ajd + 0.5;

  const z = Math.floor(shiftedJulianDay);
  const f = shiftedJulianDay - z;

  // Always apply Gregorian correction for proleptic Gregorian calendar
  const alpha = Math.floor((z - 1867216.25) / 36524.25);
  const a = z + 1 + alpha - Math.floor(alpha / 4);

  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const dayDecimal = b - d - Math.floor(30.6001 * e) + f;

  const day = Math.floor(dayDecimal);
  const dayFraction = dayDecimal - day;

  const totalMilliseconds = Math.round(dayFraction * 86_400_000);

  const hrs = Math.floor(totalMilliseconds / 3_600_000);
  const min = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const sec = Math.floor((totalMilliseconds % 60_000) / 1_000);
  const msc = totalMilliseconds % 1_000;

  // JavaScript Date month is zero-based
  const month = e < 14 ? e - 2 : e - 14;
  const year = month < 2 ? c - 4715 : c - 4716;

  const result = new Date(Date.UTC(year, month, day, hrs, min, sec, msc));

  // Fix JS Date.UTC behavior for years 0..99
  result.setUTCFullYear(year);

  return result;
}
