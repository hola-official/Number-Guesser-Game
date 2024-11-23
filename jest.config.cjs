module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./src/tests/NumberGuesser.test.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
