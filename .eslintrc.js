module.exports = {
  "extends": ["hughx/web-components"],
  "parserOptions": {
    "sourceType": "script",
  },
  "overrides": [{
    "files": ["./gulpfile.js"],
    "parserOptions": {
      "sourceType": "module",
    },
  }],
  "rules": {
    "strict": ["error", "function"],
  },
};
