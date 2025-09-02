declare module 'macro-def' {
  /* Merge many class name into a giant class names. */
  export function macro_mergeClassnames<T extends (string | { class?: string | undefined } | undefined)[]>(...name: T): string
}