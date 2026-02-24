const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/tests/**/*.test.ts", "**/tests/**/*.test.tsx"],
};

module.exports = createJestConfig(customJestConfig);
