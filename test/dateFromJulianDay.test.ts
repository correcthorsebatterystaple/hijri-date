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
});
