import { isJulian } from "./isJulian";

export function dateToJulianDay(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day =
    date.getDate() +
    date.getHours() / 24 +
    date.getMinutes() / 1440 +
    date.getSeconds() / 86400 +
    date.getMilliseconds() / 86400000;

  if (month < 3) {
    year--;
    month += 12;
  }

  let b = 0;
  if (!isJulian(date)) {
    const a = Math.floor(year / 100);
    b = 2 - a + Math.floor(a / 4);
  }

  return (
    Math.floor(365.25 * (year + 4716)) +
    Math.floor(30.6001 * (month + 1)) +
    day +
    b -
    1524.5
  );
}
