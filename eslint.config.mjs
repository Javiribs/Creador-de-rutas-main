import globals from "globals";
import pluginJs from "@eslint/js";
/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["*/.{js,mjs,cjs,jsx}"] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,  // Mantiene los globales del navegador si los necesitas
        ...globals.node      // Agrega los globales de Node.js
      }
    }
  },
  pluginJs.configs.recommended,
];