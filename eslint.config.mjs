import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 忽略自动生成的代码
  { ignores: ["src/generated/**"] },
  // Next.js 推荐配置
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
