//  @ts-check

/** @type {import('prettier').Config} */
const config = {
  semi: true,
  tabWidth: 2,
  printWidth: 85,
  bracketSpacing: true,
  arrowParens: "avoid",
  endOfLine: "auto",
  trailingComma: "all",
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  importOrder: ["^@/(.*)$", "^[./]"],
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
};

export default config;
