module.exports = {
  root: true,
  env: {
    es6: true,
    node: true, // <-- THIS IS THE FIX. It tells ESLint to allow Node.js keywords.
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "require-jsdoc": 0, // We can disable this rule for simplicity
  },
};