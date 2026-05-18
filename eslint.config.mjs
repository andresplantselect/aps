import { defineConfig, globalIgnores } from "eslint/config";
import prettierPlugin from "eslint-plugin-prettier";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),

  // Основной код проекта
  {
    files: ["**/*.{js,ts,jsx,tsx}"],

    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },

    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
    },

    settings: {
      "import/resolver": {
        typescript: true,
      },
    },
  
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          trailingComma: "all",
          bracketSpacing: true,
          arrowParens: "always",
          endOfLine: "auto",
        },
      ],
    
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
        },
      ],
    
      "import/no-unresolved": "error",
    
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    
      "unused-imports/no-unused-imports": "error",
    
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    }
  },

  // Supabase Edge Functions (Deno)
  {
    files: ["supabase/functions/**/*.ts"],
    rules: {
      "import/no-unresolved": "off",
      "import/extensions": "off",
    },
  },
]);
