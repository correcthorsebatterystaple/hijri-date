export function utcDate(
  year: number,
  month: number,
  date: number,
  hrs = 0,
  min = 0,
  sec = 0,
  msc = 0,
): Date {
  const result = new Date(Date.UTC(year, month, date, hrs, min, sec, msc));

  // Date.UTC remaps years 0..99 to 1900..1999; keep this helper correct for
  // tests that exercise the date conversion utilities directly.
  if (year >= 0 && year <= 99) result.setUTCFullYear(year);

  return result;
}
