import { isJulian } from "./isJulian";
import { utcDate } from "./utcDate";

export function dateToJulianDay(date: Date): number {
  date = utcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth() + 1;
  let day =
    date.getUTCDate() +
    date.getUTCHours() / 24 +
    date.getUTCMinutes() / 1440 +
    date.getUTCSeconds() / 86400 +
    date.getUTCMilliseconds() / 86400000;

  if (month < 3) {
    year--;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);

  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    b -
    1524.5
  );
}
