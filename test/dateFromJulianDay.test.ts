import { describe, expect, test } from "@jest/globals";
import { dateFromJulianDay } from "../src/utils/dateFromJulianDay";

describe("dateFromJulianDay", () => {
  test("converts a Julian Day Number to a Date object", () => {
    const ajd = 2461174.5;

    const date = dateFromJulianDay(ajd);

    expect(date.getUTCFullYear()).toBe(2026);
    expect(date.getUTCMonth()).toBe(4);
    expect(date.getUTCDate()).toBe(14);
  });

  test("dateFromJulianDay preserves years 0 through 99 instead of applying Date.UTC's 1900 offset", () => {
    const julianCalendarOneCe = dateFromJulianDay(1721425.5);

    expect(julianCalendarOneCe.getUTCFullYear()).toBe(1);
    expect(julianCalendarOneCe.getUTCMonth()).toBe(0);
    expect(julianCalendarOneCe.getUTCDate()).toBe(1);
  });
});
