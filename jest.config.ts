import type { Config } from "jest";

const config: Config = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",

  modulePathIgnorePatterns: ["<rootDir>/src/.*/styled.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],
  modulePaths: ["<rootDir>/src"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@pages/(.*)$": "<rootDir>/src/pages/$1",
    "^@constants/(.*)$": "<rootDir>/src/constants/$1",
    "^@constants$": "<rootDir>/src/constants/index",
    "^@assets/(.*)$": "<rootDir>/src/assets/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@store/(.*)$": "<rootDir>/src/store/$1",
    "^@api/(.*)$": "<rootDir>/src/api/$1",
    "^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@styles/(.*)$": "<rootDir>/src/styles/$1",
    "^@styles$": "<rootDir>/src/styles/index",
    "^@types/(.*)$": "<rootDir>/src/types/$1",
    "^@errors/(.*)$": "<rootDir>/src/errors/$1",
    "^@hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@mocks/(.*)$": "<rootDir>/src/mocks/$1",
    "^@mocks$": "<rootDir>/src/mocks/index",
  },

  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/styles/**/*.{ts,tsx}"],

  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
