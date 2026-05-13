/**
 * Determines if a given date falls under the Julian calendar.
 * The switch from the Julian to the Gregorian calendar occurred on October 4, 1582.
 */
export function isJulian(date: Date): boolean {
  const switchYear = 1582;
  const switchMonth = 9;
  const switchDay = 5;

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const isBeforeSwitchDate =
    year < switchYear ||
    (year === switchYear && month < switchMonth) ||
    (year === switchYear && month === switchMonth && day < switchDay);

  return isBeforeSwitchDate;
}
