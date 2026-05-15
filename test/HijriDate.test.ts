import { test, expect, describe, jest, beforeAll } from "@jest/globals";
import { HijriDate } from "../src/HijriDate";
import { utcDate } from "../src/utils/utcDate";

describe("HijriDate constructors", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-13T00:00:00Z"));
  });

  test("initialization with year, month, date returns the hijri date", () => {
    const date = new HijriDate(1442, 9, 1);

    expect(date.getYear()).toBe(1442);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(1);
  });

  test("initialization with overflowing date and month into next year", () => {
    const date = new HijriDate(1442, 12, 31);
    expect(date.getYear()).toBe(1443);
    expect(date.getMonth()).toBe(1);
    expect(date.getDate()).toBe(1);
  });

  test("initialization with overflowing date into 2 months", () => {
    const date = new HijriDate(1442, 9, 60);

    expect(date.getYear()).toBe(1442);
    expect(date.getMonth()).toBe(11);
    expect(date.getDate()).toBe(1);
  });

  test("initialization with Date object", () => {
    const date = new Date("2026-05-13T00:00:00Z");

    const hijriDate = new HijriDate(date);

    expect(hijriDate.getYear()).toBe(1447);
    expect(hijriDate.getMonth()).toBe(10);
    expect(hijriDate.getDate()).toBe(27);
  });

  test("from Gregorian accepts the same proleptic Gregorian epoch date that toGregorian emits", () => {
    const epoch = new HijriDate(utcDate(622, 6, 18));

    expect(epoch.getYear()).toBe(1);
    expect(epoch.getMonth()).toBe(0);
    expect(epoch.getDate()).toBe(1);
  });

  test("initialization with other HijriDate object clones the other object", () => {
    const date1 = new HijriDate(1442, 9, 1);
    const date2 = new HijriDate(date1);

    expect(date2.getYear()).toBe(1442);
    expect(date2.getMonth()).toBe(9);
    expect(date2.getDate()).toBe(1);
  });

  test("initialization with HijriDate creates cloned object", () => {
    const date1 = new HijriDate(1442, 9, 1);
    const date2 = new HijriDate(date1);

    date1.setYear(1443);

    expect(date2.getYear()).toBe(1442);
  });

  test("initialization with no arguments returns current date", () => {
    const date = new HijriDate();

    expect(date.getYear()).toBe(1447);
    expect(date.getMonth()).toBe(10);
    expect(date.getDate()).toBe(27);
  });

  test("initialization with invalid arguments throws an error", () => {
    expect(() => new HijriDate(1442 as any)).toThrow();
    expect(() => new HijriDate("invalid" as any)).toThrow();
    expect(() => new HijriDate({} as any)).toThrow();
    expect(() => new HijriDate(null as any)).toThrow();
    expect(() => new HijriDate(undefined as any)).toThrow();
    expect(() => new HijriDate("1442" as any, -1, 1)).toThrow();
  });
});

