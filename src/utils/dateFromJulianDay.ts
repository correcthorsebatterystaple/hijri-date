export function dateFromJulianDay(ajd: number): Date {
  const z = Math.floor(ajd + 0.5);
  const f = ajd + 0.5 - z;

  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(0.25 * alpha);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e) + f;
  const hrs = (day - Math.floor(day)) * 24;
  const min = (hrs - Math.floor(hrs)) * 60;
  const sec = (min - Math.floor(min)) * 60;
  const msc = (sec - Math.floor(sec)) * 1000;
  const month = e < 14 ? e - 2 : e - 14;
  const year = month < 2 ? c - 4715 : c - 4716;

  return new Date(Date.UTC(year, month, day, hrs, min, sec, msc));
}
