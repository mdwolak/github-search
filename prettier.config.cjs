/* eslint-disable @typescript-eslint/no-var-requires */
const pluginSortImports = require("@trivago/prettier-plugin-sort-imports");
const pluginTailwindcss = require("prettier-plugin-tailwindcss");

/**
 * @refs  https://github.com/trivago/prettier-plugin-sort-imports/issues/117#issuecomment-1198805533
 */
const mixedPlugin = {
  parsers: {
    typescript: {
      ...pluginSortImports.parsers.typescript,
      parse: pluginTailwindcss.parsers.typescript.parse,
    },
  },
};

/** @type {import("prettier").Config} */
module.exports = {
  bracketSameLine: true,
  printWidth: 100,
  plugins: [mixedPlugin],

  importOrder: [
    "(^react$|^react/(.*)$|^next$|^next/(.*)$|^@?next-auth/?(.*)$)",
    "<THIRD_PARTY_MODULES>",
    "^~/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