describe("HijriDate setters", () => {
  test("setYear updates the year correctly", () => {
    const date = new HijriDate(1442, 9, 1);
    date.setYear(1443);
    expect(date.getYear()).toBe(1443);
  });

  test("setDate updates the date correctly and normalizes month and year", () => {
    const date = new HijriDate(1442, 8, 30);
    date.setDate(31);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(1);
  });

  test("setDate with large date normalizes month and year correctly", () => {
    const date = new HijriDate(1442, 10, 30);
    date.setDate(61);
    expect(date.getYear()).toBe(1443);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(1);
  });

  test("setMonth updates the month correctly and normalizes date", () => {
    const date = new HijriDate(1442, 8, 30);
    date.setMonth(9);
    expect(date.getMonth()).toBe(10);
    expect(date.getDate()).toBe(1);
  });

  test("setMonth with large month normalizes year correctly", () => {
    const date = new HijriDate(1442, 0, 30);
    date.setMonth(24);
    expect(date.getYear()).toBe(1444);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(30);
  });

  test("setMonth with negative month normalizes year and month correctly", () => {
    const date = new HijriDate(1442, 0, 1);
    date.setMonth(-1);

    expect(date.getYear()).toBe(1441);
    expect(date.getMonth()).toBe(11);
    expect(date.getDate()).toBe(1);
  });

  test("setMonth with negative month on leap year normalizes date correctly", () => {
    const date = new HijriDate(1442, 0, 30);
    date.setMonth(-1);

    expect(date.getYear()).toBe(1442);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(1);
  });

  test("setDate with negative date normalizes date, month, and year correctly", () => {
    const date = new HijriDate(1442, 0, 1);
    date.setDate(-1);

    expect(date.getYear()).toBe(1441);
    expect(date.getMonth()).toBe(11);
    expect(date.getDate()).toBe(28);
  });

  test("setYear normalizes a leap day when the target year is not a leap year", () => {
    const date = new HijriDate(1442, 11, 30);
    date.setYear(1443);

    expect(date.equals(new HijriDate(1443, 11, 30))).toBeTruthy();
  });

  test("large negative setDate normalizes date, month, and year correctly", () => {
    const date = new HijriDate(1442, 0, 1);
    date.setDate(-400);

    const expected = new HijriDate(1440, 10, 13);

    expect(date.equals(expected)).toBeTruthy();
  });
});

describe("HijriDate getters", () => {
  test("getYear returns the correct year", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.getYear()).toBe(1442);
  });

  test("getMonth returns the correct month", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.getMonth()).toBe(9);
  });

  test("getDate returns the correct date", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.getDate()).toBe(1);
  });

  test("getDay returns the correct day of the week", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.getDay()).toBe(3);
  });

  test("getDay returns correct day of the week for leap day", () => {
    const date = new HijriDate(1442, 11, 30);
    expect(date.getDay()).toBe(0);
  });

  test("getDay agrees with the weekday of the Date returned by toGregorian", () => {
    const dates = [
      new HijriDate(1, 0, 1),
      new HijriDate(990, 8, 17),
      new HijriDate(1442, 9, 1),
    ];

    for (const hijri of dates) {
      expect(hijri.getDay()).toBe(hijri.toGregorian().getUTCDay());
    }
  });

  test("getYear returns the correct year", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.getYear()).toBe(1442);
  });

  test("getMonth returns the correct month", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.getMonth()).toBe(9);
  });

  test("getDate returns the correct date", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.getDate()).toBe(1);
  });
});

describe("HijriDate toGregorian", () => {
  test("toGregorian converts Hijri date to correct Gregorian date", () => {
    const date = new HijriDate(1442, 9, 1);
    const gregorianDate = date.toGregorian();

    expect(gregorianDate.getUTCFullYear()).toBe(2021);
    expect(gregorianDate.getUTCMonth()).toBe(4);
    expect(gregorianDate.getUTCDate()).toBe(12);
  });

  test("toGregorian converts leap day to correct Gregorian date", () => {
    const date = new HijriDate(1442, 11, 30);
    const gregorianDate = date.toGregorian();

    expect(gregorianDate.getUTCFullYear()).toBe(2021);
    expect(gregorianDate.getUTCMonth()).toBe(7);
    expect(gregorianDate.getUTCDate()).toBe(8);
  });

  test("toGregorian returns a proleptic Gregorian JS Date for the Fatimid astronomical epoch", () => {
    const epoch = new HijriDate(1, 0, 1).toGregorian();

    // 1 Muharram 1 AH in the astronomical/Thursday epoch is 15 July 622 Julian,
    // which is 18 July 622 in the proleptic Gregorian calendar used by JS Date.
    expect(epoch.getUTCFullYear()).toBe(622);
    expect(epoch.getUTCMonth()).toBe(6);
    expect(epoch.getUTCDate()).toBe(18);
  });

  test("consecutive Hijri days remain one JS day apart across the Gregorian reform", () => {
    const beforeReform = new HijriDate(990, 8, 17).toGregorian();
    const afterReform = new HijriDate(990, 8, 18).toGregorian();

    const daysBetween =
      (afterReform.getTime() - beforeReform.getTime()) / 86_400_000;

    expect(daysBetween).toBe(1);
  });

  test("round-tripping a date through toGregorian and the constructor results in the same date", () => {
    const original = new HijriDate(1442, 11, 30);
    const roundTripped = new HijriDate(original.toGregorian());

    expect(original.equals(roundTripped)).toBeTruthy();
  });

  test("round tripping dates through toGregorian and fromGregorian results in the same date", () => {
    const original = new HijriDate(1442, 11, 30);
    const roundTripped = new HijriDate(original.toGregorian());

    expect(original.equals(roundTripped)).toBeTruthy();
  });
});

