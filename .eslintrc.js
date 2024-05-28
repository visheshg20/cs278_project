module.exports = {
  extends: "next/core-web-vitals",
  parser: "@typescript-eslint/parser",
  plugins: ["no-relative-import-paths", "@typescript-eslint"],
  overrides: [
    {
      // Only run rules involving type info on ts/tsx files, otherwise ESLint freaks out.
      parserOptions: {
        project: "./tsconfig.json",
      },
      files: ["./**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/no-unnecessary-condition": [
          "warn",
          {
            allowConstantLoopConditions: false,
          },
        ],
        "@typescript-eslint/prefer-nullish-coalescing": "error",
        "@typescript-eslint/no-misused-promises": [
          "error",
          {
            checksVoidReturn: false,
          },
        ],
        "require-await": "off",
        "@typescript-eslint/require-await": "error",
        "@typescript-eslint/await-thenable": "error",
      },
    },
  ],
  rules: {
    "no-console": [
      "error",
      {
        allow: ["info", "warn", "error"],
      },
    ],
    quotes: [
      "error",
      "double",
      {
        avoidEscape: true,
        allowTemplateLiterals: false,
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "none",
        ignoreRestSiblings: false,
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "no-relative-import-paths/no-relative-import-paths": [
      "error",
      { allowSameFolder: true },
    ],
    "no-restricted-imports": "off",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-inferrable-types": "error",
  },
};
