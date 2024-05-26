module.exports = {
  extends: "next/core-web-vitals",
  parser: "@typescript-eslint/parser",
  plugins: [
    "no-relative-import-paths",
    "@typescript-eslint",
    // "mad-realities",
  ],
  overrides: [
    {
      // Only run rules involving type info on ts/tsx files, otherwise ESLint freaks out.
      parserOptions: {
        project: "./tsconfig.eslint.json",
      },
      files: ["./**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/no-unnecessary-condition": [
          "error",
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
    // TODO: Re-enable this when we package this ESLint plugin outside this repo.
    // {
    //   // Only run zod check on API routes.
    //   files: ["./src/pages/api/**/*.{ts,tsx}"],
    //   rules: {
    //     "mad-realities/zod-for-nextjs-api": "warn",
    //   },
    // },
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