describe("HijriDate add and minus methods", () => {
  test("consecutive Gregorian Dates convert to consecutive Hijri dates across 5 October 1582", () => {
    const october4 = new HijriDate(new Date(1582, 9, 4));
    const october5 = new HijriDate(new Date(1582, 9, 5));

    october4.addDays(1);

    expect(october5.equals(october4)).toBeTruthy();
  });

  test("addYears normalizes a leap day when the target year is not a leap year", () => {
    const date = new HijriDate(1442, 11, 30);

    date.addYears(1);

    expect(date.equals(new HijriDate(1443, 11, 30))).toBeTruthy();
  });

  test("minusYears normalizes a leap day when the target year is not a leap year", () => {
    const date = new HijriDate(1445, 11, 30);

    date.minusYears(1);

    expect(date.equals(new HijriDate(1444, 11, 30))).toBeTruthy();
  });

  test("year-changing operations do not leave dates that disagree with their Gregorian round-trip", () => {
    const date = new HijriDate(1442, 11, 30).addYears(1);
    const roundTripped = new HijriDate(date.toGregorian());

    expect(date.equals(roundTripped)).toBeTruthy();
  });

  test("addWeeks adds exactly 7 days per week", () => {
    const byWeeks = new HijriDate(1442, 9, 1).addWeeks(3);
    const byDays = new HijriDate(1442, 9, 1).addDays(21);

    expect(byWeeks.equals(byDays)).toBeTruthy();
  });

  test("minusDays subtracts days across month boundaries", () => {
    const date = new HijriDate(1442, 9, 1).minusDays(2);

    expect(date.equals(new HijriDate(1442, 8, 29))).toBeTruthy();
  });

  test("minusWeeks subtracts exactly 7 days per week", () => {
    const byWeeks = new HijriDate(1442, 9, 20).minusWeeks(2);
    const byDays = new HijriDate(1442, 9, 20).minusDays(14);

    expect(byWeeks.equals(byDays)).toBeTruthy();
  });

  test("addMonths normalizes month and year", () => {
    const date = new HijriDate(1442, 11, 15).addMonths(2);

    expect(date.equals(new HijriDate(1443, 1, 15))).toBeTruthy();
  });

  test("minusMonths normalizes month and year", () => {
    const date = new HijriDate(1442, 0, 15).minusMonths(2);

    expect(date.equals(new HijriDate(1441, 10, 15))).toBeTruthy();
  });
});

describe("HijriDate leap year", () => {
  test("isLeapYear returns true for leap years", () => {
    expect(new HijriDate(1442, 0, 1).isLeapYear()).toBeTruthy();
  });

  test("isLeapYear returns false for non-leap years", () => {
    expect(new HijriDate(1441, 0, 1).isLeapYear()).toBeFalsy();
  });
});

describe("HijriDate equality", () => {
  test("equals returns true for identical Hijri dates", () => {
    const date1 = new HijriDate(1442, 9, 1);
    const date2 = new HijriDate(1442, 9, 1);

    expect(date1.equals(date2)).toBeTruthy();
  });

  test("equals returns false for different Hijri dates", () => {
    const date1 = new HijriDate(1442, 9, 1);
    const date2 = new HijriDate(1442, 9, 2);

    expect(date1.equals(date2)).toBeFalsy();
  });

  test("equals returns false for non-HijriDate objects", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.equals({})).toBeFalsy();
  });

  test("equals returns false for null", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.equals(null)).toBeFalsy();
  });

  test("equals returns false for undefined", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.equals(undefined)).toBeFalsy();
  });
});

