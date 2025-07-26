import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Turn off common spacing-related rules
      indent: "off",
      "no-multi-spaces": "off",
      "space-infix-ops": "off",
      "space-before-blocks": "off",
      "keyword-spacing": "off",
      "space-unary-ops": "off",
      "block-spacing": "off",
      "comma-spacing": "off",
      "semi-spacing": "off",
      "object-curly-spacing": "off",
      "array-bracket-spacing": "off",
      "key-spacing": "off",
      "template-curly-spacing": "off",
    },
  },
];

export default eslintConfig;
