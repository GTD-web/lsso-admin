import type { Config } from "tailwindcss";
import { tailwindConfig } from "@lumir-company/prototype-ui-sdk";

export default {
  // 기본 설정 확장
  ...tailwindConfig,
  // 필요에 따라 사용자 설정 추가
  content: [
    ...tailwindConfig.content,
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    ...tailwindConfig.theme,
    extend: {
      ...tailwindConfig.theme.extend,
      colors: {
        ...tailwindConfig.theme.extend.colors,
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [...(tailwindConfig.plugins || [])],
} satisfies Config;