describe("HijriDate toString", () => {
  test("toString returns the correct string representation", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(date.toString()).toBe("1442-10-01");
  });

  test("toString returns correct string for leap day", () => {
    const date = new HijriDate(1442, 11, 30);
    expect(date.toString()).toBe("1442-12-30");
  });

  test("string interpolation calls toString", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(`${date}`).toBe("1442-10-01");
  });

  test("string construction calls toString", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(String(date)).toBe("1442-10-01");
  });
});

describe("HijriDate valueOf", () => {
  test("valueOf returns the julian day number for the date", () => {
    const date = new HijriDate(1442, 9, 1);
    const julianDay = date.valueOf();

    expect(julianDay).toBe(2459346.5);
  });

  test("primitive value of HijriDate is the julian day number", () => {
    const date = new HijriDate(1442, 9, 1);
    expect(+date).toBe(2459346.5);
  });
});

describe("HijriDate comparison", () => {
  test("HijriDate objects can be compared using <, <=, >, >=", () => {
    const date1 = new HijriDate(1442, 9, 1);
    const date2 = new HijriDate(1442, 9, 2);

    expect(date1 < date2).toBeTruthy();
    expect(date1 <= date2).toBeTruthy();
    expect(date2 > date1).toBeTruthy();
    expect(date2 >= date1).toBeTruthy();
  });
});

describe("HijriDate boundaries", () => {
  test("getWeekBoundaries returns the correct start and end of the week", () => {
    const date = new HijriDate(1442, 9, 1);
    const [start, end] = date.getWeekBoundaries();
    expect(start.equals(new HijriDate(1442, 8, 28))).toBeTruthy();
    expect(end.equals(new HijriDate(1442, 9, 4))).toBeTruthy();
  });

  test("getMonthBoundaries returns the correct start and end of the month", () => {
    const date = new HijriDate(1442, 9, 1);
    const [start, end] = date.getMonthBoundaries();

    expect(start.equals(new HijriDate(1442, 9, 1))).toBeTruthy();
    expect(end.equals(new HijriDate(1442, 9, 29))).toBeTruthy();
  });
});

describe("HijriDate diff", () => {
  test("diff returns the correct difference in days between two dates", () => {
    const date1 = new HijriDate(1442, 9, 1);
    const date2 = new HijriDate(1442, 9, 10);
    expect(date1.diff(date2)).toBe(-9);
    expect(date2.diff(date1)).toBe(9);
  });

  test("diff returns 0 for the same date", () => {
    const date1 = new HijriDate(1442, 9, 1);
    const date2 = new HijriDate(1442, 9, 1);

    expect(date1.diff(date2)).toBe(0);
    expect(date2.diff(date1)).toBe(0);
  });
});

describe("HijriDate daysInMonth", () => {
  test.each([
    [0, 30],
    [1, 29],
    [2, 30],
    [3, 29],
    [4, 30],
    [5, 29],
    [6, 30],
    [7, 29],
    [8, 30],
    [9, 29],
    [10, 30],
    [11, 29],
  ])(
    "daysInMonth returns the correct number of days for month %i in non-leap year",
    (month, daysExpected) => {
      const date = new HijriDate(1441, month, 1);
      expect(date.daysInMonth()).toBe(daysExpected);
    },
  );

  test.each([
    [0, 30],
    [1, 29],
    [2, 30],
    [3, 29],
    [4, 30],
    [5, 29],
    [6, 30],
    [7, 29],
    [8, 30],
    [9, 29],
    [10, 30],
    [11, 30],
  ])(
    "daysInMonth returns the correct number of days for month %i in leap year",
    (month, daysExpected) => {
      const date = new HijriDate(1442, month, 1);
      expect(date.daysInMonth()).toBe(daysExpected);
    },
  );
});

describe("HijriDate clone", () => {
  test("clone returns a new HijriDate object with the same date", () => {
    const date1 = new HijriDate(1442, 9, 1);
    const date2 = date1.clone();

    expect(date2.equals(date1)).toBeTruthy();
    expect(date2).not.toBe(date1);
  });
});
