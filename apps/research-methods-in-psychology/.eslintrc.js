module.exports = {
  root: true,
  extends: ["@itell/eslint-config/next.js", "plugin:drizzle/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    // Disable the no-unsafe-return rule for TypeScript
    "@typescript-eslint/no-unsafe-return": "off",
    // Enable  no-unsafe-assignment and no-unsafe-call rules for TypeScript
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
  },
};
