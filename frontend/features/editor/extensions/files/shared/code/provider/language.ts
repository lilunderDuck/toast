export const LANGUAGE_MAPPING = {
  text: () => null,
  javascript: () => import("highlight.js/lib/languages/javascript"),
  typescript: () => import("highlight.js/lib/languages/typescript"),
} as const

type LanguageKey = keyof typeof LANGUAGE_MAPPING
export type LanguageName = LanguageKey | "text"