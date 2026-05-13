import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/test"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  moduleFileExtensions: ["ts", "js"],

  testMatch: ["**/*.test.ts"],
};

export default config;

