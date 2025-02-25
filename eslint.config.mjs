import globals from "globals";
import pluginJs from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest", // Support latest JS features
      globals: {
        ...globals.node, // Set global variables for Node.js
        particlesJS: "readonly",
      },
    },
    rules: {
      "prettier/prettier": "error", // Enforce Prettier formatting
      "no-unused-vars": "warn", // Warn for unused variables
      "no-console": "off", // Allow console logs (optional)
      indent: ["error", 2], // Enforce 2-space indentation
      quotes: ["error", "double", { avoidEscape: true }],
      semi: ["error", "always"], // Require semicolons
    },
    plugins: {
      prettier: pluginPrettier,
    },
  },
  pluginJs.configs.recommended, // ESLint recommended rules
];
