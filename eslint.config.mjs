import js      from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    },
    rules: {
      "semi": ["error", "always"],
      "eqeqeq": ["error", "always", {"null": "always"}],
      "no-var": 2,
      "prefer-const": ["error"],
      "default-param-last": ["error"],
      "no-label-var": ["error"],
      "no-shadow": ["error"],
      "no-duplicate-imports": ["error"],
      "max-params": ["warn", 4],
      "no-constant-condition": ["error"],
      "no-constant-binary-expression": ["error"]
    },
  },
  {
    ignores: [
      "js/dist/",
      "inc/js/",
      "misc/"
    ],
  },
];
