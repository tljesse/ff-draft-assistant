module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": 0,
    "import/no-unresolved": 0,
    "indent": ["error", 2],
    "@typescript-eslint/no-var-requires": 0,
    "linebreak-style": 0,
    "object-curly-spacing": 0,
    "require-jsdoc": 0,
    "max-len": ["error", 200],
    "no-tabs": 0,
    "spaced-comment": 0,
    "camelcase": 0,
    "arrow-parens": 0,
  },
};
