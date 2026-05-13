import { test, expect, describe, jest, beforeAll } from "@jest/globals";
import { HijriDate } from "../src/HijriDate";

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
});

describe("HijriDate setters", () => {
  test("setYear updates the year correctly", () => {
    const date = new HijriDate(1442, 9, 1);
    date.setYear(1443);
    expect(date.getYear()).toBe(1443);
  });

  test("setMonth updates the month correctly and normalizes date", () => {
    const date = new HijriDate(1442, 8, 30);
    date.setMonth(9);
    expect(date.getMonth()).toBe(10);
    expect(date.getDate()).toBe(1);
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

  test("setMonth with large month normalizes year correctly", () => {
    const date = new HijriDate(1442, 0, 30);
    date.setMonth(24);
    expect(date.getYear()).toBe(1444);
    expect(date.getMonth()).toBe(0);
    expect(date.getDate()).toBe(30);
  });
});
