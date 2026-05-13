import { test, expect, describe, jest, beforeAll } from "@jest/globals";
import { HijriDate } from "../src/HijriDate";

describe("HijriDate constructors", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-05-13T00:00:00Z"));
  });

  test("HijriDate initialization with year, month, date returns the hijri date", () => {
    const date = new HijriDate(1442, 9, 1);

    expect(date.getYear()).toBe(1442);
    expect(date.getMonth()).toBe(9);
    expect(date.getDate()).toBe(1);
  });

  test("HijriDate initialization with Date object converts and returns corresponding hijri date", () => {
    const date = new Date("2026-05-13T00:00:00Z");

    const hijriDate = new HijriDate(date);

    expect(hijriDate.getYear()).toBe(1447);
    expect(hijriDate.getMonth()).toBe(10);
    expect(hijriDate.getDate()).toBe(27);
  });

  test("HijriDate initialization with other HijriDate object clones the other object", () => {
    const date1 = new HijriDate(1442, 9, 1);
    const date2 = new HijriDate(date1);

    expect(date2.getYear()).toBe(1442);
    expect(date2.getMonth()).toBe(9);
    expect(date2.getDate()).toBe(1);
  });

  test("HijriDate initialization with no arguments returns current date", () => {
    const date = new HijriDate();

    expect(date.getYear()).toBe(1447);
    expect(date.getMonth()).toBe(10);
    expect(date.getDate()).toBe(27);
  });
});
